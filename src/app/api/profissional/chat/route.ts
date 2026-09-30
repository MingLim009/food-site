import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { canAccessFeature } from "@/lib/plans";
import { PRO_AI_SYSTEM, PRO_DOCS } from "@/lib/professional";
import { retrieveKnowledge, formatRagContext } from "@/lib/rag";

const schema = z.object({
  content: z.string().min(1).max(4000),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .optional(),
});

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    if (!canAccessFeature(user.plan, user.planExpiresAt, "professional")) {
      return NextResponse.json({ error: "Área profissional exclusiva do plano Gold." }, { status: 403 });
    }

    const body = schema.parse(await req.json());

    if (/\b(\d+([.,]\d+)?\s?(mg|mcg|µg|ui|iu)\b)|dose|dosagem/i.test(body.content)) {
      return NextResponse.json({
        reply:
          "Não informo doses de vitaminas, minerais ou suplementos. Isso permanece sob sua responsabilidade clínica e avaliação individualizada.",
      });
    }

    const chunks = await retrieveKnowledge(body.content, 4);
    const rag = formatRagContext(chunks);
    const proContext = PRO_DOCS.slice(0, 4)
      .map((d) => `[PRO ${d.category}] ${d.title}\n${d.summary}`)
      .join("\n\n");

    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        const OpenAI = (await import("openai")).default;
        const client = new OpenAI({ apiKey });
        const completion = await client.chat.completions.create({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          temperature: 0.35,
          messages: [
            { role: "system", content: PRO_AI_SYSTEM },
            {
              role: "system",
              content: `BIBLIOTECA FAMÍLIA (RAG):\n${rag}\n\nMATERIAIS PRO DISPONÍVEIS:\n${proContext}`,
            },
            ...(body.history || []).slice(-6),
            { role: "user", content: body.content },
          ],
        });
        const text = completion.choices[0]?.message?.content?.trim();
        if (text) return NextResponse.json({ reply: text });
      } catch {
        // fall through
      }
    }

    return NextResponse.json({ reply: localProReply(body.content, rag) });
  } catch {
    return NextResponse.json({ error: "Falha ao responder." }, { status: 400 });
  }
}

function localProReply(question: string, rag: string): string {
  const q = question.toLowerCase();
  let tip =
    "Use a área profissional Gold: Ideias, Anamnese, Materiais imprimíveis, Recursos e Montagem de sessões.";

  if (/anamne|ficha|primeira consulta/.test(q)) {
    tip =
      "Sugestão: baixe a «Ficha de anamnese alimentar infantil» e a «Ficha de retorno». Adapte ao prontuário do seu serviço.";
  } else if (/sess[aã]o|montar|planejar/.test(q)) {
    tip =
      "Sugestão: use o «Modelo de sessão 40 min» + checklist do terapeuta. Defina 1 micro-objetivo e 1 alimento-alvo.";
  } else if (/sensorial|escada|degrau/.test(q)) {
    tip =
      "Sugestão: comece pelos degraus baixos (olhar/cheirar/tocar) sem exigir ingestão. Veja a ideia de sessão sensorial.";
  } else if (/imprim|material|fam[ií]lia/.test(q)) {
    tip =
      "Sugestão: imprima Escada do Comer para a família, Combinados da mesa e Registro diário de exposição.";
  }

  const fonte = rag.split("\n\n")[0] || "Biblioteca EloAlimentar.";

  return `Olá! Sou a TIA Nutri PRO (área profissional Gold).

${tip}

Apoio da biblioteca:
${fonte}

Lembrete: isto é apoio educativo. Doses, diagnóstico e conduta final são de sua responsabilidade clínica. Encaminhe TO/fono/médico quando indicado.`;
}
