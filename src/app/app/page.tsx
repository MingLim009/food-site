import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getPlan, planIsActive } from "@/lib/plans";
import { formatBrl } from "@/lib/utils";
import { avatarEmoji, parseAvatar } from "@/lib/games";

type Props = { searchParams: Promise<{ trial?: string }> };

export default async function AppHomePage({ searchParams }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) redirect("/login");

  const sp = await searchParams;
  const children = await prisma.child.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });
  const active = planIsActive(user.plan, user.planExpiresAt);
  const plan = getPlan(user.plan);
  const isTrial = user.plan === "TRIAL" && active;

  return (
    <div className="space-y-5">
      {sp.trial || isTrial ? (
        <div className="rounded-2xl border border-[var(--accent)] bg-[var(--brand-soft)] px-4 py-3 text-sm">
          <p className="font-bold text-[var(--accent-dark)]">Teste grátis de 36 horas ativo</p>
          <p className="mt-1 text-[var(--muted)]">
            Acesso amplo até{" "}
            {user.planExpiresAt?.toLocaleString("pt-BR") || "—"}. PDFs não baixam no grátis.
            Depois, escolha um plano pago em Planos.
          </p>
        </div>
      ) : null}

      {!active ? (
        <div className="rounded-2xl border border-[var(--warn)] bg-[var(--tea-gold-soft)] px-4 py-3 text-sm">
          <p className="font-bold text-[#9a6b0a]">Seu acesso expirou</p>
          <p className="mt-1 text-[var(--muted)]">
            O teste grátis ou o plano acabou. Assine para continuar com a TIA Nutri e os jogos.
          </p>
          <a href="/app/planos" className="btn btn-primary mt-3">
            Ver planos
          </a>
        </div>
      ) : null}

      <header>
        <p className="text-sm font-bold text-[var(--brand)]">EloAlimentar</p>
        <h1 className="display text-3xl font-bold">Olá, {user.name.split(" ")[0]}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {active && plan
            ? `${plan.name}${isTrial ? " (grátis)" : ""} · até ${user.planExpiresAt?.toLocaleString("pt-BR")}`
            : "Sem plano ativo — escolha um acesso para liberar a TIA Nutri e os jogos."}
        </p>
      </header>

      <section className="card p-5">
        <h2 className="font-bold">Atalhos</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[
            ["/app/chat", "Perguntar à TIA Nutri"],
            ["/app/juridico", "Direitos e leis (escola)"],
            ["/app/novelinha", "Novelinha 2D"],
            ["/app/agenda", "Agenda e alarmes"],
            ["/app/medicacoes", "Medicações TEA/TDAH"],
            ["/app/funcoes-executivas", "Funções executivas"],
            ["/app/escada", "Escada do Comer"],
            ["/app/pecs", "Cartões PECs"],
            ["/app/sugestoes", "Sugestões de melhoria"],
            ["/app/jogos", "Jogos interativos"],
            ["/app/profissional", "Área profissional"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-2xl bg-[var(--brand-soft)] px-3 py-4 text-sm font-bold text-[var(--brand)]"
            >
              {label}
            </a>
          ))}
        </div>
      </section>

      <section className="card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Crianças</h2>
          <a href="/app/criancas" className="text-sm font-bold text-[var(--brand)]">
            Gerenciar
          </a>
        </div>
        {children.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--muted)]">
            Cadastre o perfil e monte o boneco para jogar e conversar com a TIA Nutri.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {children.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-3 rounded-xl border border-[var(--line)] px-3 py-3 text-sm font-semibold"
              >
                <span className="text-2xl">{avatarEmoji(parseAvatar(c.avatar))}</span>
                {c.name}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card p-5">
        <h2 className="font-bold">Planos</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          36 horas grátis → depois Básico {formatBrl(79.9)} / Premium {formatBrl(179)} / Gold{" "}
          {formatBrl(309)}
        </p>
        <a href="/app/planos" className="btn btn-primary mt-4 w-full">
          Gerenciar plano
        </a>
      </section>

      <form action="/api/auth/logout" method="post">
        <LogoutButton />
      </form>
    </div>
  );
}

function LogoutButton() {
  return (
    <button
      className="btn btn-ghost w-full"
      formAction={async () => {
        "use server";
        const { destroySession } = await import("@/lib/auth");
        await destroySession();
        const { redirect } = await import("next/navigation");
        redirect("/login");
      }}
    >
      Sair
    </button>
  );
}
