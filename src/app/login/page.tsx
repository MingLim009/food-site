import Link from "next/link";
import { AutismRibbon } from "@/components/autism-ribbon";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <main className="hero-shell mx-auto flex min-h-[100svh] w-full max-w-lg flex-col justify-center px-[var(--space-page)] py-10">
      <div className="tea-ribbon mb-6 h-1 w-full rounded-full" aria-hidden />
      <div className="mb-6 flex flex-col items-center text-center">
        <AutismRibbon size={88} className="reel-bob" />
        <p className="mt-2 text-xs font-semibold tracking-wide text-[var(--brand)]">
          Laço do autismo (TEA)
        </p>
      </div>
      <Link href="/" className="mb-4 text-sm font-bold text-[var(--brand)]">
        ← EloAlimentar
      </Link>
      <h1 className="display text-[var(--text-fluid-lg)]">Entrar</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Demo: <strong>mae@demo.com</strong> / <strong>demo1234</strong>
      </p>
      <form
        action="/api/auth/login-form"
        method="post"
        className="card mt-6 space-y-4 p-5 sm:p-6"
      >
        <div>
          <label className="label" htmlFor="email">
            E-mail
          </label>
          <input
            className="input"
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            defaultValue="mae@demo.com"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="password">
            Senha
          </label>
          <input
            className="input"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            defaultValue="demo1234"
            required
          />
        </div>
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        <button className="btn btn-primary w-full min-h-12" type="submit">
          Entrar
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-[var(--muted)]">
        Não tem conta?{" "}
        <Link href="/register" className="font-bold text-[var(--brand)]">
          Criar conta
        </Link>
      </p>
    </main>
  );
}
