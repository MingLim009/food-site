import Link from "next/link";
import { requireProUser } from "@/components/pro-area";
import { EscadaDesenho } from "@/components/escada-desenho";
import { ESCADA_STEPS } from "@/lib/plans";

export default async function ProEscadaPage() {
  await requireProUser();

  return (
    <div className="space-y-5">
      <Link href="/app/profissional" className="text-sm font-bold text-[var(--brand)]">
        ← Área profissional
      </Link>

      <div>
        <p className="chip w-fit">Material em desenho</p>
        <h1 className="display mt-2 text-3xl font-bold">Escada do Comer</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          Use o PDF original da <strong>Trilha da Escalada do Comer</strong> (enviado por Andreza)
          para plastificar, ou o desenho interativo na tela.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href="/api/profissional/pdf/trilha-escada"
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary text-sm"
        >
          Abrir Trilha da Escada (PDF original)
        </a>
        <a href="/api/profissional/print/escada" className="btn btn-secondary text-sm">
          Imprimir versão digital
        </a>
        <Link href="/app/profissional/recursos" className="btn btn-ghost text-sm">
          Recursos terapêuticos (PDFs)
        </Link>
        <Link href="/app/escada" className="btn btn-ghost text-sm">
          Escada da família
        </Link>
      </div>

      <section className="card overflow-hidden p-0">
        <div className="border-b border-[var(--line)] bg-[var(--brand-soft)] px-4 py-3">
          <h2 className="font-bold text-[var(--brand-deep)]">PDF original — Trilha da Escalada</h2>
          <p className="text-xs text-[var(--muted)]">Anexado a partir dos seus arquivos Workana</p>
        </div>
        <iframe
          title="Trilha da Escalada do Comer"
          src="/api/profissional/pdf/trilha-escada"
          className="h-[70vh] w-full bg-white"
        />
      </section>

      <div>
        <h2 className="mb-3 font-bold">Versão interativa na tela</h2>
        <EscadaDesenho size="full" />
      </div>

      <section className="card space-y-2 p-4">
        <h2 className="font-bold">Legenda dos 26 degraus</h2>
        <ul className="grid gap-1.5 text-sm sm:grid-cols-2">
          {ESCADA_STEPS.map((s) => (
            <li key={s.step} className="rounded-lg bg-[var(--bg-soft)] px-3 py-2">
              <span className="font-bold text-[var(--brand)]">{s.step}.</span> {s.title}
              <span className="mt-0.5 block text-xs text-[var(--muted)]">{s.description}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
