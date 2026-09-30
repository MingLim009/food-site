/** i18n mínimo PT / EN / ES — landing + textos centrais. */

export type Locale = "pt" | "en" | "es";

export const LOCALES: { id: Locale; label: string }[] = [
  { id: "pt", label: "Português" },
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
];

const dict = {
  pt: {
    brand: "EloAlimentar",
    tagline: "Apoio claro para seletividade alimentar no TEA e no TDAH",
    support:
      "Com a TIA Nutri, Escada do Comer e estratégias sensoriais — conteúdo de Andreza Dias (CRN 10418).",
    ctaTrial: "Começar 36 horas grátis",
    ctaPlans: "Ver planos",
    login: "Entrar",
    start: "Começar",
    authorTitle: "Conteúdo profissional",
    focus: "Foco",
    focusTitle: "Seletividade alimentar no TEA e no TDAH",
    plans: "Planos",
    plansTitle: "Escolha o acesso da família",
    footerEdu: "Conteúdo educativo. Não substitui consulta individualizada.",
    privacy: "Privacidade / LGPD",
  },
  en: {
    brand: "EloAlimentar",
    tagline: "Clear support for food selectivity in autism and ADHD",
    support:
      "With TIA Nutri, the Eating Ladder and sensory strategies — content by Andreza Dias (CRN 10418).",
    ctaTrial: "Start 36-hour free trial",
    ctaPlans: "See plans",
    login: "Sign in",
    start: "Get started",
    authorTitle: "Professional content",
    focus: "Focus",
    focusTitle: "Food selectivity in autism and ADHD",
    plans: "Plans",
    plansTitle: "Choose access for your family",
    footerEdu: "Educational content. Does not replace individualized care.",
    privacy: "Privacy",
  },
  es: {
    brand: "EloAlimentar",
    tagline: "Apoyo claro para la selectividad alimentaria en TEA y TDAH",
    support:
      "Con TIA Nutri, la Escalera del Comer y estrategias sensoriales — contenido de Andreza Dias (CRN 10418).",
    ctaTrial: "Empezar 36 horas gratis",
    ctaPlans: "Ver planes",
    login: "Entrar",
    start: "Empezar",
    authorTitle: "Contenido profesional",
    focus: "Enfoque",
    focusTitle: "Selectividad alimentaria en TEA y TDAH",
    plans: "Planes",
    plansTitle: "Elige el acceso de tu familia",
    footerEdu: "Contenido educativo. No sustituye la consulta individualizada.",
    privacy: "Privacidad / LGPD",
  },
} as const;

export type DictKey = keyof typeof dict.pt;

export function t(locale: Locale, key: DictKey): string {
  return dict[locale][key] || dict.pt[key];
}

export function parseLocale(raw?: string | null): Locale {
  if (raw === "en" || raw === "es" || raw === "pt") return raw;
  return "pt";
}
