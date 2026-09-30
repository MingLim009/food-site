import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

function publicOrigin(req: Request) {
  const proto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const host = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  if (proto && host) return `${proto}://${host}`;
  return new URL(req.url).origin;
}

export async function POST(req: Request) {
  const origin = publicOrigin(req);
  try {
    const session = await getSession();
    const form = await req.formData();
    const parsed = z
      .object({
        message: z.string().min(5).max(2000),
        name: z.string().max(80).optional(),
        email: z.string().email().optional().or(z.literal("")),
      })
      .parse({
        message: form.get("message"),
        name: form.get("name") || undefined,
        email: form.get("email") || undefined,
      });

    await prisma.appSuggestion.create({
      data: {
        userId: session?.id || null,
        name: parsed.name || session?.name || null,
        email: parsed.email || session?.email || null,
        message: parsed.message,
      },
    });

    return NextResponse.redirect(new URL("/app/sugestoes?ok=1", origin), 303);
  } catch (e) {
    console.error("[suggestions]", e);
    return NextResponse.redirect(new URL("/app/sugestoes?error=1", origin), 303);
  }
}
