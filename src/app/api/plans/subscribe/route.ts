import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser, refreshSessionCookie } from "@/lib/auth";
import { getPlan } from "@/lib/plans";

const schema = z.object({
  tier: z.enum(["BASIC", "PREMIUM", "GOLD"]),
});

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const { tier } = schema.parse(await req.json());
    const plan = getPlan(tier);
    if (!plan) return NextResponse.json({ error: "Plano inválido." }, { status: 400 });

    const base =
      user.planExpiresAt && user.planExpiresAt > new Date() && user.plan === tier
        ? user.planExpiresAt
        : new Date();
    const planExpiresAt = new Date(base.getTime() + plan.durationDays * 24 * 3600 * 1000);

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { plan: tier, planExpiresAt },
    });
    await refreshSessionCookie(updated.id);
    return NextResponse.json({
      ok: true,
      plan: updated.plan,
      planExpiresAt: updated.planExpiresAt,
      note: "Demo local. Em produção o pagamento ocorre na Monetizze e o acesso é liberado pelo postback.",
    });
  } catch {
    return NextResponse.json({ error: "Falha ao ativar plano." }, { status: 400 });
  }
}
