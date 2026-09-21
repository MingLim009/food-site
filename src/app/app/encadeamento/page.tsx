"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { parseJsonArray } from "@/lib/utils";

type Chain = {
  id: string;
  title: string;
  description: string;
  startFood: string;
  endFood: string;
  steps: string;
};

export default function ChainingPage() {
  const [chains, setChains] = useState<Chain[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/chains")
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) setError(d.error || "Erro");
        else setChains(d.chains || []);
      });
  }, []);

  if (error) {
    return (
      <div className="card space-y-3 p-5">
        <h1 className="text-2xl font-semibold">Encadeamento alimentar</h1>
        <p className="text-sm text-[var(--muted)]">{error}</p>
        <Link href="/app/planos" className="btn btn-primary">
          Ver planos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="display text-3xl font-bold">
        Encadeamento alimentar
      </h1>
      <p className="text-sm text-[var(--muted)]">
        Avance do alimento seguro para o alvo com mudanças mínimas.
      </p>
      {chains.map((c) => (
        <article key={c.id} className="card space-y-3 p-4">
          <h2 className="font-bold">{c.title}</h2>
          <p className="text-sm text-[var(--muted)]">{c.description}</p>
          <p className="text-sm">
            <strong>{c.startFood}</strong> → <strong>{c.endFood}</strong>
          </p>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {parseJsonArray(c.steps).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </article>
      ))}
    </div>
  );
}
