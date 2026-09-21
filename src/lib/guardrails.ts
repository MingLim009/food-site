/**
 * Clinical safety guardrails for the parental AI assistant.
 * Educational guidance only — never diagnosis or dosing.
 */

const BLOCKED_PATTERNS: { pattern: RegExp; reason: string }[] = [
  {
    pattern: /\b(\d+([.,]\d+)?\s?(mg|mcg|µg|ui|iu|g)\b)/i,
    reason: "quantidades de vitaminas/minerais",
  },
  {
    pattern: /\b(dose|dosagem|suplementar com|tomar \d+)/i,
    reason: "orientação de dosagem",
  },
  {
    pattern: /\b(diagn[oó]stic(o|ar)|tem TEA|tem TDAH|você tem|seu filho tem)\b/i,
    reason: "linguagem diagnóstica",
  },
  {
    pattern: /\b(prescrev|medicament|rem[eé]dio para)\b/i,
    reason: "prescrição medicamentosa",
  },
];

const CROSS_CHILD_PATTERN =
  /\b(outra crian[cç]a|o filho de|a filha de|crian[cç]a X|meu sobrinho|vizinho)\b/i;

export const SYSTEM_GUARDRAILS = `
Você é a TIA Nutri, assistente educativa da plataforma EloAlimentar, voltada a pais de crianças com seletividade alimentar, TEA e/ou TDAH. Sempre se apresente como TIA Nutri quando for natural.

REGRAS OBRIGATÓRIAS:
1. Responda APENAS com base no perfil da criança selecionada e nos trechos da biblioteca fornecidos (RAG). Não invente dados clínicos.
2. NUNCA forneça quantidades de vitaminas, minerais, aminoácidos ou suplementos (mg, mcg, UI etc.). Oriente a buscar nutricionista/médico.
3. NUNCA faça diagnóstico. Formulas antropométricas simples (IMC infantil aproximado, percentis educacionais) podem ser explicadas como referência educativa, sem concluir diagnóstico.
4. NUNCA discuta ou compare com outra criança que não seja a do perfil ativo.
5. Sempre deixe claro que o conteúdo é educativo e não substitui consulta profissional.
6. Quando houver sinais de TPS (transtorno do processamento sensorial), indique Terapeuta Ocupacional; para dificuldades oral-motoras, indique Fonoaudiólogo; sempre considere Nutricionista.
7. Pode explicar conceitos como: causas da seletividade em TEA/TDAH, sinais da criança, Escada do Comer, texturas/cores/formas, verminoses, leaky gut, má digestão/enzimas, disbiose, SIBO e SIFO (quando investigar) — sempre de forma educativa.
8. Se a pergunta sair do escopo ou pedir algo proibido, recuse com educação e oferecer alternativa segura.
9. Responda em português do Brasil, tom acolhedor, claro e objetivo.
`.trim();

export function detectUnsafeUserIntent(message: string): string | null {
  if (CROSS_CHILD_PATTERN.test(message)) {
    return "Só posso falar sobre a criança do perfil selecionado, para proteger a privacidade e evitar confusão clínica.";
  }
  if (/\b(quanto de|quantos mg|dose de|dosagem)\b/i.test(message)) {
    return "Não informo quantidades de vitaminas ou minerais. Isso deve ser definido em consulta com nutricionista ou médico.";
  }
  if (/\b(diagnostique|meu filho tem|é autismo|é tdah)\b/i.test(message)) {
    return "Não realizo diagnósticos. Posso ajudar com sinais educativos e indicar quando procurar profissionais.";
  }
  return null;
}

export function sanitizeModelOutput(text: string): string {
  let out = text;
  for (const { pattern } of BLOCKED_PATTERNS) {
    if (pattern.test(out)) {
      out = out.replace(pattern, "[informação clínica restrita]");
    }
  }
  const disclaimer =
    "\n\n— Conteúdo educativo. Não substitui avaliação de nutricionista, médico, TO ou fonoaudiólogo.";
  if (!out.includes("Não substitui")) {
    out += disclaimer;
  }
  return out;
}

export function buildChildContext(child: {
  name: string;
  birthDate: Date | null;
  diagnosisNotes: string | null;
  textures: string;
  colors: string;
  shapes: string;
  acceptedFoods: string;
  refusedFoods: string;
  heightCm: number | null;
  weightKg: number | null;
  notes: string | null;
}): string {
  const age = child.birthDate
    ? Math.floor((Date.now() - child.birthDate.getTime()) / (365.25 * 24 * 3600 * 1000))
    : null;

  return `
PERFIL DA CRIANÇA ATIVA (único permitido nesta conversa):
- Nome: ${child.name}
- Idade aproximada: ${age ?? "não informada"} anos
- Notas de acompanhamento (não diagnóstico da TIA Nutri): ${child.diagnosisNotes || "—"}
- Texturas preferidas: ${child.textures}
- Cores preferidas: ${child.colors}
- Formas preferidas: ${child.shapes}
- Alimentos aceitos: ${child.acceptedFoods}
- Alimentos recusados: ${child.refusedFoods}
- Altura (cm): ${child.heightCm ?? "—"}
- Peso (kg): ${child.weightKg ?? "—"}
- Observações: ${child.notes || "—"}
`.trim();
}
