import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
    const conversation = await prisma.conversation.findFirst({
      where: { id, userId: user.id },
      include: {
        child: true,
        messages: { orderBy: { createdAt: "asc" } },
      },
    });
    if (!conversation) return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
    return NextResponse.json({ conversation });
  } catch {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
}
