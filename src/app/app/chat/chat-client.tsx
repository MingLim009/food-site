"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Child = { id: string; name: string };
type Message = { id: string; role: string; content: string };
type Conversation = { id: string; title: string; childId: string | null };

const SUGGESTIONS = [
  "Meu filho recusa alimentos novos. Por onde começar?",
  "O que são funções executivas da alimentação?",
  "Como usar a Escada do Comer sem pressão?",
  "Ele não consegue ficar à mesa. Como ajudar a atenção?",
];

type Props = {
  initialChildren: Child[];
  initialChildId?: string;
  initialConversationId?: string;
  initialMessages?: Message[];
  formError?: string;
};

export function ChatClient({
  initialChildren,
  initialChildId = "",
  initialConversationId = "",
  initialMessages = [],
  formError,
}: Props) {
  const [children] = useState<Child[]>(initialChildren);
  const [childId, setChildId] = useState(initialChildId || initialChildren[0]?.id || "");
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    formError === "empty"
      ? "Digite uma pergunta."
      : formError === "child"
        ? "Selecione uma criança."
        : ""
  );

  const selectedChild = useMemo(
    () => children.find((c) => c.id === childId),
    [children, childId]
  );

  useEffect(() => {
    if (!childId) return;
    fetch(`/api/chat?childId=${childId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setConversations(d.conversations || []))
      .catch(() => setConversations([]));
  }, [childId]);

  async function ensureConversation() {
    if (conversationId) return conversationId;
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ childId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Falha ao criar conversa");
    setConversationId(data.conversation.id);
    setConversations((prev) => [data.conversation, ...prev]);
    return data.conversation.id as string;
  }

  async function openConversation(id: string) {
    setConversationId(id);
    const res = await fetch(`/api/chat/messages?id=${id}`, { credentials: "include" });
    const data = await res.json();
    if (res.ok) setMessages(data.conversation.messages || []);
  }

  async function sendMessage(content: string) {
    if (!content.trim() || !childId || loading) return;
    setLoading(true);
    setError("");
    try {
      const id = await ensureConversation();
      setMessages((m) => [...m, { id: "tmp", role: "user", content }]);
      setText("");
      const res = await fetch("/api/chat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ conversationId: id, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro");
      if (Array.isArray(data.messages)) {
        setMessages(data.messages);
      } else if (data.message) {
        setMessages((m) => [
          ...m.filter((x) => x.id !== "tmp"),
          { id: "u-" + Date.now(), role: "user", content },
          data.message,
        ]);
      }
    } catch (err) {
      // Fallback: plain form POST works without client JS quirks
      setError(
        err instanceof Error
          ? err.message + " — use o botão “Perguntar (modo simples)” abaixo."
          : "Erro"
      );
    } finally {
      setLoading(false);
    }
  }

  async function send(e: FormEvent) {
    e.preventDefault();
    await sendMessage(text);
  }

  return (
    <div className="flex min-h-[70vh] flex-col gap-4">
      <div>
        <h1 className="display text-3xl font-bold">Pergunte à TIA Nutri</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          A mãe pergunta e a IA responde automaticamente sobre o perfil da criança — sem doses e
          sem diagnóstico.
        </p>
      </div>

      <div className="grid gap-2">
        <label className="label">Criança ativa</label>
        {children.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            Cadastre uma criança em Perfis para conversar.
          </p>
        ) : (
          <select
            className="input"
            value={childId}
            onChange={(e) => {
              setChildId(e.target.value);
              setConversationId("");
              setMessages([]);
            }}
          >
            {children.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {conversations.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto">
          <button
            type="button"
            className="chip whitespace-nowrap"
            onClick={() => {
              setConversationId("");
              setMessages([]);
            }}
          >
            Nova
          </button>
          {conversations.map((c) => (
            <button
              key={c.id}
              type="button"
              className="chip whitespace-nowrap"
              onClick={() => openConversation(c.id)}
            >
              {c.title}
            </button>
          ))}
        </div>
      ) : null}

      <div className="card flex min-h-80 flex-1 flex-col gap-3 overflow-y-auto p-4">
        {selectedChild ? (
          <p className="text-xs font-bold text-[var(--brand)]">Contexto: {selectedChild.name}</p>
        ) : null}

        {messages.length === 0 && childId ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[var(--ink)]">
              Toque em uma pergunta pronta — a TIA Nutri responde na hora:
            </p>
            <div className="flex flex-col gap-2">
              {SUGGESTIONS.map((s) => (
                <form key={s} action="/api/chat/ask" method="post">
                  <input type="hidden" name="childId" value={childId} />
                  <input type="hidden" name="content" value={s} />
                  <button
                    type="submit"
                    className="w-full rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-3 text-left text-sm font-semibold text-[var(--brand-deep)] disabled:opacity-50"
                    disabled={!childId || loading}
                  >
                    {s}
                  </button>
                </form>
              ))}
            </div>
          </div>
        ) : null}

        {messages.map((m) => (
          <div
            key={m.id + m.content.slice(0, 12)}
            className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
              m.role === "user"
                ? "ml-auto bg-[var(--brand)] text-white"
                : "bg-[var(--brand-soft)] text-[var(--ink)]"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading ? (
          <p className="text-xs font-bold text-[var(--muted)]">TIA Nutri está respondendo...</p>
        ) : null}
      </div>

      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

      <form onSubmit={send} className="flex gap-2">
        <input
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite sua pergunta para a TIA Nutri..."
          disabled={!childId || loading}
        />
        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading || !childId || !text.trim()}
        >
          {loading ? "..." : "Perguntar"}
        </button>
      </form>

      {/* Reliable HTML POST fallback for Cloudflare tunnel */}
      <form action="/api/chat/ask" method="post" className="card space-y-3 p-4">
        <p className="text-xs font-bold text-[var(--muted)]">
          Modo simples (sempre funciona): escolha a criança, escreva e envie.
        </p>
        <select
          className="input"
          name="childId"
          defaultValue={childId}
          onChange={(e) => setChildId(e.target.value)}
          required
        >
          {children.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <textarea
          className="input min-h-24"
          name="content"
          placeholder="Ex.: Meu filho recusa alimentos novos. Por onde começar?"
          required
        />
        <button className="btn btn-secondary w-full" type="submit" disabled={!children.length}>
          Perguntar (modo simples)
        </button>
      </form>
    </div>
  );
}
