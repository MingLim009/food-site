import Link from "next/link";
import { requireProUser } from "@/components/pro-area";
import {
  SESSION_GROUPS,
  sessionIdeasByGroup,
  ANAMNESE_SELETIVIDADE,
  REWARD_CARDS,
  SESSION_UTENSILS,
} from "@/lib/therapy-sessions";

type Props = { searchParams: Promise<{ g?: string }> };

export default async function SessoesEbookPage({ searchParams }: Props) {
  await requireProUser();
  const sp = await searchParams;
  const g = sp.g || "todos";
  const ideas = sessionIdeasByGroup(g === "todos" ? undefined : g);

  return (
    <div className="space-y-5">
      <Link href="/app/profissional" className="text-sm font-bold text-[var(--brand)]">
        ← Área profissional
      </Link>
      <div>
        <p className="chip w-fit">Ebook profissional · {ideas.length} ideias</p>
        <h1 className="display mt-2 text-3xl font-bold">Sessões de terapia alimentar</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Mais de 100 roteiros com figuras e o que fazer em cada passo, separados por grupos
          alimentares. Imprima ou use na sessão.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SESSION_GROUPS.map((group) => (
          <a
            key={group}
            href={`/app/profissional/sessoes?g=${encodeURIComponent(group)}`}
            className={`chip ${g === group ? "!bg-[var(--brand)] !text-white" : ""}`}
          >
            {group}
          </a>
        ))}
      </div>

      <section className="card space-y-3 p-4">
        <h2 className="font-bold">Utensílios da sessão</h2>
        <ul className="grid gap-1 text-sm sm:grid-cols-2">
          {SESSION_UTENSILS.map((u) => (
            <li key={u}>• {u}</li>
          ))}
        </ul>
      </section>

      <section className="card space-y-3 p-4">
        <h2 className="font-bold">Fichas de recompensa (crianças)</h2>
        <div className="flex flex-wrap gap-2">
          {REWARD_CARDS.map((r) => (
            <span key={r} className="rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm font-semibold">
              🎁 {r}
            </span>
          ))}
        </div>
      </section>

      <section className="card space-y-2 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-bold">Anamnese alimentar — seletividade</h2>
          <a href="/api/profissional/print/anamnese" className="btn btn-secondary text-sm">
            Abrir / imprimir
          </a>
        </div>
        <pre className="max-h-40 overflow-auto whitespace-pre-wrap text-xs text-[var(--muted)]">
          {ANAMNESE_SELETIVIDADE}
        </pre>
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href="/app/profissional/recursos" className="btn btn-secondary text-sm">
          Recursos terapêuticos (PDFs)
        </Link>
        <Link href="/app/profissional/escada" className="btn btn-secondary text-sm">
          Escada do Comer em desenho
        </Link>
        <a
          href="/api/profissional/pdf/trilha-escada"
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary text-sm"
        >
          Trilha da Escada (PDF)
        </a>
        <a href="/api/profissional/print/escada" className="btn btn-secondary text-sm">
          Imprimir Escada (versão digital)
        </a>
        <a href="/api/profissional/print/dado" className="btn btn-secondary text-sm">
          Dado sensorial
        </a>
        <a href="/api/profissional/print/quebra-cabeca" className="btn btn-secondary text-sm">
          Quebra-cabeça frutas/verduras
        </a>
        <a href="/api/profissional/print/evolucao" className="btn btn-secondary text-sm">
          Formulário de evolução da sessão
        </a>
        <a href="/app/profissional/pecs" className="btn btn-secondary text-sm">
          Cartões PECs / CAA
        </a>
        <a href="/app/profissional/encadeamentos-visuais" className="btn btn-secondary text-sm">
          210 encadeamentos visuais
        </a>
      </div>

      <div className="space-y-4">
        {ideas.map((idea) => (
          <article key={idea.id} className="card space-y-3 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase text-[var(--brand)]">{idea.group}</p>
                <h3 className="text-lg font-bold">{idea.title}</h3>
                <p className="text-sm text-[var(--muted)]">
                  {idea.durationMin} min · {idea.goal}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold">Materiais</p>
              <p className="text-sm text-[var(--muted)]">{idea.materials.join(" · ")}</p>
            </div>
            <ol className="space-y-2">
              {idea.steps.map((st) => (
                <li key={st.n} className="rounded-xl bg-[var(--bg-soft)] p-3 text-sm">
                  <p className="font-bold">
                    <span className="mr-2 text-xl" aria-hidden>
                      {st.figure}
                    </span>
                    {st.n}. {st.title}
                  </p>
                  <p className="mt-1 text-[var(--muted)]">{st.doWithChild}</p>
                </li>
              ))}
            </ol>
            <p className="text-xs text-[var(--brand-deep)]">💡 {idea.tip}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
