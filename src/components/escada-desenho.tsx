"use client";

import { ESCADA_STEPS } from "@/lib/plans";

type Props = {
  currentStep?: number;
  focusStep?: number;
  foodName?: string;
  onSelectStep?: (step: number) => void;
  disabled?: boolean;
  size?: "full" | "compact";
  className?: string;
};

function stepEmoji(step: number): string {
  if (step <= 2) return "🏠";
  if (step <= 4) return "👀";
  if (step <= 6) return "👃";
  if (step <= 9) return "✋";
  if (step <= 12) return "👄";
  if (step <= 16) return "🦷";
  if (step <= 22) return "🥄";
  if (step <= 25) return "🍽️";
  return "🎁";
}

function plankClass(current: boolean, focused: boolean, reached: boolean) {
  if (current || focused) return "bg-gradient-to-b from-[#ffe082] to-[#f5a623] border-[#c48a10]";
  if (reached) return "bg-gradient-to-b from-[#9fd4f5] to-[#3d8ad4] border-[#1a6bb5]";
  return "bg-gradient-to-b from-[#f8ecd4] to-[#d9b88a] border-[#b8955a]";
}

/**
 * Escada do Comer em desenho — cartaz infantil com degraus clicáveis (1–26).
 */
export function EscadaDesenho({
  currentStep = 0,
  focusStep,
  foodName,
  onSelectStep,
  disabled,
  size = "full",
  className = "",
}: Props) {
  const reversed = [...ESCADA_STEPS].reverse();
  const interactive = Boolean(onSelectStep);

  return (
    <div
      className={`escada-desenho relative overflow-hidden rounded-[1.25rem] border-2 border-[#7eb3e0] ${className}`}
      style={{
        background:
          "linear-gradient(180deg, #b8dff8 0%, #e8f4fc 28%, #fff8e8 62%, #e8f5d8 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute right-4 top-3 h-14 w-14 rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 35%, #ffe9a0, #f5c542 55%, #e8a317)",
            boxShadow: "0 0 0 6px rgba(255,220,120,0.35)",
          }}
        />
        <div className="absolute left-3 top-8 h-7 w-14 rounded-full bg-white/80" />
        <div className="absolute left-10 top-6 h-6 w-10 rounded-full bg-white/70" />
        <div className="absolute right-20 top-16 h-5 w-12 rounded-full bg-white/75" />
        <div
          className="absolute bottom-0 left-0 right-0 h-10"
          style={{
            background: "linear-gradient(180deg, transparent, #b8d96a 20%, #7cb342 100%)",
          }}
        />
      </div>

      <div className={`relative z-[1] ${size === "compact" ? "p-3" : "p-4 sm:p-5"}`}>
        <div className="mb-3 text-center">
          <p className="font-[family-name:var(--font-display)] text-lg font-bold text-[#0d4a8a] sm:text-xl">
            Escada do Comer
          </p>
          <p className="text-xs font-semibold text-[#1a6bb5]">
            {foodName ? `Alimento: ${foodName}` : "Desenho para sessão · degraus 1 → 26"}
          </p>
        </div>

        <ol className="mx-auto flex max-w-md list-none flex-col gap-0.5">
          {reversed.map((s) => {
            const reached = currentStep >= s.step;
            const current = currentStep === s.step;
            const focused = focusStep === s.step;
            const widthPct = 54 + ((26 - s.step) / 25) * 46;
            const ring = current
              ? "ring-2 ring-[#f5c542]"
              : focused
                ? "ring-2 ring-[#5BA3E0]"
                : "";

            const inner = (
              <>
                <span
                  className="pointer-events-none absolute inset-x-3 top-1/2 h-px -translate-y-2 bg-black/10"
                  aria-hidden
                />
                <span
                  className={`relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black text-white shadow ${
                    current || focused
                      ? "bg-[#c48a10]"
                      : reached
                        ? "bg-[#0d4a8a]"
                        : "bg-[#8b6914]"
                  }`}
                >
                  {s.step}
                </span>
                <span className="relative z-[1] min-w-0 flex-1">
                  <span className="block truncate text-[11px] font-extrabold leading-tight text-[#14212b] sm:text-xs">
                    <span className="mr-1" aria-hidden>
                      {stepEmoji(s.step)}
                    </span>
                    {s.title}
                  </span>
                  {size === "full" ? (
                    <span className="block truncate text-[10px] font-medium text-[#3d4a55]/90">
                      {s.description}
                    </span>
                  ) : null}
                  {current ? (
                    <span className="mt-0.5 block text-[10px] font-bold text-[#8a5a00]">
                      ★ Você está aqui
                      {foodName ? ` · ${foodName}` : ""}
                    </span>
                  ) : null}
                </span>
                {s.step === 26 ? (
                  <span className="relative z-[1] text-lg" aria-hidden>
                    🏆
                  </span>
                ) : null}
              </>
            );

            const shellClass = `relative flex items-center gap-2 rounded-xl border-2 px-2 py-1.5 text-left shadow-sm ${plankClass(current, focused, reached)} ${ring}`;

            return (
              <li key={s.step} className="flex justify-center">
                {interactive ? (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelectStep?.(s.step)}
                    aria-label={`Degrau ${s.step}: ${s.title}`}
                    className={`${shellClass} cursor-pointer transition active:scale-[0.98] disabled:opacity-60`}
                    style={{
                      width: `${widthPct}%`,
                      minWidth: size === "compact" ? "11rem" : "14rem",
                    }}
                  >
                    {inner}
                  </button>
                ) : (
                  <div
                    className={shellClass}
                    style={{
                      width: `${widthPct}%`,
                      minWidth: size === "compact" ? "11rem" : "14rem",
                    }}
                  >
                    {inner}
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-3 flex items-end justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-3xl" aria-hidden>
              🧒
            </span>
            <p className="max-w-[10rem] text-[10px] font-semibold leading-snug text-[#0d4a8a]">
              Sem pressão. Um degrauzinho por vez.
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl" aria-hidden>
              🥗
            </span>
            <p className="text-[10px] font-bold text-[#3d9a2e]">No topo: comer com calma</p>
          </div>
        </div>
      </div>
    </div>
  );
}
