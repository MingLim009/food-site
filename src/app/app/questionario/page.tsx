"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Question } from "@/lib/questionnaire";

export default function QuestionnairePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<{ score: number; summary: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/questionnaire")
      .then((r) => r.json())
      .then((d) => setQuestions(d.questions || []));
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const answers: Record<string, number> = {};
    for (const q of questions) {
      answers[q.id] = Number(fd.get(q.id) || 0);
    }
    const res = await fetch("/api/questionnaire", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childName: fd.get("childName") || undefined,
        answers,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erro");
      return;
    }
    setResult({ score: data.result.score, summary: data.result.summary });
  }

  return (
    <div className="space-y-5">
      <h1 className="display text-3xl font-bold">
        Questionário de seletividade
      </h1>
      <p className="text-sm text-[var(--muted)]">
        Investigação inicial apenas — não é diagnóstico clínico.
      </p>

      {result ? (
        <div className="card space-y-2 p-5">
          <p className="chip w-fit">Escore {result.score}</p>
          <p className="text-sm leading-relaxed">{result.summary}</p>
          <button className="btn btn-ghost" onClick={() => setResult(null)}>
            Refazer
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <input className="input" name="childName" placeholder="Nome da criança (opcional)" />
          {questions.map((q) => (
            <fieldset key={q.id} className="card space-y-2 p-4">
              <legend className="font-bold">{q.text}</legend>
              {q.options.map((o) => (
                <label key={o.label} className="flex items-center gap-2 text-sm">
                  <input type="radio" name={q.id} value={o.score} required />
                  {o.label}
                </label>
              ))}
            </fieldset>
          ))}
          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          <button className="btn btn-primary w-full">Ver resultado</button>
        </form>
      )}
    </div>
  );
}
