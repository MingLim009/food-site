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
    <div className="mx-auto min-h-[100svh] max-w-lg">
      <div className="safe-bottom px-4 pt-5">{children}</div>
      <BottomNav isAdmin={user.role === "ADMIN"} />
    </div>
  );
}
