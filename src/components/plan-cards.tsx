import { PAID_PLANS } from "@/lib/plans";
import { formatBrl } from "@/lib/utils";
import Link from "next/link";

export function PlanCards({ ctaHref = "/register" }: { ctaHref?: string }) {
  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius-lg)] border border-[var(--accent)]/30 bg-[color-mix(in_oklab,var(--brand-soft)_40%,white)] p-5 sm:p-6">
        <p className="chip !bg-[var(--accent)] !text-white w-fit">36 horas grátis</p>
        <h3 className="mt-3 text-xl font-bold sm:text-2xl">Teste gratuito para os pais</h3>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)] sm:text-base">
          Ao criar a conta, a família ganha <strong>36 horas de acesso amplo</strong> (sem download
          de PDFs). Depois, escolha um plano pago para continuar.
        </p>
        <Link href={ctaHref} className="btn btn-primary mt-4 min-h-12">
          Começar teste grátis
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {PAID_PLANS.map((plan) => {
          const featured = plan.tier === "BASIC";
          return (
          <div
            key={plan.tier}
            className={`card flex flex-col p-5 sm:p-6 ${
              featured ? "ring-2 ring-[var(--brand)] md:-translate-y-1" : ""
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="chip w-fit">{plan.name}</p>
              {featured ? (
                <p className="chip !bg-[var(--brand)] !text-white w-fit">Recomendado</p>
              ) : null}
            </div>
            <h3 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--ink)]">
              {formatBrl(plan.priceBrl)}
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {plan.durationDays} dias · {plan.tagline}
            </p>
            <ul className="mt-5 flex-1 space-y-2.5 text-sm text-[var(--muted)]">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="mt-0.5 text-[var(--brand)]">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href={ctaHref}
              className={`btn mt-6 w-full min-h-12 ${featured ? "btn-primary" : "btn-secondary"}`}
            >
              Quero este plano
            </Link>
          </div>
          );
        })}
      </div>
    </div>
  );
}
