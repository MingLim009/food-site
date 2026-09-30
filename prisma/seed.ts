import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { recipesForSeed, recipeCount } from "../src/lib/recipes-catalog";
import { KNOWLEDGE_BASE, knowledgeCount } from "../src/lib/knowledge-base";

const prisma = new PrismaClient();

const knowledge = KNOWLEDGE_BASE;

const recipes = recipesForSeed();

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
  {
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
  {
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
];

async function main() {
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.foodProgress.deleteMany();
  await prisma.questionnaireResult.deleteMany();
  await prisma.child.deleteMany();
  await prisma.knowledgeChunk.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.foodChain.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("demo1234", 10);
  const adminHash = await bcrypt.hash("admin1234", 10);

  const parent = await prisma.user.create({
    data: {
      email: "mae@demo.com",
      name: "Andreza Demo",
      passwordHash,
      role: "PARENT",
      plan: "GOLD",
      planExpiresAt: new Date(Date.now() + 180 * 24 * 3600 * 1000),
      lgpdAcceptedAt: new Date(),
    },
  });

  await prisma.user.create({
    data: {
      email: "admin@eloalimentar.com",
      name: "Admin EloAlimentar",
      passwordHash: adminHash,
      role: "ADMIN",
      plan: "GOLD",
      planExpiresAt: new Date(Date.now() + 365 * 24 * 3600 * 1000),
      lgpdAcceptedAt: new Date(),
    },
  });

  const child = await prisma.child.create({
    data: {
      userId: parent.id,
      name: "Lucas",
      birthDate: new Date("2019-05-10"),
      diagnosisNotes: "Acompanhamento nutricional; TEA em investigação multiprofissional (não diagnóstico da TIA Nutri).",
      textures: JSON.stringify(["crocante", "seco"]),
      colors: JSON.stringify(["bege", "laranja"]),
      shapes: JSON.stringify(["palito", "círculo"]),
      acceptedFoods: JSON.stringify(["biscoito", "batata frita", "iogurte liso"]),
      refusedFoods: JSON.stringify(["folhas", "misturas", "alimentos úmidos pegajosos"]),
      heightCm: 110,
      weightKg: 18.5,
      notes: "Melhor desempenho em ambiente calmo, sem pressão.",
      avatar: JSON.stringify({
        skin: "medio",
        hair: "curto",
        hairColor: "castanho",
        eyes: "castanhos",
        outfit: "camiseta",
        accessory: "bone",
      }),
    },
  });

  await prisma.foodProgress.create({
    data: { childId: child.id, foodName: "Batata-doce", step: 8, notes: "Segura palito sem angústia." },
  });

  for (const k of knowledge) {
    await prisma.knowledgeChunk.create({ data: k });
  }
  for (const r of recipes) {
    await prisma.recipe.create({ data: r });
  }
  for (const c of chains) {
    await prisma.foodChain.create({ data: c });
  }

  console.log("Seed OK");
  console.log(`Recipes with cartoon videos: ${recipeCount()}`);
  console.log(`Knowledge chunks: ${knowledgeCount()}`);
  console.log("Parent: mae@demo.com / demo1234");
  console.log("Admin:  admin@eloalimentar.com / admin1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
