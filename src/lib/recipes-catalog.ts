/** Catálogo ampliado: ≥20 ideias por categoria pedida pela cliente + vídeos em desenho. */

export type CartoonScene = {
  title: string;
  emoji: string;
  narration: string;
  bg: string;
};

export type RecipeCategory =
  | "sem_gluten_leite"
  | "bolos"
  | "sopas"
  | "muffins"
  | "bolacha_recheada"
  | "arroz"
  | "feijao"
  | "verduras"
  | "biscoitos";

export const RECIPE_CATEGORY_LABELS: Record<RecipeCategory, string> = {
  sem_gluten_leite: "Sem glúten e sem leite",
  bolos: "Bolos",
  sopas: "Sopas",
  muffins: "Muffins",
  bolacha_recheada: "Bolacha recheada",
  arroz: "Arroz",
  feijao: "Feijão",
  verduras: "Verduras",
  biscoitos: "Biscoitos",
};

export type RecipeDef = {
  title: string;
  description: string;
  emoji: string;
  categories: RecipeCategory[];
  foodGroups: string[];
  textures: string[];
  steps: string[];
  tips: string;
  glutenFree: boolean;
  dairyFree: boolean;
  minPlan: "PREMIUM" | "GOLD";
  scenes?: CartoonScene[];
};

const BGS = ["#FFF6E0", "#FFE8D0", "#E8F3FF", "#E8F8E0", "#FFE8F2", "#F0F7FF", "#FFF3D6", "#F5F0FF"];

type Idea = {
  title: string;
  emoji: string;
  texture: string[];
  foodGroups: string[];
  tip: string;
  glutenFree?: boolean;
  dairyFree?: boolean;
  gold?: boolean;
};

function scenesFor(r: RecipeDef): CartoonScene[] {
  if (r.scenes?.length) return r.scenes;
  const bg = (i: number) => BGS[i % BGS.length];
  const tex = r.textures.slice(0, 2).join(" e ") || "previsível";
  const free =
    r.glutenFree && r.dairyFree
      ? " Esta versão é sem glúten e sem leite."
      : r.glutenFree
        ? " Esta versão é sem glúten."
        : r.dairyFree
          ? " Esta versão é sem leite."
          : "";
  return [
    {
      title: "Abertura",
      emoji: "👩‍🍳",
      bg: bg(0),
      narration: `Oi! Vamos fazer ${r.title} em desenho, sem pressa e sem pressão.${free}`,
    },
    {
      title: "Olhar",
      emoji: r.emoji,
      bg: bg(1),
      narration: `A criança pode só olhar. Textura ${tex} — previsibilidade ajuda o sistema sensorial.`,
    },
    {
      title: "Preparar",
      emoji: "🥣",
      bg: bg(2),
      narration: r.steps[0] || "Um adulto prepara com calma.",
    },
    {
      title: "Passo a passo",
      emoji: "✨",
      bg: bg(3),
      narration: r.steps[1] || "Formato e porção previsíveis.",
    },
    {
      title: "Oferecer",
      emoji: "👀",
      bg: bg(4),
      narration:
        "Perto de um alimento seguro. Olhar, cheirar ou tocar já conta na Escada do Comer.",
    },
    {
      title: "Fim feliz",
      emoji: "💛",
      bg: bg(5),
      narration: `${r.tips} Até o próximo desenho!`,
    },
  ];
}

function build(
  category: RecipeCategory,
  ideas: Idea[],
  defaultSteps: (idea: Idea) => string[],
  descriptionPrefix: string
): RecipeDef[] {
  return ideas.map((idea) => {
    const glutenFree = idea.glutenFree ?? category === "sem_gluten_leite";
    const dairyFree = idea.dairyFree ?? category === "sem_gluten_leite";
    const cats: RecipeCategory[] = [category];
    if (glutenFree && dairyFree && category !== "sem_gluten_leite") {
      cats.push("sem_gluten_leite");
    }
    return {
      title: idea.title,
      description: `${descriptionPrefix} ${idea.tip}`,
      emoji: idea.emoji,
      categories: cats,
      foodGroups: idea.foodGroups,
      textures: idea.texture,
      steps: defaultSteps(idea),
      tips: idea.tip,
      glutenFree,
      dairyFree,
      minPlan: idea.gold ? "GOLD" : "PREMIUM",
    };
  });
}

