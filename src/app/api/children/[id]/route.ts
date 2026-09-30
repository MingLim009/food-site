import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { toJsonArray } from "@/lib/utils";

type Ctx = { params: Promise<{ id: string }> };

async function ownedChild(userId: string, id: string) {
  return prisma.child.findFirst({ where: { id, userId } });
}

export async function GET(_: Request, ctx: Ctx) {
  try {
    const user = await requireUser();
    const { id } = await ctx.params;
    const child = await ownedChild(user.id, id);
    if (!child) return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
    const progress = await prisma.foodProgress.findMany({
      where: { childId: child.id },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({ child, progress });
  } catch {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
}

const schema = z.object({
  name: z.string().min(1).optional(),
  birthDate: z.string().optional().nullable(),
  diagnosisNotes: z.string().optional().nullable(),
  textures: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  shapes: z.array(z.string()).optional(),
  acceptedFoods: z.array(z.string()).optional(),
  refusedFoods: z.array(z.string()).optional(),
  heightCm: z.number().optional().nullable(),
  weightKg: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
  avatar: z
    .object({
      skin: z.string(),
      hair: z.string(),
      hairColor: z.string(),
      eyes: z.string(),
      outfit: z.string(),
      accessory: z.string(),
    })
    .optional(),
});

export async function PUT(req: Request, ctx: Ctx) {
  try {
    const user = await requireUser();
    const { id } = await ctx.params;
    const existing = await ownedChild(user.id, id);
    if (!existing) return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
    const body = schema.parse(await req.json());
    const child = await prisma.child.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        birthDate:
          body.birthDate === undefined
            ? existing.birthDate
            : body.birthDate
              ? new Date(body.birthDate)
              : null,
        diagnosisNotes: body.diagnosisNotes ?? existing.diagnosisNotes,
        textures: body.textures ? toJsonArray(body.textures) : existing.textures,
        colors: body.colors ? toJsonArray(body.colors) : existing.colors,
        shapes: body.shapes ? toJsonArray(body.shapes) : existing.shapes,
        acceptedFoods: body.acceptedFoods
          ? toJsonArray(body.acceptedFoods)
          : existing.acceptedFoods,
        refusedFoods: body.refusedFoods
          ? toJsonArray(body.refusedFoods)
          : existing.refusedFoods,
        heightCm: body.heightCm === undefined ? existing.heightCm : body.heightCm,
        weightKg: body.weightKg === undefined ? existing.weightKg : body.weightKg,
        notes: body.notes ?? existing.notes,
        avatar: body.avatar ? JSON.stringify(body.avatar) : existing.avatar,
      },
    });
    return NextResponse.json({ child });
  } catch {
    return NextResponse.json({ error: "Falha ao atualizar." }, { status: 400 });
  }
}

export async function DELETE(_: Request, ctx: Ctx) {
  try {
    const user = await requireUser();
    const { id } = await ctx.params;
    const existing = await ownedChild(user.id, id);
    if (!existing) return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
    await prisma.child.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Falha ao excluir." }, { status: 400 });
  }
}
