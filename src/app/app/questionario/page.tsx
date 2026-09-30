import { SELECTIVITY_QUESTIONS } from "@/lib/questionnaire";
import { QuestionnaireForm } from "./questionnaire-form";

type Props = { searchParams: Promise<{ score?: string; summary?: string; error?: string }> };

export default async function QuestionnairePage({ searchParams }: Props) {
  const sp = await searchParams;
  const score = sp.score ? Number(sp.score) : null;
  const summary = sp.summary || null;
  const error = sp.error || null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="display text-3xl font-bold sm:text-4xl">Questionário de seletividade</h1>
        <p className="mt-1 text-sm text-[var(--muted)] sm:text-base">
          {SELECTIVITY_QUESTIONS.length} perguntas de investigação inicial — não é diagnóstico
          clínico. Funciona no celular e no notebook.
        </p>
      </div>

      <QuestionnaireForm
        questions={SELECTIVITY_QUESTIONS}
        initialResult={
          score !== null && !Number.isNaN(score) && summary
            ? { score, summary }
            : null
        }
        initialError={error}
      />
    </div>
  );
}
