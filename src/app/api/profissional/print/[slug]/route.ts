import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { canAccessFeature, canDownloadPdfs } from "@/lib/plans";
import { getAppMode } from "@/lib/app-mode";
import { ESCADA_STEPS } from "@/lib/plans";
import { ANAMNESE_SELETIVIDADE } from "@/lib/therapy-sessions";
import { ENCADEAMENTO_CARDS } from "@/lib/encadeamento-portfolio";
import { escadaDesenhoSvgMarkup } from "@/lib/escada-desenho-svg";

type Ctx = { params: Promise<{ slug: string }> };

function shell(title: string, body: string) {
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"/><title>${title}</title>
  <style>
    body{font-family:Arial,sans-serif;margin:24px;color:#14212b}
    h1{color:#0e7c7b} .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
    .card{border:1px solid #dde5ee;border-radius:12px;padding:12px;text-align:center}
    .step{border:2px solid #2872c3;border-radius:12px;padding:8px;margin:6px 0}
    .poster{max-width:640px;margin:0 auto}
    .poster svg{width:100%;height:auto;display:block}
    @media print{button{display:none} body{margin:8px}}
  </style></head><body>
  <button onclick="window.print()">Imprimir / salvar PDF</button>
  ${body}
  <p style="font-size:12px;color:#5c6b78">EloAlimentar · Andreza Dias CRN 10418 · material educativo para plastificar</p>
  </body></html>`;
}

export async function GET(req: Request, ctx: Ctx) {
  try {
    const user = await requireUser();
    if (!canAccessFeature(user.plan, user.planExpiresAt, "professional")) {
      return NextResponse.json({ error: "Gold profissional." }, { status: 403 });
    }
    if (!canDownloadPdfs(user.plan, user.planExpiresAt)) {
      return NextResponse.json(
        { error: "Impressão/PDF bloqueada no acesso grátis. Assine um plano pago." },
        { status: 403 }
      );
    }
    if ((await getAppMode()) !== "pro") {
      return NextResponse.json({ error: "Ative o modo profissional." }, { status: 403 });
    }

    const { slug } = await ctx.params;
    const format = new URL(req.url).searchParams.get("format");

    if (slug === "anamnese") {
      return new NextResponse(
        shell("Anamnese seletividade", `<h1>Anamnese alimentar</h1><pre style="white-space:pre-wrap">${ANAMNESE_SELETIVIDADE}</pre>`),
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    if (slug === "escada") {
      const svg = escadaDesenhoSvgMarkup({ title: "Escada do Comer (1–26)" });
      if (format === "svg") {
        return new NextResponse(svg, {
          headers: {
            "Content-Type": "image/svg+xml; charset=utf-8",
            "Content-Disposition": 'attachment; filename="escada-do-comer.svg"',
          },
        });
      }
      const legend = ESCADA_STEPS.map(
        (s) =>
          `<div class="step"><strong>${s.step}. ${s.title}</strong><br/><span style="font-size:13px">${s.description}</span></div>`
      ).join("");
      return new NextResponse(
        shell(
          "Escada do Comer — desenho",
          `<h1>Escada do Comer em desenho</h1>
           <p>Cartaz ilustrado para plastificar e usar em sessão com a família.</p>
           <div class="poster">${svg}</div>
           <h2 style="margin-top:28px">Legenda completa</h2>
           ${legend}`
        ),
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    if (slug === "dado") {
      const faces = ["Olhar", "Cheirar", "Tocar", "Aproximar", "Brincar", "Pausar"];
      return new NextResponse(
        shell(
          "Dado sensorial",
          `<h1>Dado sensorial</h1><p>Recorte, dobre e plastifique.</p><div class="grid">${faces
            .map((f) => `<div class="card" style="min-height:100px;font-size:22px;font-weight:700">${f}</div>`)
            .join("")}</div>`
        ),
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    if (slug === "quebra-cabeca") {
      const items = ["🍌 Banana", "🍎 Maçã", "🥕 Cenoura", "🥦 Brócolis", "🍊 Laranja", "🌽 Milho"];
      return new NextResponse(
        shell(
          "Quebra-cabeça",
          `<h1>Quebra-cabeça frutas e verduras</h1><p>Imprima 2x, recorte em 4 e plastifique.</p><div class="grid">${items
            .map((i) => `<div class="card" style="font-size:28px;min-height:120px">${i}</div>`)
            .join("")}</div>`
        ),
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    if (slug === "evolucao") {
      return new NextResponse(
        shell(
          "Evolução da sessão",
          `<h1>Formulário de evolução — sessão</h1>
          <p>Criança: __________ Data: ____/____/____ Sessão nº: ____</p>
          <p>Alimento-alvo: __________ Degrau Escada (1–26): ____</p>
          <p>O que fez: ( ) tolerou ( ) olhou ( ) cheirou ( ) tocou ( ) aproximou boca ( ) provou</p>
          <p>Humor / ânsia / engasgo: ________________________________</p>
          <p>Materiais usados: ________________________________</p>
          <p>Próximo passo sugerido: ________________________________</p>
          <p>Orientação à família: ________________________________</p>
          <p>Assinatura profissional: ________________</p>`
        ),
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    if (slug === "encadeamentos") {
      const cards = ENCADEAMENTO_CARDS.slice(0, 24)
        .map(
          (c) =>
            `<div class="card"><img src="${c.svg}" style="width:100%;height:auto"/><div style="font-size:12px">${c.id} · ${c.group}</div></div>`
        )
        .join("");
      return new NextResponse(
        shell("Encadeamentos", `<h1>Amostra de encadeamentos visuais</h1><div class="grid">${cards}</div>`),
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
}
