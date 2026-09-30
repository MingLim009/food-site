import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { canAccessFeature } from "@/lib/plans";
import { NOVELINHA } from "@/lib/novelinha";

export default async function NovelinhaHubPage() {
  let user;
  try {
    user = await requireUser();
  } catch {
    redirect("/login");
  }

  if (!canAccessFeature(user.plan, user.planExpiresAt, "escada")) {
    return (
      <div className="card space-y-3 p-5">
        <h1 className="display text-2xl font-bold">Novelinha</h1>
        <p className="text-sm text-[var(--muted)]">
          Disponível nos planos Médio e Gold (e no teste grátis).
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
        <p className="chip w-fit">10 episódios · ilustrações</p>
        <h1 className="display mt-2 text-3xl font-bold">Novelinha EloAlimentar</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Histórias com figuras realistas sobre seletividade, Escada do Comer e mesa calma — para
          assistir com a criança, sem pressão. Toque em <strong>Música lenta</strong> para um fundo
          calmo.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {NOVELINHA.map((ep) => (
          <Link
            key={ep.slug}
            href={`/app/novelinha/${ep.slug}`}
            className="card overflow-hidden p-0 transition hover:border-[var(--brand)]"
          >
            <div className="relative aspect-[16/10] w-full bg-[var(--bg-soft)]">
              <Image
                src={ep.scenes[0].image}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <div className="p-4">
              <p className="text-xs font-bold text-[var(--brand)]">Episódio {ep.id}</p>
              <h2 className="font-bold">{ep.title}</h2>
              <p className="text-sm text-[var(--muted)]">{ep.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
