import Link from "next/link";
import { requireProUser } from "@/components/pro-area";
import { ENCADEAMENTO_CARDS } from "@/lib/encadeamento-portfolio";

type Props = { searchParams: Promise<{ g?: string }> };

export default async function EncadeamentosVisuaisPage({ searchParams }: Props) {
  await requireProUser();
  const sp = await searchParams;
  const groups = [...new Set(ENCADEAMENTO_CARDS.map((c) => c.group))];
  const g = sp.g || groups[0];
  const cards = ENCADEAMENTO_CARDS.filter((c) => c.group === g);

  return (
    <div className="space-y-5">
      <Link href="/app/profissional" className="text-sm font-bold text-[var(--brand)]">
        ← Área profissional
      </Link>
      <div>
        <h1 className="display text-3xl font-bold">210 encadeamentos visuais</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Portfólio Andreza Dias — cartões para sessão e para a TIA Nutri usar quando a família pedir
          figuras. Ilustrações do material enviado (podem ser refinadas para foto realista depois).
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {groups.map((group) => (
          <a
            key={group}
            href={`/app/profissional/encadeamentos-visuais?g=${encodeURIComponent(group)}`}
            className={`chip ${g === group ? "!bg-[var(--brand)] !text-white" : ""}`}
          >
            {group}
          </a>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {cards.map((c) => (
          <a key={c.id} href={c.svg} target="_blank" rel="noreferrer" className="card p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.svg} alt={c.title} className="w-full rounded-lg bg-white" />
            <p className="mt-1 text-center text-[10px] font-bold">
              {c.id} · {c.title}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
