import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ChildrenClient } from "./children-client";

export default async function ChildrenPage() {
  let user;
  try {
    user = await requireUser();
  } catch {
    redirect("/login");
  }

  const children = await prisma.child.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <ChildrenClient
      initialChildren={children.map((c) => ({
        id: c.id,
        name: c.name,
        textures: c.textures,
        colors: c.colors,
        shapes: c.shapes,
        acceptedFoods: c.acceptedFoods,
        refusedFoods: c.refusedFoods,
        heightCm: c.heightCm,
        weightKg: c.weightKg,
        notes: c.notes,
        diagnosisNotes: c.diagnosisNotes,
        birthDate: c.birthDate?.toISOString() ?? null,
        avatar: c.avatar,
      }))}
    />
  );
}
