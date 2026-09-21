"use client";

import { useState } from "react";
import { PLANS } from "@/lib/plans";
import { formatBrl } from "@/lib/utils";

export default function PlansPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  async function subscribe(tier: string) {
    setLoading(tier);
    setMessage("");
    const res = await fetch("/api/plans/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier }),
    });
    const data = await res.json();
    setLoading(null);
    if (!res.ok) {
      setMessage(data.error || "Erro");
      return;
    }
    setMessage(
      `Plano ${tier} ativado até ${new Date(data.planExpiresAt).toLocaleDateString("pt-BR")}. ${data.note}`
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="display text-3xl font-bold">
        Planos
      </h1>
      <p className="text-sm text-[var(--muted)]">
        Básico sem receitas/encadeamento/escada · Premium 3 meses · Gold 6 meses
      </p>
      {message ? <p className="card p-3 text-sm text-[var(--ok)]">{message}</p> : null}
      <div className="space-y-4">
        {PLANS.map((p) => (
          <div key={p.tier} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-bold">{p.name}</h2>
                <p className="display text-2xl font-bold">
                  {formatBrl(p.priceBrl)}
                </p>
                <p className="text-xs text-[var(--muted)]">{p.durationDays} dias</p>
              </div>
              <button
                className="btn btn-primary"
                disabled={loading === p.tier}
                onClick={() => subscribe(p.tier)}
              >
                {loading === p.tier ? "..." : "Ativar"}
              </button>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-[var(--muted)]">
              {p.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
