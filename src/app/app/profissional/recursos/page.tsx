import Link from "next/link";
import { requireProUser } from "@/components/pro-area";
import { proDocsByCategory } from "@/lib/professional";
import { ANDREZA_MATERIAIS } from "@/lib/andreza-materiais";

const KIND_LABEL: Record<string, string> = {
  escada: "Escada do Comer",
  jogo: "Jogos terapêuticos",
  sensorial: "Sensorial",
  familia: "Família",
  guia: "Guias de uso",
};

export default async function RecursosPage() {
  await requireProUser();
  const textDocs = proDocsByCategory("recurso");
  const groups = ["escada", "sensorial", "jogo", "familia", "guia"] as const;

  return (
    <div className="space-y-6">
      <Link href="/app/profissional" className="text-sm font-bold text-[var(--brand)]">
        ← Área profissional
      </Link>

      <div>
        <h1 className="display text-3xl font-bold">Recursos terapêuticos</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Kits, linguagem, apoios de sessão e os PDFs originais para plastificar.
        </p>
      </div>

      <section className="space-y-4">
        <div>
          <p className="eyebrow">Arquivos anexados</p>
          <h2 className="display mt-1 text-xl font-bold">Materiais PDF · Andreza Dias</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Trilha da Escada, bingo, cartões, dado, álbum, cartilha e mais — abra ou baixe.
          </p>
        </div>

        {groups.map((kind) => {
          const items = ANDREZA_MATERIAIS.filter((m) => m.kind === kind);
          if (!items.length) return null;
          return (
            <div key={kind} className="space-y-2">
              <h3 className="text-sm font-bold text-[var(--brand-deep)]">{KIND_LABEL[kind]}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map((m) => (
                  <article key={m.slug} className="card flex flex-col gap-3 p-4">
                    <div>
                      <h4 className="font-bold">{m.title}</h4>
                      <p className="mt-1 text-sm text-[var(--muted)]">{m.summary}</p>
                    </div>
                      <a
                        href={`/api/profissional/pdf/${m.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary mt-auto text-sm"
                      >
                        Abrir PDF (planos pagos)
                      </a>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className="space-y-4 border-t border-[var(--line)] pt-6">
        <div>
          <p className="eyebrow">Textos de apoio</p>
          <h2 className="display mt-1 text-xl font-bold">Kit e linguagem terapêutica</h2>
        </div>
        <div className="space-y-4">
          {textDocs.map((doc) => (
            <article key={doc.slug} className="card space-y-3 p-4">
              <h3 className="font-bold">{doc.title}</h3>
              <p className="text-sm text-[var(--muted)]">{doc.summary}</p>
              <pre className="max-h-40 overflow-y-auto whitespace-pre-wrap rounded-xl bg-[var(--bg-soft)] p-3 text-xs leading-relaxed">
                {doc.body}
              </pre>
              <div className="flex flex-wrap gap-2">
                <Link href={`/app/profissional/doc/${doc.slug}`} className="btn btn-secondary text-sm">
                  Abrir completo
                </Link>
                {doc.printable ? (
                  <a href={`/api/profissional/download/${doc.slug}`} className="btn btn-primary text-sm">
                    Baixar / imprimir
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
