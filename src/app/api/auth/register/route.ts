import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";
import { trialExpiresAt } from "@/lib/plans";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  lgpdAccepted: z.literal(true),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const exists = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (exists) {
      return NextResponse.json({ error: "E-mail já cadastrado." }, { status: 400 });
    }
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email.toLowerCase(),
        passwordHash: await hashPassword(body.password),
        lgpdAcceptedAt: new Date(),
        plan: "TRIAL",
        planExpiresAt: trialExpiresAt(),
      },
    });
    await createSession(user);
    return NextResponse.json({ ok: true, trial: true });
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }
}