const SEM_GLUTEN_LEITE: Idea[] = [
  { title: "Bolo de banana com farinha de arroz", emoji: "🍌", texture: ["macio", "úmido"], foodGroups: ["frutas", "cereais sem glúten"], tip: "Doce previsível sem trigo nem leite." },
  { title: "Muffin de maçã e canela (farinha de arroz)", emoji: "🧁", texture: ["macio", "úmido"], foodGroups: ["frutas", "cereais sem glúten"], tip: "Formato muffin igual todo dia." },
  { title: "Cookies de polvilho e óleo", emoji: "🍪", texture: ["crocante", "seco"], foodGroups: ["cereais sem glúten"], tip: "Crocante leve sem leite." },
  { title: "Panqueca de tapioca recheio doce", emoji: "🥞", texture: ["macio", "úmido"], foodGroups: ["cereais sem glúten"], tip: "Tapioca pura; recheio sem leite." },
  { title: "Pão de queijo sem queijo (polvilho + azeite)", emoji: "⭕", texture: ["macio", "seco"], foodGroups: ["cereais sem glúten"], tip: "Versão sem laticínios." },
  { title: "Smoothie de morango com leite de aveia", emoji: "🍓", texture: ["líquido", "liso"], foodGroups: ["frutas", "leites vegetais"], tip: "Liso, sem leite animal." },
  { title: "Arroz doce com leite de coco", emoji: "🍚", texture: ["cremoso", "macio"], foodGroups: ["cereais", "gorduras"], tip: "Cremoso vegetal." },
  { title: "Sopa de abóbora batida (caldo vegetal)", emoji: "🎃", texture: ["liso", "líquido"], foodGroups: ["legumes"], tip: "Sem creme de leite." },
  { title: "Nuggets de frango com farinha de milho", emoji: "🍗", texture: ["crocante", "seco"], foodGroups: ["carnes", "cereais sem glúten"], tip: "Empanado sem trigo.", gold: true },
  { title: "Brownie de cacau com farinha de amêndoas", emoji: "🍫", texture: ["macio", "úmido"], foodGroups: ["oleaginosas"], tip: "Sem glúten; sem leite se usar cacau puro.", gold: true },
  { title: "Bolacha água e sal de arroz", emoji: "🧂", texture: ["crocante", "seco"], foodGroups: ["cereais sem glúten"], tip: "Sal leve e formato igual." },
  { title: "Purê de batata com azeite", emoji: "🥔", texture: ["liso", "pastoso"], foodGroups: ["tubérculos"], tip: "Sem manteiga nem leite." },
  { title: "Waffle de farinha de arroz", emoji: "🧇", texture: ["crocante", "macio"], foodGroups: ["cereais sem glúten"], tip: "Grade previsível." },
  { title: "Gelatina de fruta sem leite", emoji: "🟥", texture: ["gelatinoso", "frio"], foodGroups: ["frutas"], tip: "Cubos iguais; cor única." },
  { title: "Pizza base de polvilho (sem queijo)", emoji: "🍕", texture: ["macio", "seco"], foodGroups: ["cereais sem glúten"], tip: "Base seca; coberturas mínimas.", gold: true },
  { title: "Brigadeiro de batata-doce e cacau", emoji: "🟤", texture: ["macio", "pastoso"], foodGroups: ["tubérculos"], tip: "Doce sensorial sem leite condensado." },
  { title: "Chips de batata-doce assados", emoji: "🍠", texture: ["crocante", "seco"], foodGroups: ["tubérculos"], tip: "Finos e secos." },
  { title: "Mingau de milho com leite vegetal", emoji: "🌽", texture: ["cremoso", "liso"], foodGroups: ["cereais sem glúten"], tip: "Consistência fixa." },
  { title: "Crepioca doce com banana", emoji: "🍌", texture: ["macio", "úmido"], foodGroups: ["ovos ou substituto", "cereais sem glúten"], tip: "Ovo + tapioca; sem leite." },
  { title: "Sopa de legumes peneirada", emoji: "🥕", texture: ["liso", "líquido"], foodGroups: ["legumes"], tip: "Zero pedaços; caldo vegetal." },
];

const BOLOS: Idea[] = [
  { title: "Bolo de cenoura simples", emoji: "🥕", texture: ["macio", "úmido"], foodGroups: ["legumes", "cereais"], tip: "Fatias iguais; cobertura depois." },
  { title: "Bolo de chocolate neutro", emoji: "🍫", texture: ["macio", "úmido"], foodGroups: ["cereais"], tip: "Sabor estável, sem recheio." },
  { title: "Bolo de fubá", emoji: "🌽", texture: ["macio", "seco"], foodGroups: ["cereais"], tip: "Miolo mais seco." },
  { title: "Bolo de limão sem cobertura", emoji: "🍋", texture: ["macio", "úmido"], foodGroups: ["cereais", "frutas"], tip: "Acidez leve." },
  { title: "Bolo de maçã em fatias", emoji: "🍎", texture: ["macio", "úmido"], foodGroups: ["frutas", "cereais"], tip: "Pedaços de maçã bem finos." },
  { title: "Bolo de banana sem glúten", emoji: "🍌", texture: ["macio", "úmido"], foodGroups: ["frutas", "cereais sem glúten"], tip: "Farinha de arroz.", glutenFree: true, dairyFree: true },
  { title: "Bolo de iogurte liso", emoji: "🥛", texture: ["macio", "úmido"], foodGroups: ["laticínios", "cereais"], tip: "Miolo úmido homogêneo." },
  { title: "Bolo de laranja", emoji: "🍊", texture: ["macio", "úmido"], foodGroups: ["frutas", "cereais"], tip: "Cor alaranjada previsível." },
  { title: "Bolo de coco ralado fino", emoji: "🥥", texture: ["macio", "granuloso suave"], foodGroups: ["cereais", "gorduras"], tip: "Ralo bem fino." },
  { title: "Bolo de abacaxi sem calda", emoji: "🍍", texture: ["macio", "úmido"], foodGroups: ["frutas", "cereais"], tip: "Sem calda escorrendo." },
  { title: "Bolo de beterraba (cor rosa)", emoji: "🩷", texture: ["macio", "úmido"], foodGroups: ["legumes", "cereais"], tip: "Cor única; sem pedaços.", gold: true },
  { title: "Bolo de aveia e banana", emoji: "🥣", texture: ["macio", "úmido"], foodGroups: ["cereais", "frutas"], tip: "Aveia bem processada." },
  { title: "Bolo de milho cremoso", emoji: "🌽", texture: ["macio", "úmido"], foodGroups: ["cereais"], tip: "Textura uniforme." },
  { title: "Bolo formigueiro", emoji: "🐜", texture: ["macio", "granuloso suave"], foodGroups: ["cereais"], tip: "Grânulos pequenos e iguais." },
  { title: "Bolo de mandioca", emoji: "🌿", texture: ["macio", "úmido"], foodGroups: ["tubérculos"], tip: "Naturalmente sem glúten.", glutenFree: true },
  { title: "Bolo de café suave", emoji: "☕", texture: ["macio", "úmido"], foodGroups: ["cereais"], tip: "Aroma leve; fatia fina.", gold: true },
  { title: "Bolo de amendoim cremoso", emoji: "🥜", texture: ["macio", "úmido"], foodGroups: ["oleaginosas", "cereais"], tip: "Pasta lisa, sem pedaços." },
  { title: "Bolo de cenoura sem leite", emoji: "🥕", texture: ["macio", "úmido"], foodGroups: ["legumes", "cereais"], tip: "Óleo no lugar da manteiga.", dairyFree: true },
  { title: "Bolo de chocolate sem glúten", emoji: "🍫", texture: ["macio", "úmido"], foodGroups: ["cereais sem glúten"], tip: "Farinha de arroz + cacau.", glutenFree: true, dairyFree: true },
  { title: "Bolo de coco sem lactose", emoji: "🥥", texture: ["macio", "úmido"], foodGroups: ["cereais", "gorduras"], tip: "Leite de coco.", dairyFree: true },
];

