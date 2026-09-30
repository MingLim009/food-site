import Link from "next/link";
import { requireProUser } from "@/components/pro-area";
import fs from "fs";
import path from "path";

type Pec = {
  id: string;
  categoria: string;
  rotulo: string;
  arquivo_png: string;
};

export default async function PecsPage() {
  await requireProUser();
  let catalog: Pec[] = [];
  try {
    const raw = fs.readFileSync(
      path.join(process.cwd(), "content", "pecs", "catalogo.json"),
      "utf8"
    );
    catalog = JSON.parse(raw);
  } catch {
    catalog = [];
  }

  const byCat = new Map<string, Pec[]>();
  for (const p of catalog) {
    const list = byCat.get(p.categoria) || [];
    list.push(p);
    byCat.set(p.categoria, list);
  }

  return (
    <div className="space-y-5">
      <Link href="/app/profissional" className="text-sm font-bold text-[var(--brand)]">
        ← Área profissional
      </Link>
      <div>
        <h1 className="display text-3xl font-bold">PECs / CAA alimentares</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Cartões do portfólio Andreza Dias para comunicação na sessão. Toque para ampliar /
          imprimir.
        </p>
      </div>
      {[...byCat.entries()].map(([cat, items]) => (
        <section key={cat} className="space-y-3">
          <h2 className="font-bold">{cat}</h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {items.map((p) => (
              <a
                key={p.id}
                href={`/pecs/${p.id}.png`}
                target="_blank"
                rel="noreferrer"
                className="card flex flex-col items-center gap-1 p-2 text-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/pecs/${p.id}.png`} alt={p.rotulo} className="h-16 w-16 object-contain" />
                <span className="text-[10px] font-bold leading-tight">{p.rotulo}</span>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
