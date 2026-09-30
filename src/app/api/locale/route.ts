import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { parseLocale } from "@/lib/i18n";

function publicOrigin(req: Request) {
  const proto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const host = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  if (proto && host) return `${proto}://${host}`;
  return new URL(req.url).origin;
}

export async function POST(req: Request) {
  const origin = publicOrigin(req);
  const form = await req.formData();
  const locale = parseLocale(String(form.get("locale") || "pt"));
  const jar = await cookies();
  jar.set("elo_locale", locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
  const next = String(form.get("next") || "/");
  return NextResponse.redirect(new URL(next, origin), 303);
}
