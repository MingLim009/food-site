import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { toJsonArray } from "@/lib/utils";
import { DEFAULT_AVATAR } from "@/lib/games";

export async function GET() {
  try {
    const user = await requireUser();
    const children = await prisma.child.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ children });
  } catch {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
}

const schema = z.object({
  name: z.string().min(1),
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

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = schema.parse(await req.json());
    const child = await prisma.child.create({
      data: {
        userId: user.id,
        name: body.name,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        diagnosisNotes: body.diagnosisNotes || null,
        textures: toJsonArray(body.textures || []),
        colors: toJsonArray(body.colors || []),
        shapes: toJsonArray(body.shapes || []),
        acceptedFoods: toJsonArray(body.acceptedFoods || []),
        refusedFoods: toJsonArray(body.refusedFoods || []),
        heightCm: body.heightCm ?? null,
        weightKg: body.weightKg ?? null,
        notes: body.notes || null,
        avatar: JSON.stringify(body.avatar || DEFAULT_AVATAR),
      },
    });
    return NextResponse.json({ child });
  } catch (e) {
    const msg = e instanceof Error && e.message === "UNAUTHORIZED" ? 401 : 400;
    return NextResponse.json({ error: "Não foi possível salvar." }, { status: msg });
  }
}
