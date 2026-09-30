import {
  FOODS,
  FOOD_GROUPS,
  SENSORY_DICE_FACES,
  encodeMergeBoard,
  mergeTier,
  avatarEmoji,
  type ChildAvatar,
  type FoodGroupId,
} from "@/lib/games";

function shell(opts: {
  title: string;
  emoji: string;
  childName: string;
  avatar: ChildAvatar;
  backHref: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4 pb-8">
      <a href={opts.backHref} className="text-sm font-bold text-[var(--brand)]">
        ← Todos os jogos
      </a>
      <div className="flex items-center gap-3">
        <span className="text-4xl">{opts.emoji}</span>
        <div>
          <h1 className="display text-2xl font-bold sm:text-3xl">{opts.title}</h1>
          <p className="text-sm text-[var(--muted)]">
            {avatarEmoji(opts.avatar)} {opts.childName}
          </p>
        </div>
      </div>
      <p className="rounded-xl bg-[var(--tea-gold-soft)] px-3 py-2 text-sm font-semibold text-[#9a6b0a]">
        Toque nos botões grandes. Funciona em Samsung, Apple e notebook (sem depender de JavaScript).
      </p>
      {opts.children}
    </div>
  );
}

function base(slug: string, childId: string, extra?: Record<string, string>) {
  const p = new URLSearchParams({ child: childId, ...(extra || {}) });
  return `/app/jogos/${slug}?${p.toString()}`;
}

/** Dado Sensorial — 100% links */
export function StaticDadoSensorial(props: {
  childId: string;
  childName: string;
  avatar: ChildAvatar;
  foodId?: string;
  faceIdx?: string;
}) {
  const foods = FOODS.slice(0, 12);
  const food = FOODS.find((f) => f.id === props.foodId) || null;
  const face =
    props.faceIdx !== undefined
      ? SENSORY_DICE_FACES[Number(props.faceIdx) % SENSORY_DICE_FACES.length]
      : null;
  const slug = "dado-sensorial";

  return shell({
    title: "Dado Sensorial",
    emoji: "🎲",
    childName: props.childName,
    avatar: props.avatar,
    backHref: "/app/jogos",
    children: (
      <>
        <div className="card space-y-3 p-4">
          <p className="font-bold">1. Escolha o alimento</p>
          <div className="flex flex-wrap gap-2">
            {foods.map((f) => (
              <a
                key={f.id}
                href={base(slug, props.childId, { food: f.id })}
                className={`chip min-h-11 text-base ${
                  food?.id === f.id ? "!bg-[var(--brand)] !text-white" : ""
                }`}
              >
                {f.emoji} {f.name}
              </a>
            ))}
          </div>
        </div>
        <div className="card flex flex-col items-center gap-3 p-6 text-center">
          <p className="font-bold">2. Role o dado</p>
          <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--brand-soft)] to-[var(--tea-gold-soft)] text-5xl">
            {face?.emoji || "🎲"}
          </div>
          {face ? (
            <div>
              <p className="text-lg font-bold">{face.label}</p>
              <p className="text-sm text-[var(--muted)]">{face.tip}</p>
              {food ? (
                <p className="mt-2 font-semibold text-[var(--brand)]">
                  Com: {food.emoji} {food.name}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-[var(--muted)]">Escolha o alimento e toque em Jogar</p>
          )}
          {food ? (
            <a
              href={base(slug, props.childId, { food: food.id, roll: "1" })}
              className="btn btn-primary min-h-14 w-full max-w-sm text-base"
            >
              🎲 Jogar dado agora
            </a>
          ) : (
            <p className="text-sm font-semibold text-[var(--danger)]">
              Escolha um alimento acima primeiro
            </p>
          )}
        </div>
      </>
    ),
  });
}

