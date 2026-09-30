export type GameDef = {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  groups: string[];
};

/** Mínimo 10 jogos interativos com grupos alimentares */
export const GAMES: GameDef[] = [
  {
    slug: "classificar",
    title: "Classifique os alimentos",
    description: "Toque no grupo certo: carnes, verduras, frutas, sucos, arroz ou feijão.",
    emoji: "🗂️",
    groups: ["carnes", "verduras", "frutas", "sucos", "arroz", "feijao"],
  },
  {
    slug: "prato-colorido",
    title: "Monte o prato",
    description: "Coloque no prato um alimento de cada grupo alimentar.",
    emoji: "🍽️",
    groups: ["carnes", "verduras", "frutas", "arroz", "feijao"],
  },
  {
    slug: "memoria",
    title: "Memória dos alimentos",
    description: "Encontre os pares de frutas, verduras e outros alimentos.",
    emoji: "🧠",
    groups: ["frutas", "verduras", "carnes", "arroz"],
  },
  {
    slug: "quiz-rapido",
    title: "Quiz do grupo",
    description: "Qual é o grupo deste alimento? Responda bem rápido!",
    emoji: "❓",
    groups: ["carnes", "verduras", "frutas", "sucos", "arroz", "feijao"],
  },
  {
    slug: "corrida-frutas",
    title: "Corrida das frutas",
    description: "Toque só nas frutas — deixe os outros alimentos passarem.",
    emoji: "🍎",
    groups: ["frutas"],
  },
  {
    slug: "horta-magica",
    title: "Horta mágica",
    description: "Colha as verduras certas na horta colorida.",
    emoji: "🥬",
    groups: ["verduras"],
  },
  {
    slug: "feira",
    title: "Feira da criança",
    description: "Compre da lista: carnes, frutas, verduras, arroz e feijão.",
    emoji: "🛒",
    groups: ["carnes", "verduras", "frutas", "arroz", "feijao"],
  },
  {
    slug: "suco-magico",
    title: "Suco mágico",
    description: "Escolha frutas para preparar um suco delicioso.",
    emoji: "🧃",
    groups: ["frutas", "sucos"],
  },
  {
    slug: "arroz-feijao",
    title: "Arroz e feijão",
    description: "Una o arroz com o feijão — o duo clássico do prato brasileiro!",
    emoji: "🇧🇷",
    groups: ["arroz", "feijao"],
  },
  {
    slug: "chef-das-carnes",
    title: "Chef das carnes",
    description: "Separe as carnes e proteínas das outras comidinhas.",
    emoji: "👨‍🍳",
    groups: ["carnes"],
  },
];

export function getGame(slug: string) {
  return GAMES.find((g) => g.slug === slug);
}
