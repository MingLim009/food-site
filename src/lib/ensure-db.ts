import { copyFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

declare global {
  // eslint-disable-next-line no-var
  var __eloDbReady: boolean | undefined;
}

function dbPathFromUrl(url: string | undefined) {
  if (!url) return null;
  if (!url.startsWith("file:")) return null;
  const raw = url.slice("file:".length);
  if (raw.startsWith("/")) return raw;
  return path.join(process.cwd(), raw);
}

function findTemplate() {
  const candidates = [
    path.join(process.cwd(), "prisma", "seed.db"),
    path.join(__dirname, "..", "..", "prisma", "seed.db"),
    path.join("/var/task", "prisma", "seed.db"),
  ];
  return candidates.find((p) => existsSync(p)) ?? null;
}

/**
 * On Vercel, SQLite must live under /tmp (writable). We ship a seeded
 * prisma/seed.db and copy it once per cold start.
 */
export function ensureDatabase() {
  if (globalThis.__eloDbReady) return;

  const target = dbPathFromUrl(process.env.DATABASE_URL);
  const template = findTemplate();
  const isTmp =
    !!target && (target.startsWith("/tmp") || target.includes(`${path.sep}tmp${path.sep}`));

  if (isTmp && target && !existsSync(target) && template) {
    mkdirSync(path.dirname(target), { recursive: true });
    copyFileSync(template, target);
  }

  globalThis.__eloDbReady = true;
}