/** Toque no grupo certo */
export function StaticTapGroup(props: {
  slug: string;
  title: string;
  emoji: string;
  childId: string;
  childName: string;
  avatar: ChildAvatar;
  targetGroup: FoodGroupId;
  prompt: string;
  pick?: string;
  score?: string;
}) {
  const score = Number(props.score || 0) || 0;
  const options = [...FOODS].sort((a, b) => a.name.localeCompare(b.name)).slice(0, 12);
  const picked = options.find((f) => f.id === props.pick);
  let feedback: string | null = null;
  let nextScore = score;
  if (picked) {
    if (picked.group === props.targetGroup) {
      feedback = `Acertou! ${picked.emoji} ${picked.name} é do grupo certo.`;
      nextScore = score + 1;
    } else {
      feedback = `${picked.emoji} ${picked.name} é de outro grupo. Tente de novo!`;
    }
  }

  return shell({
    title: props.title,
    emoji: props.emoji,
    childName: props.childName,
    avatar: props.avatar,
    backHref: "/app/jogos",
    children: (
      <>
        <p className="text-sm font-semibold">{props.prompt}</p>
        <p className="chip w-fit">Pontos: {picked && picked.group === props.targetGroup ? nextScore : score}</p>
        {feedback ? (
          <div className="card border-[var(--accent)] bg-[var(--bg-soft)] p-4 font-semibold">
            {feedback}
          </div>
        ) : null}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {options.map((f) => (
            <a
              key={f.id}
              href={base(props.slug, props.childId, {
                pick: f.id,
                score: String(
                  picked && picked.group === props.targetGroup ? nextScore : score
                ),
              })}
              className="card flex min-h-[4.5rem] flex-col items-center justify-center gap-1 p-3 text-center active:bg-[var(--brand-soft)]"
            >
              <span className="text-3xl">{f.emoji}</span>
              <span className="text-xs font-bold">{f.name}</span>
            </a>
          ))}
        </div>
        <a
          href={base(props.slug, props.childId, { score: "0" })}
          className="btn btn-ghost"
        >
          Zerar pontos
        </a>
      </>
    ),
  });
}

/** Classificar grupos */
export function StaticClassificar(props: {
  childId: string;
  childName: string;
  avatar: ChildAvatar;
  food?: string;
  group?: string;
  score?: string;
}) {
  const slug = "classificar-grupos";
  const score = Number(props.score || 0) || 0;
  const food = FOODS.find((f) => f.id === props.food) || FOODS[Math.floor(Math.random() * FOODS.length)];
  const chosen = FOOD_GROUPS.find((g) => g.id === props.group);
  let feedback: string | null = null;
  let nextScore = score;
  if (chosen) {
    if (chosen.id === food.group) {
      feedback = `Isso! ${food.emoji} ${food.name} é ${chosen.label}.`;
      nextScore = score + 1;
    } else {
      feedback = `Quase. ${food.emoji} ${food.name} não é ${chosen.label}.`;
    }
  }

  const nextFood = FOODS[(FOODS.findIndex((f) => f.id === food.id) + 1) % FOODS.length];

  return shell({
    title: "Classificar grupos",
    emoji: "🧺",
    childName: props.childName,
    avatar: props.avatar,
    backHref: "/app/jogos",
    children: (
      <>
        <p className="chip w-fit">Pontos: {chosen && chosen.id === food.group ? nextScore : score}</p>
        <div className="card flex flex-col items-center gap-2 p-6 text-center">
          <span className="text-5xl">{food.emoji}</span>
          <p className="text-lg font-bold">{food.name}</p>
          <p className="text-sm text-[var(--muted)]">Em qual grupo fica?</p>
        </div>
        {feedback ? (
          <div className="card p-4 font-semibold text-[var(--brand-deep)]">{feedback}</div>
        ) : null}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {FOOD_GROUPS.map((g) => (
            <a
              key={g.id}
              href={base(slug, props.childId, {
                food: food.id,
                group: g.id,
                score: String(score),
              })}
              className="btn btn-primary min-h-14"
            >
              {g.emoji} {g.label}
            </a>
          ))}
        </div>
        <a
          href={base(slug, props.childId, {
            food: nextFood.id,
            score: String(chosen && chosen.id === food.group ? nextScore : score),
          })}
          className="btn btn-ghost"
        >
          Próximo alimento →
        </a>
      </>
    ),
  });
}

