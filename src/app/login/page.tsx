"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: fd.get("email"),
        password: fd.get("password"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Falha no login");
      return;
    }
    router.push(data.role === "ADMIN" ? "/admin" : "/app");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-[100svh] max-w-md flex-col justify-center px-5 py-10">
      <Link href="/" className="mb-6 text-sm font-bold text-[var(--brand)]">
        ← EloAlimentar
      </Link>
      <h1 className="display text-3xl font-bold">
        Entrar
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Demo: mae@demo.com / demo1234
      </p>
      <form onSubmit={onSubmit} className="card mt-6 space-y-4 p-5">
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
          <input className="input" id="password" name="password" type="password" required />
        </div>
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
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
