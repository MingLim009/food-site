import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { canAccessFeature } from "@/lib/plans";
import { planMeetsMinimum } from "@/lib/types";

export async function GET() {
  try {
    const user = await requireUser();
    if (!canAccessFeature(user.plan, user.planExpiresAt, "recipes")) {
      return NextResponse.json({ error: "Disponível nos planos Premium e Gold." }, { status: 403 });
    }
    const recipes = await prisma.recipe.findMany({
      where: { published: true },
      orderBy: { title: "asc" },
    });
    const filtered = recipes.filter((r) => planMeetsMinimum(user.plan, r.minPlan));
    return NextResponse.json({ recipes: filtered });
  } catch {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
}
