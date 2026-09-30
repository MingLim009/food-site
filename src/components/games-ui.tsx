"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FOOD_GROUPS,
  FOODS,
  GAMES,
  SENSORY_DICE_FACES,
  avatarEmoji,
  parseAvatar,
  type ChildAvatar,
  type FoodItem,
} from "@/lib/games";

type Child = { id: string; name: string; avatar: string };

function pick<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < n && copy.length) {
    const i = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function GamesHub({
  childrenList,
  locked,
}: {
  childrenList: Child[];
  locked?: boolean;
}) {
  const [childId, setChildId] = useState(childrenList[0]?.id || "");
  const child = childrenList.find((c) => c.id === childId);
  const avatar = parseAvatar(child?.avatar);

  if (locked) {
    return (
      <div className="card space-y-3 p-5">
        <h1 className="text-2xl font-semibold">Jogos alimentares</h1>
        <p className="text-sm text-[var(--muted)]">
          Disponível no teste grátis e nos planos pagos. Ative um plano para jogar.
        </p>
        <Link href="/app/planos" className="btn btn-primary">
          Ver planos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-4">
      <div>
        <h1 className="display text-3xl font-bold sm:text-4xl">Jogos interativos</h1>
        <p className="mt-1 text-sm text-[var(--muted)] sm:text-base">
          {GAMES.length} jogos com grupos alimentares. Funciona no <strong>celular e no notebook</strong>
          — clique no jogo para abrir e use os botões grandes para jogar.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--accent)] bg-[var(--bg-soft)] px-4 py-3 text-sm">
        <p className="font-bold text-[var(--accent-dark)]">No notebook</p>
        <p className="mt-1 text-[var(--muted)]">
          1) Escolha quem joga → 2) Clique em um jogo abaixo → 3) Siga as instruções na tela (botões
          verdes). Se nada abrir, atualize com Ctrl+F5 e confira se o plano está ativo.
        </p>
      </div>

      {childrenList.length === 0 ? (
        <div className="card space-y-3 p-4">
          <p className="text-sm text-[var(--muted)]">
            Cadastre um perfil e monte o boneco em Perfis para jogar.
          </p>
          <Link href="/app/criancas" className="btn btn-primary">
            Criar perfil
          </Link>
        </div>
      ) : (
        <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <span className="text-4xl">{avatarEmoji(avatar)}</span>
          <div className="flex-1">
            <label className="label">Quem joga</label>
            <select
              className="input"
              value={childId}
              onChange={(e) => setChildId(e.target.value)}
            >
              {childrenList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <Link href="/app/criancas" className="btn btn-ghost text-sm">
            Boneco
          </Link>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((g) => (
          <Link
            key={g.slug}
            href={childId ? `/app/jogos/${g.slug}?child=${childId}` : "/app/criancas"}
            className="card flex min-h-[7rem] items-start gap-3 p-4 transition hover:border-[var(--brand)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
          >
            <span className="text-3xl">{g.emoji}</span>
            <div>
              <h2 className="font-bold">{g.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{g.description}</p>
              <p className="mt-2 text-xs font-bold text-[var(--brand)]">Clique para jogar →</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function GameShell({
  title,
  emoji,
  childName,
  avatar,
  children,
}: {
  title: string;
  emoji: string;
  childName: string;
  avatar: ChildAvatar;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4 pb-6">
      <Link href="/app/jogos" className="text-sm font-bold text-[var(--brand)]">
        ← Todos os jogos
      </Link>
      <div className="flex items-center gap-3">
        <span className="text-4xl">{emoji}</span>
        <div>
          <h1 className="display text-2xl font-bold sm:text-3xl">{title}</h1>
          <p className="text-sm text-[var(--muted)]">
            Jogando: {avatarEmoji(avatar)} {childName}
          </p>
        </div>
      </div>
      <p className="rounded-xl bg-[var(--tea-gold-soft)] px-3 py-2 text-xs font-semibold text-[#9a6b0a] sm:text-sm">
        Sem pressão: a criança manda no ritmo. No notebook, use o mouse nos botões grandes abaixo.
      </p>
      {children}
    </div>
  );
}

/** Dado Sensorial */
export function DadoSensorialGame({
  childName,
  avatar,
}: {
  childName: string;
  avatar: ChildAvatar;
}) {
  const [foods, setFoods] = useState<FoodItem[]>(() => pick(FOODS, 4));
  const [selected, setSelected] = useState<FoodItem | null>(null);
  const [face, setFace] = useState<(typeof SENSORY_DICE_FACES)[number] | null>(null);
  const [rolling, setRolling] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  function roll() {
    if (!selected) return;
    setRolling(true);
    let n = 0;
    const iv = setInterval(() => {
      setFace(SENSORY_DICE_FACES[n % SENSORY_DICE_FACES.length]);
      n++;
    }, 80);
    setTimeout(() => {
      clearInterval(iv);
      const result = SENSORY_DICE_FACES[Math.floor(Math.random() * SENSORY_DICE_FACES.length)];
      setFace(result);
      setRolling(false);
      setLog((l) => [
        `${avatarEmoji(avatar)} ${childName}: ${result.emoji} ${result.label} → ${selected.emoji} ${selected.name}`,
        ...l,
      ]);
    }, 1200);
  }

  return (
    <GameShell title="Dado Sensorial" emoji="🎲" childName={childName} avatar={avatar}>
      <div className="card space-y-3 p-4">
        <p className="text-sm font-semibold">1. Escolha o alimento da partida</p>
        <div className="flex flex-wrap gap-2">
          {foods.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`chip text-base ${selected?.id === f.id ? "!bg-[var(--brand)] !text-white" : ""}`}
              onClick={() => setSelected(f)}
            >
              {f.emoji} {f.name}
            </button>
          ))}
        </div>
        <button type="button" className="btn btn-ghost text-sm" onClick={() => setFoods(pick(FOODS, 4))}>
          Trocar alimentos
        </button>
      </div>

      <div className="card flex flex-col items-center gap-3 p-6 text-center">
        <p className="text-sm font-semibold">2. Role o dado sensorial</p>
        <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--brand-soft)] to-[var(--tea-gold-soft)] text-5xl shadow-inner">
          {face?.emoji || "🎲"}
        </div>
        {face ? (
          <div>
            <p className="text-lg font-bold">{face.label}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{face.tip}</p>
            {selected ? (
              <p className="mt-2 text-sm font-semibold text-[var(--brand)]">
                Alimento: {selected.emoji} {selected.name}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-[var(--muted)]">Escolha um alimento e role o dado</p>
        )}
        <button
          type="button"
          className="btn btn-primary"
          disabled={!selected || rolling}
          onClick={roll}
        >
          {rolling ? "Rolando..." : "🎲 Jogar dado"}
        </button>
      </div>

      {log.length > 0 ? (
        <div className="card space-y-2 p-4">
          <p className="text-xs font-bold text-[var(--muted)]">Rodadas</p>
          {log.slice(0, 6).map((line, i) => (
            <p key={i} className="text-sm">
              {line}
            </p>
          ))}
        </div>
      ) : null}
    </GameShell>
  );
}

export function ClassificarGruposGame({
  childName,
  avatar,
}: {
  childName: string;
  avatar: ChildAvatar;
}) {
  const deck = useMemo(() => pick(FOODS, 6), []);
  const [left, setLeft] = useState(deck);
  const [bins, setBins] = useState<Record<string, FoodItem[]>>({});
  const [msg, setMsg] = useState("");

  function put(food: FoodItem, groupId: string) {
    if (food.group === groupId) {
      setLeft((l) => l.filter((x) => x.id !== food.id));
      setBins((b) => ({ ...b, [groupId]: [...(b[groupId] || []), food] }));
      setMsg(`Acertou! ${food.emoji} é do grupo certo.`);
    } else {
      setMsg(`Ops! ${food.emoji} ${food.name} não é desse grupo. Tente outro.`);
    }
  }

  const current = left[0];

  return (
    <GameShell title="Classificar Grupos" emoji="📦" childName={childName} avatar={avatar}>
      {current ? (
        <div className="card p-5 text-center">
          <p className="text-5xl">{current.emoji}</p>
          <p className="mt-2 font-bold">{current.name}</p>
          <p className="text-sm text-[var(--muted)]">Em qual grupo coloca?</p>
        </div>
      ) : (
        <div className="card p-5 text-center font-bold text-[var(--ok)]">
          {avatarEmoji(avatar)} Parabéns, {childName}! Todos classificados.
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        {FOOD_GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            className="card p-3 text-left"
            disabled={!current}
            onClick={() => current && put(current, g.id)}
            style={{ borderColor: g.color }}
          >
            <span className="text-xl">{g.emoji}</span>
            <p className="text-sm font-bold">{g.label}</p>
            <p className="text-xs text-[var(--muted)]">{(bins[g.id] || []).length} itens</p>
          </button>
        ))}
      </div>
      {msg ? <p className="text-sm font-semibold text-[var(--brand)]">{msg}</p> : null}
    </GameShell>
  );
}

export function MemoriaGame({ childName, avatar }: { childName: string; avatar: ChildAvatar }) {
  const pairs = useMemo(() => {
    const base = pick(FOODS, 4);
    return shuffle([...base, ...base].map((f, i) => ({ ...f, key: f.id + "-" + i })));
  }, []);
  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);

  function flip(key: string, id: string) {
    if (open.length === 2 || open.includes(key) || matched.includes(id)) return;
    const next = [...open, key];
    setOpen(next);
    if (next.length === 2) {
      const [a, b] = next.map((k) => pairs.find((p) => p.key === k)!);
      if (a.id === b.id) {
        setMatched((m) => [...m, a.id]);
        setOpen([]);
      } else {
        setTimeout(() => setOpen([]), 700);
      }
    }
  }

  return (
    <GameShell title="Memória dos Alimentos" emoji="🃏" childName={childName} avatar={avatar}>
      <div className="grid grid-cols-4 gap-2">
        {pairs.map((card) => {
          const show = open.includes(card.key) || matched.includes(card.id);
          return (
            <button
              key={card.key}
              type="button"
              className="flex aspect-square items-center justify-center rounded-xl border border-[var(--line)] bg-white text-2xl"
              onClick={() => flip(card.key, card.id)}
            >
              {show ? card.emoji : "❓"}
            </button>
          );
        })}
      </div>
      {matched.length >= 4 ? (
        <p className="text-center font-bold text-[var(--ok)]">
          {avatarEmoji(avatar)} {childName} achou todos os pares!
        </p>
      ) : null}
    </GameShell>
  );
}

export function PratoColoridoGame({
  childName,
  avatar,
}: {
  childName: string;
  avatar: ChildAvatar;
}) {
  const needed = ["carnes", "verduras", "frutas", "arroz", "feijao"] as const;
  const options = useMemo(() => shuffle(pick(FOODS, 10)), []);
  const [plate, setPlate] = useState<FoodItem[]>([]);

  function add(f: FoodItem) {
    if (plate.some((p) => p.group === f.group)) return;
    if (!needed.includes(f.group as (typeof needed)[number])) return;
    setPlate((p) => [...p, f]);
  }

  const done = needed.every((g) => plate.some((p) => p.group === g));

  return (
    <GameShell title="Prato Colorido" emoji="🍽️" childName={childName} avatar={avatar}>
      <div className="card min-h-28 p-4">
        <p className="text-xs font-bold text-[var(--muted)]">Seu prato</p>
        <div className="mt-2 flex flex-wrap gap-2 text-3xl">
          {plate.length ? plate.map((p) => <span key={p.id}>{p.emoji}</span>) : "🍽️"}
        </div>
      </div>
      <p className="text-sm">Pegue 1 de cada: carne, verdura, fruta, arroz e feijão</p>
      <div className="flex flex-wrap gap-2">
        {options.map((f) => (
          <button key={f.id} type="button" className="chip text-base" onClick={() => add(f)}>
            {f.emoji} {f.name}
          </button>
        ))}
      </div>
      {done ? (
        <p className="font-bold text-[var(--ok)]">
          {avatarEmoji(avatar)} Prato completo, {childName}!
        </p>
      ) : null}
    </GameShell>
  );
}

export function TapTargetGame({
  title,
  emoji,
  childName,
  avatar,
  targetGroup,
  prompt,
}: {
  title: string;
  emoji: string;
  childName: string;
  avatar: ChildAvatar;
  targetGroup: string;
  prompt: string;
}) {
  const items = useMemo(() => shuffle(pick(FOODS, 9)), []);
  const [score, setScore] = useState(0);
  const [miss, setMiss] = useState(0);

  function tap(f: FoodItem) {
    if (f.group === targetGroup) setScore((s) => s + 1);
    else setMiss((m) => m + 1);
  }

  return (
    <GameShell title={title} emoji={emoji} childName={childName} avatar={avatar}>
      <p className="text-sm font-semibold">{prompt}</p>
      <p className="text-xs text-[var(--muted)]">
        Acertos: {score} · Erros: {miss}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {items.map((f) => (
          <button
            key={f.id + score + miss}
            type="button"
            className="card flex aspect-square flex-col items-center justify-center gap-1 p-2"
            onClick={() => tap(f)}
          >
            <span className="text-3xl">{f.emoji}</span>
            <span className="text-[10px] font-bold">{f.name}</span>
          </button>
        ))}
      </div>
    </GameShell>
  );
}

export function FeijaoPulaGame({
  childName,
  avatar,
}: {
  childName: string;
  avatar: ChildAvatar;
}) {
  const [pos, setPos] = useState(0);
  const [score, setScore] = useState(0);
  const beans = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        left: 10 + ((i * 17) % 80),
        delay: i * 0.4,
      })),
    []
  );

  useEffect(() => {
    const t = setInterval(() => setPos((p) => (p + 1) % 100), 80);
    return () => clearInterval(t);
  }, []);

  return (
    <GameShell title="Feijão Pula" emoji="🫘" childName={childName} avatar={avatar}>
      <p className="text-sm">Mova o boneco e toque nos feijões!</p>
      <p className="text-xs text-[var(--muted)]">Pontos: {score}</p>
      <div className="relative h-48 overflow-hidden rounded-2xl border border-[var(--line)] bg-gradient-to-b from-[#e8f3ff] to-[#fff6e0]">
        {beans.map((b) => (
          <button
            key={b.id}
            type="button"
            className="absolute text-2xl"
            style={{
              left: `${b.left}%`,
              top: `${(pos + b.delay * 20) % 85}%`,
            }}
            onClick={() => setScore((s) => s + 1)}
          >
            🫘
          </button>
        ))}
        <div
          className="absolute bottom-2 text-3xl transition-all"
          style={{ left: `${pos % 90}%` }}
        >
          {avatarEmoji(avatar)}
        </div>
      </div>
      <button type="button" className="btn btn-secondary" onClick={() => setPos((p) => (p + 15) % 90)}>
        Mover {childName} →
      </button>
    </GameShell>
  );
}

