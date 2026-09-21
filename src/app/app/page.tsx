import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getPlan, planIsActive } from "@/lib/plans";
import { formatBrl } from "@/lib/utils";

export default async function AppHomePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) redirect("/login");

  const children = await prisma.child.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });
  const active = planIsActive(user.plan, user.planExpiresAt);
  const plan = getPlan(user.plan);

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm font-bold text-[var(--brand)]">EloAlimentar</p>
        <h1 className="display text-3xl font-bold">
          Olá, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {active && plan
            ? `Plano ${plan.name} ativo até ${user.planExpiresAt?.toLocaleDateString("pt-BR")}`
            : "Sem plano ativo — escolha um acesso para liberar a TIA Nutri."}
        </p>
      </header>

      <section className="card p-5">
        <h2 className="font-bold">Atalhos</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[
            ["/app/chat", "Falar com a TIA Nutri"],
            ["/app/criancas", "Perfis infantis"],
            ["/app/escada", "Escada do Comer"],
            ["/app/questionario", "Questionário"],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="surface-tint rounded-2xl px-3 py-4 text-sm font-bold text-[var(--brand-dark)]">
              {label}
            </Link>
          ))}
        </div>
      </section>

      <section className="card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Crianças</h2>
          <Link href="/app/criancas" className="text-sm font-bold text-[var(--brand)]">
            Gerenciar
          </Link>
        </div>
        {children.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--muted)]">
            Cadastre o primeiro perfil para a TIA Nutri responder com contexto seguro.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {children.map((c) => (
              <li key={c.id} className="rounded-xl border border-[var(--line)] px-3 py-3 text-sm font-semibold">
                {c.name}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card p-5">
        <h2 className="font-bold">Planos</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Básico {formatBrl(29.9)} / Premium {formatBrl(99.9)} / Gold {formatBrl(220)}
        </p>
        <Link href="/app/planos" className="btn btn-primary mt-4 w-full">
          Gerenciar plano
        </Link>
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
