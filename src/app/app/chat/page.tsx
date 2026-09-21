"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Child = { id: string; name: string };
type Message = { id: string; role: string; content: string };
type Conversation = { id: string; title: string; childId: string | null };

export default function ChatPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [childId, setChildId] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedChild = useMemo(
    () => children.find((c) => c.id === childId),
    [children, childId]
  );

  useEffect(() => {
    fetch("/api/children")
      .then((r) => r.json())
      .then((d) => {
        setChildren(d.children || []);
        if (d.children?.[0]) setChildId(d.children[0].id);
      });
  }, []);

  useEffect(() => {
    if (!childId) return;
    fetch(`/api/chat?childId=${childId}`)
      .then((r) => r.json())
      .then((d) => setConversations(d.conversations || []));
  }, [childId]);

  async function ensureConversation() {
    if (conversationId) return conversationId;
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    const res = await fetch(`/api/chat/messages?id=${id}`);
    const data = await res.json();
    if (res.ok) setMessages(data.conversation.messages || []);
  }

  async function send(e: FormEvent) {
    e.preventDefault();
    if (!text.trim() || !childId) return;
    setLoading(true);
    setError("");
    try {
      const id = await ensureConversation();
      const optimistic: Message = { id: "tmp", role: "user", content: text };
      setMessages((m) => [...m, optimistic]);
      const content = text;
      setText("");
      const res = await fetch("/api/chat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: id, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro");
      const detail = await fetch(`/api/chat/messages?id=${id}`);
      const full = await detail.json();
      setMessages(full.conversation.messages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] flex-col gap-4">
      <div>
        <h1 className="display text-3xl font-bold">
          TIA Nutri
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Sua assistente nutricional · respostas só sobre o perfil ativo · sem doses · sem diagnóstico
        </p>
      </div>

      <div className="grid gap-2">
        <label className="label">Criança ativa</label>
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
      </div>

      {conversations.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto">
          <button
            className="chip whitespace-nowrap"
            onClick={() => {
              setConversationId("");
              setMessages([]);
            }}
          >
            Nova
          </button>
          {conversations.map((c) => (
            <button key={c.id} className="chip whitespace-nowrap" onClick={() => openConversation(c.id)}>
              {c.title}
            </button>
          ))}
        </div>
      ) : null}

      <div className="card flex min-h-80 flex-1 flex-col gap-3 overflow-y-auto p-4">
        {selectedChild ? (
          <p className="text-xs font-bold text-[var(--brand)]">Contexto: {selectedChild.name}</p>
        ) : (
          <p className="text-sm text-[var(--muted)]">Cadastre uma criança para conversar.</p>
        )}
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
      </div>

      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

      <form onSubmit={send} className="flex gap-2">
        <input
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Pergunte sobre seletividade, sinais, escada..."
          disabled={!childId || loading}
        />
        <button className="btn btn-primary" disabled={loading || !childId}>
          {loading ? "..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}
