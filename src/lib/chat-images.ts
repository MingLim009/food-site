import fs from "fs";
import path from "path";
import { wantsTextOnly, wantsVisualChain, buildVisualChainReply } from "./visual-chain-reply";
import { findEncadeamentoCards } from "./encadeamento-portfolio";

const PUBLIC_DIR = path.join(process.cwd(), "public", "generated");

function ensureDir() {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export function buildChainSvg(title: string, steps: { label: string; emoji: string }[]): string {
  const w = 900;
  const rowH = 110;
  const h = 120 + steps.length * rowH;
  const rows = steps
    .map((s, i) => {
      const y = 100 + i * rowH;
      return `
      <rect x="40" y="${y}" width="820" height="90" rx="18" fill="#e8f1fb" stroke="#2872c3"/>
      <text x="70" y="${y + 38}" font-size="36">${escapeXml(s.emoji)}</text>
      <text x="130" y="${y + 42}" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="#14212b">${escapeXml(s.label)}</text>
      <text x="820" y="${y + 48}" font-family="Arial,sans-serif" font-size="18" fill="#2872c3" text-anchor="end">${i + 1}</text>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="#f6f8fb"/>
  <text x="40" y="48" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#0e7c7b">TIA Nutri · Encadeamento</text>
  <text x="40" y="78" font-family="Arial,sans-serif" font-size="18" fill="#5c6b78">${escapeXml(title)}</text>
  ${rows}
  <text x="40" y="${h - 18}" font-family="Arial,sans-serif" font-size="12" fill="#5c6b78">Educativo · EloAlimentar · Andreza Dias CRN 10418</text>
</svg>`;
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function generateReplyImage(params: {
  userMessage: string;
  childName: string;
}): Promise<{ url: string; caption: string; extraUrls?: string[] } | null> {
  if (wantsTextOnly(params.userMessage)) return null;
  const wantsImg =
    wantsVisualChain(params.userMessage) ||
    /imagem|figura|desenho|ilustr|mostre|mostra|gere uma imagem|gerar imagem|cart[aã]o/i.test(
      params.userMessage
    );
  if (!wantsImg) return null;

  // Prefer portfolio visual cards (210 encadeamentos Andreza)
  const portfolio = findEncadeamentoCards(params.userMessage, 4);
  if (portfolio.length) {
    return {
      url: portfolio[0].svg,
      caption: `${portfolio[0].title} (portfólio visual Andreza Dias)`,
      extraUrls: portfolio.slice(1).map((p) => p.svg),
    };
  }

  ensureDir();
  const id = `${Date.now()}-${slugify(params.userMessage) || "tia"}`;
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (apiKey) {
    try {
      const OpenAI = (await import("openai")).default;
      const client = new OpenAI({ apiKey });
      const prompt = `Photorealistic but soft educational food photo collage for parents, selective eating food chaining steps, natural lighting, appetizing real food textures, clean white background, no text, related to: ${params.userMessage.slice(0, 180)}`;
      const img = await client.images.generate({
        model: process.env.OPENAI_IMAGE_MODEL || "dall-e-3",
        prompt,
        size: "1024x1024",
        n: 1,
      });
      const remote = img.data?.[0]?.url;
      if (remote) {
        const res = await fetch(remote);
        const buf = Buffer.from(await res.arrayBuffer());
        const file = `${id}.png`;
        fs.writeFileSync(path.join(PUBLIC_DIR, file), buf);
        return {
          url: `/generated/${file}`,
          caption: `Figura gerada para ${params.childName}`,
        };
      }
    } catch (e) {
      console.error("[image gen openai]", e);
    }
  }

  const reply = buildVisualChainReply(params.userMessage, params.childName);
  const stepLines = [...reply.matchAll(/\[([^\]]+)\]/g)].map((m) => m[1]);
  const steps = stepLines.slice(0, 8).map((line) => {
    const parts = line.trim().split(/\s+/);
    const emoji = parts[0] || "🍽️";
    const label = parts.slice(1).join(" ") || line;
    return { emoji, label: label.slice(0, 48) };
  });
  if (!steps.length) {
    steps.push(
      { emoji: "🍽️", label: "Alimento seguro" },
      { emoji: "➡️", label: "Pequena variação" },
      { emoji: "🥗", label: "Próximo passo" }
    );
  }

  const svg = buildChainSvg(`Para ${params.childName}`, steps);
  const file = `${id}.svg`;
  fs.writeFileSync(path.join(PUBLIC_DIR, file), svg, "utf8");
  return {
    url: `/generated/${file}`,
    caption: `Figura educativa de encadeamento para ${params.childName}`,
  };
}

export function appendImageToReply(
  text: string,
  image: { url: string; caption: string; extraUrls?: string[] } | null
) {
  if (!image) return text;
  let out = `${text}\n\n![${image.caption}](${image.url})\n_${image.caption}_`;
  for (const u of image.extraUrls || []) {
    out += `\n\n![](${u})`;
  }
  return out;
}
