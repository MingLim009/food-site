import Link from "next/link";
import { PlanCards } from "@/components/plan-cards";

export default function HomePage() {
  return (
    <main>
      <section className="hero-shell relative min-h-[100svh] overflow-hidden px-5 pb-16 pt-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-40"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><path d='M0 60h120M60 0v120' stroke='%23ecf2ef14' stroke-width='1'/></svg>\")",
            backgroundSize: "72px 72px",
            maskImage: "linear-gradient(180deg, black 35%, transparent 92%)",
          }}
        />
        <div className="mx-auto flex min-h-[85svh] max-w-3xl flex-col justify-between">
          <header className="flex items-center justify-between">
            <div>
              <p className="display text-2xl font-bold tracking-tight text-[var(--ink)]">
                EloAlimentar
              </p>
              <p className="text-xs font-semibold text-[var(--muted)]">com TIA Nutri</p>
            </div>
            <Link href="/login" className="btn btn-ghost">
              Entrar
            </Link>
          </header>

          <div className="max-w-xl py-10">
            <p className="mb-3 inline-flex rounded-xl border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-[var(--brand)]">
              Apoio familiar · seletividade · TEA · TDAH
            </p>
            <h1 className="display text-4xl font-bold text-[var(--ink)] sm:text-5xl">
              Apoio calmo para a seletividade alimentar
            </h1>
            <p className="mt-4 text-lg font-medium leading-relaxed text-[var(--muted)]">
              A TIA Nutri guia famílias com biblioteca especializada, Escada do Comer e
              limites clínicos claros — no ritmo da criança.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className="btn btn-primary">
                Começar agora
              </Link>
              <a href="#planos" className="btn btn-ghost">
                Ver planos
              </a>
            </div>
          </div>

          <p className="text-xs font-medium text-[var(--muted)]">
            Conteúdo educativo. Não substitui nutricionista, médico, TO ou fonoaudiólogo.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14">
        <h2 className="display text-3xl font-bold text-[var(--ink)]">O que a plataforma oferece</h2>
        <p className="mt-2 max-w-2xl font-medium text-[var(--muted)]">
          Chat com a TIA Nutri, perfis infantis, questionário inicial, receitas sensoriais,
          encadeamento alimentar e Escada do Comer — com proteção LGPD.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            ["TIA Nutri com guardrails", "Respostas só sobre a criança cadastrada, sem doses nem diagnóstico."],
            ["Escada do Comer", "Do passo 1 (tolerar) ao 26 (mastigar e comer), alimento a alimento."],
            ["Rede de cuidado", "Orientação para buscar TO (TPS), fono (oral-motor) e nutricionista."],
            ["Planos flexíveis", "Básico, Premium e Gold — comece pelo essencial no celular."],
          ].map(([t, d]) => (
            <div key={t} className="card p-5">
              <h3 className="display text-lg font-bold">{t}</h3>
              <p className="mt-2 text-sm font-medium text-[var(--muted-strong)]">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="planos" className="mx-auto max-w-5xl px-5 pb-20">
        <h2 className="display mb-6 text-3xl font-bold text-[var(--ink)]">Planos</h2>
        <PlanCards />
      </section>
    </main>
  );
}
