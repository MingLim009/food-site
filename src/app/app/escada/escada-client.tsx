"use client";

import { FormEvent, useMemo, useState } from "react";
import { ESCADA_STEPS } from "@/lib/plans";
import Link from "next/link";
import { Infinity as InfinityIcon } from "lucide-react";
import { EscadaDesenho } from "@/components/escada-desenho";

type Child = { id: string; name: string };
type MediaItem = { step: number; url: string; kind: "photo" | "video"; caption?: string };
type Item = {
  id: string;
  foodName: string;
  step: number;
  notes: string | null;
  mediaJson?: string | null;
  reward?: string | null;
};

const REWARDS = [
  "Adesivo especial",
  "Escolher o jogo da tarde",
  "Passeio curto no parque",
  "Filme em família",
  "Tempo extra no brinquedo favorito",
  "Cozinhar juntos um alimento seguro",
];

function parseMedia(raw?: string | null): MediaItem[] {
  try {
    const arr = JSON.parse(raw || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function EscadaClient({
  initialChildren,
  initialChildId,
  initialItems,
}: {
  initialChildren: Child[];
  initialChildId: string;
  initialItems: Item[];
}) {
  const [children] = useState(initialChildren);
  const [childId, setChildId] = useState(initialChildId);
  const [items, setItems] = useState<Item[]>(initialItems);
  const [activeId, setActiveId] = useState(initialItems[0]?.id || "");
  const [focusStep, setFocusStep] = useState<number>(initialItems[0]?.step || 1);
  const [savingStep, setSavingStep] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const active = items.find((i) => i.id === activeId) || items[0] || null;
  const media = useMemo(() => parseMedia(active?.mediaJson), [active?.mediaJson]);
  const focusMeta = ESCADA_STEPS.find((s) => s.step === focusStep);

  async function loadItems(id: string, keepId?: string) {
    if (!id) {
      setItems([]);
      return;
    }
    const res = await fetch(`/api/escada?childId=${id}`, { credentials: "include" });
    const data = await res.json();
    if (res.ok) {
      const list: Item[] = data.items || [];
      setItems(list);
      const nextId =
        (keepId && list.some((i) => i.id === keepId) ? keepId : null) ||
        list[0]?.id ||
        "";
      setActiveId(nextId);
      const cur = list.find((i) => i.id === nextId);
      if (cur) setFocusStep(cur.step);
    }
  }

  async function saveProgress(opts: {
    foodName: string;
    step: number;
    notes?: string | null;
    reward?: string | null;
  }) {
    const res = await fetch("/api/escada", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        childId,
        foodName: opts.foodName,
        step: opts.step,
        notes: opts.notes ?? null,
        reward: opts.reward ?? null,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao salvar");
    return data.item as Item;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!childId) {
      setError("Cadastre uma criança em Perfis primeiro.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    try {
      const item = await saveProgress({
        foodName: String(fd.get("foodName") || ""),
        step: Number(fd.get("step")),
        notes: String(fd.get("notes") || "") || null,
        reward: String(fd.get("reward") || "") || null,
      });
      await loadItems(childId, item.id);
      setFocusStep(item.step);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    }
  }

  /** Clique em qualquer degrau 1–26: acessa e atualiza o progresso. */
  async function goToStep(step: number) {
    if (!active || !childId) return;
    setFocusStep(step);
    if (step === active.step) return;
    setSavingStep(true);
    setError("");
    try {
      const item = await saveProgress({
        foodName: active.foodName,
        step,
        notes: active.notes,
        reward: active.reward,
      });
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, ...item } : i)));
      setActiveId(item.id);
      setFocusStep(step);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível mudar o degrau.");
    } finally {
      setSavingStep(false);
    }
  }

  async function uploadMedia(step: number, file: File) {
    if (!active) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.set("progressId", active.id);
      fd.set("step", String(step));
      fd.set("file", file);
      const res = await fetch("/api/escada/media", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Falha no upload");
        return;
      }
      await loadItems(childId, active.id);
      setFocusStep(step);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand)] text-white">
          <InfinityIcon size={22} aria-label="Símbolo da neurodivergência" />
        </span>
        <div>
          <h1 className="display text-3xl font-bold sm:text-4xl">Escada do Comer</h1>
          <p className="mt-1 text-sm text-[var(--muted)] sm:text-base">
            Toque em <strong>qualquer número de 1 a 26</strong> para ir a esse degrau. A foto/vídeo
            fica no degrau que você escolheu. No 26, a recompensa dos pais.
          </p>
        </div>
      </div>

      {children.length === 0 ? (
        <div className="card space-y-3 p-5">
          <p className="text-sm text-[var(--muted)]">Nenhuma criança cadastrada.</p>
          <Link href="/app/criancas" className="btn btn-primary">
            Ir para Perfis
          </Link>
        </div>
      ) : (
        <>
          <div>
            <label className="label">Criança</label>
            <select
              className="input"
              value={childId}
              onChange={async (e) => {
                setChildId(e.target.value);
                await loadItems(e.target.value);
              }}
            >
              {children.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <form key={active?.id || "new"} onSubmit={onSubmit} className="card space-y-3 p-4">
            <h2 className="font-bold">Registrar / atualizar alimento</h2>
            <input
              className="input"
              name="foodName"
              placeholder="Alimento (ex.: batata-doce)"
              required
              defaultValue={active?.foodName || ""}
            />
            <select className="input" name="step" defaultValue={active?.step || 1}>
              {ESCADA_STEPS.map((s) => (
                <option key={s.step} value={s.step}>
                  Degrau {s.step} — {s.title}
                </option>
              ))}
            </select>
            <input
              className="input"
              name="notes"
              placeholder="Observação (opcional)"
              defaultValue={active?.notes || ""}
            />
            <select className="input" name="reward" defaultValue={active?.reward || REWARDS[0]}>
              {REWARDS.map((r) => (
                <option key={r} value={r}>
                  Recompensa no degrau 26: {r}
                </option>
              ))}
            </select>
            {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
            <button className="btn btn-primary w-full" type="submit">
              Salvar na escada
            </button>
          </form>

          {items.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {items.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  className={`chip min-h-10 ${it.id === active?.id ? "!bg-[var(--brand)] !text-white" : ""}`}
                  onClick={() => {
                    setActiveId(it.id);
                    setFocusStep(it.step);
                  }}
                >
                  {it.foodName} · {it.step}/26
                </button>
              ))}
            </div>
          ) : null}

          {active ? (
            <section className="card overflow-hidden p-0">
              <div className="bg-[var(--brand)] px-4 py-3 text-white">
                <p className="text-xs font-bold uppercase tracking-wide opacity-90">
                  Escada em desenho
                </p>
                <h2 className="text-xl font-bold">
                  {active.foodName} · degrau {active.step}/26
                </h2>
                <p className="text-sm opacity-90">
                  {ESCADA_STEPS.find((s) => s.step === active.step)?.title}
                  {active.reward ? ` · 🎁 ${active.reward}` : ""}
                </p>
                {savingStep ? (
                  <p className="mt-1 text-xs text-white/90">Salvando degrau…</p>
                ) : (
                  <p className="mt-1 text-xs text-white/80">
                    Toque em um degrau do desenho (ou nos números) para acessar.
                  </p>
                )}
              </div>

              <div className="border-b border-[var(--line)] bg-white p-3">
                <p className="mb-2 text-xs font-bold text-[var(--muted)]">Atalho rápido 1–26</p>
                <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-9 lg:grid-cols-13">
                  {ESCADA_STEPS.map((s) => {
                    const isProgress = active.step === s.step;
                    const isFocus = focusStep === s.step;
                    return (
                      <button
                        key={s.step}
                        type="button"
                        disabled={savingStep}
                        onClick={() => goToStep(s.step)}
                        className={`flex min-h-11 min-w-0 items-center justify-center rounded-lg text-sm font-bold transition ${
                          isProgress
                            ? "bg-[var(--accent)] text-white ring-2 ring-[var(--accent)]"
                            : isFocus
                              ? "bg-[var(--brand)] text-white"
                              : active.step > s.step
                                ? "bg-[var(--brand-soft)] text-[var(--brand-deep)]"
                                : "bg-[var(--bg-soft)] text-[var(--muted)]"
                        }`}
                        aria-label={`Degrau ${s.step}: ${s.title}`}
                      >
                        {s.step}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3">
                <EscadaDesenho
                  currentStep={active.step}
                  focusStep={focusStep}
                  foodName={active.foodName}
                  disabled={savingStep}
                  onSelectStep={goToStep}
                />
              </div>

              <div className="space-y-3 border-t border-[var(--line)] p-4">
                <h3 className="font-bold">
                  Anexar foto ou vídeo no degrau {focusStep}
                  {focusMeta ? ` — ${focusMeta.title}` : ""}
                </h3>
                <p className="text-xs text-[var(--muted)]">
                  Selecione o número acima e anexe a mídia desse passo. Tire no celular ou escolha da
                  galeria.
                </p>
                <input
                  type="file"
                  accept="image/*,video/*"
                  capture="environment"
                  disabled={uploading || savingStep}
                  className="block w-full text-sm"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) await uploadMedia(focusStep, f);
                    e.target.value = "";
                  }}
                />
                {uploading ? <p className="text-sm text-[var(--brand)]">Enviando…</p> : null}

                {media.length ? (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {media.map((m, idx) => (
                      <button
                        key={`${m.url}-${idx}`}
                        type="button"
                        className="relative overflow-hidden rounded-xl border border-[var(--line)]"
                        onClick={() => setFocusStep(m.step)}
                      >
                        {m.kind === "video" ? (
                          <video src={m.url} className="aspect-square w-full object-cover" />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.url} alt="" className="aspect-square w-full object-cover" />
                        )}
                        <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[10px] text-white">
                          Degrau {m.step}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
