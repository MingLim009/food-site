const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

const chains = [
  {
    title: "Da batata chips à batata cozida",
    description: "Encadeamento crocante — mesma família, mudando formato e preparo.",
    startFood: "Batata chips",
    endFood: "Purê de batata",
    steps: JSON.stringify([
      { label: "Batata chips industrial", emoji: "🥔", bg: "#FFF3D6" },
      { label: "Chips caseiros assados", emoji: "🫓", bg: "#FFE8B8" },
      { label: "Batata em gomos assados", emoji: "🍟", bg: "#FFD9A0" },
      { label: "Batata cozida em pedaços", emoji: "🥔", bg: "#F5E6C8" },
      { label: "Batata + vagem no prato", emoji: "🫘", bg: "#E8F5D8" },
      { label: "Purê de batata liso", emoji: "🥣", bg: "#F0E6D8" },
    ]),
    minPlan: "PREMIUM",
  },
  {
    title: "Da cenoura crua à abóbora",
    description: "Encadeamento pela cor laranja e perfil doce-suave.",
    startFood: "Cenoura crua",
    endFood: "Abóbora assada",
    steps: JSON.stringify([
      { label: "Cenoura em palitos", emoji: "🥕", bg: "#FFE8D0" },
      { label: "Cenoura ralada", emoji: "🥗", bg: "#FFDCC0" },
      { label: "Suco de cenoura", emoji: "🧃", bg: "#FFD0A8" },
      { label: "Bolo / muffin de cenoura", emoji: "🧁", bg: "#F5C890" },
      { label: "Sopa de abóbora", emoji: "🍲", bg: "#FFE0B0" },
      { label: "Abóbora assada em pedaços", emoji: "🎃", bg: "#FFCC80" },
    ]),
    minPlan: "PREMIUM",
  },
  {
    title: "Do nugget à carne moída",
    description: "Da proteína empanada segura até formatos mais reais.",
    startFood: "Nugget industrial",
    endFood: "Carne moída",
    steps: JSON.stringify([
      { label: "Nugget industrial", emoji: "🍗", bg: "#FFE8E0" },
      { label: "Frango empanado caseiro", emoji: "🥖", bg: "#FFD8CC" },
      { label: "Tiras de frango grelhado", emoji: "🥩", bg: "#FFC8B8" },
      { label: "Frango desfiado", emoji: "🍜", bg: "#F5D0C0" },
      { label: "Peito em molho suave", emoji: "🍛", bg: "#E8D0C0" },
      { label: "Carne moída temperada leve", emoji: "🥘", bg: "#E0C8B8" },
    ]),
    minPlan: "PREMIUM",
  },
  {
    title: "Da banana à uva",
    description: "Parte da fruta segura e avança por formatos parecidos.",
    startFood: "Banana em rodelas",
    endFood: "Uvas",
    steps: JSON.stringify([
      { label: "Banana em rodelas", emoji: "🍌", bg: "#FFF9C4" },
      { label: "Panqueca de banana", emoji: "🥞", bg: "#FFF59D" },
      { label: "Vitamina de banana", emoji: "🥤", bg: "#FFF176" },
      { label: "Maçã em fatias", emoji: "🍎", bg: "#FFECB3" },
      { label: "Morango inteiro / corte", emoji: "🍓", bg: "#FFCDD2" },
      { label: "Uvas sem semente", emoji: "🍇", bg: "#E1BEE7" },
    ]),
    minPlan: "PREMIUM",
  },
];

async function main() {
  await p.foodChain.deleteMany();
  for (const c of chains) {
    await p.foodChain.create({ data: c });
  }
  // keep the two original text ones also as visual
  await p.foodChain.create({
    data: {
      title: "Do biscoito seco ao torrado integral",
      description: "Encadeamento por textura crocante semelhante.",
      startFood: "Biscoito preferido",
      endFood: "Torrada integral fina",
      steps: JSON.stringify([
        { label: "Biscoito preferido", emoji: "🍪", bg: "#FFF3D6" },
        { label: "Mesmo biscoito outro formato", emoji: "🥠", bg: "#FFE8B8" },
        { label: "Outra marca textura parecida", emoji: "🍘", bg: "#FFD9A0" },
        { label: "Torrada clara bem fina", emoji: "🍞", bg: "#F5E6C8" },
        { label: "Torrada integral fina", emoji: "🥖", bg: "#E8D8B8" },
      ]),
      minPlan: "PREMIUM",
    },
  });
  await p.foodChain.create({
    data: {
      title: "Do iogurte liso à fruta amassada",
      description: "Da homogeneidade à microtextura.",
      startFood: "Iogurte liso aceito",
      endFood: "Fruta bem amassada",
      steps: JSON.stringify([
        { label: "Iogurte liso preferido", emoji: "🥛", bg: "#E3F2FD" },
        { label: "Iogurte com aroma sutil", emoji: "🍶", bg: "#BBDEFB" },
        { label: "Iogurte + pitada de fruta", emoji: "🍓", bg: "#FFE0E8" },
        { label: "Fruta peneirada microporção", emoji: "🥄", bg: "#F8BBD0" },
        { label: "Fruta amassada", emoji: "🍌", bg: "#FFF9C4" },
      ]),
      minPlan: "PREMIUM",
    },
  });
  const n = await p.foodChain.count();
  console.log("chains", n);
  await p.$disconnect();
}

main();
