import { redirect } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { canAccessFeature } from "@/lib/plans";
import { MEDICATIONS_TEA_TDAH } from "@/lib/medications";

export default async function MedicacoesPage() {
  let user;
  try {
    user = await requireUser();
  } catch {
    redirect("/login");
  }

  if (!canAccessFeature(user.plan, user.planExpiresAt, "medications")) {
    return (
      <div className="card space-y-3 p-5">
        <h1 className="display text-2xl font-bold">Medicações TEA / TDAH</h1>
        <p className="text-sm text-[var(--muted)]">
          Conteúdo educativo disponível nos planos Médio e Gold.
        </p>
        <Link href="/app/planos" className="btn btn-primary">
          Ver planos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="chip w-fit">Educativo · sem doses</p>
        <h1 className="display mt-2 text-3xl font-bold">Medicações, apetite e peso</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Como algumas classes de medicamentos usadas no TEA/TDAH podem relacionar-se ao apetite e
          ao ganho de peso — para conversar com o médico e a nutricionista. A EloAlimentar{" "}
          <strong>não prescrita</strong> e não indica doses.
        </p>
      </div>

      <div className="space-y-4">
        {MEDICATIONS_TEA_TDAH.map((m) => (
          <article key={m.id} className="card space-y-3 p-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--brand)]">
                {m.classLabel}
              </p>
              <h2 className="mt-1 text-lg font-bold">{m.name}</h2>
            </div>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>
                <strong>Uso clínico (geral):</strong> {m.usedFor}
              </p>
              <p>
                <strong>No organismo:</strong> {m.organism}
              </p>
              <p>
                <strong>Apetite:</strong> {m.appetite}
              </p>
              <p>
                <strong>Peso:</strong> {m.weight}
              </p>
              <p className="rounded-xl bg-[var(--bg-soft)] p-3 text-[var(--muted)]">{m.note}</p>
            </div>
          </article>
        ))}
      </div>

      <p className="text-xs text-[var(--muted)]">
        Em caso de perda/ganho acelerado de peso, vômitos ou recusa total, procure a equipe de saúde.
      </p>
    </div>
  );
}
