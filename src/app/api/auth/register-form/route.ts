import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";
import { trialExpiresAt } from "@/lib/plans";

function publicOrigin(req: Request) {
  const proto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const host = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  if (proto && host) return `${proto}://${host}`;
  return new URL(req.url).origin;
}

export async function POST(req: Request) {
  const form = await req.formData();
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(form.get("password") || "");
  const lgpd = form.get("lgpd");
  const origin = publicOrigin(req);

  const fail = (msg: string) =>
    NextResponse.redirect(new URL("/register?error=" + encodeURIComponent(msg), origin), 303);

  if (!name || name.length < 2) return fail("Informe seu nome.");
  if (!email || !password || password.length < 6) {
    return fail("E-mail e senha (mín. 6 caracteres) são obrigatórios.");
  }
  if (!lgpd) return fail("É necessário aceitar a política de privacidade (LGPD).");

  try {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return fail("E-mail já cadastrado. Faça login.");

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: await hashPassword(password),
        lgpdAcceptedAt: new Date(),
        plan: "TRIAL",
        planExpiresAt: trialExpiresAt(),
      },
    });
    await createSession(user);
    return NextResponse.redirect(new URL("/app?trial=1", origin), 303);
  } catch (e) {
    console.error("[register-form]", e);
    return fail("Falha no cadastro. Tente novamente.");
  }
}
