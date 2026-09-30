import Link from "next/link";
import { EXECUTIVE_FEEDING } from "@/lib/executive-functions";

export default function FuncoesExecutivasPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="chip w-fit">Família · educativo</p>
        <h1 className="display mt-2 text-3xl font-bold">Funções executivas da alimentação</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Imagens-conceito e dicas práticas para planejar, iniciar e permanecer na refeição — sem
          pressão. Ideal para TEA/TDAH e seletividade.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {EXECUTIVE_FEEDING.map((card) => (
          <article
            key={card.id}
            className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm"
          >
            <div
              className="flex items-center gap-3 px-4 py-4"
              style={{ background: card.bg, color: card.color }}
            >
              <span className="text-4xl" aria-hidden>
                {card.emoji}
              </span>
              <div>
                <h2 className="text-lg font-bold">{card.title}</h2>
                <p className="text-sm opacity-90">{card.short}</p>
              </div>
            </div>
            <ul className="space-y-2 px-4 py-3 text-sm">
              {card.tips.map((t) => (
                <li key={t} className="flex gap-2">
                  <span style={{ color: card.color }}>▸</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <p className="text-sm text-[var(--muted)]">
        Quer aplicar isso à mesa? Pergunte à{" "}
        <Link href="/app/chat" className="font-bold text-[var(--brand)]">
          TIA Nutri
        </Link>{" "}
        ou registre o degrau na{" "}
        <Link href="/app/escada" className="font-bold text-[var(--brand)]">
          Escada do Comer
        </Link>
        .
      </p>
    </div>
  );
}
