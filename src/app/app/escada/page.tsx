import { redirect } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canAccessFeature } from "@/lib/plans";
import { EscadaClient } from "./escada-client";

export default async function EscadaPage() {
  let user;
  try {
    user = await requireUser();
  } catch {
    redirect("/login");
  }

  if (!canAccessFeature(user.plan, user.planExpiresAt, "escada")) {
    return (
      <div className="card space-y-3 p-5">
        <h1 className="text-2xl font-semibold">Escada do Comer</h1>
        <p className="text-sm text-[var(--muted)]">
          Disponível nos planos Médio e Gold. O plano Básico não inclui este módulo.
        </p>
        <Link href="/app/planos" className="btn btn-primary">
          Ver planos
        </Link>
      </div>
    );
  }

  const children = await prisma.child.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true },
  });

  const firstId = children[0]?.id;
  const items = firstId
    ? await prisma.foodProgress.findMany({
        where: { childId: firstId },
        orderBy: { updatedAt: "desc" },
      })
    : [];

  return (
    <EscadaClient
      initialChildren={children}
      initialChildId={firstId || ""}
      initialItems={items.map((i) => ({
        id: i.id,
        foodName: i.foodName,
        step: i.step,
        notes: i.notes,
        mediaJson: i.mediaJson,
        reward: i.reward,
      }))}
    />
  );
}