const SOPAS: Idea[] = [
  { title: "Sopa de batata lisa", emoji: "🥔", texture: ["liso", "líquido"], foodGroups: ["tubérculos"], tip: "Zero grumos." },
  { title: "Sopa de abóbora", emoji: "🎃", texture: ["liso", "líquido"], foodGroups: ["legumes"], tip: "Cor alaranjada estável." },
  { title: "Sopa de cenoura", emoji: "🥕", texture: ["liso", "líquido"], foodGroups: ["legumes"], tip: "Peneire se precisar." },
  { title: "Sopa de legumes mista batida", emoji: "🥣", texture: ["liso", "líquido"], foodGroups: ["legumes"], tip: "Sem pedaços visíveis." },
  { title: "Canja de frango bem clara", emoji: "🍗", texture: ["líquido", "macio"], foodGroups: ["carnes", "cereais"], tip: "Arroz bem cozido e solto.", gold: true },
  { title: "Sopa de feijão batido", emoji: "🫘", texture: ["cremoso", "liso"], foodGroups: ["leguminosas"], tip: "Caldo cremoso sem cascas." },
  { title: "Sopa de tomate peneirada", emoji: "🍅", texture: ["liso", "líquido"], foodGroups: ["legumes"], tip: "Sem sementes." },
  { title: "Sopa de milho cremosa", emoji: "🌽", texture: ["cremoso", "liso"], foodGroups: ["cereais"], tip: "Bata bem." },
  { title: "Sopa de ervilha lisa", emoji: "🟢", texture: ["liso", "líquido"], foodGroups: ["leguminosas"], tip: "Cor verde uniforme." },
  { title: "Caldo verde suave", emoji: "🥬", texture: ["líquido", "macio"], foodGroups: ["folhas", "tubérculos"], tip: "Couve bem fininha." },
  { title: "Sopa de inhame", emoji: "🤍", texture: ["liso", "cremoso"], foodGroups: ["tubérculos"], tip: "Naturalmente aveludada.", glutenFree: true, dairyFree: true },
  { title: "Sopa de quinoa e legumes", emoji: "🌾", texture: ["líquido", "macio"], foodGroups: ["cereais sem glúten", "legumes"], tip: "Grãos pequenos iguais.", glutenFree: true, dairyFree: true, gold: true },
  { title: "Sopa de peixe clara", emoji: "🐟", texture: ["líquido", "macio"], foodGroups: ["peixes"], tip: "Sem espinhas; caldo claro.", gold: true },
  { title: "Sopa de lentilha batida", emoji: "🟤", texture: ["cremoso", "liso"], foodGroups: ["leguminosas"], tip: "Sem cascas." },
  { title: "Consommé de legumes", emoji: "🍵", texture: ["líquido", "liso"], foodGroups: ["legumes"], tip: "Transparente e leve." },
  { title: "Sopa de batata-doce", emoji: "🍠", texture: ["liso", "líquido"], foodGroups: ["tubérculos"], tip: "Doçura suave." },
  { title: "Sopa de cebola bem cozida", emoji: "🧅", texture: ["líquido", "macio"], foodGroups: ["legumes"], tip: "Cebola bem macia; aroma controlado." },
  { title: "Sopa de arroz e frango", emoji: "🍚", texture: ["líquido", "macio"], foodGroups: ["cereais", "carnes"], tip: "Arroz bem mole." },
  { title: "Sopa creme de couve-flor", emoji: "☁️", texture: ["liso", "cremoso"], foodGroups: ["legumes"], tip: "Branco uniforme.", dairyFree: true },
  { title: "Sopa de mandioquinha", emoji: "🟡", texture: ["liso", "cremoso"], foodGroups: ["tubérculos"], tip: "Sem leite — azeite.", dairyFree: true, glutenFree: true },
];

