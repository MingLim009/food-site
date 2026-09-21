import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { canAccessFeature } from "@/lib/plans";
import { SELECTIVITY_QUESTIONS, summarizeSelectivityScore } from "@/lib/questionnaire";

export async function GET() {
  return NextResponse.json({ questions: SELECTIVITY_QUESTIONS });
}

const schema = z.object({
  childName: z.string().optional(),
  answers: z.record(z.string(), z.number()),
});

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    if (!canAccessFeature(user.plan, user.planExpiresAt, "questionnaire")) {
      return NextResponse.json({ error: "Plano ativo necessário." }, { status: 403 });
    }
    const body = schema.parse(await req.json());
    let score = 0;
    for (const q of SELECTIVITY_QUESTIONS) {
      score += Number(body.answers[q.id] ?? 0);
    }
    const { level, summary } = summarizeSelectivityScore(score);
    const fullSummary = `${level}. ${summary}`;
    const result = await prisma.questionnaireResult.create({
      data: {
        userId: user.id,
        childName: body.childName || null,
        answers: JSON.stringify(body.answers),
        score,
        summary: fullSummary,
      },
    });
    return NextResponse.json({ result });
  } catch {
    return NextResponse.json({ error: "Falha ao salvar questionário." }, { status: 400 });
  }
}
