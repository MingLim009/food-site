import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { canAccessFeature } from "@/lib/plans";
import { buildChildContext } from "@/lib/guardrails";
import { generateAssistantReply } from "@/lib/rag";

function publicOrigin(req: Request) {
  const proto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const host = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  if (proto && host) return `${proto}://${host}`;
  return new URL(req.url).origin;
}

/** Plain HTML form POST — works even if client JS fails on the tunnel */
export async function POST(req: Request) {
  const origin = publicOrigin(req);
  try {
    const user = await requireUser();
    if (!canAccessFeature(user.plan, user.planExpiresAt, "ai")) {
      return NextResponse.redirect(new URL("/app/planos", origin), 303);
    }

    const form = await req.formData();
    const childId = String(form.get("childId") || "");
    const content = String(form.get("content") || "").trim();
    if (!childId || !content) {
      return NextResponse.redirect(new URL("/app/chat?error=empty", origin), 303);
    }

    const child = await prisma.child.findFirst({
      where: { id: childId, userId: user.id },
    });
    if (!child) {
      return NextResponse.redirect(new URL("/app/chat?error=child", origin), 303);
    }

    const existingId = String(form.get("conversationId") || "");
    let conversation = existingId
      ? await prisma.conversation.findFirst({
          where: { id: existingId, userId: user.id, childId: child.id },
          include: { messages: { orderBy: { createdAt: "asc" }, take: 40 } },
        })
      : null;

    // Fresh thread when opening chat without an active conversation
    // (avoids dumping old generic answers onto an empty chat view).
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId: user.id,
          childId: child.id,
          title: content.slice(0, 48) || `Conversa — ${child.name}`,
        },
        include: { messages: true },
      });
    }

    await prisma.message.create({
      data: { conversationId: conversation.id, role: "user", content },
    });

    const replyBase = await generateAssistantReply({
      userMessage: content,
      childContext: buildChildContext(child),
      history: conversation.messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const { generateReplyImage, appendImageToReply } = await import("@/lib/chat-images");
    const image = await generateReplyImage({
      userMessage: content,
      childName: child.name,
    });
    const reply = appendImageToReply(replyBase, image);

    await prisma.message.create({
      data: { conversationId: conversation.id, role: "assistant", content: reply },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.redirect(
      new URL(`/app/chat?c=${conversation.id}`, origin),
      303
    );
  } catch (e) {
    console.error("[chat/ask]", e);
    return NextResponse.redirect(new URL("/login", origin), 303);
  }
}
