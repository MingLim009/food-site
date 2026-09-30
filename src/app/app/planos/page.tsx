"use client";

import { useEffect, useState } from "react";
import { PAID_PLANS } from "@/lib/plans";
import { formatBrl } from "@/lib/utils";

export default function PlansPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [checkouts, setCheckouts] = useState<Record<string, string | null>>({});

  useEffect(() => {
    fetch("/api/plans/checkout")
      .then((r) => r.json())
      .then((d) => {
        if (d.checkouts) setCheckouts(d.checkouts);
      })
      .catch(() => {});
  }, []);

  async function subscribe(tier: string) {
    setLoading(tier);
    setMessage("");

    const monetizzeUrl = checkouts[tier];
    if (monetizzeUrl) {
      window.location.href = monetizzeUrl;
      return;
    }

    const res = await fetch("/api/plans/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ tier }),
    });
    const data = await res.json();
    setLoading(null);
    if (!res.ok) {
      setMessage(data.error || "Erro");
      return;
    }
    setMessage(
      `Plano ${tier} ativado até ${new Date(data.planExpiresAt).toLocaleDateString("pt-BR")}. ${data.note || ""}`
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="display text-3xl font-bold">Planos</h1>
      <div className="card border-l-4 border-l-[var(--accent)] p-4 text-sm">
        <p className="font-bold text-[var(--accent-dark)]">Teste grátis de 36 horas</p>
        <p className="mt-1 text-[var(--muted)]">
          Toda conta nova já começa com 36 horas de acesso amplo (sem download de PDFs). Depois do
          teste, assine um plano pago para continuar.
        </p>
      </div>
      <p className="text-sm text-[var(--muted)]">
        Pagamento via Monetizze. Use o <strong>mesmo e-mail</strong> da sua conta EloAlimentar na
        compra.
      </p>
      {message ? <p className="card p-3 text-sm text-[var(--ok)]">{message}</p> : null}
      <div className="space-y-4">
        {PAID_PLANS.map((p) => {
          const featured = p.tier === "BASIC";
          return (
          <div
            key={p.tier}
            className={`card p-4 ${featured ? "ring-2 ring-[var(--brand)]" : ""}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-bold">{p.name}</h2>
                  {featured ? (
                    <span className="chip !bg-[var(--brand)] !text-white text-[10px]">
                      Recomendado
                    </span>
                  ) : null}
                </div>
                <p className="display text-2xl font-bold">{formatBrl(p.priceBrl)}</p>
                <p className="text-xs text-[var(--muted)]">{p.durationDays} dias</p>
              </div>
              <button
                className="btn btn-primary"
                disabled={loading === p.tier}
                onClick={() => subscribe(p.tier)}
              >
                {loading === p.tier
                  ? "..."
                  : checkouts[p.tier]
                    ? "Assinar na Monetizze"
                    : "Ativar (demo)"}
              </button>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-[var(--muted)]">
              {p.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
          </div>
          );
        })}
      </div>
    </div>
  );
}
