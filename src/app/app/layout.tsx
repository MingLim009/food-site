import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { BottomNav } from "@/components/nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) redirect("/login");

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-[0.65rem] bg-[var(--brand)] text-white"
          title="Símbolo da neurodivergência"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            aria-hidden
          >
            <path d="M12 12c-2-3.5-6-3.5-6 0s4 3.5 6 0 6-3.5 6 0-4 3.5-6 0" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-[family-name:var(--font-display)] text-sm font-bold text-[var(--brand)] sm:text-base">
            EloAlimentar
          </p>
          <p className="truncate text-[11px] font-medium text-[var(--muted)] sm:text-xs">
            TIA Nutri · celular e notebook
          </p>
        </div>
      </header>
      <div className="safe-bottom px-[var(--space-page)] pt-4 md:pt-6">{children}</div>
      <BottomNav isAdmin={user.role === "ADMIN"} />
    </div>
  );
}
