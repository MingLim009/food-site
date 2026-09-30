import type { ReelBeat } from "@/lib/recipe-reel";

type Props = {
  title: string;
  beats: ReelBeat[];
  beatIdx: number;
  prevHref: string;
  nextHref: string;
  autoHref: string | null;
  pauseHref: string;
  liked: boolean;
  likeHref: string;
  recipeId: string;
};

/** Vertical Reels-style player: character + big text + bowl (HTML links, no JS needed). */
export function RecipeReelPlayer(props: Props) {
  const beat = props.beats[props.beatIdx] || props.beats[0];
  const total = props.beats.length;
  const idx = props.beatIdx;

  return (
    <div className="mx-auto w-full max-w-md">
      {props.autoHref ? (
        <meta httpEquiv="refresh" content={"3.5;url=" + props.autoHref} />
      ) : null}

      <div
        className="relative overflow-hidden rounded-3xl border border-black/10 shadow-lg"
        style={{
          aspectRatio: "9 / 16",
          maxHeight: "min(78vh, 640px)",
          background: beat.bg,
        }}
      >
        <div className="absolute inset-x-0 top-0 z-20 flex gap-1 px-3 pt-3">
          {props.beats.map((b, i) => (
            <div
              key={b.id}
              className="h-1 flex-1 overflow-hidden rounded-full"
              style={{ background: "rgba(0,0,0,0.15)" }}
            >
              <div
                className="h-full rounded-full bg-white"
                style={{
                  width: i < idx ? "100%" : i === idx ? "55%" : "0%",
                }}
              />
            </div>
          ))}
        </div>

        <a
          href={props.prevHref}
          className="absolute inset-y-0 left-0 z-10 w-1/3"
          aria-label="Cena anterior"
        >
          {" "}
        </a>
        <a
          href={props.nextHref}
          className="absolute inset-y-0 right-0 z-10 w-1/3"
          aria-label="Proxima cena"
        >
          {" "}
        </a>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-28 pt-14">
          <div
            className="absolute bottom-24 left-0 right-0 h-28"
            style={{
              background: "linear-gradient(to top, #c4a574, #e8d4a8)",
            }}
          />
          <div className="absolute bottom-24 left-0 right-0 h-2" style={{ background: "#a8885a" }} />

          <div className="relative z-10 mb-2 reel-bob">
            <ChefGirl />
          </div>

          <div className="relative z-20 -mt-2 flex flex-col items-center">
            <div className="text-4xl reel-pop">{beat.bowl}</div>
            <div className="relative mt-1 h-16 w-36">
              <div
                className="absolute inset-x-2 top-0 h-4 rounded-full"
                style={{ background: "#d0d5dc" }}
              />
              <div
                className="absolute inset-x-0 top-2 h-14 rounded-b-3xl rounded-t-lg shadow-md"
                style={{
                  background: "linear-gradient(to bottom, #eceff3, #b0b6c0)",
                }}
              />
              <div
                className="absolute inset-x-4 top-4 h-6 rounded-full"
                style={{ background: "rgba(255,255,255,0.5)" }}
              />
            </div>
          </div>

          <div
            className="absolute left-1/2 z-30 w-11/12 -translate-x-1/2 text-center"
            style={{ top: "38%" }}
          >
            <p
              className="reel-pop text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl"
              style={{
                textShadow:
                  "0 3px 0 rgba(0,0,0,.25), 0 8px 24px rgba(0,0,0,.2), -2px -2px 0 #2872c3, 2px 2px 0 #e85d4c",
              }}
            >
              {beat.bigText}
            </p>
            <p className="mx-auto mt-3 max-w-xs rounded-2xl bg-white/95 px-3 py-2 text-sm font-semibold text-[var(--ink)] shadow-md">
              {beat.line}
            </p>
          </div>
        </div>

        <div className="absolute bottom-36 right-2 z-20 flex flex-col items-center gap-3">
          <a
            href={props.likeHref}
            className="flex flex-col items-center rounded-full px-2 py-2 text-white"
            style={{ background: "rgba(0,0,0,0.25)" }}
          >
            <span className="text-2xl">{props.liked ? "❤️" : "🤍"}</span>
            <span className="text-[10px] font-bold">{props.liked ? "Curtido" : "Curtir"}</span>
          </a>
          <div
            className="flex flex-col items-center rounded-full px-2 py-2 text-white"
            style={{ background: "rgba(0,0,0,0.25)" }}
          >
            <span className="text-2xl">💬</span>
            <span className="text-[10px] font-bold">Dica</span>
          </div>
          <a
            href={props.nextHref}
            className="flex flex-col items-center rounded-full px-2 py-2 text-white"
            style={{ background: "rgba(0,0,0,0.25)" }}
          >
            <span className="text-2xl">➡️</span>
            <span className="text-[10px] font-bold">Prox.</span>
          </a>
        </div>

        <div
          className="absolute inset-x-0 bottom-0 z-20 px-4 pb-4 pt-10 text-white"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
          }}
        >
          <p className="text-xs font-bold opacity-90">@tia.nutri · EloAlimentar</p>
          <p className="mt-0.5 text-sm font-bold leading-snug">{props.title}</p>
          <p className="mt-1 text-[11px] opacity-90">
            Cena {idx + 1}/{total}
            {props.autoHref ? " · reproduzindo..." : ""}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <a href={props.prevHref} className="btn btn-ghost min-h-11">
          Anterior
        </a>
        {props.autoHref ? (
          <a href={props.pauseHref} className="btn btn-ghost min-h-11">
            Pausar
          </a>
        ) : (
          <a href={props.pauseHref} className="btn btn-primary min-h-11">
            Continuar
          </a>
        )}
        <a href={props.nextHref} className="btn btn-ghost min-h-11">
          Proxima
        </a>
      </div>
      <p className="mt-2 text-center text-[11px] text-[var(--muted)]">
        Toque na esquerda/direita da tela para mudar de cena · formato vertical interativo
      </p>
    </div>
  );
}

