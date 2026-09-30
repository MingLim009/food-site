import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { setAppMode, type AppMode } from "@/lib/app-mode";
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
    if (!canAccessFeature(user.plan, user.planExpiresAt, "professional")) {
      return NextResponse.redirect(new URL("/app/planos", origin), 303);
    }

    const contentType = req.headers.get("content-type") || "";
    let mode: AppMode = "family";

    if (contentType.includes("application/json")) {
      const body = z.object({ mode: z.enum(["family", "pro"]) }).parse(await req.json());
      mode = body.mode;
    } else {
      const form = await req.formData();
      const raw = String(form.get("mode") || "family");
      mode = raw === "pro" ? "pro" : "family";
    }

    await setAppMode(mode);
    const dest = mode === "pro" ? "/app/profissional" : "/app";
    return NextResponse.redirect(new URL(dest, origin), 303);
  } catch {
    return NextResponse.redirect(new URL("/login", origin), 303);
  }
}
