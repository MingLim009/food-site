/** Exemplos visuais de encadeamento — estilo material educativo Andreza Dias */

export type ChainStep = {
  label: string;
  emoji: string;
  /** tom de fundo do “quadro” da figura */
  bg: string;
};

export type VisualFoodChain = {
  id: string;
  category: string;
  categoryEmoji: string;
  /** cor da faixa da categoria */
  banner: string;
  title: string;
  description: string;
  startFood: string;
  endFood: string;
  steps: ChainStep[];
};

export const VISUAL_FOOD_CHAINS: VisualFoodChain[] = [
  {
    id: "crocante-batata",
    category: "CROCANTE",
    categoryEmoji: "🥔",
    banner: "#2872c3",
    title: "Da batata chips à batata cozida",
    description: "Mesma família (batata), mudando só o formato e o preparo — um passo por vez.",
    startFood: "Batata chips",
    endFood: "Batata cozida / purê",
    steps: [
      { label: "Batata chips industrial", emoji: "🥔", bg: "#FFF3D6" },
      { label: "Chips caseiros assados", emoji: "🫓", bg: "#FFE8B8" },
      { label: "Batata em gomos assados", emoji: "🍟", bg: "#FFD9A0" },
      { label: "Batata cozida em pedaços", emoji: "🥔", bg: "#F5E6C8" },
      { label: "Batata + vagem no prato", emoji: "🫘", bg: "#E8F5D8" },
      { label: "Purê de batata liso", emoji: "🥣", bg: "#F0E6D8" },
    ],
  },
  {
    id: "laranja-cenoura",
    category: "LARANJA",
    categoryEmoji: "🥕",
    banner: "#e8a317",
    title: "Da cenoura crua à abóbora",
    description: "Encadeamento pela cor laranja e pelo perfil doce-suave.",
    startFood: "Cenoura crua",
    endFood: "Abóbora assada",
    steps: [
      { label: "Cenoura em palitos", emoji: "🥕", bg: "#FFE8D0" },
      { label: "Cenoura ralada", emoji: "🥗", bg: "#FFDCC0" },
      { label: "Suco de cenoura", emoji: "🧃", bg: "#FFD0A8" },
      { label: "Bolo / muffin de cenoura", emoji: "🧁", bg: "#F5C890" },
      { label: "Sopa de abóbora", emoji: "🍲", bg: "#FFE0B0" },
      { label: "Abóbora assada em pedaços", emoji: "🎃", bg: "#FFCC80" },
    ],
  },
  {
    id: "proteina-nugget",
    category: "PROTEÍNA",
    categoryEmoji: "🍗",
    banner: "#e85d4c",
    title: "Do nugget à carne moída",
    description: "Da proteína empanada segura até formatos mais “reais”, sem salto brusco.",
    startFood: "Nugget industrial",
    endFood: "Carne moída",
    steps: [
      { label: "Nugget industrial", emoji: "🍗", bg: "#FFE8E0" },
      { label: "Frango empanado caseiro", emoji: "🥖", bg: "#FFD8CC" },
      { label: "Tiras de frango grelhado", emoji: "🥩", bg: "#FFC8B8" },
      { label: "Frango desfiado", emoji: "🍜", bg: "#F5D0C0" },
      { label: "Peito em molho suave", emoji: "🍛", bg: "#E8D0C0" },
      { label: "Carne moída temperada leve", emoji: "🥘", bg: "#E0C8B8" },
    ],
  },
  {
    id: "frutas-banana",
    category: "FRUTAS",
    categoryEmoji: "🍌",
    banner: "#65b21e",
    title: "Da banana à uva",
    description: "Parte da fruta segura e avança por formatos parecidos até outras frutas.",
    startFood: "Banana em rodelas",
    endFood: "Uvas",
    steps: [
      { label: "Banana em rodelas", emoji: "🍌", bg: "#FFF9C4" },
      { label: "Panqueca de banana", emoji: "🥞", bg: "#FFF59D" },
      { label: "Vitamina de banana", emoji: "🥤", bg: "#FFF176" },
      { label: "Maçã em fatias", emoji: "🍎", bg: "#FFECB3" },
      { label: "Morango inteiro / corte", emoji: "🍓", bg: "#FFCDD2" },
      { label: "Uvas sem semente", emoji: "🍇", bg: "#E1BEE7" },
    ],
  },
];

export const CHAINING_GUIDE = {
  what: {
    title: "O que é?",
    body: "Estratégia para ampliar o cardápio usando semelhanças sensoriais (cor, textura, sabor, formato) entre o alimento que a criança já aceita e o próximo passo.",
  },
  why: {
    title: "Por que funciona?",
    items: [
      "Respeita o ritmo e os limites da criança",
      "Reduz o medo do “novo”",
      "Parte do que já é preferido",
      "Diminui a tensão à mesa",
    ],
  },
  how: {
    title: "Como fazer?",
    items: [
      "Identifique um alimento seguro (preferido)",
      "Escolha um alimento novo bem parecido",
      "Ofereça porção pequena, sem pressão",
      "Respeite o tempo (olhar/cheirar/tocar já conta)",
      "Seja consistente — um passo por vez",
    ],
  },
  tips: {
    title: "Dicas importantes",
    items: [
      "Não force a provar",
      "Envolva a criança no preparo quando possível",
      "Celebre microvitórias (olhou, cheirou, tocou)",
    ],
  },
  remember: {
    title: "Lembre-se",
    items: [
      "Paciência: cada criança tem seu tempo",
      "O progresso não é linear",
      "Acompanhamento profissional faz diferença",
    ],
  },
  avoid: {
    title: "O que evitar?",
    items: [
      "Forçar a comer",
      "Usar comida como chantagem ou prêmio",
      "Telas como única estratégia à mesa",
      "Comparar com irmãos ou outras crianças",
    ],
  },
} as const;
