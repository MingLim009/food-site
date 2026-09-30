import type { PlanTier } from "./types";
import { PLANS, getPlan } from "./plans";

/** Checkout Monetizze — configure via .env (não commitar senhas). */
export function getMonetizzeCheckoutUrl(tier: PlanTier): string | null {
  const map: Record<string, string | undefined> = {
    BASIC: process.env.MONETIZZE_CHECKOUT_BASIC,
    PREMIUM: process.env.MONETIZZE_CHECKOUT_PREMIUM,
    GOLD: process.env.MONETIZZE_CHECKOUT_GOLD,
  };
  const url = map[tier]?.trim();
  return url || null;
}

export function mapMonetizzeProductToTier(productCode: string): PlanTier | null {
  const basic = process.env.MONETIZZE_PRODUCT_BASIC || "";
  const premium = process.env.MONETIZZE_PRODUCT_PREMIUM || "";
  const gold = process.env.MONETIZZE_PRODUCT_GOLD || "";
  const code = String(productCode).trim();
  if (basic && code === basic) return "BASIC";
  if (premium && code === premium) return "PREMIUM";
  if (gold && code === gold) return "GOLD";

  // fallback by name keywords in env map JSON optional
  const byName = process.env.MONETIZZE_PRODUCT_MAP;
  if (byName) {
    try {
      const parsed = JSON.parse(byName) as Record<string, PlanTier>;
      if (parsed[code]) return parsed[code];
    } catch {
      /* ignore */
    }
  }
  return null;
}

/** Status Monetizze: 2 = Finalizada (paga). */
export function isMonetizzePaidStatus(status: string | number): boolean {
  const s = String(status).toLowerCase();
  return s === "2" || s === "finalizada" || s === "aprovada" || s === "pago";
}

export function plansWithCheckout() {
  return PLANS.map((p) => ({
    ...p,
    checkoutUrl: getMonetizzeCheckoutUrl(p.tier),
  }));
}

export { getPlan };
