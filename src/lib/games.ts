/** Food groups and interactive games for EloAlimentar kids. */

export type FoodGroupId =
  | "carnes"
  | "verduras"
  | "frutas"
  | "sucos"
  | "arroz"
  | "feijao";

export type FoodItem = {
  id: string;
  name: string;
  emoji: string;
  group: FoodGroupId;
};

export const FOOD_GROUPS: { id: FoodGroupId; label: string; emoji: string; color: string }[] = [
  { id: "carnes", label: "Carnes", emoji: "🥩", color: "#e85d4c" },
  { id: "verduras", label: "Verduras", emoji: "🥬", color: "#65b21e" },
  { id: "frutas", label: "Frutas", emoji: "🍎", color: "#e8a317" },
  { id: "sucos", label: "Sucos", emoji: "🧃", color: "#e31794" },
  { id: "arroz", label: "Arroz", emoji: "🍚", color: "#f5f0e6" },
  { id: "feijao", label: "Feijão", emoji: "🫘", color: "#8b5a2b" },
];

export const FOODS: FoodItem[] = [
  { id: "frango", name: "Frango", emoji: "🍗", group: "carnes" },
  { id: "carne", name: "Carne", emoji: "🥩", group: "carnes" },
  { id: "peixe", name: "Peixe", emoji: "🐟", group: "carnes" },
  { id: "ovo", name: "Ovo", emoji: "🥚", group: "carnes" },
  { id: "alface", name: "Alface", emoji: "🥬", group: "verduras" },
  { id: "cenoura", name: "Cenoura", emoji: "🥕", group: "verduras" },
  { id: "brocolis", name: "Brócolis", emoji: "🥦", group: "verduras" },
  { id: "tomate", name: "Tomate", emoji: "🍅", group: "verduras" },
  { id: "banana", name: "Banana", emoji: "🍌", group: "frutas" },
  { id: "maca", name: "Maçã", emoji: "🍎", group: "frutas" },
  { id: "morango", name: "Morango", emoji: "🍓", group: "frutas" },
  { id: "laranja", name: "Laranja", emoji: "🍊", group: "frutas" },
  { id: "suco-laranja", name: "Suco de laranja", emoji: "🍊", group: "sucos" },
  { id: "suco-uva", name: "Suco de uva", emoji: "🍇", group: "sucos" },
  { id: "suco-manga", name: "Suco de manga", emoji: "🥭", group: "sucos" },
  { id: "agua", name: "Água saborizada", emoji: "💧", group: "sucos" },
  { id: "arroz-branco", name: "Arroz", emoji: "🍚", group: "arroz" },
  { id: "arroz-integral", name: "Arroz integral", emoji: "🍚", group: "arroz" },
  { id: "risoto", name: "Risoto", emoji: "🍛", group: "arroz" },
  { id: "feijao-carioca", name: "Feijão", emoji: "🫘", group: "feijao" },
  { id: "feijao-preto", name: "Feijão preto", emoji: "🌑", group: "feijao" },
  { id: "feijoada", name: "Feijoada", emoji: "🍲", group: "feijao" },
];

export type ChildAvatar = {
  skin: string;
  hair: string;
  hairColor: string;
  eyes: string;
  outfit: string;
  accessory: string;
};

export const AVATAR_OPTIONS = {
  skin: [
    { id: "claro", label: "Clara", emoji: "🏻" },
    { id: "medio", label: "Média", emoji: "🏼" },
    { id: "moreno", label: "Morena", emoji: "🏽" },
    { id: "escuro", label: "Escura", emoji: "🏾" },
  ],
  hair: [
    { id: "curto", label: "Curto", emoji: "💇" },
    { id: "medio", label: "Médio", emoji: "💇‍♀️" },
    { id: "longo", label: "Longo", emoji: "👩" },
    { id: "cacheado", label: "Cacheado", emoji: "👨‍🦱" },
    { id: "rasta", label: "Tranças", emoji: "👧" },
  ],
  hairColor: [
    { id: "preto", label: "Preto", color: "#1a1a1a" },
    { id: "castanho", label: "Castanho", color: "#5c3a21" },
    { id: "loiro", label: "Loiro", color: "#d4a017" },
    { id: "ruivo", label: "Ruivo", color: "#c45c26" },
  ],
  eyes: [
    { id: "castanhos", label: "Castanhos", emoji: "🟤" },
    { id: "verdes", label: "Verdes", emoji: "🟢" },
    { id: "azuis", label: "Azuis", emoji: "🔵" },
    { id: "pretos", label: "Pretos", emoji: "⚫" },
  ],
  outfit: [
    { id: "camiseta", label: "Camiseta", emoji: "👕" },
    { id: "vestido", label: "Vestido", emoji: "👗" },
    { id: "uniforme", label: "Uniforme", emoji: "🥋" },
    { id: "pijama", label: "Pijama", emoji: "🩳" },
  ],
  accessory: [
    { id: "nenhum", label: "Nenhum", emoji: "✨" },
    { id: "oculos", label: "Óculos", emoji: "👓" },
    { id: "bone", label: "Boné", emoji: "🧢" },
    { id: "laco", label: "Laço", emoji: "🎀" },
  ],
} as const;

