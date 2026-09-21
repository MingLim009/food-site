import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const knowledge = [
  {
    title: "Principais causas da seletividade em TEA",
    category: "TEA",
    tags: JSON.stringify(["tea", "seletividade", "causas", "sensorial"]),
    content:
      "Na TEA, a seletividade alimentar costuma relacionar-se a hipersensibilidade sensorial (textura, cheiro, temperatura, cor), necessidade de previsibilidade, padrões rígidos e, em alguns casos, dificuldades oral-motoras. A abordagem deve ser gradual, sem pressão coercitiva à mesa, respeitando o sistema nervoso da criança e integrando família e escola.",
  },
  {
    title: "Principais causas da seletividade em TDAH",
    category: "TDAH",
    tags: JSON.stringify(["tdah", "seletividade", "atencao", "impulsividade"]),
    content:
      "No TDAH, a seletividade pode ligar-se a desatenção durante a refeição, busca por estímulos intensos (sabores fortes), impulsividade, dificuldade de permanecer à mesa e regulação emocional. Rotinas previsíveis, ambiente calmo e porções visuais claras ajudam. Não se trata de 'birra'; é regulação.",
  },
  {
    title: "Sinais que a criança dá na seletividade",
    category: "Sinais",
    tags: JSON.stringify(["sinais", "recusa", "sensorial"]),
    content:
      "Sinais comuns: virar o rosto, engasgo antecipatório, náusea, choro, engolir saliva em excesso, empurrar o prato, aceitar só marcas específicas, preferir seco ou só líquido, recusar misturas. Observe o que ocorre antes da recusa (cheiro, visual, barulho do ambiente).",
  },
  {
    title: "Escada do Comer — visão geral",
    category: "Escada",
    tags: JSON.stringify(["escada", "passos", "tolerar", "mastigar"]),
    content:
      "A Escada do Comer organiza o progresso do passo 1 (tolerar a presença do alimento) até o 26 (mastigar e comer de forma funcional). Cada alimento tem seu próprio degrau. Não se pula etapas por pressão. Celebrar microprogressos reduz ansiedade familiar.",
  },
  {
    title: "Preferências por texturas, cores e formas",
    category: "Sensorial",
    tags: JSON.stringify(["textura", "cor", "forma"]),
    content:
      "Muitas crianças aceitam melhor alimentos crocantes OU pastosos, cores claras OU vibrantes, formatos previsíveis (palito, círculo). Mapear preferências permite escolher o próximo alimento da cadeia com menor carga sensorial.",
  },
  {
    title: "Profissionais além do nutricionista",
    category: "Rede",
    tags: JSON.stringify(["to", "fono", "tps", "oral-motor"]),
    content:
      "Além do nutricionista: Terapeuta Ocupacional quando há sinais de Transtorno do Processamento Sensorial (TPS); Fonoaudiólogo para dificuldades oral-motoras (mastigação, deglutição, tônus); médico pediatra/gastro conforme sintomas sistêmicos. A TIA Nutri não substitui esses profissionais.",
  },
  {
    title: "Vitaminas, minerais e aminoácidos na seletividade",
    category: "Nutrientes",
    tags: JSON.stringify(["vitaminas", "minerais", "aminoacidos"]),
    content:
      "Dietas muito restritas podem envolver risco de inadequação de ferro, zinco, cálcio, vitamina D, vitaminas do complexo B, ômega-3 e aminoácidos essenciais — entre outros. A plataforma NÃO informa quantidades. Avaliação laboratorial e suplementação, se necessária, é exclusiva de consulta.",
  },
  {
    title: "Verminoses, leaky gut, má digestão e enzimas",
    category: "Gastro",
    tags: JSON.stringify(["verminose", "leaky gut", "enzimas", "digestao"]),
    content:
      "Queixas gastrointestinais (dor, gases, diarreia, constipação, desconforto após comer) merecem avaliação médica. Hipóteses como verminoses, aumento da permeabilidade intestinal (leaky gut), má digestão ou baixa de enzimas digestivas exigem investigação clínica — não automedicação nem protocolo pela TIA Nutri.",
  },
  {
    title: "Disbiose, SIBO e SIFO — quando investigar",
    category: "Gastro",
    tags: JSON.stringify(["disbiose", "sibo", "sifo"]),
    content:
      "Investigar disbiose, SIBO ou SIFO quando há sintomas persistentes (inchaço, distensão, alteração do hábito intestinal, desconforto crônico) sob orientação médica especializada. A plataforma apenas educa sobre o conceito; exames e conduta são clínicos.",
  },
  {
    title: "Antropometria educativa sem diagnóstico",
    category: "Antropometria",
    tags: JSON.stringify(["imc", "peso", "altura"]),
    content:
      "Peso e altura permitem calcular IMC aproximado (peso / altura²). Em crianças, a interpretação usa curvas de crescimento e percentis — isso é papel do profissional de saúde. Na plataforma, o IMC é apenas referência educativa, sem classificar desnutrição/obesidade como diagnóstico.",
  },
  {
    title: "Limites clínicos da TIA Nutri",
    category: "Seguranca",
    tags: JSON.stringify(["limites", "lgpd", "seguranca", "tia nutri"]),
    content:
      "A TIA Nutri responde só sobre a criança do perfil ativo; não compara com outras crianças; não dá doses; não diagnostica; usa biblioteca especializada (RAG). Dados pessoais são tratados conforme LGPD, com finalidade de apoio educativo aos responsáveis legais.",
  },
];

