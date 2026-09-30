import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { canAccessFeature } from "@/lib/plans";
import { getEpisode, NOVELINHA } from "@/lib/novelinha";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ s?: string }>;
};

export default async function NovelinhaEpisodePage({ params, searchParams }: Props) {
  let user;
  try {
    user = await requireUser();
  } catch {
    redirect("/login");
  }
  if (!canAccessFeature(user.plan, user.planExpiresAt, "escada")) {
    redirect("/app/planos");
  }

  const { slug } = await params;
  const sp = await searchParams;
  const ep = getEpisode(slug);
  if (!ep) {
    return (
      <div className="card p-5">
        <p>Episódio não encontrado.</p>
        <Link href="/app/novelinha">Voltar</Link>
      </div>
    );
  }

  const sceneIdx = Math.min(Math.max(0, Number(sp.s || 0) || 0), ep.scenes.length - 1);
  const scene = ep.scenes[sceneIdx];
  const prev = sceneIdx > 0 ? sceneIdx - 1 : null;
  const next = sceneIdx < ep.scenes.length - 1 ? sceneIdx + 1 : null;
  const nextEp = NOVELINHA.find((e) => e.id === ep.id + 1);

  return (
    <div className="space-y-4">
      <Link href="/app/novelinha" className="text-sm font-bold text-[var(--brand)]">
        ← Novelinha
      </Link>
      <div>
        <p className="text-xs font-bold text-[var(--brand)]">
          Episódio {ep.id}/10 · cena {sceneIdx + 1}/{ep.scenes.length}
        </p>
        <h1 className="display text-2xl font-bold sm:text-3xl">{ep.title}</h1>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="relative aspect-[4/3] w-full bg-[var(--bg-soft)]">
          <Image
            src={scene.image}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 720px"
            priority
          />
        </div>
        <div className="space-y-2 p-5" style={{ background: scene.bg }}>
          <p className="text-lg font-semibold leading-relaxed text-[var(--ink)] sm:text-xl">
            {scene.text}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {prev !== null ? (
          <Link href={`/app/novelinha/${ep.slug}?s=${prev}`} className="btn btn-ghost flex-1">
            ← Anterior
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {next !== null ? (
          <Link href={`/app/novelinha/${ep.slug}?s=${next}`} className="btn btn-primary flex-1">
            Próxima →
          </Link>
        ) : nextEp ? (
          <Link href={`/app/novelinha/${nextEp.slug}`} className="btn btn-primary flex-1">
            Próximo episódio →
          </Link>
        ) : (
          <Link href="/app/novelinha" className="btn btn-primary flex-1">
            Concluir novelinha
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-1">
        {ep.scenes.map((_, i) => (
          <Link
            key={i}
            href={`/app/novelinha/${ep.slug}?s=${i}`}
            className={`h-2 flex-1 rounded-full ${i === sceneIdx ? "bg-[var(--brand)]" : "bg-[var(--line)]"}`}
            aria-label={`Cena ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
