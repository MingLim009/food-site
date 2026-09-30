import {
  Brain,
  Ear,
  HeartHandshake,
  Infinity,
  Puzzle,
  Sparkles,
  Users,
  Waves,
} from "lucide-react";

const SYMBOLS = [
  {
    title: "TEA",
    subtitle: "Espectro autista",
    icon: Infinity,
    color: "#1e6bb8",
    bg: "#d9e9fb",
  },
  {
    title: "TDAH",
    subtitle: "Atenção e regulação",
    icon: Sparkles,
    color: "#e8a317",
    bg: "#fff3d6",
  },
  {
    title: "Seletividade",
    subtitle: "Orientações no TEA e TDAH",
    icon: Puzzle,
    color: "#1e6bb8",
    bg: "#d9e9fb",
  },
  {
    title: "Sensorial",
    subtitle: "Processamento TPS",
    icon: Ear,
    color: "#0d4a8a",
    bg: "#e8f0fa",
  },
  {
    title: "Neurodiversidade",
    subtitle: "Respeito ao ritmo",
    icon: Brain,
    color: "#1e6bb8",
    bg: "#d9e9fb",
  },
  {
    title: "Família",
    subtitle: "Rede de cuidado",
    icon: Users,
    color: "#c48a10",
    bg: "#fff3d6",
  },
  {
    title: "Inclusão",
    subtitle: "Sem pressão à mesa",
    icon: HeartHandshake,
    color: "#155a9c",
    bg: "#e8f1fb",
  },
  {
    title: "Regulação",
    subtitle: "Ambiente previsível",
    icon: Waves,
    color: "#1e6bb8",
    bg: "#d9e9fb",
  },
];

export function NeuroSymbols() {
  return (
    <section id="neuro" className="section-pad">
      <div className="container-page">
        <p className="eyebrow">Neurodivergência</p>
        <h2 className="display mt-2 text-[var(--text-fluid-lg)]">
          Identidade visual em azul e dourado
        </h2>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          Símbolos para acolher famílias na seletividade alimentar no TEA e no TDAH — com linguagem
          clara e respeitosa.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {SYMBOLS.map(({ title, subtitle, icon: Icon, color, bg }) => (
            <div
              key={title}
              className="flex flex-col items-center rounded-[var(--radius)] border border-[var(--line)] bg-white/85 p-5 text-center"
            >
              <span
                className="mb-3 flex h-14 w-14 items-center justify-center rounded-[0.9rem]"
                style={{ background: bg, color }}
                aria-hidden
              >
                <Icon size={28} strokeWidth={2.1} />
              </span>
              <p className="font-bold text-[var(--ink)]">{title}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
