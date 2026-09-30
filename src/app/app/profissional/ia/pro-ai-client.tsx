"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Como estruturar uma primeira sessão de terapia alimentar?",
  "Quais materiais imprimir para a família nesta semana?",
  "Ideias de sessão focada em funções executivas à mesa",
  "Como registrar evolução na Escada do Comer?",
];

export function ProAiClient() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function ask(content: string) {
    if (!content.trim() || loading) return;
    setLoading(true);
    setError("");
    const nextUser: Msg = { role: "user", content };
    setMessages((m) => [...m, nextUser]);
    setText("");
    try {
      const res = await fetch("/api/profissional/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro");
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Link href="/app/profissional" className="text-sm font-bold text-[var(--brand)]">
        ← Área profissional
      </Link>
      <div>
        <p className="chip !bg-[var(--tea-gold)] !text-white w-fit">Gold · IA PRO</p>
        <h1 className="display mt-2 text-3xl font-bold">IA para dúvidas profissionais</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Tire dúvidas sobre condução de sessões, anamnese e materiais. Sem doses. A conduta
          clínica final é sua.
        </p>
      </div>

      <div className="card flex min-h-72 flex-col gap-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-semibold">Sugestões:</p>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                className="w-full rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-3 text-left text-sm font-semibold text-[var(--brand-deep)]"
                disabled={loading}
                onClick={() => ask(s)}
              >
                {s}
              </button>
            ))}
          </div>
        ) : null}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[92%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
              m.role === "user"
                ? "ml-auto bg-[var(--brand)] text-white"
                : "bg-[var(--tea-gold-soft)] text-[var(--ink)]"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading ? (
          <p className="text-xs font-bold text-[var(--muted)]">TIA Nutri PRO pensando...</p>
        ) : null}
      </div>

      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          ask(text);
        }}
        className="flex gap-2"
      >
        <input
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Sua dúvida profissional..."
          disabled={loading}
        />
        <button className="btn btn-primary" type="submit" disabled={loading || !text.trim()}>
          {loading ? "..." : "Perguntar"}
        </button>
      </form>
    </div>
  );
}
