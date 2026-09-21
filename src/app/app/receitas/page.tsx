"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { parseJsonArray } from "@/lib/utils";

type Recipe = {
  id: string;
  title: string;
  description: string;
  foodGroups: string;
  textures: string;
  steps: string;
  tips: string | null;
};

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/recipes")
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) setError(d.error || "Erro");
        else setRecipes(d.recipes || []);
      });
  }, []);

  if (error) {
    return (
      <div className="card space-y-3 p-5">
        <h1 className="text-2xl font-semibold">Receitas sensoriais</h1>
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
        Receitas sensoriais
      </h1>
      <p className="text-sm text-[var(--muted)]">
        Cobertura de grupos alimentares com atenção a texturas e previsibilidade.
      </p>
      {recipes.map((r) => (
        <article key={r.id} className="card space-y-2 p-4">
          <h2 className="font-bold">{r.title}</h2>
          <p className="text-sm text-[var(--muted)]">{r.description}</p>
          <div className="flex flex-wrap gap-2">
            {parseJsonArray(r.foodGroups).map((g) => (
              <span key={g} className="chip">
                {g}
              </span>
            ))}
            {parseJsonArray(r.textures).map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
          <pre className="whitespace-pre-wrap text-sm text-[var(--ink)]">{r.steps}</pre>
          {r.tips ? <p className="text-xs text-[var(--brand-dark)]">{r.tips}</p> : null}
        </article>
      ))}
    </div>
  );
}
