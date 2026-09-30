import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { canAccessFeature } from "@/lib/plans";

function publicOrigin(req: Request) {
  const proto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const host = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  if (proto && host) return `${proto}://${host}`;
  return new URL(req.url).origin;
}

export async function POST(req: Request) {
  const origin = publicOrigin(req);
  try {
    const user = await requireUser();
    if (!canAccessFeature(user.plan, user.planExpiresAt, "agenda")) {
      return NextResponse.redirect(new URL("/app/planos", origin), 303);
    }

    const form = await req.formData();
    const action = String(form.get("action") || "create");

    if (action === "delete") {
      const id = String(form.get("id") || "");
      if (id) {
        await prisma.agendaEvent.deleteMany({ where: { id, userId: user.id } });
      }
      return NextResponse.redirect(new URL("/app/agenda", origin), 303);
    }

    const parsed = z
      .object({
        title: z.string().min(1).max(120),
        kind: z.string().min(1).max(40),
        startsAt: z.string().min(1),
        notes: z.string().max(500).optional(),
        alarmMin: z.coerce.number().int().min(0).max(24 * 60).default(30),
        childId: z.string().optional(),
      })
      .parse({
        title: form.get("title"),
        kind: form.get("kind") || "consulta",
        startsAt: form.get("startsAt"),
        notes: form.get("notes") || undefined,
        alarmMin: form.get("alarmMin") || 30,
        childId: form.get("childId") || undefined,
      });

    const startsAt = new Date(parsed.startsAt);
    if (Number.isNaN(startsAt.getTime())) {
      return NextResponse.redirect(new URL("/app/agenda?error=date", origin), 303);
    }

    await prisma.agendaEvent.create({
      data: {
        userId: user.id,
        childId: parsed.childId || null,
        title: parsed.title,
        kind: parsed.kind,
        startsAt,
        notes: parsed.notes || null,
        alarmMin: parsed.alarmMin,
      },
    });

    return NextResponse.redirect(new URL("/app/agenda?ok=1", origin), 303);
  } catch (e) {
    console.error("[agenda]", e);
    return NextResponse.redirect(new URL("/app/agenda?error=1", origin), 303);
  }
}
