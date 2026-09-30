import Link from "next/link";
import { cookies } from "next/headers";
import { AutismRibbon } from "@/components/autism-ribbon";
import { PlanCards } from "@/components/plan-cards";
import { NeuroSymbols } from "@/components/neuro-symbols";
import { LOCALES, parseLocale, t } from "@/lib/i18n";

export default async function HomePage() {
  const jar = await cookies();
  const locale = parseLocale(jar.get("elo_locale")?.value);

  return (
    <main>
      <div className="tea-ribbon h-1 w-full" aria-hidden />

      <section className="hero-shell relative min-h-[100svh]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          aria-hidden
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a6bb5' fill-opacity='0.07'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        <div className="container-page relative flex min-h-[100svh] flex-col px-[var(--space-page)] pb-10 pt-5">
          <header className="rise-in flex flex-wrap items-center justify-between gap-3 py-2">
            <div className="flex items-center gap-2.5">
              <AutismRibbon size={40} />
              <p className="font-[family-name:var(--font-display)] text-[clamp(1.6rem,4vw,2.1rem)] font-bold tracking-tight text-[var(--brand)]">
                {t(locale, "brand")}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <form action="/api/locale" method="post" className="flex gap-1">
                <input type="hidden" name="next" value="/" />
                {LOCALES.map((l) => (
                  <button
                    key={l.id}
                    type="submit"
                    name="locale"
                    value={l.id}
                    className={`rounded-md px-2 py-1 text-[11px] font-bold ${
                      locale === l.id
                        ? "bg-[var(--brand)] text-white"
                        : "bg-white/80 text-[var(--muted)]"
                    }`}
                  >
                    {l.id.toUpperCase()}
                  </button>
                ))}
              </form>
              <Link
                href="/login"
                className="min-h-11 px-3 py-2 text-sm font-semibold text-[var(--brand-deep)]"
              >
                {t(locale, "login")}
              </Link>
              <Link href="/register" className="btn btn-secondary !min-h-11 !px-4 !py-2 text-sm">
                {t(locale, "start")}
              </Link>
            </div>
          </header>

          <div className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-4">
            <div className="rise-in-delay max-w-xl">
              <p className="font-[family-name:var(--font-display)] text-[var(--text-fluid-xl)] font-bold text-[var(--brand)]">
                {t(locale, "brand")}
              </p>
              <h1 className="display mt-3 text-[clamp(1.45rem,2.8vw+0.6rem,2.15rem)] font-semibold text-[var(--ink-soft)]">
                {t(locale, "tagline")}
              </h1>
              <p className="mt-4 max-w-md text-[var(--text-fluid-md)] text-[var(--muted)]">
                {t(locale, "support")}
              </p>
              <div className="rise-in-delay-2 mt-8 flex flex-wrap gap-3">
                <Link href="/register" className="btn btn-primary min-h-12 px-6">
                  {t(locale, "ctaTrial")}
                </Link>
                <a href="#planos" className="btn btn-ghost min-h-12 px-6">
                  {t(locale, "ctaPlans")}
                </a>
              </div>
            </div>

            <div
              className="rise-in-delay-2 relative min-h-[42vw] overflow-hidden rounded-[var(--radius-lg)] border border-white/50 shadow-[var(--shadow-soft)] sm:min-h-[280px] lg:min-h-[420px]"
              aria-hidden
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(155deg, #1a6bb5 0%, #3d8ad4 35%, #d4920f 70%, #3d9a2e 100%)",
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
                <AutismRibbon size={88} className="reel-bob drop-shadow-md" />
                <p className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight sm:text-3xl">
                  TIA Nutri
                </p>
                <p className="mt-1 text-sm font-medium text-white/90">Laço do autismo · TEA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="autoridade" className="section-pad">
        <div className="container-page">
          <div className="author-card p-6 sm:p-8">
            <p className="eyebrow">{t(locale, "authorTitle")}</p>
            <h2 className="display mt-2 text-[var(--text-fluid-lg)]">Andreza Dias · CRN 10418</h2>
            <p className="mt-3 max-w-3xl text-[var(--muted)]">{t(locale, "footerEdu")}</p>
          </div>
        </div>
      </section>

      <section className="section-pad border-y border-[var(--line)] bg-[color-mix(in_oklab,var(--brand-soft)_55%,white)]">
        <div className="container-page">
          <p className="eyebrow">{t(locale, "focus")}</p>
          <h2 className="display mt-2 text-[var(--text-fluid-lg)]">{t(locale, "focusTitle")}</h2>
        </div>
      </section>

      <NeuroSymbols />

      <section id="planos" className="section-pad bg-[color-mix(in_oklab,var(--bg-soft)_70%,white)]">
        <div className="container-page">
          <p className="eyebrow">{t(locale, "plans")}</p>
          <h2 className="display mt-2 mb-8 text-[var(--text-fluid-lg)]">{t(locale, "plansTitle")}</h2>
          <PlanCards />
        </div>
      </section>

      <footer className="border-t border-[var(--line)] px-[var(--space-page)] py-10 text-sm text-[var(--muted)]">
        <div className="container-page flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--brand)]">
            {t(locale, "brand")}
          </p>
          <p className="max-w-sm text-xs sm:text-sm">{t(locale, "footerEdu")}</p>
          <Link href="/privacidade" className="font-semibold text-[var(--brand)]">
            {t(locale, "privacy")}
          </Link>
        </div>
      </footer>
    </main>
  );
}
