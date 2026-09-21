"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type AdminData = {
  users: { id: string; name: string; email: string; role: string; plan: string }[];
  chunks: { id: string; title: string; category: string; content: string }[];
};

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    const res = await fetch("/api/admin");
    const d = await res.json();
    if (!res.ok) {
      setError(d.error || "Acesso negado");
      return;
    }
    setData(d);
  }

  useEffect(() => {
    load();
  }, []);

  async function saveChunk(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fd.get("title"),
        category: fd.get("category"),
        content: fd.get("content"),
        tags: String(fd.get("tags") || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    });
    const d = await res.json();
    if (!res.ok) {
      setMsg(d.error || "Erro");
      return;
    }
    setMsg("Conteúdo salvo na biblioteca RAG.");
    (e.target as HTMLFormElement).reset();
    await load();
  }

  async function removeChunk(id: string) {
    await fetch(`/api/admin?id=${id}`, { method: "DELETE" });
    await load();
  }

  if (error) {
    return (
      <main className="mx-auto max-w-lg px-5 py-10">
        <p className="text-[var(--danger)]">{error}</p>
        <Link href="/login" className="btn btn-primary mt-4">
          Login admin
        </Link>
      </main>
    );
  }

  if (!data) return <main className="p-10">Carregando...</main>;

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-5 py-8">
      <div className="flex items-center justify-between">
        <h1 className="display text-3xl font-bold">
          Admin
        </h1>
        <Link href="/app" className="btn btn-ghost">
          App
        </Link>
      </div>

      <section className="card p-4">
        <h2 className="font-bold">Usuários ({data.users.length})</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {data.users.map((u) => (
            <li key={u.id} className="flex justify-between gap-2 border-b border-[var(--line)] py-2">
              <span>
                {u.name} · {u.email}
              </span>
              <span className="chip">
                {u.role}/{u.plan}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card space-y-3 p-4">
        <h2 className="font-bold">Biblioteca RAG</h2>
        {msg ? <p className="text-sm text-[var(--ok)]">{msg}</p> : null}
        <form onSubmit={saveChunk} className="space-y-2">
          <input className="input" name="title" placeholder="Título" required />
          <input className="input" name="category" placeholder="Categoria" required />
          <input className="input" name="tags" placeholder="tags, separadas" />
          <textarea className="input min-h-28" name="content" placeholder="Conteúdo" required />
          <button className="btn btn-primary">Publicar trecho</button>
        </form>
        <div className="space-y-2 pt-2">
          {data.chunks.map((c) => (
            <div key={c.id} className="rounded-xl border border-[var(--line)] p-3 text-sm">
              <div className="flex justify-between gap-2">
                <strong>
                  [{c.category}] {c.title}
                </strong>
                <button className="chip" onClick={() => removeChunk(c.id)}>
                  Excluir
                </button>
              </div>
              <p className="mt-1 text-[var(--muted)] line-clamp-3">{c.content}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
