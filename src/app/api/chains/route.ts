import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { canAccessFeature } from "@/lib/plans";
import { planMeetsMinimum } from "@/lib/types";

export async function GET() {
  try {
    const user = await requireUser();
    if (!canAccessFeature(user.plan, user.planExpiresAt, "chaining")) {
      return NextResponse.json({ error: "Disponível nos planos Premium e Gold." }, { status: 403 });
    }
    const chains = await prisma.foodChain.findMany({
      where: { published: true },
      orderBy: { title: "asc" },
    });
    const filtered = chains.filter((c) => planMeetsMinimum(user.plan, c.minPlan));
    return NextResponse.json({ chains: filtered });
  } catch {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
}