export function SucoMagicoGame({
  childName,
  avatar,
}: {
  childName: string;
  avatar: ChildAvatar;
}) {
  const target = useMemo(() => pick(FOODS.filter((f) => f.group === "frutas"), 1)[0], []);
  const [picked, setPicked] = useState<FoodItem[]>([]);
  const fruits = FOODS.filter((f) => f.group === "frutas");

  const ok = picked.some((p) => p.id === target.id);

  return (
    <GameShell title="Suco Mágico" emoji="🧃" childName={childName} avatar={avatar}>
      <p className="text-sm font-semibold">
        Faça o suco de: {target.emoji} {target.name}
      </p>
      <div className="card p-4 text-center text-4xl">{ok ? "🧃✨" : "🥛"}</div>
      <div className="flex flex-wrap gap-2">
        {fruits.map((f) => (
          <button
            key={f.id}
            type="button"
            className="chip"
            onClick={() => setPicked((p) => [...p, f])}
          >
            {f.emoji} {f.name}
          </button>
        ))}
      </div>
      {ok ? (
        <p className="font-bold text-[var(--ok)]">
          {avatarEmoji(avatar)} Suco pronto, {childName}!
        </p>
      ) : null}
    </GameShell>
  );
}

export function ArrozFeijaoGame({
  childName,
  avatar,
}: {
  childName: string;
  avatar: ChildAvatar;
}) {
  const [hasArroz, setHasArroz] = useState(false);
  const [hasFeijao, setHasFeijao] = useState(false);
  const options = useMemo(() => shuffle(pick(FOODS, 8)), []);

  function choose(f: FoodItem) {
    if (f.group === "arroz") setHasArroz(true);
    if (f.group === "feijao") setHasFeijao(true);
  }

  return (
    <GameShell title="Arroz & Feijão" emoji="🇧🇷" childName={childName} avatar={avatar}>
      <div className="card flex justify-center gap-4 p-6 text-4xl">
        <span className={hasArroz ? "" : "opacity-30"}>🍚</span>
        <span>+</span>
        <span className={hasFeijao ? "" : "opacity-30"}>🫘</span>
      </div>
      <p className="text-sm">Toque no arroz e no feijão para completar o prato</p>
      <div className="flex flex-wrap gap-2">
        {options.map((f) => (
          <button key={f.id} type="button" className="chip" onClick={() => choose(f)}>
            {f.emoji} {f.name}
          </button>
        ))}
      </div>
      {hasArroz && hasFeijao ? (
        <p className="font-bold text-[var(--ok)]">
          {avatarEmoji(avatar)} Duo clássico completo!
        </p>
      ) : null}
    </GameShell>
  );
}

