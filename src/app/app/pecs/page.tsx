import Link from "next/link";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";
import { requireUser } from "@/lib/auth";
import { canAccessFeature } from "@/lib/plans";

type Pec = { id: string; categoria: string; rotulo: string };

export default async function FamilyPecsPage() {
  let user;
  try {
    user = await requireUser();
  } catch {
    redirect("/login");
  }

  if (!canAccessFeature(user.plan, user.planExpiresAt, "escada")) {
    return (
      <div className="card space-y-3 p-5">
        <h1 className="display text-2xl font-bold">Cartões PECs / CAA</h1>
        <p className="text-sm text-[var(--muted)]">Disponível nos planos Médio e Gold.</p>
        <Link href="/app/planos" className="btn btn-primary">
          Ver planos
        </Link>
      </div>
    );
  }

  let catalog: Pec[] = [];
  try {
    catalog = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "content", "pecs", "catalogo.json"), "utf8")
    );
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
      <div>
        <h1 className="display text-3xl font-bold">Cartões PECs para a família</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Figuras para comunicação na mesa (pedido, recusa, mais, acabou…). Toque para ampliar.
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