const recipes = [
  {
    title: "Palitinhos crocantes de batata-doce",
    description: "Receita sensorial com foco em crocância e cor alaranjada.",
    foodGroups: JSON.stringify(["tubérculos", "legumes"]),
    textures: JSON.stringify(["crocante", "seco"]),
    steps:
      "1. Corte a batata-doce em palitos uniformes.\n2. Asse até ficar crocante por fora.\n3. Ofereça primeiro para olhar/tolerar, depois tocar.\n4. Pareie com um alimento seguro da criança.",
    tips: "Mantenha o formato previsível. Sem pressão para morder no primeiro contato.",
    minPlan: "PREMIUM",
  },
  {
    title: "Smoothie rosa suave",
    description: "Textura líquida homogênea com cor previsível.",
    foodGroups: JSON.stringify(["frutas", "laticínios ou vegetais"]),
    textures: JSON.stringify(["líquido", "liso"]),
    steps:
      "1. Bata fruta preferida até ficar totalmente lisa.\n2. Sirva em copo opaco se a cor for gatilho.\n3. Use canudo se ajudar no controle oral.\n4. Avance na Escada apenas se houver conforto.",
    tips: "Evite pedaços. Homogeneidade reduz surpresa sensorial.",
    minPlan: "PREMIUM",
  },
  {
    title: "Panqueca neutra em formato círculo",
    description: "Forma circular previsível, sabor neutro.",
    foodGroups: JSON.stringify(["cereais", "ovos ou substituto"]),
    textures: JSON.stringify(["macio", "úmido"]),
    steps:
      "1. Prepare massa simples e uniforme.\n2. Mantenha sempre o mesmo tamanho de círculo.\n3. Ofereça cortada em iguais se a criança preferir simetria.\n4. Introduza variação mínima depois de aceitação estável.",
    tips: "Mudanças de forma só depois do passo consolidado.",
    minPlan: "GOLD",
  },
];

const chains = [
  {
    title: "Do biscoito seco ao torrado integral",
    description: "Encadeamento por textura crocante semelhante.",
    startFood: "Biscoito preferido",
    endFood: "Torrada integral fina",
    steps: JSON.stringify([
      "Biscoito preferido (alimento seguro)",
      "Mesmo biscoito em formato ligeiramente diferente",
      "Biscoito de outra marca com textura parecida",
      "Torrada clara muito fina",
      "Torrada integral fina",
    ]),
    minPlan: "PREMIUM",
  },
  {
    title: "Do iogurte liso à fruta amassada",
    description: "Da homogeneidade à microtextura.",
    startFood: "Iogurte liso aceito",
    endFood: "Fruta bem amassada",
    steps: JSON.stringify([
      "Iogurte liso preferido",
      "Iogurte com aroma sutil da fruta-alvo",
      "Iogurte com 1 pitada de fruta peneirada",
      "Fruta peneirada isolada em microporção",
      "Fruta amassada",
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