const MUFFINS: Idea[] = [
  { title: "Muffin de blueberry (mirtilo)", emoji: "🫐", texture: ["macio", "úmido"], foodGroups: ["frutas", "cereais"], tip: "Frutas bem distribuídas." },
  { title: "Muffin de banana", emoji: "🍌", texture: ["macio", "úmido"], foodGroups: ["frutas", "cereais"], tip: "Sem pedaços grandes." },
  { title: "Muffin de cenoura", emoji: "🥕", texture: ["macio", "úmido"], foodGroups: ["legumes", "cereais"], tip: "Ralo fino." },
  { title: "Muffin de chocolate chips mínimos", emoji: "🍫", texture: ["macio", "úmido"], foodGroups: ["cereais"], tip: "Chips bem pequenos.", gold: true },
  { title: "Muffin de maçã e canela", emoji: "🍎", texture: ["macio", "úmido"], foodGroups: ["frutas", "cereais"], tip: "Canela suave." },
  { title: "Muffin de limão", emoji: "🍋", texture: ["macio", "úmido"], foodGroups: ["cereais", "frutas"], tip: "Sem glacê no início." },
  { title: "Muffin de aveia", emoji: "🥣", texture: ["macio", "úmido"], foodGroups: ["cereais"], tip: "Aveia processada." },
  { title: "Muffin de abobrinha", emoji: "🥒", texture: ["macio", "úmido"], foodGroups: ["legumes", "cereais"], tip: "Esprema água da abobrinha." },
  { title: "Muffin de milho", emoji: "🌽", texture: ["macio", "úmido"], foodGroups: ["cereais"], tip: "Fubá fino." },
  { title: "Muffin de coco", emoji: "🥥", texture: ["macio", "granuloso suave"], foodGroups: ["cereais"], tip: "Coco ralado fino." },
  { title: "Muffin de laranja", emoji: "🍊", texture: ["macio", "úmido"], foodGroups: ["frutas", "cereais"], tip: "Cor clara." },
  { title: "Muffin de cacau sem glúten", emoji: "🧁", texture: ["macio", "úmido"], foodGroups: ["cereais sem glúten"], tip: "Farinha de arroz.", glutenFree: true, dairyFree: true },
  { title: "Muffin de batata-doce", emoji: "🍠", texture: ["macio", "úmido"], foodGroups: ["tubérculos", "cereais"], tip: "Doçura natural." },
  { title: "Muffin de pera", emoji: "🍐", texture: ["macio", "úmido"], foodGroups: ["frutas", "cereais"], tip: "Pedaços mínimos." },
  { title: "Muffin de amêndoas", emoji: "🌰", texture: ["macio", "úmido"], foodGroups: ["oleaginosas"], tip: "Farinha de amêndoas.", glutenFree: true, gold: true },
  { title: "Muffin salgado de queijo suave", emoji: "🧀", texture: ["macio", "úmido"], foodGroups: ["laticínios", "cereais"], tip: "Queijo pouco aromático." },
  { title: "Muffin de espinafre e ovo", emoji: "🥬", texture: ["macio", "úmido"], foodGroups: ["folhas", "ovos"], tip: "Espinafre bem picado.", gold: true },
  { title: "Muffin de maçã sem leite", emoji: "🍏", texture: ["macio", "úmido"], foodGroups: ["frutas", "cereais"], tip: "Óleo vegetal.", dairyFree: true },
  { title: "Muffin de banana sem glúten", emoji: "🍌", texture: ["macio", "úmido"], foodGroups: ["frutas", "cereais sem glúten"], tip: "Sem trigo nem leite.", glutenFree: true, dairyFree: true },
  { title: "Muffin de cenoura sem glúten", emoji: "🥕", texture: ["macio", "úmido"], foodGroups: ["legumes", "cereais sem glúten"], tip: "Farinha de arroz.", glutenFree: true, dairyFree: true },
];

