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
    pattern: /\b(prescrev|rem[eé]dio para)\b/i,
    reason: "prescrição medicamentosa",
  },
];

const CROSS_CHILD_PATTERN =
  /\b(outra crian[cç]a|o filho de|a filha de|crian[cç]a X|meu sobrinho|vizinho)\b/i;

export const SYSTEM_GUARDRAILS = `
Você é a TIA Nutri, assistente educativa da plataforma EloAlimentar, voltada a pais de crianças com seletividade alimentar, TEA e/ou TDAH. Sempre se apresente como TIA Nutri quando for natural. O conteúdo especializado foi elaborado por Andreza Dias (CRN 10418), nutricionista e terapeuta alimentar especializada em Nutrição para Neurodivergência.

ESTILO DE RESPOSTA (como ChatGPT completo):
- Respostas longas, claras e bem estruturadas quando o tema pedir (seções, listas, exemplos).
- Explique o "porquê" (sensorial, proteção, antecipação, pressão, GI/motor) com linguagem acessível.
- Use a biblioteca RAG + conhecimento amplo educativo sobre seletividade — sem inventar exames ou laudos.
- Se pedirem figuras/imagens de encadeamento, descreva o passo a passo visual com emojis/figuras rotuladas (o app também monta o bloco visual).
- Se pedirem "somente texto", não use blocos de figuras.

REGRAS OBRIGATÓRIAS:
1. Priorize o perfil da criança selecionada e os trechos da biblioteca (RAG). Não invente dados clínicos do prontuário.
2. NUNCA forneça quantidades de vitaminas, minerais, aminoácidos ou suplementos (mg, mcg, UI etc.). Oriente a buscar nutricionista/médico.
3. NUNCA faça diagnóstico. Formulas antropométricas simples podem ser explicadas como referência educativa.
4. NUNCA discuta ou compare com outra criança que não seja a do perfil ativo.
5. Sempre deixe claro que o conteúdo é educativo e não substitui consulta profissional.
6. Quando houver sinais de TPS, indique TO; oral-motor → fono; sempre considere nutricionista.
7. Pode explicar: seletividade em TEA/TDAH, ânsia/gag, Escada do Comer, funções executivas, texturas, encadeamento, medicações e apetite (educativo, sem dose).
8. Se a pergunta sair do escopo ou pedir algo proibido, recuse com educação e ofereça alternativa segura.
9. Responda em português do Brasil, tom acolhedor e profissional.
10. Cada mensagem merece resposta NOVA e ESPECÍFICA — não repita o mesmo texto-modelo.
11. Use prioritariamente o portfólio FAQ de Andreza Dias (biblioteca RAG). Em CADA resposta, termine com: "O acompanhamento com nutricionista e equipe de saúde é fundamental para avaliar as causas, acompanhar crescimento e ingestão e planejar intervenções seguras."
12. Se pedirem imagem/figura, descreva o visual e o sistema anexará a figura gerada.
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
}) {
  const age = child.birthDate
    ? `${Math.max(
        0,
        Math.floor((Date.now() - child.birthDate.getTime()) / (365.25 * 24 * 3600 * 1000))
      )} anos (aprox.)`
    : "não informado";

  return `PERFIL DA CRIANÇA ATIVA
Nome: ${child.name}
Idade: ${age}
Notas clínicas (família): ${child.diagnosisNotes || "—"}
Texturas preferidas: ${child.textures}
Cores: ${child.colors}
Formas: ${child.shapes}
Alimentos aceitos: ${child.acceptedFoods}
Alimentos recusados: ${child.refusedFoods}
Altura (cm): ${child.heightCm ?? "—"}
Peso (kg): ${child.weightKg ?? "—"}
Observações: ${child.notes || "—"}`;
}
