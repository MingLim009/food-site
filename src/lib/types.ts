export type Role = "PARENT" | "ADMIN";
export type PlanTier = "NONE" | "TRIAL" | "BASIC" | "PREMIUM" | "GOLD";

export const PLAN_RANK: Record<PlanTier, number> = {
  NONE: 0,
  TRIAL: 2,
  BASIC: 1,
  PREMIUM: 2,
  GOLD: 3,
};

export function planMeetsMinimum(userPlan: string, minPlan: string): boolean {
  const u = (userPlan as PlanTier) in PLAN_RANK ? (userPlan as PlanTier) : "NONE";
  const m = (minPlan as PlanTier) in PLAN_RANK ? (minPlan as PlanTier) : "PREMIUM";
  return PLAN_RANK[u] >= PLAN_RANK[m];
}