const BOLACHA_RECHEADA: Idea[] = [
  { title: "Bolacha recheada chocolate suave", emoji: "🍪", texture: ["crocante", "cremoso"], foodGroups: ["cereais"], tip: "Recheio fino e uniforme." },
  { title: "Bolacha recheada baunilha", emoji: "🤍", texture: ["crocante", "cremoso"], foodGroups: ["cereais"], tip: "Cor clara previsível." },
  { title: "Bolacha recheada morango", emoji: "🍓", texture: ["crocante", "cremoso"], foodGroups: ["cereais", "frutas"], tip: "Cor rosa leve." },
  { title: "Bolacha recheada doce de leite fino", emoji: "🟤", texture: ["crocante", "cremoso"], foodGroups: ["cereais", "laticínios"], tip: "Camada bem fina." },
  { title: "Bolacha recheada limão", emoji: "🍋", texture: ["crocante", "cremoso"], foodGroups: ["cereais"], tip: "Acidez suave." },
  { title: "Bolacha recheada coco", emoji: "🥥", texture: ["crocante", "cremoso"], foodGroups: ["cereais"], tip: "Recheio liso." },
  { title: "Bolacha recheada amendoim", emoji: "🥜", texture: ["crocante", "cremoso"], foodGroups: ["cereais", "oleaginosas"], tip: "Pasta sem grãos." },
  { title: "Sanduíche de biscoito maria + geléia", emoji: "🥪", texture: ["crocante", "úmido"], foodGroups: ["cereais", "frutas"], tip: "Geléia fina, sem pedaços." },
  { title: "Bolacha recheada cacau sem leite", emoji: "🍫", texture: ["crocante", "cremoso"], foodGroups: ["cereais"], tip: "Creme vegetal.", dairyFree: true },
  { title: "Bolacha recheada banana amassada", emoji: "🍌", texture: ["crocante", "macio"], foodGroups: ["cereais", "frutas"], tip: "Recheio caseiro liso.", dairyFree: true },
  { title: "Bolacha recheada creme de avelã fino", emoji: "🌰", texture: ["crocante", "cremoso"], foodGroups: ["cereais", "oleaginosas"], tip: "Camada mínima.", gold: true },
  { title: "Bolacha água e sal + pasta de fruta", emoji: "🍎", texture: ["crocante", "macio"], foodGroups: ["cereais", "frutas"], tip: "Sal + doce controlado." },
  { title: "Bolacha recheada iogurte seco", emoji: "🥛", texture: ["crocante", "cremoso"], foodGroups: ["cereais", "laticínios"], tip: "Recheio pouco úmido." },
  { title: "Mini sanduíche de cream cracker", emoji: "🟧", texture: ["crocante", "seco"], foodGroups: ["cereais"], tip: "Recheio quase seco." },
  { title: "Bolacha recheada geléia de uva peneirada", emoji: "🍇", texture: ["crocante", "úmido"], foodGroups: ["cereais", "frutas"], tip: "Sem bagaço." },
  { title: "Bolacha recheada sem glúten cacau", emoji: "🍪", texture: ["crocante", "cremoso"], foodGroups: ["cereais sem glúten"], tip: "Base de arroz.", glutenFree: true, dairyFree: true },
  { title: "Bolacha recheada goiabada lisa", emoji: "🟥", texture: ["crocante", "macio"], foodGroups: ["cereais", "frutas"], tip: "Goiabada sem pedaços." },
  { title: "Bolacha recheada pasta de abacate cacau", emoji: "🥑", texture: ["crocante", "cremoso"], foodGroups: ["frutas", "cereais"], tip: "Verde-marrom suave.", dairyFree: true, gold: true },
  { title: "Bolacha recheada ricota doce", emoji: "⚪", texture: ["crocante", "cremoso"], foodGroups: ["cereais", "laticínios"], tip: "Ricota bem lisa." },
  { title: "Bolacha recheada geleia de maçã", emoji: "🍏", texture: ["crocante", "úmido"], foodGroups: ["cereais", "frutas"], tip: "Doçura leve." },
];

const ARROZ: Idea[] = [
  { title: "Arroz branco soltinho", emoji: "🍚", texture: ["seco", "macio"], foodGroups: ["cereais"], tip: "Grãos separados." },
  { title: "Arroz integral bem cozido", emoji: "🌾", texture: ["macio", "seco"], foodGroups: ["cereais"], tip: "Mais tempo de cocção." },
  { title: "Arroz com brócolis picado fino", emoji: "🥦", texture: ["macio", "seco"], foodGroups: ["cereais", "folhas"], tip: "Verde mínimo no início." },
  { title: "Arroz de forno cremoso", emoji: "🍲", texture: ["cremoso", "macio"], foodGroups: ["cereais"], tip: "Textura uniforme.", gold: true },
  { title: "Arroz com cenoura ralada", emoji: "🥕", texture: ["macio", "seco"], foodGroups: ["cereais", "legumes"], tip: "Cor alaranjada leve." },
  { title: "Arroz doce clássico", emoji: "🍮", texture: ["cremoso", "macio"], foodGroups: ["cereais", "laticínios"], tip: "Canela por cima opcional." },
  { title: "Arroz com frango desfiado fino", emoji: "🍗", texture: ["macio", "seco"], foodGroups: ["cereais", "carnes"], tip: "Fios bem finos." },
  { title: "Arroz com milho", emoji: "🌽", texture: ["macio", "seco"], foodGroups: ["cereais"], tip: "Grãos de milho iguais." },
  { title: "Arroz negro (ou integral escuro)", emoji: "🖤", texture: ["macio", "seco"], foodGroups: ["cereais"], tip: "Cor escura — avise antes.", gold: true },
  { title: "Arroz com ervilhas", emoji: "🟢", texture: ["macio", "seco"], foodGroups: ["cereais", "leguminosas"], tip: "Ervilhas inteiras previsíveis." },
  { title: "Risoto de abóbora batido", emoji: "🎃", texture: ["cremoso", "liso"], foodGroups: ["cereais", "legumes"], tip: "Cremoso sem pedaços." },
  { title: "Arroz com açafrão (cor amarela)", emoji: "🟡", texture: ["macio", "seco"], foodGroups: ["cereais"], tip: "Cor única e estável." },
  { title: "Bolinho de arroz assado", emoji: "🍙", texture: ["crocante", "macio"], foodGroups: ["cereais"], tip: "Formato bola igual." },
  { title: "Arroz com feijão misturado (tropeiro leve)", emoji: "🫘", texture: ["macio", "seco"], foodGroups: ["cereais", "leguminosas"], tip: "Mistura só após aceitar os dois." },
  { title: "Sopa de arroz", emoji: "🥣", texture: ["líquido", "macio"], foodGroups: ["cereais"], tip: "Arroz bem mole." },
  { title: "Arroz com leite vegetal", emoji: "🥛", texture: ["cremoso", "macio"], foodGroups: ["cereais", "leites vegetais"], tip: "Sem leite animal.", dairyFree: true },
  { title: "Arroz japonês para onigiri", emoji: "🍙", texture: ["macio", "úmido"], foodGroups: ["cereais"], tip: "Bolinhas iguais.", glutenFree: true, dairyFree: true },
  { title: "Arroz com ovo mexido", emoji: "🍳", texture: ["macio", "úmido"], foodGroups: ["cereais", "ovos"], tip: "Ovo bem soltinho." },
  { title: "Arroz com abobrinha em cubinhos", emoji: "🥒", texture: ["macio", "úmido"], foodGroups: ["cereais", "legumes"], tip: "Cubos iguais e secos." },
  { title: "Arroz com tomate sem pele", emoji: "🍅", texture: ["macio", "úmido"], foodGroups: ["cereais", "legumes"], tip: "Sem sementes." },
];

