import { cookies } from "next/headers";

export type AppMode = "family" | "pro";

const COOKIE = "elo_app_mode";

export async function getAppMode(): Promise<AppMode> {
  const jar = await cookies();
  const v = jar.get(COOKIE)?.value;
  return v === "pro" ? "pro" : "family";
}

export async function setAppMode(mode: AppMode) {
  const jar = await cookies();
  jar.set(COOKIE, mode, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
