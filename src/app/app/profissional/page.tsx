import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getAppMode } from "@/lib/app-mode";
import { canAccessFeature } from "@/lib/plans";
import { PRO_NAV } from "@/lib/professional";

export default async function ProfissionalHubPage() {
  let user;
  try {
    user = await requireUser();
  } catch {
    redirect("/login");
  }

  if (!canAccessFeature(user.plan, user.planExpiresAt, "professional")) {
    return (
      <div className="card space-y-4 p-5">
        <h1 className="display text-2xl font-bold">Área profissional</h1>
        <p className="text-sm text-[var(--muted)]">
          Exclusiva do <strong>plano Gold</strong>: currículo, ideias de terapia, anamnese,
          materiais didáticos, sessões e IA profissional.
        </p>
        <Link href="/app/planos" className="btn btn-primary w-full">
          Ver plano Gold
        </Link>
      </div>
    );
  }

  const mode = await getAppMode();

  return (
    <div className="space-y-5">
      <div>
        <p className="chip !bg-[var(--tea-gold)] !text-white w-fit">Gold</p>
        <h1 className="display mt-3 text-3xl font-bold">Área profissional</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Escolha o modo: <strong>Família</strong> (app dos pais) ou <strong>Profissional</strong>{" "}
          (material didático). O conteúdo abaixo só aparece no modo profissional.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <form action="/api/mode" method="post">
          <input type="hidden" name="mode" value="family" />
          <button
            type="submit"
            className={`btn w-full ${mode === "family" ? "btn-primary" : "btn-secondary"}`}
          >
            Modo família
          </button>
        </form>
        <form action="/api/mode" method="post">
          <input type="hidden" name="mode" value="pro" />
          <button
            type="submit"
            className={`btn w-full ${mode === "pro" ? "btn-primary" : "btn-secondary"}`}
          >
            Modo profissional
          </button>
        </form>
      </div>

      {mode !== "pro" ? (
        <div className="card space-y-3 p-5">
          <h2 className="font-bold">Você está no modo família</h2>
          <p className="text-sm text-[var(--muted)]">
            Os materiais didáticos profissionais ficam ocultos para não misturar com o uso dos pais.
            Ative o <strong>modo profissional</strong> para ver currículo e impressos.
          </p>
          <Link href="/app" className="btn btn-secondary w-full">
            Ir ao início da família
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {PRO_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="card block space-y-1 p-4">
              <h2 className="font-bold text-[var(--brand-deep)]">{item.title}</h2>
              <p className="text-sm text-[var(--muted)]">{item.desc}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