const FEIJAO: Idea[] = [
  { title: "Feijão carioca caldo limpo", emoji: "🫘", texture: ["líquido", "macio"], foodGroups: ["leguminosas"], tip: "Caldo sem pedaços grandes." },
  { title: "Feijão preto batido (tutú leve)", emoji: "⚫", texture: ["cremoso", "liso"], foodGroups: ["leguminosas"], tip: "Bata parcialmente." },
  { title: "Feijão branco cremoso", emoji: "🤍", texture: ["cremoso", "macio"], foodGroups: ["leguminosas"], tip: "Grãos macios iguais." },
  { title: "Feijão tropeiro sem farofa excessiva", emoji: "🍳", texture: ["seco", "macio"], foodGroups: ["leguminosas", "cereais"], tip: "Farofa fina e seca.", gold: true },
  { title: "Sopa de feijão", emoji: "🍲", texture: ["cremoso", "liso"], foodGroups: ["leguminosas"], tip: "Peneire cascas." },
  { title: "Feijão com arroz separado no prato", emoji: "🍚", texture: ["macio", "úmido"], foodGroups: ["leguminosas", "cereais"], tip: "Não misturar no início." },
  { title: "Feijão verde (vagem) em palitos", emoji: "🟢", texture: ["crocante", "macio"], foodGroups: ["legumes"], tip: "Palitos iguais." },
  { title: "Hummus de feijão branco", emoji: "🟡", texture: ["liso", "pastoso"], foodGroups: ["leguminosas"], tip: "Lisura total.", glutenFree: true, dairyFree: true },
  { title: "Feijão com bacon em cubinhos mínimos", emoji: "🥓", texture: ["macio", "úmido"], foodGroups: ["leguminosas", "carnes"], tip: "Cubos bem pequenos.", gold: true },
  { title: "Feijão de corda cozido", emoji: "🌿", texture: ["macio", "úmido"], foodGroups: ["leguminosas"], tip: "Ponto firme estável." },
  { title: "Feijão com cenoura em cubos", emoji: "🥕", texture: ["macio", "úmido"], foodGroups: ["leguminosas", "legumes"], tip: "Cubos previsíveis." },
  { title: "Tutu de feijão liso", emoji: "🟤", texture: ["pastoso", "liso"], foodGroups: ["leguminosas"], tip: "Sem pedaços." },
  { title: "Feijão enlatado enxaguado (emergência)", emoji: "🥫", texture: ["macio", "úmido"], foodGroups: ["leguminosas"], tip: "Enxágue reduz sal/cheiro." },
  { title: "Feijão com mandioca", emoji: "🌿", texture: ["macio", "úmido"], foodGroups: ["leguminosas", "tubérculos"], tip: "Mandioca em cubos iguais." },
  { title: "Salada de feijão-fradinho fria", emoji: "🥗", texture: ["macio", "úmido"], foodGroups: ["leguminosas"], tip: "Temperatura fria estável.", gold: true },
  { title: "Feijão com couve fininha", emoji: "🥬", texture: ["macio", "úmido"], foodGroups: ["leguminosas", "folhas"], tip: "Couve em tiras mínimas." },
  { title: "Pastinha de feijão para torrada", emoji: "🥪", texture: ["pastoso", "liso"], foodGroups: ["leguminosas"], tip: "Espalhe fino.", dairyFree: true },
  { title: "Feijão com abóbora", emoji: "🎃", texture: ["macio", "úmido"], foodGroups: ["leguminosas", "legumes"], tip: "Abóbora bem macia." },
  { title: "Feijão sem tempero forte (só sal leve)", emoji: "🫘", texture: ["macio", "úmido"], foodGroups: ["leguminosas"], tip: "Aroma mínimo." },
  { title: "Feijão com arroz na Escada (lado a lado)", emoji: "👀", texture: ["macio", "úmido"], foodGroups: ["leguminosas", "cereais"], tip: "Tolerar os dois no prato." },
];

