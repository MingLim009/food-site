import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { canAccessFeature } from "@/lib/plans";
import { buildChildContext } from "@/lib/guardrails";
import { generateAssistantReply } from "@/lib/rag";

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const childId = new URL(req.url).searchParams.get("childId");
    const conversations = await prisma.conversation.findMany({
      where: { userId: user.id, ...(childId ? { childId } : {}) },
      orderBy: { updatedAt: "desc" },
      include: { messages: { orderBy: { createdAt: "asc" }, take: 1 } },
    });
    return NextResponse.json({ conversations });
  } catch {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
}

const createSchema = z.object({
  childId: z.string().min(1),
  title: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    if (!canAccessFeature(user.plan, user.planExpiresAt, "ai")) {
      return NextResponse.json(
        { error: "Plano ativo necessário para conversar com a TIA Nutri." },
        { status: 403 }
      );
    }
    const body = createSchema.parse(await req.json());
    const child = await prisma.child.findFirst({
      where: { id: body.childId, userId: user.id },
    });
    if (!child) {
      return NextResponse.json({ error: "Criança inválida para este usuário." }, { status: 400 });
    }
    const conversation = await prisma.conversation.create({
      data: {
        userId: user.id,
        childId: child.id,
        title: body.title || `Conversa — ${child.name}`,
      },
    });
    return NextResponse.json({ conversation });
  } catch {
    return NextResponse.json({ error: "Falha ao criar conversa." }, { status: 400 });
  }
}

const messageSchema = z.object({
  conversationId: z.string(),
  content: z.string().min(1).max(4000),
});

export async function PUT(req: Request) {
  try {
    const user = await requireUser();
    if (!canAccessFeature(user.plan, user.planExpiresAt, "ai")) {
      return NextResponse.json({ error: "Plano ativo necessário." }, { status: 403 });
    }
    const body = messageSchema.parse(await req.json());
    const conversation = await prisma.conversation.findFirst({
      where: { id: body.conversationId, userId: user.id },
      include: { child: true, messages: { orderBy: { createdAt: "asc" }, take: 20 } },
    });
    if (!conversation || !conversation.child) {
      return NextResponse.json(
        { error: "Conversa não encontrada ou sem criança vinculada." },
        { status: 404 }
      );
    }

    await prisma.message.create({
      data: { conversationId: conversation.id, role: "user", content: body.content },
    });

    const replyBase = await generateAssistantReply({
      userMessage: body.content,
      childContext: buildChildContext(conversation.child),
      history: conversation.messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const { generateReplyImage, appendImageToReply } = await import("@/lib/chat-images");
    const image = await generateReplyImage({
      userMessage: body.content,
      childName: conversation.child.name,
    });
    const reply = appendImageToReply(replyBase, image);

    const assistant = await prisma.message.create({
      data: { conversationId: conversation.id, role: "assistant", content: reply },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    const messages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ message: assistant, messages });
  } catch (e) {
    console.error("[chat PUT]", e);
    return NextResponse.json({ error: "Falha ao enviar mensagem." }, { status: 400 });
  }
}
