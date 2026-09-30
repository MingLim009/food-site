import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canAccessFeature } from "@/lib/plans";
import { planMeetsMinimum } from "@/lib/types";
import { parseJsonArray } from "@/lib/utils";
import {
  CHAINING_GUIDE,
  VISUAL_FOOD_CHAINS,
  type ChainStep,
} from "@/lib/food-chains-visual";

type Props = {
  searchParams: Promise<{ chain?: string }>;
};

function parseVisualSteps(raw: string): ChainStep[] | null {
  try {
    const data = JSON.parse(raw || "[]");
    if (!Array.isArray(data) || !data.length) return null;
    if (typeof data[0] === "string") return null;
    if (data.every((s) => s && typeof s.label === "string" && typeof s.emoji === "string")) {
      return data as ChainStep[];
    }
    return null;
  } catch {
    return null;
  }
}

function ChainFigures({
  steps,
  banner,
}: {
  steps: ChainStep[];
  banner?: string;
}) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-max items-stretch gap-1 sm:gap-2">
        {steps.map((step, i) => (
          <div key={`${step.label}-${i}`} className="flex items-center gap-1 sm:gap-2">
            <div
              className="flex w-[5.5rem] flex-col items-center rounded-2xl border border-black/5 px-1.5 py-2 text-center shadow-sm sm:w-28 sm:px-2 sm:py-3"
              style={{ background: step.bg || "#FFF8E8" }}
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-3xl shadow-sm sm:h-16 sm:w-16 sm:text-4xl"
                aria-hidden
              >
                {step.emoji}
              </div>
              <p className="mt-2 text-[10px] font-bold leading-tight text-[var(--ink)] sm:text-[11px]">
                {step.label}
              </p>
              <span
                className="mt-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white"
                style={{ background: banner || "var(--brand)" }}
              >
                {i + 1}
              </span>
            </div>
            {i < steps.length - 1 ? (
              <span
                className="text-lg font-black sm:text-xl"
                style={{ color: banner || "var(--brand)" }}
                aria-hidden
              >
                →
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function ChainingPage({ searchParams }: Props) {
  let user;
  try {
    user = await requireUser();
  } catch {
    redirect("/login");
  }

  if (!canAccessFeature(user.plan, user.planExpiresAt, "chaining")) {
    return (
      <div className="card space-y-3 p-5">
        <h1 className="text-2xl font-semibold">Encadeamento alimentar</h1>
        <p className="text-sm text-[var(--muted)]">
          Disponível no plano Gold (e no teste grátis). O Médio não inclui encadeamento.
        </p>
        <a href="/app/planos" className="btn btn-primary">
          Ver planos
        </a>
      </div>
    );
  }

  const sp = await searchParams;
  const dbChains = await prisma.foodChain.findMany({
    where: { published: true },
    orderBy: { title: "asc" },
  });
  const extra = dbChains.filter((c) => planMeetsMinimum(user.plan, c.minPlan));

  const selectedId =
    sp.chain && VISUAL_FOOD_CHAINS.some((c) => c.id === sp.chain)
      ? sp.chain
      : VISUAL_FOOD_CHAINS[0].id;
  const selected = VISUAL_FOOD_CHAINS.find((c) => c.id === selectedId)!;

  const g = CHAINING_GUIDE;

  return (
    <div className="space-y-5 pb-4">
      <div>
        <p className="text-sm font-bold text-[var(--brand)]">Como fazer em casa</p>
        <h1 className="display text-3xl font-bold sm:text-4xl">Encadeamento alimentar</h1>
        <p className="mt-1 text-sm text-[var(--muted)] sm:text-base">
          Figuras passo a passo — do alimento seguro ao próximo alvo, com mudanças mínimas.
          Funciona em Samsung, Apple e notebook.
        </p>
      </div>

      {/* Guia — 3 cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl border border-[#9ec5ea] bg-[#e8f3fc] p-4">
          <p className="text-xs font-bold uppercase text-[#1a5a9a]">💡 {g.what.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]">{g.what.body}</p>
        </article>
        <article className="rounded-2xl border border-[#b5d99a] bg-[#eef8e4] p-4">
          <p className="text-xs font-bold uppercase text-[#3d6b12]">✅ {g.why.title}</p>
          <ul className="mt-2 space-y-1 text-sm">
            {g.why.items.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[var(--brand)]">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-[#f0c878] bg-[#fff6e0] p-4">
          <p className="text-xs font-bold uppercase text-[#9a6b0a]">🔢 {g.how.title}</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm">
            {g.how.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </article>
      </div>

      {/* Seletor de cadeias */}
      <div>
        <p className="mb-2 text-[11px] font-bold uppercase text-[var(--muted)]">
          Exemplos práticos — toque para ver a figura
        </p>
        <div className="flex flex-wrap gap-2">
          {VISUAL_FOOD_CHAINS.map((c) => (
            <a
              key={c.id}
              href={`/app/encadeamento?chain=${c.id}`}
              className={`chip min-h-11 text-sm ${
                c.id === selectedId ? "!text-white" : ""
              }`}
              style={
                c.id === selectedId
                  ? { background: c.banner, borderColor: c.banner }
                  : undefined
              }
            >
              {c.categoryEmoji} {c.category}
            </a>
          ))}
        </div>
      </div>

      {/* Figura principal da cadeia */}
      <article className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm">
        <div
          className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-white"
          style={{ background: selected.banner }}
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide opacity-90">
              {selected.categoryEmoji} {selected.category}
            </p>
            <h2 className="text-lg font-bold sm:text-xl">{selected.title}</h2>
          </div>
          <p className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
            {selected.startFood} → {selected.endFood}
          </p>
        </div>
        <div className="space-y-3 p-4">
          <p className="text-sm text-[var(--muted)]">{selected.description}</p>
          <p className="text-[11px] font-bold uppercase text-[var(--brand)]">
            Figura do encadeamento — deslize para o lado no celular
          </p>
          <ChainFigures steps={selected.steps} banner={selected.banner} />
          <p className="rounded-xl bg-[var(--bg-soft)] px-3 py-2 text-xs text-[var(--muted)]">
            Ofereça só o próximo quadro depois que o atual estiver confortável. Olhar, cheirar ou
            tocar já é progresso (Escada do Comer).
          </p>
        </div>
      </article>

      {/* Todas as cadeias em miniatura */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Todas as figuras</h2>
        {VISUAL_FOOD_CHAINS.map((c) => (
          <article
            key={c.id}
            id={c.id}
            className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white"
          >
            <div
              className="px-3 py-2 text-sm font-bold text-white"
              style={{ background: c.banner }}
            >
              {c.categoryEmoji} {c.category}: {c.title}
            </div>
            <div className="p-3">
              <ChainFigures steps={c.steps} banner={c.banner} />
            </div>
          </article>
        ))}
      </div>

      {/* Dicas / lembrar / evitar */}
      <div className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl border border-[#9ec5ea] bg-[#e8f3fc] p-4">
          <p className="text-xs font-bold uppercase text-[#1a5a9a]">💙 {g.tips.title}</p>
          <ul className="mt-2 space-y-1 text-sm">
            {g.tips.items.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-[#f0c878] bg-[#fff6e0] p-4">
          <p className="text-xs font-bold uppercase text-[#9a6b0a]">💛 {g.remember.title}</p>
          <ul className="mt-2 space-y-1 text-sm">
            {g.remember.items.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-[#f0a8a0] bg-[#fff0ee] p-4">
          <p className="text-xs font-bold uppercase text-[#b33a2e]">⛔ {g.avoid.title}</p>
          <ul className="mt-2 space-y-1 text-sm">
            {g.avoid.items.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>
      </div>

      {/* Cadeias extras do banco (texto) */}
      {extra.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Outros encadeamentos</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {extra.map((c) => {
              const visual = parseVisualSteps(c.steps);
              const textSteps = visual ? null : parseJsonArray(c.steps);
              return (
                <article key={c.id} className="card space-y-3 p-4">
                  <h3 className="font-bold">{c.title}</h3>
                  <p className="text-sm text-[var(--muted)]">{c.description}</p>
                  <p className="text-sm">
                    <strong>{c.startFood}</strong> → <strong>{c.endFood}</strong>
                  </p>
                  {visual ? (
                    <ChainFigures steps={visual} />
                  ) : (
                    <ol className="list-decimal space-y-1 pl-5 text-sm">
                      {(textSteps || []).map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ol>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      ) : null}

      <p className="text-center text-[11px] text-[var(--muted)]">
        Material educativo · EloAlimentar · baseado na orientação de Andreza Dias (nutrição
        materno-infantil)
      </p>
    </div>
  );
}