export function MercadoMagicoGame({
  childName,
  avatar,
}: {
  childName: string;
  avatar: ChildAvatar;
}) {
  const needed = FOOD_GROUPS.map((g) => g.id);
  const options = useMemo(() => shuffle(FOODS), []);
  const [cart, setCart] = useState<FoodItem[]>([]);

  function add(f: FoodItem) {
    if (cart.some((c) => c.group === f.group)) return;
    setCart((c) => [...c, f]);
  }

  const done = needed.every((g) => cart.some((c) => c.group === g));

  return (
    <GameShell title="Mercado Mágico" emoji="🛒" childName={childName} avatar={avatar}>
      <div className="card p-4">
        <p className="text-xs font-bold">Cestinha ({cart.length}/6)</p>
        <div className="mt-2 flex flex-wrap gap-2 text-2xl">
          {cart.map((c) => (
            <span key={c.id}>{c.emoji}</span>
          ))}
        </div>
      </div>
      <p className="text-sm">Pegue 1 alimento de cada grupo</p>
      <div className="flex max-h-64 flex-wrap gap-2 overflow-y-auto">
        {options.map((f) => (
          <button key={f.id} type="button" className="chip" onClick={() => add(f)}>
            {f.emoji} {f.name}
          </button>
        ))}
      </div>
      {done ? (
        <p className="font-bold text-[var(--ok)]">
          {avatarEmoji(avatar)} Compras feitas, {childName}!
        </p>
      ) : null}
    </GameShell>
  );
}

export function DesafioRapidoGame({
  childName,
  avatar,
}: {
  childName: string;
  avatar: ChildAvatar;
}) {
  const [food, setFood] = useState(() => pick(FOODS, 1)[0]);
  const [score, setScore] = useState(0);

  function answer(groupId: string) {
    if (food.group === groupId) {
      setScore((s) => s + 1);
      setFood(pick(FOODS, 1)[0]);
    } else {
      setFood(pick(FOODS, 1)[0]);
    }
  }

  return (
    <GameShell title="Desafio Rápido" emoji="⚡" childName={childName} avatar={avatar}>
      <div className="card p-6 text-center">
        <p className="text-5xl">{food.emoji}</p>
        <p className="mt-2 font-bold">{food.name}</p>
        <p className="text-sm text-[var(--muted)]">Qual grupo?</p>
      </div>
      <p className="text-xs text-[var(--muted)]">Pontos: {score}</p>
      <div className="grid grid-cols-2 gap-2">
        {FOOD_GROUPS.map((g) => (
          <button key={g.id} type="button" className="btn btn-secondary" onClick={() => answer(g.id)}>
            {g.emoji} {g.label}
          </button>
        ))}
      </div>
    </GameShell>
  );
}

