import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { planIsActive } from "@/lib/plans";
import { JuridicoClient } from "./juridico-client";
import Link from "next/link";

export default async function JuridicoPage() {
  let user;
  try {
    user = await requireUser();
  } catch {
    redirect("/login");
  }

  if (!planIsActive(user.plan, user.planExpiresAt)) {
    return (
      <div className="card space-y-3 p-5">
        <h1 className="display text-2xl font-bold">Direitos e leis</h1>
        <p className="text-sm text-[var(--muted)]">
          Disponível com plano ativo (teste grátis ou pago). Assine para continuar.
        </p>
        <Link href="/app/planos" className="btn btn-primary">
          Ver planos
        </Link>
      </div>
    );
  }

  return <JuridicoClient />;
}
