"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    if (!fd.get("lgpd")) {
      setError("É necessário aceitar a política de privacidade (LGPD).");
      setLoading(false);
      return;
    }
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        password: fd.get("password"),
        lgpdAccepted: true,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Falha no cadastro");
      return;
    }
    router.push("/app/planos");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-[100svh] max-w-md flex-col justify-center px-5 py-10">
      <Link href="/" className="mb-6 text-sm font-bold text-[var(--brand)]">
        ← EloAlimentar
      </Link>
      <h1 className="display text-3xl font-bold">
        Criar conta
      </h1>
      <form onSubmit={onSubmit} className="card mt-6 space-y-4 p-5">
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
          <input className="input" id="password" name="password" type="password" minLength={6} required />
        </div>
        <label className="flex items-start gap-2 text-sm text-[var(--muted)]">
          <input type="checkbox" name="lgpd" className="mt-1" required />
          <span>
            Li e aceito a{" "}
            <Link href="/privacidade" className="font-bold text-[var(--brand)]">
              Política de Privacidade (LGPD)
            </Link>
            . Entendo que o conteúdo é educativo.
          </span>
        </label>
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Criando..." : "Criar conta"}
        </button>
      </form>
    </main>
  );
}