const VERDURAS: Idea[] = [
  { title: "Cenoura em palitos crus", emoji: "🥕", texture: ["crocante", "seco"], foodGroups: ["legumes"], tip: "Seque a superfície." },
  { title: "Cenoura cozida em palitos", emoji: "🟧", texture: ["macio", "úmido"], foodGroups: ["legumes"], tip: "Ponto sempre igual." },
  { title: "Brócolis em floretes", emoji: "🥦", texture: ["macio", "úmido"], foodGroups: ["folhas"], tip: "Mesmo tamanho." },
  { title: "Couve-flor branca", emoji: "☁️", texture: ["macio", "úmido"], foodGroups: ["legumes"], tip: "Cheiro: comece longe." },
  { title: "Abobrinha grelhada em tiras", emoji: "🥒", texture: ["macio", "seco"], foodGroups: ["legumes"], tip: "Superfície seca." },
  { title: "Pepino em palitos sem casca", emoji: "🥒", texture: ["crocante", "úmido"], foodGroups: ["legumes"], tip: "Seque a água." },
  { title: "Tomate cereja ao meio", emoji: "🍅", texture: ["úmido", "macio"], foodGroups: ["legumes"], tip: "Escorra sementes." },
  { title: "Beterraba cozida em cubos", emoji: "🟣", texture: ["macio", "úmido"], foodGroups: ["legumes"], tip: "Cor intensa — avise.", gold: true },
  { title: "Espinafre refogado seco", emoji: "🥬", texture: ["macio", "seco"], foodGroups: ["folhas"], tip: "Sem líquido no prato." },
  { title: "Alface em tiras iguais", emoji: "🥗", texture: ["crocante", "úmido"], foodGroups: ["folhas"], tip: "Crocância previsível." },
  { title: "Vagem em palitos", emoji: "🟢", texture: ["crocante", "macio"], foodGroups: ["legumes"], tip: "Corte uniforme." },
  { title: "Chuchu cozido em cubos", emoji: "🤍", texture: ["macio", "úmido"], foodGroups: ["legumes"], tip: "Sabor neutro." },
  { title: "Berinjela assada em tiras", emoji: "🍆", texture: ["macio", "úmido"], foodGroups: ["legumes"], tip: "Bem assada e seca.", gold: true },
  { title: "Quiabo sem baba (bem seco)", emoji: "🫒", texture: ["macio", "seco"], foodGroups: ["legumes"], tip: "Secar bem reduz baba." },
  { title: "Rúcula picada mínima", emoji: "🌿", texture: ["crocante", "úmido"], foodGroups: ["folhas"], tip: "Amargor — porção mínima." },
  { title: "Repolho refogado fino", emoji: "🫧", texture: ["macio", "úmido"], foodGroups: ["folhas"], tip: "Tiras bem finas." },
  { title: "Palitos de pimentão assado", emoji: "🫑", texture: ["macio", "seco"], foodGroups: ["legumes"], tip: "Uma cor por vez." },
  { title: "Couve crisps assada", emoji: "🥬", texture: ["crocante", "seco"], foodGroups: ["folhas"], tip: "Folha úmida → floco seco.", glutenFree: true, dairyFree: true },
  { title: "Mix de legumes assados iguais", emoji: "🥘", texture: ["macio", "seco"], foodGroups: ["legumes"], tip: "Cortes do mesmo tamanho.", gold: true },
  { title: "Sopinha só de verduras batida", emoji: "🥣", texture: ["liso", "líquido"], foodGroups: ["legumes", "folhas"], tip: "Sem pedaços.", dairyFree: true },
];

const BISCOITOS: Idea[] = [
  { title: "Biscoito maria em tiras", emoji: "🍪", texture: ["crocante", "seco"], foodGroups: ["cereais"], tip: "Alimento seguro clássico." },
  { title: "Cream cracker inteiro", emoji: "🟧", texture: ["crocante", "seco"], foodGroups: ["cereais"], tip: "Sal leve." },
  { title: "Biscoito de polvilho", emoji: "⭕", texture: ["crocante", "seco"], foodGroups: ["cereais sem glúten"], tip: "Naturalmente sem glúten.", glutenFree: true, dairyFree: true },
  { title: "Biscoito de aveia fino", emoji: "🌾", texture: ["crocante", "seco"], foodGroups: ["cereais"], tip: "Sem pedaços de fruta." },
  { title: "Biscoito champagne", emoji: "🟨", texture: ["crocante", "seco"], foodGroups: ["cereais"], tip: "Formato retângulo." },
  { title: "Biscoito de maisena", emoji: "🤍", texture: ["crocante", "seco"], foodGroups: ["cereais"], tip: "Sabor neutro." },
  { title: "Biscoito amanteigado simples", emoji: "🧈", texture: ["crocante", "macio"], foodGroups: ["cereais", "laticínios"], tip: "Sem recheio." },
  { title: "Biscoito de milho", emoji: "🌽", texture: ["crocante", "seco"], foodGroups: ["cereais"], tip: "Cor amarela." },
  { title: "Biscoito integral fino", emoji: "🟫", texture: ["crocante", "seco"], foodGroups: ["cereais"], tip: "Encadeamento do refinado." },
  { title: "Biscoito de arroz", emoji: "🍙", texture: ["crocante", "seco"], foodGroups: ["cereais sem glúten"], tip: "Sem glúten.", glutenFree: true, dairyFree: true },
  { title: "Biscoito wafer fino", emoji: "🟨", texture: ["crocante", "seco"], foodGroups: ["cereais"], tip: "Camadas previsíveis." },
  { title: "Biscoito de chocolate meio amargo", emoji: "🍫", texture: ["crocante", "seco"], foodGroups: ["cereais"], tip: "Amargor controlado.", gold: true },
  { title: "Biscoito de coco", emoji: "🥥", texture: ["crocante", "granuloso suave"], foodGroups: ["cereais"], tip: "Coco fino." },
  { title: "Biscoito de gengibre suave", emoji: "🍪", texture: ["crocante", "seco"], foodGroups: ["cereais"], tip: "Aroma leve." },
  { title: "Biscoito sem lactose", emoji: "🥛", texture: ["crocante", "seco"], foodGroups: ["cereais"], tip: "Versão sem leite.", dairyFree: true },
  { title: "Biscoito sem glúten Neutro", emoji: "✨", texture: ["crocante", "seco"], foodGroups: ["cereais sem glúten"], tip: "Formato igual ao preferido.", glutenFree: true, dairyFree: true },
  { title: "Torrada biscoito (rusk)", emoji: "🍞", texture: ["crocante", "seco"], foodGroups: ["cereais"], tip: "Muito seco." },
  { title: "Biscoito de batata (chips biscoitados)", emoji: "🥔", texture: ["crocante", "seco"], foodGroups: ["tubérculos"], tip: "Sal mínimo.", glutenFree: true, dairyFree: true },
  { title: "Biscoito recheado light (camada fina)", emoji: "🍪", texture: ["crocante", "cremoso"], foodGroups: ["cereais"], tip: "Ponte para bolacha recheada." },
  { title: "Mini biscoito redondo igual", emoji: "⭕", texture: ["crocante", "seco"], foodGroups: ["cereais"], tip: "Tamanho bite previsível." },
];

