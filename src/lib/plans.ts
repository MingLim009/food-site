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
  hasEbooks: boolean;
  hasEscada: boolean;
  hasAi: boolean;
  hasQuestionnaire: boolean;
  hasGames: boolean;
  hasAgenda: boolean;
  hasMedications: boolean;
  hasProfessional: boolean;
  /** Download/impressão de PDFs e materiais anexados (bloqueado no grátis). */
  hasPdfDownload: boolean;
  isTrial?: boolean;
};

/** Acesso livre na criação da conta (36 horas). */
export const TRIAL_HOURS = 36;

export const PLANS: PlanDefinition[] = [
  {
    tier: "TRIAL",
    name: "Teste grátis",
    priceBrl: 0,
    durationDays: 0,
    tagline: "36 horas grátis para a família conhecer o EloAlimentar.",
    features: [
      "36 horas de acesso amplo (área família)",
      "Chat com a TIA Nutri",
      "Escada do Comer, agenda e medicações educativas",
      "Jogos + questionário",
      "Sem download de PDFs no teste grátis",
      "Depois das 36 horas, escolha um plano pago",
    ],
    hasRecipes: true,
    hasChaining: true,
    hasEbooks: false,
    hasEscada: true,
    hasAi: true,
    hasQuestionnaire: true,
    hasGames: true,
    hasAgenda: true,
    hasMedications: true,
    hasProfessional: false,
    hasPdfDownload: false,
    isTrial: true,
  },
  {
    tier: "BASIC",
    name: "Básico (Simples)",
    priceBrl: 79.9,
    durationDays: 30,
    tagline: "Comece com perfis, jogos e questionário — sem TIA Nutri.",
    features: [
      "30 dias de acesso",
      "Cadastro de perfis infantis",
      "Questionário de seletividade (investigação inicial)",
      "Jogos interativos com alimentos",
      "Caixinha de sugestões de melhoria",
      "Conteúdo educativo básico",
      "Sem TIA Nutri neste plano",
      "Sem download de PDFs no teste grátis (só planos pagos)",
    ],
    hasRecipes: false,
    hasChaining: false,
    hasEbooks: false,
    hasEscada: false,
    hasAi: false,
    hasQuestionnaire: true,
    hasGames: true,
    hasAgenda: false,
    hasMedications: false,
    hasProfessional: false,
    hasPdfDownload: true,
  },
  {
    tier: "PREMIUM",
    name: "Premium (Médio)",
    priceBrl: 179,
    durationDays: 90,
    tagline: "TIA Nutri + Escada + agenda — sem receitas, encadeamento ou ebooks extras.",
    features: [
      "TIA Nutri (respostas completas estilo ChatGPT)",
      "Escada do Comer atualizada",
      "Agenda (consultas, terapias, medicações + alarmes)",
      "Aba educativa de medicações TEA/TDAH",
      "Funções executivas da alimentação",
      "Jogos + boneco + questionário",
      "Sem receitas, sem encadeamento e sem ebooks extras",
    ],
    hasRecipes: false,
    hasChaining: false,
    hasEbooks: false,
    hasEscada: true,
    hasAi: true,
    hasQuestionnaire: true,
    hasGames: true,
    hasAgenda: true,
    hasMedications: true,
    hasProfessional: false,
    hasPdfDownload: true,
  },
  {
    tier: "GOLD",
    name: "Gold",
    priceBrl: 309,
    durationDays: 180,
    tagline: "Tudo do Médio + receitas, encadeamento, ebooks e área profissional.",
    features: [
      "Tudo do Premium (Médio)",
      "Receitas sensoriais e vídeos em desenho",
      "Encadeamento alimentar com figuras",
      "Ebooks extras",
      "Modo Família e Modo Profissional",
      "Material didático profissional + currículo",
      "IA educativa para profissionais",
      "Download de PDFs e materiais anexados",
    ],
    hasRecipes: true,
    hasChaining: true,
    hasEbooks: true,
    hasEscada: true,
    hasAi: true,
    hasQuestionnaire: true,
    hasGames: true,
    hasAgenda: true,
    hasMedications: true,
    hasProfessional: true,
    hasPdfDownload: true,
  },
];

/** Paid plans shown on pricing cards (excludes free trial). */
export const PAID_PLANS = PLANS.filter((p) => !p.isTrial);

