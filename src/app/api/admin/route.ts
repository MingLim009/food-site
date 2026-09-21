import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const [users, chunks, recipes, chains] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          plan: true,
          planExpiresAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.knowledgeChunk.findMany({ orderBy: { updatedAt: "desc" } }),
      prisma.recipe.findMany({ orderBy: { updatedAt: "desc" } }),
      prisma.foodChain.findMany({ orderBy: { updatedAt: "desc" } }),
    ]);
    return NextResponse.json({ users, chunks, recipes, chains });
  } catch {
    return NextResponse.json({ error: "Acesso admin necessário." }, { status: 403 });
  }
}

const chunkSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  category: z.string().min(1),
  content: z.string().min(1),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = chunkSchema.parse(await req.json());
    const data = {
      title: body.title,
      category: body.category,
      content: body.content,
      tags: JSON.stringify(body.tags || []),
      published: body.published ?? true,
    };
    const chunk = body.id
      ? await prisma.knowledgeChunk.update({ where: { id: body.id }, data })
      : await prisma.knowledgeChunk.create({ data });
    return NextResponse.json({ chunk });
  } catch {
    return NextResponse.json({ error: "Falha ao salvar conteúdo." }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
    await prisma.knowledgeChunk.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Falha ao excluir." }, { status: 400 });
  }
}
