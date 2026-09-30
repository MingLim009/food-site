import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { canAccessFeature, canDownloadPdfs } from "@/lib/plans";
import { ebookToHtml, getEbook } from "@/lib/ebooks";
import { planMeetsMinimum } from "@/lib/types";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const user = await requireUser();
    if (!canAccessFeature(user.plan, user.planExpiresAt, "ebooks")) {
      return NextResponse.json(
        { error: "Ebooks extras disponíveis no plano Gold." },
        { status: 403 }
      );
    }
    if (!canDownloadPdfs(user.plan, user.planExpiresAt)) {
      return NextResponse.json(
        { error: "Download bloqueado no acesso grátis. Assine um plano pago." },
        { status: 403 }
      );
    }
    const { slug } = await ctx.params;
    const ebook = getEbook(slug);
    if (!ebook) {
      return NextResponse.json({ error: "Ebook não encontrado." }, { status: 404 });
    }
    if (!planMeetsMinimum(user.plan, ebook.minPlan)) {
      return NextResponse.json(
        { error: "Este ebook exige um plano superior." },
        { status: 403 }
      );
    }

    const html = ebookToHtml(ebook);
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
