"use client";

import { useMemo, useState } from "react";
import {
  JURIDICO_CLOSING,
  JURIDICO_META,
  JURIDICO_SECTIONS,
} from "@/lib/juridico-seletividade";

export function JuridicoClient() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const [sec, setSec] = useState<string>("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return JURIDICO_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (sec !== "all" && section.id !== sec) return false;
        if (!needle) return true;
        return (
          item.question.toLowerCase().includes(needle) ||
          item.answer.toLowerCase().includes(needle)
        );
      }),
    })).filter((s) => s.items.length > 0);
  }, [q, sec]);

  return (
    <div className="space-y-5">
      <div>
        <p className="chip w-fit">Conteúdo educativo · leis BR</p>
        <h1 className="display mt-2 text-3xl font-bold">{JURIDICO_META.title}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{JURIDICO_META.subtitle}</p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          {JURIDICO_META.author} · atualizado {JURIDICO_META.date}
        </p>
      </div>

      <div className="card space-y-2 border-l-4 border-l-[var(--warn)] p-4 text-sm">
        <p className="font-bold text-[#9a6b0a]">Aviso importante</p>
        <p className="text-[var(--muted)]">{JURIDICO_META.disclaimer}</p>
      </div>

      <div className="space-y-3">
        <input
          className="input"
          placeholder="Buscar pergunta (ex.: escola, PNAE, laudo, TDAH…)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`chip ${sec === "all" ? "!bg-[var(--brand)] !text-white" : ""}`}
            onClick={() => setSec("all")}
          >
            Todas
          </button>
          {JURIDICO_SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`chip ${sec === s.id ? "!bg-[var(--brand)] !text-white" : ""}`}
              onClick={() => setSec(s.id)}
            >
              {s.title.replace(/^\d+\.\s*/, "").slice(0, 28)}
              {s.title.replace(/^\d+\.\s*/, "").length > 28 ? "…" : ""}
            </button>
          ))}
        </div>
      </div>

      {filtered.map((section) => (
        <section key={section.id} className="space-y-3">
          <h2 className="font-bold text-[var(--brand-deep)]">{section.title}</h2>
          <div className="space-y-2">
            {section.items.map((item) => {
              const isOpen = open === item.n;
              return (
                <article key={item.n} className="card overflow-hidden p-0">
                  <button
                    type="button"
                    className="flex w-full items-start gap-3 px-4 py-3 text-left"
                    onClick={() => setOpen(isOpen ? null : item.n)}
                    aria-expanded={isOpen}
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-xs font-bold text-[var(--brand)]">
                      {item.n}
                    </span>
                    <span className="flex-1 text-sm font-bold leading-snug">{item.question}</span>
                    <span className="text-[var(--muted)]" aria-hidden>
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen ? (
                    <div className="space-y-3 border-t border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3">
                      <p className="text-sm leading-relaxed text-[var(--ink)]">{item.answer}</p>
                      <p className="text-xs font-semibold italic text-[var(--muted)]">
                        {JURIDICO_CLOSING}
                      </p>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      ))}

      {filtered.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">Nenhuma pergunta encontrada para “{q}”.</p>
      ) : null}
    </div>
  );
}
