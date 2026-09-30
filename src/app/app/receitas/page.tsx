import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canAccessFeature } from "@/lib/plans";
import { planMeetsMinimum } from "@/lib/types";
import { SENSORY_EBOOKS } from "@/lib/ebooks";
import { parseJsonArray } from "@/lib/utils";
import { buildRecipeDetails } from "@/lib/recipe-details";
import { buildRecipeReel } from "@/lib/recipe-reel";
import { RecipeReelPlayer } from "@/components/recipe-reel";

type Props = {
  searchParams: Promise<{
    r?: string;
    scene?: string;
    auto?: string;
    like?: string;
    tab?: string;
    cat?: string;
    q?: string;
  }>;
};

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
];

export default async function RecipesPage({ searchParams }: Props) {
  let user;
  try {
    user = await requireUser();
  } catch {
    redirect("/login");
  }

  if (!canAccessFeature(user.plan, user.planExpiresAt, "recipes")) {
    return (
      <div className="card space-y-3 p-5">
        <h1 className="text-2xl font-semibold">Receitas, vídeos e ebooks</h1>
        <p className="text-sm text-[var(--muted)]">
          Receitas, vídeos e ebooks extras estão no plano <strong>Gold</strong> (e no teste
          grátis). O Médio não inclui este módulo.
        </p>
        <a href="/app/planos" className="btn btn-primary">
          Ver planos
        </a>
      </div>
    );
  }

  const sp = await searchParams;
  const tab = sp.tab === "ebooks" || sp.tab === "lista" ? sp.tab : "videos";
  const cat = sp.cat || "all";
  const q = (sp.q || "").trim().toLowerCase();
  const autoPlay = sp.auto === "1";

  const rows = await prisma.recipe.findMany({
    where: { published: true },
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      description: true,
      foodGroups: true,
      textures: true,
      steps: true,
      tips: true,
      cartoonScenes: true,
      minPlan: true,
    },
  });

  const allowed = rows.filter((r) => planMeetsMinimum(user.plan, r.minPlan));
  const filtered = allowed.filter((r) => {
    const groups = parseJsonArray(r.foodGroups);
    if (cat !== "all" && !groups.some((g) => g.toLowerCase() === cat.toLowerCase())) {
      return false;
    }
    if (!q) return true;
    const textures = parseJsonArray(r.textures);
    return (
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      textures.some((t) => t.toLowerCase().includes(q)) ||
      groups.some((g) => g.toLowerCase().includes(q))
    );
  });

  const selectedId = sp.r && filtered.some((r) => r.id === sp.r) ? sp.r : filtered[0]?.id;
  const selected = filtered.find((r) => r.id === selectedId) || null;

  const groups = selected ? parseJsonArray(selected.foodGroups) : [];
  const details = selected
    ? buildRecipeDetails({
        title: selected.title,
        description: selected.description,
        steps: selected.steps,
        tips: selected.tips,
        foodGroups: groups,
      })
    : null;

  const foodEmoji =
    selected?.title.match(/bolo|muffin|sopa|arroz|feij|cenoura|banana|nugget|biscoito|bolacha/i)?.[0]
      ? guessFoodEmoji(selected.title)
      : "🍽️";

  const beats = selected && details ? buildRecipeReel(selected.title, details, foodEmoji) : [];
  const beatIdx = Math.min(
    Math.max(0, Number(sp.scene || 0) || 0),
    Math.max(0, beats.length - 1)
  );
  const liked = sp.like === "1";
  const ebooks = SENSORY_EBOOKS.filter((e) => planMeetsMinimum(user.plan, e.minPlan));

  function href(opts: {
    r?: string | null;
    scene?: number;
    auto?: boolean;
    like?: boolean;
    tab?: string;
    cat?: string;
  }) {
    const p = new URLSearchParams();
    const t = opts.tab ?? tab;
    if (t !== "videos") p.set("tab", t);
    const c = opts.cat ?? cat;
    if (c !== "all") p.set("cat", c);
    if (sp.q) p.set("q", sp.q);
    if (t === "videos") {
      const rid = opts.r === null ? undefined : (opts.r ?? selectedId);
      if (rid) p.set("r", rid);
      if (opts.auto) p.set("auto", "1");
      const likeOn = opts.like === true || (opts.like === undefined && liked);
      if (likeOn) p.set("like", "1");
      if (typeof opts.scene === "number") p.set("scene", String(opts.scene));
    }
    const s = p.toString();
    return s ? `/app/receitas?${s}` : "/app/receitas";
  }

  const autoNext =
    autoPlay && selected && beatIdx < beats.length - 1
      ? href({ r: selected.id, auto: true, scene: beatIdx + 1 })
      : null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="display text-3xl font-bold sm:text-4xl">Receitas, desenhos e ebooks</h1>
        <p className="mt-1 text-sm text-[var(--muted)] sm:text-base">
          Vídeo vertical interativo (estilo Reels) com personagem, textos grandes, ingredientes,
          forno e Air Fryer.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={href({ tab: "videos" })}
          className={`chip ${tab === "videos" ? "!bg-[var(--brand)] !text-white" : ""}`}
        >
          Reel + ficha ({filtered.length})
        </a>
        <a
          href={href({ tab: "ebooks" })}
          className={`chip ${tab === "ebooks" ? "!bg-[var(--brand)] !text-white" : ""}`}
        >
          Ebooks ({ebooks.length})
        </a>
        <a
          href={href({ tab: "lista" })}
          className={`chip ${tab === "lista" ? "!bg-[var(--brand)] !text-white" : ""}`}
        >
          Lista completa
        </a>
      </div>

      {tab !== "ebooks" ? (
        <div className="space-y-3">
          <form method="get" action="/app/receitas" className="flex flex-wrap gap-2">
            <input type="hidden" name="tab" value={tab} />
            {cat !== "all" ? <input type="hidden" name="cat" value={cat} /> : null}
            <input
              className="input min-w-[12rem] flex-1"
              name="q"
              defaultValue={sp.q || ""}
              placeholder="Buscar por nome…"
            />
            <button className="btn btn-primary" type="submit">
              Buscar
            </button>
          </form>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map((c) => (
              <a
                key={c.id}
                href={href({ cat: c.id, r: null })}
                className={`chip ${cat === c.id ? "!bg-[var(--accent)] !text-white" : ""}`}
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "videos" && selected && details && beats.length ? (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">{selected.title}</h2>
            <p className="text-sm text-[var(--muted)]">{selected.description}</p>
            <p className="mt-1 text-xs font-semibold text-[var(--brand)]">
              Preparo ~{details.prepMin} min · {details.cookNote}
            </p>
          </div>

          {!autoPlay ? (
            <a
              href={href({ r: selected.id, auto: true, scene: 0 })}
              className="btn btn-primary flex min-h-12 w-full items-center justify-center text-base"
            >
              ▶ Assistir reel interativo
            </a>
          ) : null}

          <RecipeReelPlayer
            title={selected.title}
            beats={beats}
            beatIdx={beatIdx}
            recipeId={selected.id}
            liked={liked}
            likeHref={href({
              r: selected.id,
              scene: beatIdx,
              auto: autoPlay,
              like: !liked,
            })}
            prevHref={href({
              r: selected.id,
              scene: Math.max(0, beatIdx - 1),
              auto: autoPlay,
            })}
            nextHref={href({
              r: selected.id,
              scene: Math.min(beats.length - 1, beatIdx + 1),
              auto: autoPlay,
            })}
            autoHref={autoNext}
            pauseHref={
              autoPlay
                ? href({ r: selected.id, scene: beatIdx, auto: false })
                : href({ r: selected.id, scene: beatIdx, auto: true })
            }
          />

          {/* FICHA */}
          <div className="grid gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-[#9ec5ea] bg-[#e8f3fc] p-4">
              <h3 className="text-sm font-bold uppercase text-[#1a5a9a]">🧾 Ingredientes</h3>
              <ul className="mt-2 space-y-1.5 text-sm">
                {details.ingredients.map((ing) => (
                  <li key={ing} className="flex gap-2">
                    <span className="text-[var(--brand)]">•</span>
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-[#f0c878] bg-[#fff6e0] p-4">
              <h3 className="text-sm font-bold uppercase text-[#9a6b0a]">⏱️ Tempos de assar</h3>
              <div className="mt-3 space-y-3 text-sm">
                <div className="rounded-xl bg-white/80 px-3 py-2">
                  <p className="text-xs font-bold uppercase text-[var(--muted)]">Forno</p>
                  <p className="font-semibold">{details.oven}</p>
                </div>
                <div className="rounded-xl bg-white/80 px-3 py-2">
                  <p className="text-xs font-bold uppercase text-[var(--muted)]">Air Fryer</p>
                  <p className="font-semibold">{details.airFryer}</p>
                </div>
              </div>
            </article>
          </div>

          <article className="rounded-2xl border border-[#b5d99a] bg-[#eef8e4] p-4">
            <h3 className="text-sm font-bold uppercase text-[#3d6b12]">👩‍🍳 Modo de preparo</h3>
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm">
              {details.method.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="mt-3 rounded-xl bg-white/70 px-3 py-2 text-xs font-semibold text-[var(--brand-deep)]">
              💡 {details.tip}
            </p>
          </article>

          <div>
            <p className="mb-2 text-[11px] font-bold uppercase text-[var(--muted)]">
              Trocar receita ({filtered.length})
            </p>
            <div className="grid max-h-[40vh] gap-2 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((r) => (
                <a
                  key={r.id}
                  href={href({ r: r.id, scene: 0 })}
                  className={`rounded-xl border px-3 py-3 text-left text-sm ${
                    r.id === selected.id
                      ? "border-[var(--brand)] bg-[var(--brand)] font-bold text-white"
                      : "border-[var(--line)] bg-white active:bg-[var(--brand-soft)]"
                  }`}
                >
                  {r.title}
                  <span
                    className={`mt-1 block text-[11px] ${
                      r.id === selected.id ? "text-white/85" : "text-[var(--muted)]"
                    }`}
                  >
                    Abrir reel →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {tab === "videos" && !selected ? (
        <p className="text-sm text-[var(--muted)]">Nenhuma receita neste filtro.</p>
      ) : null}

      {tab === "ebooks" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {ebooks.map((e) => (
            <article key={e.slug} className="card space-y-2 p-4">
              <h2 className="font-bold">
                {e.coverEmoji} {e.title}
              </h2>
              <p className="text-sm text-[var(--muted)]">{e.subtitle}</p>
              <a
                href={`/api/ebooks/download/${e.slug}`}
                className="btn btn-primary inline-flex text-sm"
              >
                Abrir / imprimir ebook
              </a>
            </article>
          ))}
        </div>
      ) : null}

      {tab === "lista" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((r) => {
            const d = buildRecipeDetails({
              title: r.title,
              steps: r.steps,
              tips: r.tips,
              foodGroups: parseJsonArray(r.foodGroups),
            });
            return (
              <article key={r.id} className="card space-y-3 p-4">
                <h2 className="font-bold">{r.title}</h2>
                <p className="text-sm text-[var(--muted)]">{r.description}</p>
                <p className="text-xs font-semibold">🔥 {d.oven}</p>
                <p className="text-xs font-semibold">🌬️ {d.airFryer}</p>
                <a
                  href={href({ tab: "videos", r: r.id, scene: 0 })}
                  className="text-sm font-bold text-[var(--brand)]"
                >
                  Abrir reel + ficha →
                </a>
              </article>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function guessFoodEmoji(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("cenoura")) return "🥕";
  if (t.includes("banana")) return "🍌";
  if (t.includes("chocolate") || t.includes("cacau")) return "🍫";
  if (t.includes("sopa")) return "🍲";
  if (t.includes("arroz")) return "🍚";
  if (t.includes("feijão") || t.includes("feijao")) return "🫘";
  if (t.includes("nugget") || t.includes("frango")) return "🍗";
  if (t.includes("muffin") || t.includes("bolo")) return "🧁";
  if (t.includes("biscoito") || t.includes("bolacha") || t.includes("cookie")) return "🍪";
  return "🍽️";
}
