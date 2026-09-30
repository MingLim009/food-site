/**
 * Smoke-test critical routes after login (cookie jar).
 */
import { PrismaClient } from "@prisma/client";

const BASE = process.env.BASE_URL || "http://localhost:3000";

async function main() {
  const jar = new Map<string, string>();

  function storeCookies(res: Response) {
    const raw = res.headers.getSetCookie?.() || [];
    for (const c of raw) {
      const [pair] = c.split(";");
      const eq = pair.indexOf("=");
      if (eq > 0) jar.set(pair.slice(0, eq), pair.slice(eq + 1));
    }
  }

  function cookieHeader() {
    return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
  }

  const loginBody = new URLSearchParams({
    email: "mae@demo.com",
    password: "demo1234",
  });

  const login = await fetch(`${BASE}/api/auth/login-form`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: loginBody,
    redirect: "manual",
  });
  storeCookies(login);

  const results: Record<string, number | string | boolean> = {
    loginStatus: login.status,
    hasCookie: jar.has("elo_session") ? "yes" : "no",
  };

  const paths = [
    "/app",
    "/app/receitas",
    "/app/questionario",
    "/app/escada",
    "/app/encadeamento",
    "/app/jogos",
    "/app/criancas",
    "/app/conteudo/nutricao-comportamento",
    "/app/profissional",
    "/app/chat",
  ];

  for (const p of paths) {
    const res = await fetch(`${BASE}${p}`, {
      headers: { Cookie: cookieHeader() },
      redirect: "manual",
    });
    results[p] = res.status;
    const html = await res.text();
    if (p === "/app/receitas") {
      results.receitasHasPlayer = html.includes("Assistir desenhos") || html.includes("vídeo");
      results.receitasHasScene = html.includes("Cena") || html.includes("cenas") || html.includes("Narração");
    }
    if (p === "/app/questionario") {
      results.questionarioHasQ = html.includes("Quantos alimentos") || html.includes("perguntas");
      results.qCountHint = (html.match(/type="radio"/g) || []).length;
    }
  }

  const prisma = new PrismaClient();
  results.dbRecipes = await prisma.recipe.count();
  results.dbWithScenes = await prisma.recipe.count({ where: { NOT: { cartoonScenes: "[]" } } });
  await prisma.$disconnect();

  console.log(JSON.stringify(results, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
