import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { requireUser } from "@/lib/auth";
import { canAccessFeature, canDownloadPdfs } from "@/lib/plans";
import { getAppMode } from "@/lib/app-mode";
import { getAndrezaMaterial } from "@/lib/andreza-materiais";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const user = await requireUser();
    if (!canAccessFeature(user.plan, user.planExpiresAt, "professional")) {
      return NextResponse.json({ error: "Somente plano Gold." }, { status: 403 });
    }
    if (!canDownloadPdfs(user.plan, user.planExpiresAt)) {
      return NextResponse.json(
        { error: "Download de PDF não disponível no acesso grátis. Assine um plano pago." },
        { status: 403 }
      );
    }
    if ((await getAppMode()) !== "pro") {
      return NextResponse.json({ error: "Ative o modo profissional." }, { status: 403 });
    }

    const { slug } = await ctx.params;
    const item = getAndrezaMaterial(slug);
    if (!item) {
      return NextResponse.json({ error: "Material não encontrado." }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), "content", "materiais-andreza", item.file);
    const buf = await fs.readFile(filePath);

    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${item.file}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("ENOENT")) {
      return NextResponse.json({ error: "Arquivo ausente no servidor." }, { status: 404 });
    }
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
}
