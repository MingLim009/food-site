import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { canAccessFeature, canDownloadPdfs } from "@/lib/plans";
import { getProDoc } from "@/lib/professional";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const user = await requireUser();
    if (!canAccessFeature(user.plan, user.planExpiresAt, "professional")) {
      return NextResponse.json({ error: "Somente plano Gold." }, { status: 403 });
    }
    if (!canDownloadPdfs(user.plan, user.planExpiresAt)) {
      return NextResponse.json(
        { error: "Download não disponível no acesso grátis. Assine um plano pago." },
        { status: 403 }
      );
    }
    const { slug } = await ctx.params;
    const doc = getProDoc(slug);
    if (!doc || !doc.printable) {
      return NextResponse.json({ error: "Material não encontrado." }, { status: 404 });
    }

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"/>
<title>${escapeHtml(doc.title)} — EloAlimentar</title>
<style>
  body{font-family:Georgia,serif;max-width:720px;margin:24px auto;padding:0 16px;color:#222;line-height:1.5}
  h1{font-size:1.4rem;margin-bottom:0.25rem}
  .meta{color:#666;font-size:0.85rem;margin-bottom:1.5rem}
  pre{white-space:pre-wrap;font-family:Georgia,serif;font-size:0.95rem}
  .foot{margin-top:2rem;font-size:0.75rem;color:#888;border-top:1px solid #ddd;padding-top:0.75rem}
  @media print{body{margin:0;max-width:none}}
</style>
</head>
<body>
  <h1>${escapeHtml(doc.title)}</h1>
  <p class="meta">${escapeHtml(doc.summary)} · EloAlimentar · Área profissional Gold</p>
  <pre>${escapeHtml(doc.body)}</pre>
  <p class="foot">Conteúdo educativo de apoio. Não substitui prontuário oficial nem julgamento clínico. Andreza Dias · CRN 10418.</p>
  <script>window.onload=function(){setTimeout(function(){window.print()},300)}</script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="${slug}.html"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