function cakeSteps(idea: Idea): string[] {
  return [
    `Prepare a massa de ${idea.title.toLowerCase()} de forma uniforme.`,
    "Asse até cor e textura estáveis.",
    "Corte fatias ou unidades do mesmo tamanho.",
    "Ofereça perto de um alimento seguro, sem pressão.",
  ];
}

function soupSteps(idea: Idea): string[] {
  return [
    `Cozinhe os ingredientes de ${idea.title.toLowerCase()} até ficarem macios.`,
    "Bata ou peneire para a lisura desejada.",
    "Sirva na temperatura que a criança tolera melhor.",
    "Comece com cheirar/tolerar o prato antes de provar.",
  ];
}

function muffinSteps(idea: Idea): string[] {
  return [
    "Massa homogênea, sem pedaços grandes surpresa.",
    "Asse em forminhas iguais.",
    "Sirva inteiro ou em metades simétricas.",
    "Sem cobertura no início da Escada.",
  ];
}

function cookieSteps(idea: Idea): string[] {
  return [
    "Escolha ou prepare o biscoito com formato previsível.",
    "Se houver recheio, mantenha camada fina e uniforme.",
    "Ofereça 1 unidade simbólica no prato.",
    "Pareie com o alimento seguro da criança.",
  ];
}

function riceSteps(idea: Idea): string[] {
  return [
    "Cozinhe o arroz no ponto combinado (solto ou mais mole).",
    "Mantenha a mesma aparência entre os dias.",
    "Monte porção visual clara no prato.",
    "Avance misturas só depois de aceitar o arroz sozinho.",
  ];
}

function beanSteps(idea: Idea): string[] {
  return [
    "Cozinhe o feijão até o ponto de caldo/grão escolhido.",
    "Controle aroma e tempero — comece suave.",
    "Sirva separado do arroz no início.",
    "Use a Escada: tolerar → olhar → cheirar → tocar.",
  ];
}

function vegSteps(idea: Idea): string[] {
  return [
    "Lave e corte em formato repetido (palito, cubo ou florete).",
    "Cozinhe ou sirva cru conforme a textura-alvo.",
    "Seque excesso de água/óleo.",
    "Ofereça longe ou perto conforme o degrau atual.",
  ];
}

function gfSteps(idea: Idea): string[] {
  return [
    `Confira ingredientes sem glúten e sem leite em ${idea.title.toLowerCase()}.`,
    "Prepare com utensílios limpos (evitar contaminação cruzada).",
    "Mantenha formato e porção previsíveis.",
    "Ofereça sem pressão; celebre microprogressos.",
  ];
}

/** Catálogo completo (≥20 por categoria). */
export const RECIPE_CATALOG: RecipeDef[] = [
  ...build("sem_gluten_leite", SEM_GLUTEN_LEITE, gfSteps, "Ideia sem glúten e sem leite."),
  ...build("bolos", BOLOS, cakeSteps, "Bolo sensorial."),
  ...build("sopas", SOPAS, soupSteps, "Sopa com foco em textura."),
  ...build("muffins", MUFFINS, muffinSteps, "Muffin previsível."),
  ...build("bolacha_recheada", BOLACHA_RECHEADA, cookieSteps, "Bolacha recheada controlada."),
  ...build("arroz", ARROZ, riceSteps, "Preparação de arroz."),
  ...build("feijao", FEIJAO, beanSteps, "Preparação de feijão."),
  ...build("verduras", VERDURAS, vegSteps, "Verdura na Escada."),
  ...build("biscoitos", BISCOITOS, cookieSteps, "Biscoito sensorial."),
];

export function recipesForSeed() {
  return RECIPE_CATALOG.map((r) => ({
    title: r.title,
    description: r.description,
    foodGroups: JSON.stringify([
      ...r.foodGroups,
      ...r.categories.map((c) => RECIPE_CATEGORY_LABELS[c]),
      ...(r.glutenFree ? ["sem glúten"] : []),
      ...(r.dairyFree ? ["sem leite"] : []),
    ]),
    textures: JSON.stringify(r.textures),
    steps: r.steps.map((s, i) => `${i + 1}. ${s}`).join("\n"),
    tips: r.tips,
    videoUrl: null as string | null,
    videoLabel: null as string | null,
    cartoonScenes: JSON.stringify(scenesFor(r)),
    minPlan: r.minPlan,
  }));
}

export function recipeCount() {
  return RECIPE_CATALOG.length;
}

export function countByCategory() {
  const counts: Record<string, number> = {};
  for (const c of Object.keys(RECIPE_CATEGORY_LABELS) as RecipeCategory[]) {
    counts[c] = RECIPE_CATALOG.filter((r) => r.categories.includes(c)).length;
  }
  return counts;
}
