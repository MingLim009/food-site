import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canAccessFeature } from "@/lib/plans";
import { GAMES, avatarEmoji, parseAvatar } from "@/lib/games";

type Props = {
  searchParams: Promise<{ child?: string }>;
};

export default async function JogosPage({ searchParams }: Props) {
  let user;
  try {
    user = await requireUser();
  } catch {
    redirect("/login");
  }

  const locked = !canAccessFeature(user.plan, user.planExpiresAt, "games");
  const children = await prisma.child.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true, avatar: true },
  });

  const sp = await searchParams;
  const childId =
    (sp.child && children.some((c) => c.id === sp.child) ? sp.child : null) ||
    children[0]?.id ||
    "";
  const child = children.find((c) => c.id === childId);
  const avatar = parseAvatar(child?.avatar);

  if (locked) {
    return (
      <div className="card space-y-3 p-5">
        <h1 className="text-2xl font-semibold">Jogos alimentares</h1>
        <p className="text-sm text-[var(--muted)]">
          Disponível no teste grátis e nos planos pagos. Ative um plano para jogar.
        </p>
        <a href="/app/planos" className="btn btn-primary">
          Ver planos
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-4">
      <div>
        <h1 className="display text-3xl font-bold sm:text-4xl">Jogos interativos</h1>
        <p className="mt-1 text-sm text-[var(--muted)] sm:text-base">
          {GAMES.length} jogos. Funciona em Samsung, Apple e notebook — toque no jogo (link
          simples, sem depender de JavaScript).
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--accent)] bg-[var(--bg-soft)] px-4 py-3 text-sm">
        <p className="font-bold text-[var(--accent-dark)]">Como jogar</p>
        <p className="mt-1 text-[var(--muted)]">
          1) Escolha quem joga → 2) Toque em um jogo → 3) Toque nos botões grandes na tela do jogo.
        </p>
      </div>

      {children.length === 0 ? (
        <div className="card space-y-3 p-4">
          <p className="text-sm text-[var(--muted)]">
            Cadastre um perfil e monte o boneco em Perfis para jogar.
          </p>
          <a href="/app/criancas" className="btn btn-primary">
            Criar perfil
          </a>
        </div>
      ) : (
        <div className="card space-y-3 p-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{avatarEmoji(avatar)}</span>
            <div>
              <p className="label mb-0">Quem joga agora</p>
              <p className="font-bold">{child?.name}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {children.map((c) => (
              <a
                key={c.id}
                href={`/app/jogos?child=${c.id}`}
                className={`chip min-h-11 ${
                  c.id === childId ? "!bg-[var(--brand)] !text-white" : ""
                }`}
              >
                {avatarEmoji(parseAvatar(c.avatar))} {c.name}
              </a>
            ))}
            <a href="/app/criancas" className="chip min-h-11">
              Boneco →
            </a>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((g) => (
          <a
            key={g.slug}
            href={childId ? `/app/jogos/${g.slug}?child=${childId}` : "/app/criancas"}
            className="card flex min-h-[7rem] items-start gap-3 p-4 active:bg-[var(--brand-soft)]"
          >
            <span className="text-3xl">{g.emoji}</span>
            <div>
              <h2 className="font-bold">{g.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{g.description}</p>
              <p className="mt-2 text-xs font-bold text-[var(--brand)]">Toque para jogar →</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
