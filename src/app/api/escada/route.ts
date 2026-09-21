import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { canAccessFeature } from "@/lib/plans";

const schema = z.object({
  childId: z.string(),
  foodName: z.string().min(1),
  step: z.number().int().min(1).max(26),
  notes: z.string().optional().nullable(),
});

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    if (!canAccessFeature(user.plan, user.planExpiresAt, "escada")) {
      return NextResponse.json({ error: "Disponível nos planos Premium e Gold." }, { status: 403 });
    }
    const childId = new URL(req.url).searchParams.get("childId");
    if (!childId) return NextResponse.json({ error: "childId obrigatório." }, { status: 400 });
    const child = await prisma.child.findFirst({ where: { id: childId, userId: user.id } });
    if (!child) return NextResponse.json({ error: "Criança não encontrada." }, { status: 404 });
    const items = await prisma.foodProgress.findMany({
      where: { childId },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    if (!canAccessFeature(user.plan, user.planExpiresAt, "escada")) {
      return NextResponse.json({ error: "Disponível nos planos Premium e Gold." }, { status: 403 });
    }
    const body = schema.parse(await req.json());
    const child = await prisma.child.findFirst({
      where: { id: body.childId, userId: user.id },
    });
    if (!child) return NextResponse.json({ error: "Criança inválida." }, { status: 400 });

    const item = await prisma.foodProgress.upsert({
      where: { childId_foodName: { childId: body.childId, foodName: body.foodName } },
      create: {
        childId: body.childId,
        foodName: body.foodName,
        step: body.step,
        notes: body.notes || null,
      },
      update: { step: body.step, notes: body.notes || null },
    });
    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "Falha ao salvar progresso." }, { status: 400 });
  }
}
