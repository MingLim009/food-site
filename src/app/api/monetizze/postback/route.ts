import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPlan } from "@/lib/plans";
import { isMonetizzePaidStatus, mapMonetizzeProductToTier } from "@/lib/monetizze";

type Loose = Record<string, unknown>;

function dig(obj: Loose, paths: string[]): string {
  for (const path of paths) {
    const parts = path.split(".");
    let cur: unknown = obj;
    for (const p of parts) {
      if (cur && typeof cur === "object" && p in (cur as Loose)) {
        cur = (cur as Loose)[p];
      } else {
        cur = undefined;
        break;
      }
    }
    if (cur !== undefined && cur !== null && String(cur).trim()) {
      return String(cur).trim();
    }
  }
  return "";
}

function flattenForm(data: Record<string, string>): Loose {
  return { ...data };
}

/**
 * Postback Monetizze (JSON server-to-server).
 * Configurar em: Ferramentas > Postback
 * URL: https://SEU_DOMINIO/api/monetizze/postback
 * Evento: Finalizada / Aprovada
 */
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let raw: Loose = {};

    if (contentType.includes("application/json")) {
      raw = (await req.json()) as Loose;
    } else {
      const form = await req.formData();
      const flat: Record<string, string> = {};
      form.forEach((value, key) => {
        flat[key] = String(value);
      });
      raw = flattenForm(flat);
    }

    const produto = dig(raw, [
      "produto.codigo",
      "produto.chave",
      "produto",
      "produto_codigo",
      "codigo_produto",
    ]);
    const produtoNome = dig(raw, ["produto.nome", "produto_nome", "nome_produto"]);
    const status = dig(raw, ["venda.status", "status", "venda_status", "status_venda"]);
    const email = dig(raw, [
      "comprador.email",
      "email",
      "comprador_email",
      "customer_email",
    ]).toLowerCase();

    console.log("[monetizze postback]", { produto, produtoNome, status, email });

    if (!email) {
      return NextResponse.json({ ok: false, error: "email ausente" }, { status: 400 });
    }

    if (!isMonetizzePaidStatus(status)) {
      return NextResponse.json({ ok: true, ignored: true, reason: "status nao pago", status });
    }

    let tier = mapMonetizzeProductToTier(produto);
    if (!tier) {
      const nome = produtoNome.toLowerCase();
      if (nome.includes("gold") || nome.includes("ouro")) tier = "GOLD";
      else if (nome.includes("premium")) tier = "PREMIUM";
      else if (nome.includes("basico") || nome.includes("básico") || nome.includes("basic"))
        tier = "BASIC";
    }

    if (!tier) {
      return NextResponse.json({ ok: false, error: "produto nao mapeado", produto, produtoNome }, { status: 400 });
    }

    const plan = getPlan(tier);
    if (!plan) {
      return NextResponse.json({ ok: false, error: "plano invalido" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.warn("[monetizze] pagamento sem usuario:", email, tier);
      return NextResponse.json({
        ok: true,
        pendingRegistration: true,
        message: "Pagamento ok. Cadastre-se no EloAlimentar com o mesmo e-mail.",
      });
    }

    const base =
      user.planExpiresAt && user.planExpiresAt > new Date() && user.plan === tier
        ? user.planExpiresAt
        : new Date();
    const planExpiresAt = new Date(base.getTime() + plan.durationDays * 24 * 3600 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { plan: tier, planExpiresAt },
    });

    return NextResponse.json({ ok: true, email, plan: tier, planExpiresAt });
  } catch (e) {
    console.error("[monetizze postback error]", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    service: "monetizze-postback",
    configure: "Ferramentas > Postback > Tipo Postback > JSON > Evento Finalizada/Aprovada",
  });
}