function ChefGirl() {
  return (
    <svg
      width="140"
      height="150"
      viewBox="0 0 140 150"
      aria-hidden
      className="drop-shadow-md"
    >
      <ellipse cx="70" cy="58" rx="42" ry="46" fill="#2b1a12" />
      <ellipse cx="70" cy="62" rx="32" ry="36" fill="#f0c2a0" />
      <path d="M38 55 Q70 28 102 55 Q70 48 38 55" fill="#1f140e" />
      <path
        d="M36 52 Q70 38 104 52"
        fill="none"
        stroke="#5cb85c"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <circle cx="52" cy="48" r="4" fill="#ff6b9d" />
      <circle cx="70" cy="44" r="4" fill="#ffd54f" />
      <circle cx="88" cy="48" r="4" fill="#ff6b9d" />
      <ellipse cx="58" cy="64" rx="6" ry="8" fill="#fff" />
      <ellipse cx="82" cy="64" rx="6" ry="8" fill="#fff" />
      <circle cx="59" cy="66" r="3.2" fill="#3e2723" />
      <circle cx="83" cy="66" r="3.2" fill="#3e2723" />
      <circle cx="60" cy="65" r="1" fill="#fff" />
      <circle cx="84" cy="65" r="1" fill="#fff" />
      <path
        d="M60 78 Q70 86 80 78"
        fill="none"
        stroke="#c62828"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M48 100 Q70 94 92 100 L98 148 L42 148 Z" fill="#fff" />
      <path d="M55 108 L85 108 L88 148 L52 148 Z" fill="#66bb6a" />
      <circle cx="70" cy="128" r="5" fill="#fff" opacity="0.7" />
      <path
        d="M48 110 Q28 120 32 138"
        fill="none"
        stroke="#f0c2a0"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M92 110 Q112 120 108 138"
        fill="none"
        stroke="#f0c2a0"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
}