/** Arroz e feijão / simples escolha */
export function StaticPickTwo(props: {
  slug: string;
  title: string;
  emoji: string;
  childId: string;
  childName: string;
  avatar: ChildAvatar;
  aGroup: FoodGroupId;
  bGroup: FoodGroupId;
  aLabel: string;
  bLabel: string;
  pick?: string;
}) {
  const pool = FOODS.filter((f) => f.group === props.aGroup || f.group === props.bGroup);
  const picked = pool.find((f) => f.id === props.pick);

  return shell({
    title: props.title,
    emoji: props.emoji,
    childName: props.childName,
    avatar: props.avatar,
    backHref: "/app/jogos",
    children: (
      <>
        <p className="text-sm font-semibold">
          Separe: toque em {props.aLabel} ou {props.bLabel}
        </p>
        {picked ? (
          <div className="card p-4 font-semibold">
            {picked.emoji} {picked.name} →{" "}
            {picked.group === props.aGroup ? props.aLabel : props.bLabel}
          </div>
        ) : null}
        <div className="grid grid-cols-2 gap-2">
          {pool.map((f) => (
            <a
              key={f.id}
              href={base(props.slug, props.childId, { pick: f.id })}
              className="card flex min-h-[4.5rem] flex-col items-center justify-center p-3 active:bg-[var(--brand-soft)]"
            >
              <span className="text-3xl">{f.emoji}</span>
              <span className="text-xs font-bold">{f.name}</span>
            </a>
          ))}
        </div>
      </>
    ),
  });
}

export function StaticMercado(props: {
  childId: string;
  childName: string;
  avatar: ChildAvatar;
  cart?: string;
}) {
  const slug = "mercado-magico";
  const cartIds = (props.cart || "").split(",").filter(Boolean);
  const cart = cartIds
    .map((id) => FOODS.find((f) => f.id === id))
    .filter(Boolean) as typeof FOODS;

  return shell({
    title: "Mercado mágico",
    emoji: "🛒",
    childName: props.childName,
    avatar: props.avatar,
    backHref: "/app/jogos",
    children: (
      <>
        <p className="text-sm">Monte a cesta tocando nos alimentos (máx. 6).</p>
        <div className="card p-4">
          <p className="text-xs font-bold text-[var(--muted)]">Cesta</p>
          <p className="mt-2 text-2xl">
            {cart.length ? cart.map((f) => f.emoji).join(" ") : "🛒 vazia"}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {FOODS.slice(0, 12).map((f) => {
            const next = [...cartIds, f.id].slice(-6).join(",");
            return (
              <a
                key={f.id}
                href={base(slug, props.childId, { cart: next })}
                className="card flex min-h-[4.5rem] flex-col items-center justify-center p-2"
              >
                <span className="text-2xl">{f.emoji}</span>
                <span className="text-[10px] font-bold">{f.name}</span>
              </a>
            );
          })}
        </div>
        <a href={base(slug, props.childId, { cart: "" })} className="btn btn-ghost">
          Esvaziar cesta
        </a>
      </>
    ),
  });
}

export function StaticDesafio(props: {
  childId: string;
  childName: string;
  avatar: ChildAvatar;
  n?: string;
}) {
  const slug = "desafio-rapido";
  const n = Number(props.n || 0) || 0;
  const food = FOODS[n % FOODS.length];
  const group = FOOD_GROUPS.find((g) => g.id === food.group)!;

  return shell({
    title: "Desafio rápido",
    emoji: "⚡",
    childName: props.childName,
    avatar: props.avatar,
    backHref: "/app/jogos",
    children: (
      <>
        <div className="card flex flex-col items-center gap-2 p-6 text-center">
          <span className="text-5xl">{food.emoji}</span>
          <p className="text-lg font-bold">{food.name}</p>
          <p className="text-sm text-[var(--muted)]">
            Grupo: {group.emoji} {group.label}
          </p>
        </div>
        <a
          href={base(slug, props.childId, { n: String(n + 1) })}
          className="btn btn-primary min-h-14 w-full text-base"
        >
          Próximo desafio →
        </a>
      </>
    ),
  });
}

