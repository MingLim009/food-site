import Link from "next/link";
import { AutismRibbon } from "@/components/autism-ribbon";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function RegisterPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <main className="hero-shell mx-auto flex min-h-[100svh] w-full max-w-lg flex-col justify-center px-[var(--space-page)] py-10">
      <div className="mb-5 flex justify-center">
        <AutismRibbon size={64} />
      </div>
      <Link href="/" className="mb-4 text-sm font-bold text-[var(--brand)]">
        ← EloAlimentar
      </Link>
      <h1 className="display text-[var(--text-fluid-lg)]">Criar conta</h1>
      <form
        action="/api/auth/register-form"
        method="post"
        className="card mt-6 space-y-4 p-5 sm:p-6"
      >
        <div>
          <label className="label" htmlFor="name">
            Nome
          </label>
          <input className="input" id="name" name="name" required />
        </div>
        <div>
          <label className="label" htmlFor="email">
            E-mail
          </label>
          <input className="input" id="email" name="email" type="email" required />
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
            minLength={6}
            required
          />
        </div>
        <label className="flex items-start gap-2 text-sm text-[var(--muted)]">
          <input type="checkbox" name="lgpd" className="mt-1" value="on" required />
          <span>
            Li e aceito a{" "}
            <Link href="/privacidade" className="font-bold text-[var(--brand)]">
              Política de Privacidade (LGPD)
            </Link>
            . Entendo que o conteúdo é educativo.
          </span>
        </label>
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        <button className="btn btn-primary w-full" type="submit">
          Criar conta
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-[var(--muted)]">
        Já tem conta?{" "}
        <Link href="/login" className="font-bold text-[var(--brand)]">
          Entrar
        </Link>
      </p>
    </main>
  );
}
