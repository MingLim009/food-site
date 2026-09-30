import { ProCategoryView, requireProUser } from "@/components/pro-area";

export default async function Page() {
  await requireProUser();
  return (
    <div className="space-y-5">
      <div className="card space-y-3 border-[var(--brand)] p-4">
        <h2 className="font-bold text-[var(--brand-deep)]">PDFs originais</h2>
        <p className="text-sm text-[var(--muted)]">
          Trilha da Escada, bingo, cartões, dado, álbum e cartilha estão em Recursos terapêuticos.
        </p>
        <a href="/app/profissional/recursos" className="btn btn-primary w-fit text-sm">
          Abrir Recursos terapêuticos
        </a>
      </div>
      <ProCategoryView
        title="Materiais para imprimir (textos)"
        intro="Folhas em texto para entregar à família ou colar na mesa."
        category="material"
      />
    </div>
  );
}
