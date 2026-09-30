import { ESCADA_STEPS } from "@/lib/plans";

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** SVG da Escada do Comer em desenho — para impressão / download. */
export function escadaDesenhoSvgMarkup(opts?: { title?: string }): string {
  const title = opts?.title || "Escada do Comer (1–26)";
  const rows = [...ESCADA_STEPS]
    .reverse()
    .map((s, i) => {
      const y = 70 + i * 28;
      const w = 220 + ((26 - s.step) / 25) * 200;
      const x = (640 - w) / 2;
      const fill =
        s.step === 26 ? "#f5c542" : s.step % 2 === 0 ? "#7ec8f5" : "#a8d4f5";
      return `
      <g>
        <rect x="${x}" y="${y}" width="${w}" height="24" rx="8" fill="${fill}" stroke="#0d4a8a" stroke-width="1.5"/>
        <circle cx="${x + 16}" cy="${y + 12}" r="9" fill="#0d4a8a"/>
        <text x="${x + 16}" y="${y + 16}" text-anchor="middle" fill="#fff" font-size="10" font-weight="700" font-family="Arial,sans-serif">${s.step}</text>
        <text x="${x + 32}" y="${y + 16}" fill="#14212b" font-size="11" font-weight="700" font-family="Arial,sans-serif">${escapeXml(s.title)}</text>
      </g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 860" width="640" height="860">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#9fd0f5"/>
      <stop offset="45%" stop-color="#e8f4fc"/>
      <stop offset="100%" stop-color="#d4ecc8"/>
    </linearGradient>
  </defs>
  <rect width="640" height="860" fill="url(#sky)"/>
  <circle cx="560" cy="48" r="28" fill="#f5c542"/>
  <ellipse cx="80" cy="70" rx="36" ry="16" fill="#fff" opacity="0.85"/>
  <ellipse cx="110" cy="62" rx="24" ry="12" fill="#fff" opacity="0.75"/>
  <text x="320" y="36" text-anchor="middle" fill="#0d4a8a" font-size="22" font-weight="800" font-family="Arial,sans-serif">${escapeXml(title)}</text>
  <text x="320" y="54" text-anchor="middle" fill="#1a6bb5" font-size="12" font-family="Arial,sans-serif">EloAlimentar · material educativo · plastifique</text>
  ${rows}
  <text x="40" y="840" fill="#3d4a55" font-size="11" font-family="Arial,sans-serif">Andreza Dias · CRN 10418 · sem pressão à mesa</text>
</svg>`;
}
