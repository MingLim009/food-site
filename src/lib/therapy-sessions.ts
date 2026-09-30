/**
 * 100+ ideias de sessão de terapia alimentar por grupo alimentar (área profissional Gold).
 * Cada ideia traz passos com figuras (emoji/portfolio) e o que fazer com a criança.
 */

export type SessionStep = {
  n: number;
  title: string;
  figure: string;
  doWithChild: string;
};

export type TherapySessionIdea = {
  id: string;
  group: string;
  title: string;
  durationMin: number;
  goal: string;
  materials: string[];
  steps: SessionStep[];
  tip: string;
};

const GROUPS = [
  "Arroz",
  "Feijão",
  "Sucos",
  "Verduras",
  "Ovos",
  "Carnes",
  "Frutas",
  "Tubérculos",
  "Massas",
  "Laticínios",
] as const;

const TEMPLATES: { title: string; focus: string; figures: string[] }[] = [
  { title: "Tolerar no ambiente", focus: "presença sem pressão", figures: ["👀", "🏠", "🍽️"] },
  { title: "Olhar de perto", focus: "contato visual", figures: ["👁️", "📷", "🥣"] },
  { title: "Cheirar com distância", focus: "olfato gradual", figures: ["👃", "🌬️", "🍲"] },
  { title: "Tocar com utensílio", focus: "mediação tátil", figures: ["🥄", "✋", "🍴"] },
  { title: "Tocar com dedo", focus: "toque breve", figures: ["👆", "🧼", "🙌"] },
  { title: "Encadeamento de formato", focus: "mesma família, nova forma", figures: ["⭐", "🔺", "⬜"] },
  { title: "Encadeamento de textura", focus: "crocante → menos seco", figures: ["🥨", "🍞", "🥣"] },
  { title: "Separar no prato", focus: "sem misturar", figures: ["🍱", "➡️", "🥗"] },
  { title: "Modelagem familiar", focus: "adulto come ao lado", figures: ["👨‍👩‍👧", "🍽️", "🙂"] },
  { title: "Microporção simbólica", focus: "quantidade mínima", figures: ["🔬", "🥄", "✨"] },
  { title: "Escolha limitada", focus: "2 opções", figures: ["1️⃣", "2️⃣", "✅"] },
  { title: "Jogo sensorial pré-mesa", focus: "regulação", figures: ["🎲", "🧊", "🎵"] },
];

function buildIdea(group: string, idx: number, tpl: (typeof TEMPLATES)[0]): TherapySessionIdea {
  const n = idx + 1;
  const foodHint =
    group === "Sucos"
      ? "o suco-alvo"
      : group === "Frutas"
        ? "a fruta-alvo"
        : `o ${group.toLowerCase()}-alvo`;

  return {
    id: `sessao-${group.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")}-${n}`,
    group,
    title: `${group}: ${tpl.title} (#${n})`,
    durationMin: 30 + (n % 3) * 5,
    goal: `Aumentar tolerância a ${foodHint} com foco em ${tpl.focus}, sem exigir ingestão.`,
    materials: [
      "Alimento seguro da criança",
      `${group} em porção micro / apresentação previsível`,
      "Prato compartimentado ou dois pratos",
      "Utensílio preferido",
      "Timer visual",
      "Cartão da Escada do Comer (imprimível)",
      "PECs / figuras do alimento (se usar CAA)",
    ],
    steps: [
      {
        n: 1,
        title: "Acolhida e combinados",
        figure: "🤝",
        doWithChild: `Combinar “pode parar”. Mostrar timer. Deixar o alimento seguro visível.`,
      },
      {
        n: 2,
        title: "Regulação / jogo curto",
        figure: tpl.figures[0],
        doWithChild: `1–2 min de jogo sensorial leve (dado, música baixa ou movimento) antes do alimento-alvo.`,
      },
      {
        n: 3,
        title: `Apresentar ${group}`,
        figure: tpl.figures[1],
        doWithChild: `Colocar ${foodHint} longe do centro. Explicar com figura/PEC o que vai acontecer neste degrau (${tpl.focus}).`,
      },
      {
        n: 4,
        title: "Prática do foco da sessão",
        figure: tpl.figures[2],
        doWithChild: `Conduzir só a meta de hoje (${tpl.title.toLowerCase()}). Reforçar aproximação, não engolir.`,
      },
      {
        n: 5,
        title: "Registro e encerramento",
        figure: "📝",
        doWithChild: `Registrar degrau da Escada, humor e se houve ânsia. Celebrar microprogresso. Combinar recompensa social se combinado com a família.`,
      },
    ],
    tip: `Se houver engasgo, dor ou crise, regredir um degrau. ${group}: altere só uma variável por sessão.`,
  };
}

export const THERAPY_SESSION_IDEAS: TherapySessionIdea[] = GROUPS.flatMap((group) =>
  TEMPLATES.map((tpl, idx) => buildIdea(group, idx, tpl))
);

/** Garante ≥100 ideias */
export function sessionIdeasByGroup(group?: string) {
  if (!group || group === "todos") return THERAPY_SESSION_IDEAS;
  return THERAPY_SESSION_IDEAS.filter(
    (s) => s.group.toLowerCase() === group.toLowerCase()
  );
}

export const SESSION_GROUPS = ["todos", ...GROUPS] as const;

export const ANAMNESE_SELETIVIDADE = `
FICHA DE ANAMNESE ALIMENTAR — SELETIVIDADE (imprimir)
EloAlimentar · Andreza Dias CRN 10418 · uso profissional

Dados: nome / idade / responsável / data
Diagnósticos / hipóteses (se houver): ________________
Peso / altura / curva: ________________
Alimentos aceitos (marcas): ________________
Alimentos recusados: ________________
Texturas / cores / formatos / temperaturas toleradas: ________________
Ânsia / vômito / engasgo / tosse: ________________
Intestino / dor abdominal / refluxo: ________________
Medicações e horário (efeito no apetite): ________________
Sono / escola / terapias: ________________
Objetivo da família nesta fase: ________________
Sinais de alerta encaminhados? ( ) sim ( ) não
Plano inicial (Escada / encadeamento / equipe): ________________
`.trim();

export const REWARD_CARDS = [
  "Adesivo da vitória",
  "Escolher a música",
  "5 min de brincadeira preferida",
  "Ajudar a montar a mesa",
  "Foto na Escada do Comer",
  "Escolher o prato/colorido",
  "Selo “eu olhei”",
  "Selo “eu cheirei”",
  "Selo “eu toquei”",
  "Diploma do degrau",
];

export const SESSION_UTENSILS = [
  "Colheres de tamanhos diferentes",
  "Garfo infantil",
  "Prato compartimentado",
  "Copo / canudo preferido",
  "Timer visual",
  "Cartões PECs alimentares",
  "Escada do Comer impressa (plastificar)",
  "Avental / toalha de apoio",
  "Bandeja sensorial (seco)",
  "Espelho pequeno (se fono indicar)",
];