export const DEFAULT_AVATAR: ChildAvatar = {
  skin: "medio",
  hair: "curto",
  hairColor: "castanho",
  eyes: "castanhos",
  outfit: "camiseta",
  accessory: "nenhum",
};

export function parseAvatar(raw: string | null | undefined): ChildAvatar {
  try {
    const data = JSON.parse(raw || "{}");
    return { ...DEFAULT_AVATAR, ...data };
  } catch {
    return { ...DEFAULT_AVATAR };
  }
}

export function avatarEmoji(avatar: ChildAvatar): string {
  const skinMap: Record<string, string> = {
    claro: "🙂",
    medio: "😊",
    moreno: "😄",
    escuro: "😁",
  };
  const acc = AVATAR_OPTIONS.accessory.find((a) => a.id === avatar.accessory);
  if (avatar.accessory !== "nenhum" && acc) return acc.emoji;
  return skinMap[avatar.skin] || "😊";
}

export type GameDef = {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  groups: FoodGroupId[];
};

export const GAMES: GameDef[] = [
  {
    slug: "dado-sensorial",
    title: "Dado Sensorial",
    description: "Role o dado: lamber, cheirar, tocar, provar ou morder um alimento da partida — sem pressão.",
    emoji: "🎲",
    groups: ["carnes", "verduras", "frutas", "sucos", "arroz", "feijao"],
  },
  {
    slug: "classificar-grupos",
    title: "Classificar Grupos",
    description: "Arraste cada alimento para o grupo certo: carnes, verduras, frutas, sucos, arroz ou feijão.",
    emoji: "📦",
    groups: ["carnes", "verduras", "frutas", "sucos", "arroz", "feijao"],
  },
  {
    slug: "memoria-alimentos",
    title: "Memória dos Alimentos",
    description: "Encontre os pares de alimentos dos grupos alimentares.",
    emoji: "🃏",
    groups: ["frutas", "verduras", "carnes"],
  },
  {
    slug: "prato-colorido",
    title: "Prato Colorido",
    description: "Monte um prato com um item de cada grupo alimentar.",
    emoji: "🍽️",
    groups: ["carnes", "verduras", "frutas", "arroz", "feijao"],
  },
  {
    slug: "caca-frutas",
    title: "Caça às Frutas",
    description: "Toque só nas frutas — deixe os outros grupos quietos!",
    emoji: "🍎",
    groups: ["frutas"],
  },
  {
    slug: "feijao-pula",
    title: "Feijão Pula",
    description: "Pegue os feijões que pulam na tela com o seu boneco.",
    emoji: "🫘",
    groups: ["feijao"],
  },
  {
    slug: "suco-magico",
    title: "Suco Mágico",
    description: "Combine frutas certas para fazer o suco pedido.",
    emoji: "🧃",
    groups: ["sucos", "frutas"],
  },
  {
    slug: "arroz-feijao",
    title: "Arroz & Feijão",
    description: "Una o arroz ao feijão para completar o prato brasileiro.",
    emoji: "🇧🇷",
    groups: ["arroz", "feijao"],
  },
  {
    slug: "verdura-esconde",
    title: "Verdura Esconde",
    description: "Ache as verduras escondidas entre outros alimentos.",
    emoji: "🥬",
    groups: ["verduras"],
  },
  {
    slug: "carnes-forte",
    title: "Carnes Fortes",
    description: "Escolha os alimentos do grupo das carnes/proteínas.",
    emoji: "🥩",
    groups: ["carnes"],
  },
  {
    slug: "mercado-magico",
    title: "Mercado Mágico",
    description: "Encha a cestinha com um alimento de cada grupo.",
    emoji: "🛒",
    groups: ["carnes", "verduras", "frutas", "sucos", "arroz", "feijao"],
  },
  {
    slug: "desafio-rapido",
    title: "Desafio Rápido",
    description: "Qual grupo é este? Responda o mais rápido que puder.",
    emoji: "⚡",
    groups: ["carnes", "verduras", "frutas", "sucos", "arroz", "feijao"],
  },
  {
    slug: "merge-alimentos",
    title: "Merge Game — Fusão",
    description:
      "Junte dois iguais e evolua o alimento: semente → legume → salada → prato → estrela!",
    emoji: "🔀",
    groups: ["frutas", "verduras", "arroz", "feijao"],
  },
  {
    slug: "pizza-grupos",
    title: "Pizza dos Grupos",
    description: "Monte fatias tocando alimentos coloridos de grupos variados.",
    emoji: "🍕",
    groups: ["carnes", "verduras", "frutas", "arroz", "feijao"],
  },
  {
    slug: "sorvete-fruta",
    title: "Sorvete de Fruta",
    description: "Toque nas frutas certas para “preparar” o sorvete.",
    emoji: "🍦",
    groups: ["frutas"],
  },
  {
    slug: "sopa-quente",
    title: "Sopa Quente",
    description: "Ache verduras para a sopinha sensorial.",
    emoji: "🍲",
    groups: ["verduras", "carnes"],
  },
  {
    slug: "lancheira",
    title: "Lancheira da Escola",
    description: "Separe sucos e frutas para a lancheira.",
    emoji: "🎒",
    groups: ["frutas", "sucos", "arroz", "feijao"],
  },
  {
    slug: "arco-iris",
    title: "Arco-íris no Prato",
    description: "Toque nas frutas coloridas do arco-íris alimentar.",
    emoji: "🌈",
    groups: ["frutas", "verduras"],
  },
];

