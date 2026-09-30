/** Índice dos 210 encadeamentos visuais (Andreza Dias). */

export type EncadeamentoCard = {
  id: string;
  group: string;
  title: string;
  svg: string;
};

const GROUPS: { name: string; start: number; end: number }[] = [
  { name: "Frango", start: 1, end: 10 },
  { name: "Carne bovina", start: 11, end: 20 },
  { name: "Carne suína", start: 21, end: 30 },
  { name: "Ovos", start: 31, end: 40 },
  { name: "Leite e derivados", start: 41, end: 50 },
  { name: "Leite / bebida vegetal", start: 51, end: 60 },
  { name: "Verduras e legumes", start: 61, end: 70 },
  { name: "Frutas", start: 71, end: 80 },
  { name: "Feijão", start: 81, end: 90 },
  { name: "Arroz", start: 91, end: 100 },
  { name: "Sucos", start: 101, end: 110 },
  { name: "Folhosos", start: 111, end: 120 },
  { name: "Nuggets", start: 121, end: 130 },
  { name: "Sopas", start: 131, end: 140 },
  { name: "Macarrão", start: 141, end: 150 },
  { name: "Pastel", start: 151, end: 160 },
  { name: "Tubérculos e raízes", start: 161, end: 170 },
  { name: "Pães e cereais", start: 171, end: 180 },
  { name: "Biscoitos e snacks", start: 181, end: 190 },
  { name: "Doces e sobremesas", start: 191, end: 200 },
  { name: "Misturas e pratos", start: 201, end: 210 },
];

function pad(n: number) {
  return String(n).padStart(3, "0");
}

export const ENCADEAMENTO_CARDS: EncadeamentoCard[] = GROUPS.flatMap((g) => {
  const cards: EncadeamentoCard[] = [];
  for (let i = g.start; i <= g.end; i++) {
    const id = `EA${pad(i)}`;
    cards.push({
      id,
      group: g.name,
      title: `${g.name} · opção ${i - g.start + 1}`,
      svg: `/encadeamentos/${id}.svg`,
    });
  }
  return cards;
});

export function findEncadeamentoCards(query: string, limit = 4): EncadeamentoCard[] {
  const q = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const scored = ENCADEAMENTO_CARDS.map((c) => {
    const hay = `${c.group} ${c.title} ${c.id}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    let score = 0;
    for (const token of q.split(/\W+/).filter((t) => t.length > 3)) {
      if (hay.includes(token)) score += 2;
    }
    // keywords
    const map: Record<string, string[]> = {
      pastel: ["pastel"],
      frango: ["frango", "nugget"],
      carne: ["carne", "bovina", "suina"],
      ovo: ["ovos"],
      leite: ["leite"],
      verdura: ["verduras"],
      fruta: ["frutas"],
      feijao: ["feijao"],
      arroz: ["arroz"],
      suco: ["sucos"],
      sopa: ["sopas"],
      macarrao: ["macarrao"],
      batata: ["tuberculos"],
      pao: ["paes"],
      biscoito: ["biscoitos"],
    };
    for (const [k, groups] of Object.entries(map)) {
      if (q.includes(k) && groups.some((g) => hay.includes(g))) score += 3;
    }
    return { c, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  if (scored.length) return scored.slice(0, limit).map((x) => x.c);
  // fallback pastel / first of popular groups
  if (/pastel/.test(q)) return ENCADEAMENTO_CARDS.filter((c) => c.group === "Pastel").slice(0, limit);
  return ENCADEAMENTO_CARDS.slice(0, limit);
}
