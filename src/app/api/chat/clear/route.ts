import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

function publicOrigin(req: Request) {
  const proto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const host = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  if (proto && host) return `${proto}://${host}`;
  return new URL(req.url).origin;
}

/** Apaga histórico de perguntas (conversa atual ou todas da criança). */
export async function POST(req: Request) {
  const origin = publicOrigin(req);
  try {
    const user = await requireUser();
    const form = await req.formData();
    const conversationId = String(form.get("conversationId") || "");
    const childId = String(form.get("childId") || "");

    if (conversationId) {
      const conv = await prisma.conversation.findFirst({
        where: { id: conversationId, userId: user.id },
      });
      if (conv) {
        await prisma.message.deleteMany({ where: { conversationId: conv.id } });
        await prisma.conversation.delete({ where: { id: conv.id } });
      }
      const dest = childId ? `/app/chat?child=${childId}` : "/app/chat";
      return NextResponse.redirect(new URL(dest, origin), 303);
    }

    if (childId) {
      const convs = await prisma.conversation.findMany({
        where: { userId: user.id, childId },
        select: { id: true },
      });
      const ids = convs.map((c) => c.id);
      if (ids.length) {
        await prisma.message.deleteMany({ where: { conversationId: { in: ids } } });
        await prisma.conversation.deleteMany({ where: { id: { in: ids } } });
      }
      return NextResponse.redirect(new URL(`/app/chat?child=${childId}`, origin), 303);
    }

    return NextResponse.redirect(new URL("/app/chat", origin), 303);
  } catch {
    return NextResponse.redirect(new URL("/login", origin), 303);
  }
}
