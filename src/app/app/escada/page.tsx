"use client";

import { FormEvent, useEffect, useState } from "react";
import { ESCADA_STEPS } from "@/lib/plans";
import Link from "next/link";

type Child = { id: string; name: string };
type Item = { id: string; foodName: string; step: number; notes: string | null };

export default function EscadaPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [childId, setChildId] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState("");
  const [forbidden, setForbidden] = useState(false);

  async function loadItems(id: string) {
    const res = await fetch(`/api/escada?childId=${id}`);
    const data = await res.json();
    if (res.status === 403) {
      setForbidden(true);
      return;
    }
    if (res.ok) setItems(data.items || []);
  }

  useEffect(() => {
    fetch("/api/children")
      .then((r) => r.json())
      .then(async (d) => {
        setChildren(d.children || []);
        if (d.children?.[0]) {
          setChildId(d.children[0].id);
          await loadItems(d.children[0].id);
        }
      });
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/escada", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childId,
        foodName: fd.get("foodName"),
        step: Number(fd.get("step")),
        notes: fd.get("notes") || null,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erro");
      return;
    }
    (e.target as HTMLFormElement).reset();
    await loadItems(childId);
  }

  if (forbidden) {
    return (
      <div className="card space-y-3 p-5">
        <h1 className="text-2xl font-semibold">Escada do Comer</h1>
        <p className="text-sm text-[var(--muted)]">
          Disponível nos planos Premium e Gold. O plano Básico não inclui este módulo.
        </p>
        <Link href="/app/planos" className="btn btn-primary">
          Ver planos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="display text-3xl font-bold">
        Escada do Comer
      </h1>
      <p className="text-sm text-[var(--muted)]">
        Do passo 1 (Tolerar) ao 26 (Mastigar e comer). Cada alimento tem seu próprio degrau.
      </p>

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

      <form onSubmit={onSubmit} className="card space-y-3 p-4">
        <input className="input" name="foodName" placeholder="Alimento" required />
        <select className="input" name="step" defaultValue={1}>
          {ESCADA_STEPS.map((s) => (
            <option key={s.step} value={s.step}>
              {s.step}. {s.title}
            </option>
          ))}
        </select>
        <input className="input" name="notes" placeholder="Como progredir / observação" />
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        <button className="btn btn-primary w-full">Salvar progresso</button>
      </form>

      <div className="space-y-3">
        {items.map((item) => {
          const meta = ESCADA_STEPS.find((s) => s.step === item.step);
          return (
            <div key={item.id} className="card p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">{item.foodName}</h3>
                <span className="chip">
                  Passo {item.step}/26
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold">{meta?.title}</p>
              <p className="text-sm text-[var(--muted)]">{meta?.description}</p>
              {item.step < 26 ? (
                <p className="mt-2 text-xs text-[var(--brand-dark)]">
                  Próximo: {ESCADA_STEPS[item.step]?.title} — {ESCADA_STEPS[item.step]?.description}
                </p>
              ) : null}
              {item.notes ? <p className="mt-2 text-xs text-[var(--muted)]">{item.notes}</p> : null}
            </div>
          );
        })}
      </div>

      <details className="card p-4">
        <summary className="cursor-pointer font-bold">Ver todos os 26 passos</summary>
        <ol className="mt-3 space-y-2 text-sm text-[var(--muted)]">
          {ESCADA_STEPS.map((s) => (
            <li key={s.step}>
              <strong>{s.step}. {s.title}</strong> — {s.description}
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}
