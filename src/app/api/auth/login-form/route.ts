import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";

function publicOrigin(req: Request) {
  const proto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const host = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  if (proto && host) return `${proto}://${host}`;
  return new URL(req.url).origin;
}

export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(form.get("password") || "");
  const origin = publicOrigin(req);

  if (!email || !password) {
    return NextResponse.redirect(
      new URL("/login?error=" + encodeURIComponent("Informe e-mail e senha."), origin),
      303
    );
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.redirect(
        new URL(
          "/login?error=" +
            encodeURIComponent("Credenciais inválidas. Use mae@demo.com / demo1234"),
          origin
        ),
        303
      );
    }
    await createSession(user);
    const dest = user.role === "ADMIN" ? "/admin" : "/app";
    return NextResponse.redirect(new URL(dest, origin), 303);
  } catch (e) {
    console.error("[login-form]", e);
    return NextResponse.redirect(
      new URL("/login?error=" + encodeURIComponent("Falha no login. Tente novamente."), origin),
      303
    );
  }
}