export function StaticMemoria(props: {
  childId: string;
  childName: string;
  avatar: ChildAvatar;
  open?: string;
}) {
  const slug = "memoria-alimentos";
  const pair = FOODS.slice(0, 6);
  const cards = [...pair, ...pair].map((f, i) => ({ ...f, key: `${f.id}-${i}` }));
  const openId = props.open;

  return shell({
    title: "Memória de alimentos",
    emoji: "🧠",
    childName: props.childName,
    avatar: props.avatar,
    backHref: "/app/jogos",
    children: (
      <>
        <p className="text-sm">Toque em uma carta para revelar.</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {cards.map((c) => {
            const revealed = openId === c.key;
            return (
              <a
                key={c.key}
                href={base(slug, props.childId, { open: c.key })}
                className="card flex min-h-[4.5rem] items-center justify-center text-3xl"
              >
                {revealed ? c.emoji : "❓"}
              </a>
            );
          })}
        </div>
      </>
    ),
  });
}

/** Merge Game — junte dois iguais para evoluir (estilo fusão). */
export function StaticMergeGame(props: {
  childId: string;
  childName: string;
  avatar: ChildAvatar;
  board: number[];
  sel?: number | null;
  score: number;
  message?: string;
}) {
  const slug = "merge-alimentos";
  const boardEnc = encodeMergeBoard(props.board);
  const sel = props.sel;
  const maxLevel = Math.max(0, ...props.board);

  function cellHref(i: number) {
    const extra: Record<string, string> = {
      g: boardEnc,
      score: String(props.score),
    };
    if (sel === undefined || sel === null || Number.isNaN(sel)) {
      extra.sel = String(i);
    } else if (sel === i) {
      // desmarca
    } else {
      extra.a = String(sel);
      extra.b = String(i);
    }
    return base(slug, props.childId, extra);
  }

  return shell({
    title: "Merge Game — Fusão",
    emoji: "🔀",
    childName: props.childName,
    avatar: props.avatar,
    backHref: "/app/jogos",
    children: (
      <>
        <div className="card space-y-2 p-4">
          <p className="text-sm font-semibold">
            Toque em dois blocos <strong>iguais</strong> para fundir e subir de nível.
          </p>
          <p className="text-xs text-[var(--muted)]">
            🌱 → 🥕 → 🥗 → 🍚 → 🍲 → ⭐ · Pontos:{" "}
            <strong className="text-[var(--brand)]">{props.score}</strong>
            {maxLevel >= 6 ? " · Você chegou na estrela!" : ""}
          </p>
          {props.message ? (
            <p className="rounded-xl bg-[var(--brand-soft)] px-3 py-2 text-sm font-bold text-[var(--brand-deep)]">
              {props.message}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {props.board.map((level, i) => {
            const tier = mergeTier(level);
            const selected = sel === i;
            return (
              <a
                key={i}
                href={cellHref(i)}
                className={`flex min-h-[4.25rem] flex-col items-center justify-center rounded-2xl border-2 text-3xl transition ${
                  selected
                    ? "border-[var(--brand)] bg-[var(--brand)] text-white shadow-md"
                    : level
                      ? "border-[var(--line)] bg-white active:bg-[var(--brand-soft)]"
                      : "border-dashed border-[var(--line)] bg-[var(--bg-soft)]"
                }`}
              >
                {tier ? (
                  <>
                    <span>{tier.emoji}</span>
                    <span className="mt-0.5 text-[9px] font-bold leading-tight opacity-80">
                      {tier.label}
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-[var(--muted)]">+</span>
                )}
              </a>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={base(slug, props.childId, {
              g: boardEnc,
              score: String(props.score),
              drop: "1",
            })}
            className="btn btn-primary min-h-12 flex-1"
          >
            + Novo alimento (semente)
          </a>
          <a
            href={base(slug, props.childId, { g: "reset", score: "0" })}
            className="btn btn-ghost min-h-12"
          >
            Reiniciar
          </a>
        </div>
      </>
    ),
  });
}
