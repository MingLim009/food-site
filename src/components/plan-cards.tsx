import { PLANS } from "@/lib/plans";
import { formatBrl } from "@/lib/utils";
import Link from "next/link";

export function PlanCards({ ctaHref = "/register" }: { ctaHref?: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {PLANS.map((plan) => (
        <div key={plan.tier} className="card flex flex-col p-5">
          <p className="chip w-fit">{plan.name}</p>
          <h3
            className="display mt-3 text-3xl font-bold"
          >
            {formatBrl(plan.priceBrl)}
          </h3>
          <p className="mt-1 text-sm text-[var(--muted-strong)]">
            {plan.durationDays} dias · {plan.tagline}
          </p>
          <ul className="mt-4 flex-1 space-y-2 text-sm text-[var(--muted-strong)]">
            {plan.features.map((f) => (
              <li key={f}>• {f}</li>
            ))}
          </ul>
          <Link href={ctaHref} className="btn btn-primary mt-5 w-full">
            Quero este plano
          </Link>
        </div>
      ))}
    </div>
  );
}
