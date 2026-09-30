import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getAppMode } from "@/lib/app-mode";
import { canAccessFeature } from "@/lib/plans";
import { CURRICULO } from "@/lib/curriculo";

export default async function CurriculoPage() {
  let user;
  try {
    user = await requireUser();
  } catch {
    redirect("/login");
  }

  if (!canAccessFeature(user.plan, user.planExpiresAt, "professional")) {
    redirect("/app/profissional");
  }

  const mode = await getAppMode();
  if (mode !== "pro") {
    return (
      <div className="card space-y-4 p-5">
        <h1 className="display text-2xl font-bold">Currículo profissional</h1>
        <p className="text-sm text-[var(--muted)]">
          Este material didático / institucional fica no <strong>modo profissional</strong>.
          Ative o modo abaixo para visualizar.
        </p>
        <form action="/api/mode" method="post">
          <input type="hidden" name="mode" value="pro" />
          <button type="submit" className="btn btn-primary w-full">
            Entrar no modo profissional
          </button>
        </form>
        <Link href="/app" className="btn btn-secondary w-full">
          Voltar ao modo família
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link href="/app/profissional" className="text-sm font-bold text-[var(--brand)]">
        ← Área profissional
      </Link>
      <div className="card space-y-4 p-5">
        <p className="chip w-fit !bg-[var(--tea-gold)] !text-white">Currículo</p>
        <h1 className="display text-3xl font-bold">{CURRICULO.name}</h1>
        <p className="font-semibold text-[var(--brand)]">{CURRICULO.credentials}</p>
        <p className="text-sm text-[var(--muted)]">{CURRICULO.title}</p>
        <p className="text-sm leading-relaxed">{CURRICULO.summary}</p>
        <div>
          <h2 className="font-bold">Destaques</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {CURRICULO.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-bold">Temas de atuação</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {CURRICULO.topics.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        </div>
        <p className="text-xs text-[var(--muted)]">{CURRICULO.disclaimer}</p>
      </div>
    </div>
  );
}
