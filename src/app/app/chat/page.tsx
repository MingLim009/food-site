import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canAccessFeature } from "@/lib/plans";
import { ChatMessageBubble } from "@/components/chat-message";
import { ChatVoiceControls, ClearChatButton } from "@/components/chat-voice";

const SUGGESTIONS = [
  "O que é seletividade alimentar?",
  "Por que provoca ânsia só de ver ou cheirar um alimento?",
  "Como começar um encadeamento alimentar? Me mostre com figuras",
  "Meu filho aceitou pastel de carne. Que cadeia posso testar? Com figuras",
  "Como usar a Escada do Comer sem pressão?",
  "Prêmios e obrigar a provar ajudam?",
  "TEA e seletividade: o que priorizar na mesa?",
  "TDAH e fuga da mesa: o que tentar primeiro?",
];

type Props = {
  searchParams: Promise<{ c?: string; error?: string; child?: string }>;
};

export default async function ChatPage({ searchParams }: Props) {
  let user;
  try {
    user = await requireUser();
  } catch {
    redirect("/login");
  }

  if (!canAccessFeature(user.plan, user.planExpiresAt, "ai")) {
    return (
      <div className="card space-y-3 p-5">
        <h1 className="text-2xl font-semibold">TIA Nutri</h1>
        <p className="text-sm text-[var(--muted)]">
          A TIA Nutri não está incluída no plano <strong>Básico</strong>. Disponível no teste
          grátis, no Médio (Premium) e no Gold.
        </p>
        <a href="/app/planos" className="btn btn-primary">
          Ver planos
        </a>
      </div>
    );
  }

  const sp = await searchParams;

  const children = await prisma.child.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true },
  });

  let messages: { id: string; role: string; content: string }[] = [];
  let conversationId = "";
  let childId =
    (sp.child && children.some((c) => c.id === sp.child) ? sp.child : null) ||
    children[0]?.id ||
    "";

  if (sp.c) {
    const conversation = await prisma.conversation.findFirst({
      where: { id: sp.c, userId: user.id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    if (conversation) {
      conversationId = conversation.id;
      childId = conversation.childId || childId;
      messages = conversation.messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
      }));
    }
  }

  const error =
    sp.error === "empty"
      ? "Digite ou fale uma pergunta."
      : sp.error === "child"
        ? "Selecione uma criança."
        : "";

  const selectedChild = children.find((c) => c.id === childId);

  return (
    <div className="flex min-h-[70vh] flex-col gap-4">
      <div>
        <h1 className="display text-3xl font-bold">Pergunte à TIA Nutri</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Biblioteca FAQ Andreza Dias (TEA/TDAH) + respostas completas. Peça figuras para gerar
          imagem; fale no microfone se não quiser digitar; toque em Ouvir para áudio.
        </p>
      </div>

      {children.length === 0 ? (
        <div className="card space-y-3 p-4">
          <p className="text-sm text-[var(--muted)]">Cadastre uma criança em Perfis para conversar.</p>
          <a href="/app/criancas" className="btn btn-primary">
            Criar perfil
          </a>
        </div>
      ) : (
        <>
          <div className="card space-y-2 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="label mb-0">Criança ativa</p>
              <ClearChatButton childId={childId} conversationId={conversationId || undefined} />
            </div>
            <div className="flex flex-wrap gap-2">
              {children.map((c) => (
                <a
                  key={c.id}
                  href={`/app/chat?child=${c.id}`}
                  className={`chip min-h-11 ${
                    c.id === childId ? "!bg-[var(--brand)] !text-white" : ""
                  }`}
                >
                  {c.name}
                </a>
              ))}
              {conversationId ? (
                <a href={`/app/chat?child=${childId}`} className="chip min-h-11">
                  Nova conversa
                </a>
              ) : null}
            </div>
          </div>

          <div className="card flex min-h-80 flex-1 flex-col gap-3 overflow-y-auto p-4">
            {selectedChild ? (
              <p className="text-xs font-bold text-[var(--brand)]">Contexto: {selectedChild.name}</p>
            ) : null}

            {messages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm font-semibold">Perguntas frequentes do portfólio:</p>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS.map((s) => (
                    <form key={s} action="/api/chat/ask" method="post">
                      <input type="hidden" name="childId" value={childId} />
                      <input type="hidden" name="content" value={s} />
                      <button
                        type="submit"
                        className="w-full rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-3 text-left text-sm font-semibold text-[var(--brand-deep)]"
                      >
                        {s}
                      </button>
                    </form>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((m) => (
              <ChatMessageBubble key={m.id} role={m.role} content={m.content} />
            ))}
          </div>

          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

          <ChatVoiceControls childId={childId} conversationId={conversationId || undefined} />

          <form action="/api/chat/ask" method="post" className="card space-y-3 p-4">
            <input type="hidden" name="childId" value={childId} />
            {conversationId ? (
              <input type="hidden" name="conversationId" value={conversationId} />
            ) : null}
            <label className="label">Sua pergunta (texto)</label>
            <textarea
              className="input min-h-28"
              name="content"
              placeholder="Ex.: Por que ânsia só de ver o alimento? (somente texto)"
              required
            />
            <button className="btn btn-primary min-h-12 w-full text-base" type="submit">
              Perguntar à TIA Nutri
            </button>
          </form>
        </>
      )}
    </div>
  );
}