/** Níveis do Merge Game (fusão). 0 = vazio. */
export const MERGE_TIERS = [
  { level: 1, emoji: "🌱", label: "Semente" },
  { level: 2, emoji: "🥕", label: "Legume" },
  { level: 3, emoji: "🥗", label: "Salada" },
  { level: 4, emoji: "🍚", label: "Prato base" },
  { level: 5, emoji: "🍲", label: "Refeição" },
  { level: 6, emoji: "⭐", label: "Estrela!" },
] as const;

export const MERGE_SIZE = 16; // 4x4

export function parseMergeBoard(raw?: string): number[] {
  const cells = (raw || "").split("").map((c) => Number(c) || 0);
  if (cells.length === MERGE_SIZE) return cells.map((n) => Math.min(6, Math.max(0, n)));
  // board inicial: algumas sementes
  const b = Array(MERGE_SIZE).fill(0);
  b[0] = 1;
  b[2] = 1;
  b[5] = 1;
  b[10] = 2;
  return b;
}

export function encodeMergeBoard(board: number[]): string {
  return board.map((n) => String(Math.min(6, Math.max(0, n | 0)))).join("");
}

export function mergeTier(level: number) {
  return MERGE_TIERS.find((t) => t.level === level) || null;
}

export const SENSORY_DICE_FACES = [
  { id: "lamber", label: "Lamber", emoji: "👅", tip: "Só a ponta da língua — sem obrigação de engolir." },
  { id: "cheirar", label: "Cheirar", emoji: "👃", tip: "Aproxime o nariz e respire o aroma com calma." },
  { id: "tocar", label: "Tocar", emoji: "👆", tip: "Toque com o dedo ou utensílio, no ritmo da criança." },
  { id: "provar", label: "Provar", emoji: "😋", tip: "Um pedacinho minúsculo, se ela quiser." },
  { id: "morder", label: "Morder", emoji: "😬", tip: "Pode morder e cuspir — mastigar sem engolir também vale." },
  { id: "olhar", label: "Olhar", emoji: "👀", tip: "Só observar o alimento de perto já é progresso!" },
] as const;
