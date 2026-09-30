"use client";

import { useState } from "react";
import type { Question } from "@/lib/questionnaire";

type Result = { score: number; summary: string };

export function QuestionnaireForm({
  questions,
  initialResult,
  initialError,
}: {
  questions: Question[];
  initialResult: Result | null;
  initialError: string | null;
}) {
  const [result, setResult] = useState<Result | null>(initialResult);
  const [error] = useState(initialError || "");

  if (result) {
    return (
      <div className="card space-y-3 p-5">
        <p className="chip w-fit">Escore {result.score}</p>
        <p className="text-sm leading-relaxed sm:text-base">{result.summary}</p>
        <a href="/app/questionario" className="btn btn-ghost inline-flex">
          Refazer questionário
        </a>
      </div>
    );
  }

  return (
    <form action="/api/questionnaire/form" method="post" className="space-y-4">
      <label className="block space-y-1">
        <span className="text-sm font-semibold">Nome da criança (opcional)</span>
        <input className="input w-full" name="childName" placeholder="Ex.: Lucas" />
      </label>

      {questions.map((q, i) => (
        <fieldset key={q.id} className="card space-y-3 p-4">
          <legend className="px-1 text-sm font-bold text-[var(--ink)] sm:text-base">
            {i + 1}. {q.text}
          </legend>
          <div className="space-y-2 pt-1">
            {q.options.map((o) => (
              <label
                key={`${q.id}-${o.label}`}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-2.5 text-sm hover:border-[var(--brand)]"
              >
                <input
                  type="radio"
                  name={q.id}
                  value={o.score}
                  required
                  className="mt-1 shrink-0"
                />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      <button className="btn btn-primary w-full" type="submit">
        Ver resultado
      </button>
    </form>
  );
}
