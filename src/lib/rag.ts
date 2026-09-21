import { prisma } from "./db";

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function scoreChunk(queryTokens: string[], title: string, content: string, tags: string): number {
  const hay = tokenize(`${title} ${content} ${tags}`);
  if (!hay.length || !queryTokens.length) return 0;
  let hits = 0;
  for (const q of queryTokens) {
    if (hay.includes(q)) hits += 1;
    else if (hay.some((h) => h.includes(q) || q.includes(h))) hits += 0.5;
  }
  return hits / queryTokens.length;
}

export async function retrieveKnowledge(query: string, limit = 5) {
  const chunks = await prisma.knowledgeChunk.findMany({ where: { published: true } });
  const tokens = tokenize(query);
  const ranked = chunks
    .map((c) => ({
      chunk: c,
      score: scoreChunk(tokens, c.title, c.content, c.tags),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return ranked.map((r) => r.chunk);
}

export function formatRagContext(
  chunks: { title: string; category: string; content: string }[]
): string {
  if (!chunks.length) {
    return "Nenhum trecho específico encontrado na biblioteca. Responda com cautela e diga quando o tema exigir profissional.";
  }
  return chunks
    .map(
      (c, i) =>
        `[Fonte ${i + 1} | ${c.category}] ${c.title}\n${c.content}`
    )
    .join("\n\n");
}

export async function generateAssistantReply(params: {
  userMessage: string;
  childContext: string;
  history: { role: string; content: string }[];
}): Promise<string> {
  const { detectUnsafeUserIntent, sanitizeModelOutput, SYSTEM_GUARDRAILS } = await import(
    "./guardrails"
  );

  const blocked = detectUnsafeUserIntent(params.userMessage);
  if (blocked) return blocked;

  const chunks = await retrieveKnowledge(params.userMessage, 5);
  const rag = formatRagContext(chunks);

  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    try {
      const OpenAI = (await import("openai")).default;
      const client = new OpenAI({ apiKey });
      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          { role: "system", content: SYSTEM_GUARDRAILS },
          {
            role: "system",
            content: `${params.childContext}\n\nBIBLIOTECA (RAG):\n${rag}`,
          },
          ...params.history.slice(-8).map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
          { role: "user", content: params.userMessage },
        ],
      });
      const text = completion.choices[0]?.message?.content?.trim();
      if (text) return sanitizeModelOutput(text);
    } catch {
      // fall through to local reply
    }
  }

  return sanitizeModelOutput(localRagReply(params.userMessage, rag, params.childContext));
}

function localRagReply(question: string, rag: string, childContext: string): string {
  const firstSource = rag.split("\n\n")[0] || rag;
  return `Olá! Sou a TIA Nutri. Com base no perfil da criança ativa e na biblioteca EloAlimentar, aqui vai uma orientação educativa:

${firstSource}

Sobre sua pergunta (“${question.slice(0, 160)}”): avance com respeito ao ritmo da criança, sem pressão à mesa, observando sinais sensoriais e registrando progresso na Escada do Comer quando o plano permitir.

Quando envolver vitaminas/minerais em quantidade, verminoses, disbiose, SIBO/SIFO ou suspeita de TPS/oral-motor, procure nutricionista e, conforme o caso, médico, terapeuta ocupacional ou fonoaudiólogo.

Contexto considerado:
${childContext.split("\n").slice(0, 6).join("\n")}`;
}
