"use client";

import { useMemo, useState } from "react";
import { Download, BookOpen } from "lucide-react";
import { parseJsonArray } from "@/lib/utils";
import {
  CartoonVideoPlayer,
  type CartoonScene,
} from "@/components/cartoon-recipe-player";

export type RecipeCard = {
  id: string;
  title: string;
  description: string;
  foodGroups: string;
  textures: string;
  steps: string;
  tips: string | null;
  scenes: CartoonScene[];
};

export type EbookCard = {
  slug: string;
  title: string;
  subtitle: string;
  coverEmoji: string;
  recipeCount: number;
  minPlan: string;
};

type Tab = "videos" | "ebooks" | "lista";

const CATEGORY_FILTERS = [
  { id: "all", label: "Todas" },
  { id: "sem glúten", label: "Sem glúten" },
  { id: "sem leite", label: "Sem leite" },
  { id: "Bolos", label: "Bolos" },
  { id: "Sopas", label: "Sopas" },
  { id: "Muffins", label: "Muffins" },
  { id: "Bolacha recheada", label: "Bolacha recheada" },
  { id: "Arroz", label: "Arroz" },
  { id: "Feijão", label: "Feijão" },
  { id: "Verduras", label: "Verduras" },
  { id: "Biscoitos", label: "Biscoitos" },
] as const;

export function RecipesClient({
  recipes,
  ebooks,
}: {
  recipes: RecipeCard[];
  ebooks: EbookCard[];
}) {
  const [tab, setTab] = useState<Tab>("videos");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(recipes[0]?.id ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes.filter((r) => {
      const groups = parseJsonArray(r.foodGroups);
      const textures = parseJsonArray(r.textures);
      if (category !== "all") {
        const matchCat = groups.some((g) => g.toLowerCase() === category.toLowerCase());
        if (!matchCat) return false;
      }
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        textures.some((t) => t.toLowerCase().includes(q)) ||
        groups.some((g) => g.toLowerCase().includes(q))
      );
    });
  }, [recipes, query, category]);

  const selected =
    filtered.find((r) => r.id === selectedId) || filtered[0] || null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="display text-3xl font-bold sm:text-4xl">Receitas, desenhos e ebooks</h1>
        <p className="mt-1 text-sm text-[var(--muted)] sm:text-base">
          {recipes.length} vídeos em desenho + ebooks sensoriais. Funciona no celular e no
          notebook — toque em <strong>▶ Assistir desenho</strong> ou nas cenas abaixo do vídeo.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["videos", `Assistir desenhos (${recipes.length})`],
            ["ebooks", `Ebooks (${ebooks.length})`],
            ["lista", "Texto passo a passo"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`chip ${tab === id ? "!bg-[var(--brand)] !text-white" : ""}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab !== "ebooks" ? (
        <div className="space-y-3">
          <input
            className="input w-full"
            placeholder="Buscar por nome, textura ou grupo…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`chip ${category === c.id ? "!bg-[var(--accent)] !text-white" : ""}`}
                onClick={() => setCategory(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-[var(--muted)]">
            Mostrando {filtered.length} de {recipes.length} receitas
            {selected ? ` · vídeo: ${selected.scenes.length} cenas` : ""}
          </p>
        </div>
      ) : null}

      {tab === "videos" ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--brand)] bg-[var(--brand-soft)]/60 px-4 py-3 text-sm">
            <p className="font-bold text-[var(--brand-deep)]">Como ver o vídeo no notebook ou celular</p>
            <ol className="mt-1 list-decimal space-y-0.5 pl-4 text-[var(--muted)]">
              <li>Escolha uma receita na faixa abaixo (ou na lista).</li>
              <li>
                Clique em <strong className="text-[var(--ink)]">▶ Assistir desenho</strong> no
                player.
              </li>
              <li>Use “Próxima cena” ou toque nas cenas para avançar.</li>
            </ol>
          </div>

          {selected ? (
            <div className="space-y-3">
              <div>
                <h2 className="text-xl font-bold sm:text-2xl">{selected.title}</h2>
                <p className="text-sm text-[var(--muted)]">{selected.description}</p>
              </div>
              <CartoonVideoPlayer recipeTitle={selected.title} scenes={selected.scenes} />
            </div>
          ) : (
            <p className="text-sm text-[var(--muted)]">Selecione uma receita abaixo.</p>
          )}

          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[var(--muted)]">
              Escolha a receita ({filtered.length})
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-4">
              {filtered.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedId(r.id)}
                  className={`min-w-[11rem] shrink-0 rounded-xl border px-3 py-2.5 text-left text-sm transition md:min-w-0 ${
                    selected?.id === r.id
                      ? "border-[var(--brand)] bg-[var(--brand)] font-bold text-white"
                      : "border-[var(--line)] bg-white hover:border-[var(--brand)]"
                  }`}
                >
                  {r.title}
                  <span
                    className={`mt-0.5 block text-[11px] ${
                      selected?.id === r.id ? "text-white/80" : "text-[var(--muted)]"
                    }`}
                  >
                    {r.scenes.length} cenas · clicar para ver
                  </span>
                </button>
              ))}
            </div>
            {filtered.length === 0 ? (
              <p className="p-3 text-sm text-[var(--muted)]">Nenhuma receita encontrada.</p>
            ) : null}
          </div>
        </div>
      ) : null}

      {tab === "ebooks" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <p className="text-sm text-[var(--muted)] sm:col-span-2">
            Abra o ebook e use <strong>imprimir / salvar PDF</strong> no notebook ou celular.
          </p>
          {ebooks.map((e) => (
            <article key={e.slug} className="card flex items-start gap-3 p-4">
              <span className="text-3xl" aria-hidden>
                {e.coverEmoji}
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <BookOpen size={16} className="text-[var(--brand)]" />
                  <h2 className="font-bold">{e.title}</h2>
                </div>
                <p className="text-sm text-[var(--muted)]">{e.subtitle}</p>
                <p className="text-xs text-[var(--brand-dark)]">
                  {e.recipeCount} receitas sensoriais
                  {e.minPlan === "GOLD" ? " · Gold" : ""}
                </p>
                <a
                  href={`/api/ebooks/download/${e.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary inline-flex gap-2 text-sm"
                >
                  <Download size={16} />
                  Abrir / imprimir ebook
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {tab === "lista" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((r) => (
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
      ) : null}
    </div>
  );
}
