import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { canAccessFeature } from "@/lib/plans";
import { SELECTIVITY_QUESTIONS, summarizeSelectivityScore } from "@/lib/questionnaire";

function publicOrigin(req: Request) {
  const proto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const host = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  if (proto && host) return `${proto}://${host}`;
  return new URL(req.url).origin;
}

/** Plain HTML form POST — works when tunnel breaks client JS. */
export async function POST(req: Request) {
  const origin = publicOrigin(req);
  try {
    const user = await requireUser();
    if (!canAccessFeature(user.plan, user.planExpiresAt, "questionnaire")) {
      return NextResponse.redirect(
        new URL("/app/planos?need=questionnaire", origin),
        303
      );
    }
    const form = await req.formData();
    const childName = String(form.get("childName") || "").trim() || null;
    const answers: Record<string, number> = {};
    let missing = false;
    for (const q of SELECTIVITY_QUESTIONS) {
      const raw = form.get(q.id);
      if (raw === null || raw === "") {
        missing = true;
        break;
      }
      answers[q.id] = Number(raw);
    }
    if (missing) {
      return NextResponse.redirect(
        new URL(
          "/app/questionario?error=" +
            encodeURIComponent("Responda todas as perguntas."),
          origin
        ),
        303
      );
    }
    let score = 0;
    for (const q of SELECTIVITY_QUESTIONS) {
      score += Number(answers[q.id] ?? 0);
    }
    const { level, summary } = summarizeSelectivityScore(score);
    const fullSummary = `${level}. ${summary}`;
    await prisma.questionnaireResult.create({
      data: {
        userId: user.id,
        childName,
        answers: JSON.stringify(answers),
        score,
        summary: fullSummary,
      },
    });
    const url = new URL("/app/questionario", origin);
    url.searchParams.set("score", String(score));
    url.searchParams.set("summary", fullSummary);
    return NextResponse.redirect(url, 303);
  } catch {
    return NextResponse.redirect(
      new URL(
        "/app/questionario?error=" + encodeURIComponent("Falha ao salvar. Faça login novamente."),
        origin
      ),
      303
    );
  }
}
