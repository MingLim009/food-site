import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { canAccessFeature } from "@/lib/plans";

export const runtime = "nodejs";

type MediaItem = { step: number; url: string; kind: "photo" | "video"; caption?: string };

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    if (!canAccessFeature(user.plan, user.planExpiresAt, "escada")) {
      return NextResponse.json({ error: "Plano sem Escada." }, { status: 403 });
    }

    const form = await req.formData();
    const progressId = String(form.get("progressId") || "");
    const step = Number(form.get("step") || 0);
    const file = form.get("file");

    if (!progressId || !step || !(file instanceof File)) {
      return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
    }

    const item = await prisma.foodProgress.findFirst({
      where: { id: progressId },
      include: { child: true },
    });
    if (!item || item.child.userId !== user.id) {
      return NextResponse.json({ error: "Registro não encontrado." }, { status: 404 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    if (buf.length > 12 * 1024 * 1024) {
      return NextResponse.json({ error: "Arquivo muito grande (máx. 12MB)." }, { status: 400 });
    }

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) {
      return NextResponse.json({ error: "Envie foto ou vídeo." }, { status: 400 });
    }

    const dir = path.join(process.cwd(), "public", "uploads", "escada", item.childId);
    await mkdir(dir, { recursive: true });
    const ext = (file.name.split(".").pop() || (isVideo ? "mp4" : "jpg")).toLowerCase();
    const name = `${item.id}-s${step}-${Date.now()}.${ext}`;
    await writeFile(path.join(dir, name), buf);
    const url = `/uploads/escada/${item.childId}/${name}`;

    let media: MediaItem[] = [];
    try {
      media = JSON.parse(item.mediaJson || "[]");
    } catch {
      media = [];
    }
    media.push({
      step,
      url,
      kind: isVideo ? "video" : "photo",
      caption: String(form.get("caption") || ""),
    });

    const updated = await prisma.foodProgress.update({
      where: { id: item.id },
      data: { mediaJson: JSON.stringify(media) },
    });

    return NextResponse.json({ item: updated, url });
  } catch (e) {
    console.error("[escada media]", e);
    return NextResponse.json({ error: "Falha no upload." }, { status: 500 });
  }
}