export function getPlan(tier: string): PlanDefinition | undefined {
  return PLANS.find((p) => p.tier === tier);
}

export function planIsActive(plan: string, expiresAt: Date | null | undefined): boolean {
  if (plan === "NONE") return false;
  if (!expiresAt) return false;
  return expiresAt.getTime() > Date.now();
}

export type PlanFeature =
  | "recipes"
  | "chaining"
  | "ebooks"
  | "escada"
  | "ai"
  | "questionnaire"
  | "games"
  | "agenda"
  | "medications"
  | "professional"
  | "pdfDownload";

export function canAccessFeature(
  plan: string,
  expiresAt: Date | null | undefined,
  feature: PlanFeature
): boolean {
  if (!planIsActive(plan, expiresAt)) return false;
  const def = getPlan(plan);
  if (!def) return false;
  switch (feature) {
    case "recipes":
      return def.hasRecipes;
    case "chaining":
      return def.hasChaining;
    case "ebooks":
      return def.hasEbooks;
    case "escada":
      return def.hasEscada;
    case "ai":
      return def.hasAi;
    case "questionnaire":
      return def.hasQuestionnaire;
    case "games":
      return def.hasGames;
    case "agenda":
      return def.hasAgenda;
    case "medications":
      return def.hasMedications;
    case "professional":
      return def.hasProfessional;
    case "pdfDownload":
      return def.hasPdfDownload;
  }
}

/** PDFs / impressos: bloqueado no teste grátis e em planos sem a flag. */
export function canDownloadPdfs(plan: string, expiresAt: Date | null | undefined): boolean {
  return canAccessFeature(plan, expiresAt, "pdfDownload");
}

export function trialExpiresAt(from = new Date()) {
  return new Date(from.getTime() + TRIAL_HOURS * 60 * 60 * 1000);
}

export const ESCADA_STEPS: { step: number; title: string; description: string }[] = [
  { step: 1, title: "Tolerar no ambiente", description: "Aceitar a presença do alimento no ambiente sem pressão." },
  { step: 2, title: "Tolerar na mesa", description: "Alimento presente na mesa da família." },
  { step: 3, title: "Olhar de longe", description: "Observar o alimento sem necessidade de aproximação." },
  { step: 4, title: "Olhar de perto", description: "Permitir o alimento no campo visual próximo / no prato." },
  { step: 5, title: "Cheirar no ambiente", description: "Tolerar o aroma no espaço." },
  { step: 6, title: "Cheirar de perto", description: "Aproximar o nariz do alimento." },
  { step: 7, title: "Tocar com utensílio", description: "Manipular com colher/garfo sem pressão." },
  { step: 8, title: "Tocar com dedo", description: "Contato tátil breve e voluntário." },
  { step: 9, title: "Segurar", description: "Manter o alimento na mão por alguns segundos." },
  { step: 10, title: "Levar à boca fechada", description: "Aproximar do lábio sem abrir a boca." },
  { step: 11, title: "Tocar nos lábios", description: "Permitir contato labial." },
  { step: 12, title: "Beijar / lamber", description: "Contato com a língua na superfície." },
  { step: 13, title: "Morder e cuspir", description: "Experimentar a mordida sem engolir." },
  { step: 14, title: "Morder e segurar", description: "Manter na boca por segundos." },
  { step: 15, title: "Mastigar e cuspir", description: "Praticar mastigação sem engolir." },
  { step: 16, title: "Mastigar e engolir líquido", description: "Associar com líquido preferido." },
  { step: 17, title: "Engolir pequena quantidade", description: "Ingestão mínima voluntária." },
  { step: 18, title: "Engolir com apoio", description: "Ingestão com estratégia sensorial." },
  { step: 19, title: "Provar variações", description: "Pequenas mudanças de forma/temperatura." },
  { step: 20, title: "Combinar com preferido", description: "Parear com alimento seguro." },
  { step: 21, title: "Porção micro", description: "Quantidade simbólica no prato." },
  { step: 22, title: "Porção pequena", description: "Aumento gradual da quantidade." },
  { step: 23, title: "Aceitar no prato", description: "Alimento presente nas refeições habituais." },
  { step: 24, title: "Participar da refeição", description: "Comer junto da família sem pressão." },
  { step: 25, title: "Generalizar", description: "Aceitar o alimento em novos contextos." },
  { step: 26, title: "Mastigar e comer", description: "Consumo funcional e repetido." },
];
