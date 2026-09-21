import type { PlanTier } from "./types";

export type PlanDefinition = {
  tier: PlanTier;
  name: string;
  priceBrl: number;
  durationDays: number;
  tagline: string;
  features: string[];
  hasRecipes: boolean;
  hasChaining: boolean;
  hasEscada: boolean;
  hasAi: boolean;
  hasQuestionnaire: boolean;
};

export const PLANS: PlanDefinition[] = [
  {
    tier: "BASIC",
    name: "Básico",
    priceBrl: 29.9,
    durationDays: 15,
    tagline: "Comece com orientação e o questionário inicial.",
    features: [
      "Chat com a TIA Nutri sobre o perfil da criança",
      "Cadastro de perfis infantis",
      "Questionário de seletividade (investigação inicial)",
      "Conteúdo educativo básico",
      "Sem receitas, encadeamento e Escada do Comer",
    ],
    hasRecipes: false,
    hasChaining: false,
    hasEscada: false,
    hasAi: true,
    hasQuestionnaire: true,
  },
  {
    tier: "PREMIUM",
    name: "Premium",
    priceBrl: 99.9,
    durationDays: 90,
    tagline: "Acesso ampliado por 3 meses.",
    features: [
      "Tudo do Básico",
      "Receitas sensoriais",
      "Encadeamento alimentar",
      "Escada do Comer (passos 1–26)",
      "Preferências de texturas, cores e formas",
    ],
    hasRecipes: true,
    hasChaining: true,
    hasEscada: true,
    hasAi: true,
    hasQuestionnaire: true,
  },
  {
    tier: "GOLD",
    name: "Gold",
    priceBrl: 220,
    durationDays: 180,
    tagline: "Acompanhamento completo por 6 meses.",
    features: [
      "Tudo do Premium",
      "Prioridade no histórico e múltiplos perfis",
      "Biblioteca completa de conteúdo clínico-educativo",
      "Suporte estendido no período do plano",
    ],
    hasRecipes: true,
    hasChaining: true,
    hasEscada: true,
    hasAi: true,
    hasQuestionnaire: true,
  },
];

export function getPlan(tier: string): PlanDefinition | undefined {
  return PLANS.find((p) => p.tier === tier);
}

export function planIsActive(plan: string, expiresAt: Date | null | undefined): boolean {
  if (plan === "NONE") return false;
  if (!expiresAt) return false;
  return expiresAt.getTime() > Date.now();
}

export function canAccessFeature(
  plan: string,
  expiresAt: Date | null | undefined,
  feature: "recipes" | "chaining" | "escada" | "ai" | "questionnaire"
): boolean {
  if (!planIsActive(plan, expiresAt)) return false;
  const def = getPlan(plan);
  if (!def) return false;
  switch (feature) {
    case "recipes":
      return def.hasRecipes;
    case "chaining":
      return def.hasChaining;
    case "escada":
      return def.hasEscada;
    case "ai":
      return def.hasAi;
    case "questionnaire":
      return def.hasQuestionnaire;
  }
}

export const ESCADA_STEPS: { step: number; title: string; description: string }[] = [
  { step: 1, title: "Tolerar", description: "Aceitar a presença do alimento no ambiente." },
  { step: 2, title: "Olhar de longe", description: "Observar o alimento sem necessidade de aproximação." },
  { step: 3, title: "Olhar de perto", description: "Permitir o alimento no campo visual próximo." },
  { step: 4, title: "Cheirar no ambiente", description: "Tolerar o aroma no espaço." },
  { step: 5, title: "Cheirar de perto", description: "Aproximar o nariz do alimento." },
  { step: 6, title: "Tocar com utensílio", description: "Manipular com colher/garfo sem pressão." },
  { step: 7, title: "Tocar com dedo", description: "Contato tátil breve e voluntário." },
  { step: 8, title: "Segurar", description: "Manter o alimento na mão por alguns segundos." },
  { step: 9, title: "Levar à boca fechada", description: "Aproximar do lábio sem abrir a boca." },
  { step: 10, title: "Tocar nos lábios", description: "Permitir contato labial." },
  { step: 11, title: "Beijar / lamber", description: "Contato com a língua na superfície." },
  { step: 12, title: "Morder e cuspir", description: "Experimentar a mordida sem engolir." },
  { step: 13, title: "Morder e segurar", description: "Manter na boca por segundos." },
  { step: 14, title: "Mastigar e cuspir", description: "Praticar mastigação sem engolir." },
  { step: 15, title: "Mastigar e engolir líquido", description: "Associar com líquido preferido." },
  { step: 16, title: "Engolir pequena quantidade", description: "Ingestão mínima voluntária." },
  { step: 17, title: "Engolir com apoio", description: "Ingestão com estratégia sensorial." },
  { step: 18, title: "Provar variações", description: "Pequenas mudanças de forma/temperatura." },
  { step: 19, title: "Combinar com preferido", description: "Parear com alimento seguro." },
  { step: 20, title: "Porção micro", description: "Quantidade simbólica no prato." },
  { step: 21, title: "Porção pequena", description: "Aumento gradual da quantidade." },
  { step: 22, title: "Mastigar com ritmo", description: "Mastigação mais funcional." },
  { step: 23, title: "Aceitar no prato", description: "Alimento presente nas refeições." },
  { step: 24, title: "Participar da refeição", description: "Comer junto da família sem pressão." },
  { step: 25, title: "Generalizar", description: "Aceitar o alimento em novos contextos." },
  { step: 26, title: "Mastigar e comer", description: "Consumo funcional e repetido." },
];
