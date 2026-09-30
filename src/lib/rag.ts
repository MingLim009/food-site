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

/** Synonyms help the same question match different library wording. */
const SYNONYMS: Record<string, string[]> = {
  recusa: ["recusar", "recusa", "nao come", "nao aceita", "seletiva", "seletividade"],
  escada: ["escada", "degrau", "passo", "tolerar", "cheirar", "tocar", "provar"],
  textura: ["textura", "crocante", "pastoso", "cremoso", "pegajoso", "liquido", "seco", "umido"],
  tea: ["tea", "autismo", "autista", "espectro"],
  tdah: ["tdah", "hiperatividade", "desatencao", "atencao"],
  pressao: ["pressao", "forcar", "obrigar", "brigar", "insistir"],
  receita: ["receita", "preparar", "cozinhar", "lanche", "jantar", "almoco", "bolo", "sopa"],
  comportamento: ["comportamento", "birra", "crise", "irritada", "irritado", "ansiedade", "humor"],
  intestino: ["intestino", "prisao", "constipacao", "diarreia", "gases", "barriga", "gastro"],
  vitamina: ["vitamina", "ferro", "zinco", "calcio", "suplemento", "nutriente"],
  executiva: ["executiva", "planejar", "atencao", "impulsivo", "fuga", "mesa"],
  encadeamento: ["encadeamento", "encadear", "transicao", "trocar marca", "variacao"],
};

function expandTokens(tokens: string[]): string[] {
  const set = new Set(tokens);
  for (const t of tokens) {
    for (const [key, syns] of Object.entries(SYNONYMS)) {
      if (syns.some((s) => t.includes(s) || s.includes(t)) || t.includes(key)) {
        syns.forEach((s) => set.add(s));
        set.add(key);
      }
    }
  }
  return [...set];
}

function scoreChunk(queryTokens: string[], title: string, content: string, tags: string): number {
  const hay = tokenize(`${title} ${content} ${tags}`);
  const expanded = expandTokens(queryTokens);
  if (!hay.length || !expanded.length) return 0;
  let hits = 0;
  for (const q of expanded) {
    if (hay.includes(q)) hits += 1.2;
    else if (hay.some((h) => h.includes(q) || q.includes(h))) hits += 0.5;
  }
  // Boost exact phrase snippets from original query words in title
  const titleTokens = tokenize(title);
  for (const q of queryTokens) {
    if (titleTokens.includes(q)) hits += 1.5;
  }
  return hits / Math.max(expanded.length * 0.35, 1);
}

export async function retrieveKnowledge(query: string, limit = 5) {
  const chunks = await prisma.knowledgeChunk.findMany({ where: { published: true } });
  const tokens = tokenize(query);
  const ranked = chunks
    .map((c) => ({
      chunk: c,
      score: scoreChunk(tokens, c.title, c.content, c.tags),
    }))
    .filter((r) => r.score > 0.15)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  if (!ranked.length) {
    const fallback = chunks
      .filter((c) =>
        /escada|sinais|limites|sensorial|seletividade|comportamento/i.test(
          `${c.title} ${c.tags}`
        )
      )
      .slice(0, 3);
    return fallback.length ? fallback : chunks.slice(0, 2);
  }

  return ranked.map((r) => r.chunk);
}

export function formatRagContext(
  chunks: { title: string; category: string; content: string }[]
): string {
  if (!chunks.length) {
    return "Nenhum trecho específico encontrado na biblioteca. Responda com cautela e diga quando o tema exigir profissional.";
  }
  return chunks
    .map((c, i) => `[Fonte ${i + 1} | ${c.category}] ${c.title}\n${c.content}`)
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
  const {
    wantsVisualChain,
    wantsTextOnly,
    buildVisualChainReply,
  } = await import("./visual-chain-reply");

  const blocked = detectUnsafeUserIntent(params.userMessage);
  if (blocked) return blocked;

  const nameMatch = params.childContext.match(/Nome:\s*(.+)/i);
  const childName = nameMatch?.[1]?.trim().split("\n")[0] || "sua criança";

  // Visual encadeamento on demand (unless user asked text-only)
  if (wantsVisualChain(params.userMessage) && !wantsTextOnly(params.userMessage)) {
    return sanitizeModelOutput(buildVisualChainReply(params.userMessage, childName));
  }

  const chunks = await retrieveKnowledge(params.userMessage, 8);
  const rag = formatRagContext(chunks);

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (apiKey) {
    try {
      const OpenAI = (await import("openai")).default;
      const client = new OpenAI({ apiKey });
      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.65,
        max_tokens: 1800,
        messages: [
          { role: "system", content: SYSTEM_GUARDRAILS },
          {
            role: "system",
            content: `${params.childContext}

BIBLIOTECA (RAG):
${rag}

INSTRUÇÃO DE RESPOSTA DESTA VEZ:
- Responda de forma COMPLETA e estruturada (estilo ChatGPT), em português do Brasil.
- Comece respondendo o ponto concreto da pergunta.
- Explique mecanismos (sensorial, proteção, antecipação, pressão, GI/motor) quando couber.
- Use seções e listas quando ajudar a clareza.
- Ligue a orientação ao perfil de ${childName}.
- Se pediram somente texto, não monte galeria de figuras.
- Não invente doses nem diagnósticos.`,
          },
          ...params.history.slice(-10).map((m) => ({
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

  return sanitizeModelOutput(
    localRagReply(params.userMessage, chunks, params.childContext, params.history)
  );
}

function childNameFromContext(childContext: string) {
  const m = childContext.match(/Nome:\s*(.+)/i);
  return m?.[1]?.trim().split("\n")[0] || "sua criança";
}

function parseList(childContext: string, label: string): string[] {
  const re = new RegExp(`${label}:\\s*(.+)`, "i");
  const m = childContext.match(re);
  if (!m) return [];
  const raw = m[1].trim();
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map(String).map((s) => s.trim()).filter(Boolean);
    }
  } catch {
    // not JSON — fall through
  }
  return raw
    .replace(/^\[|\]$/g, "")
    .split(/[,;]/)
    .map((s) => s.replace(/^["']|["']$/g, "").trim())
    .filter((s) => s && s !== "—" && s.toLowerCase() !== "nao informado");
}

type Intent =
  | "recusa"
  | "escada"
  | "sensorial"
  | "receita"
  | "pressao"
  | "tea"
  | "tdah"
  | "funcoes"
  | "nutrientes"
  | "gastro"
  | "comportamento"
  | "encadeamento"
  | "jogo"
  | "geral";

function detectIntent(q: string): Intent {
  // More specific intents first (diagnoses / named tools), then broader themes
  if (/\btea\b|autis/.test(q)) return "tea";
  if (/\btdah\b|hiperativ|desaten/.test(q)) return "tdah";
  if (/[aâ]nsia|n[aá]usea|v[oô]mito|gag|engasg/.test(q)) return "sensorial";
  if (/escada|degrau|passo\s*\d|tolerar|cheirar de/.test(q)) return "escada";
  if (/encade|outra marca|variar o|transi[cç][aã]o/.test(q)) return "encadeamento";
  if (/receita|prepar|cozinhar|bolo|sopa|muffin|biscoito|lanche|jantar|almo[cç]o/.test(q))
    return "receita";
  if (/press[aã]o|for[cç]ar|obrig|brigar na mesa|insistir/.test(q)) return "pressao";
  if (/fun[cç][aã]o?es?\s+executiv|fuga da mesa|n[aã]o senta|aten[cç][aã]o.*mesa|impulsiv/.test(q))
    return "funcoes";
  if (/textura|crocante|pastoso|pegajos|l[ií]quido|cor|formato|cheiro|sensorial/.test(q))
    return "sensorial";
  if (/comportament|birra|crise|irritad|ansied|humor|agressiv/.test(q)) return "comportamento";
  if (/vitamina|ferro|zinco|c[aá]lcio|suplement|nutriente|falta de|medica[cç][aã]o|apetite|peso/.test(q))
    return "nutrientes";
  if (/intestino|pris[aã]o|constipa|diarreia|gases|barriga|refluxo|gastro|disbiose|sibo/.test(q))
    return "gastro";
  if (/jogo|boneco|avatar|desenho/.test(q)) return "jogo";
  if (/recus|n[aã]o come|n[aã]o aceit|s[oó] come|seletiva|seletividade/.test(q)) return "recusa";
  return "geral";
}

const COMMON_FOODS = [
  "batata-doce",
  "batata doce",
  "arroz",
  "feijão",
  "feijao",
  "batata",
  "banana",
  "maçã",
  "maca",
  "iogurte",
  "leite",
  "pão",
  "pao",
  "biscoito",
  "fruta",
  "carne",
  "frango",
  "ovo",
  "queijo",
  "macarrão",
  "macarrao",
  "sopa",
  "bolo",
  "cenoura",
  "brócolis",
  "brocolis",
  "tomate",
  "alface",
  "suco",
  "água",
  "agua",
];

function extractMentionedFoods(question: string, accepted: string[], refused: string[]): string[] {
  const q = question.toLowerCase();
  const candidates = [...COMMON_FOODS, ...accepted, ...refused]
    .map((f) => f.toLowerCase())
    .filter((f) => f.length >= 3)
    .sort((a, b) => b.length - a.length); // longer first so batata-doce before batata
  const found: string[] = [];
  for (const f of candidates) {
    if (q.includes(f) && !found.some((x) => x.includes(f) || f.includes(x))) {
      found.push(f);
    }
  }
  return found.slice(0, 3);
}

function pickSnippet(content: string, max = 220): string {
  const clean = content.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const last = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("; "));
  return (last > 80 ? cut.slice(0, last + 1) : cut) + "…";
}

function bestChunkForIntent(
  intent: Intent,
  chunks: { title: string; category: string; content: string }[]
) {
  const prefer: Record<Intent, RegExp> = {
    recusa: /seletiv|sinais|recusa|tea|tdah/i,
    escada: /escada/i,
    sensorial: /sensorial|textura|prefer/i,
    receita: /receita|sensorial|escada/i,
    pressao: /press|regula|emocional|limites/i,
    tea: /tea|seletiv/i,
    tdah: /tdah|executiv/i,
    funcoes: /executiv/i,
    nutrientes: /vitamina|nutriente|limites/i,
    gastro: /gastro|disbiose|intestino|digest/i,
    comportamento: /comportamento|nutri[cç][aã]o|emocional/i,
    encadeamento: /encade|prefer|sensorial/i,
    jogo: /limites|escada/i,
    geral: /seletiv|escada|limites/i,
  };
  const re = prefer[intent];
  return (
    chunks.find((c) => re.test(`${c.title} ${c.category} ${c.content}`)) || chunks[0] || null
  );
}

function localRagReply(
  question: string,
  chunks: { title: string; category: string; content: string }[],
  childContext: string,
  history: { role: string; content: string }[]
): string {
  const name = childNameFromContext(childContext);
  const qNorm = question
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const intent = detectIntent(qNorm);
  const accepted = parseList(childContext, "Alimentos aceitos");
  const refused = parseList(childContext, "Alimentos recusados");
  const textures = parseList(childContext, "Texturas preferidas");
  const foods = extractMentionedFoods(question, accepted, refused);
  const foodLabel = foods[0] || null;
  const chunk = bestChunkForIntent(intent, chunks);
  const snippet = chunk ? pickSnippet(chunk.content, 200) : null;
  const safeLabel =
    accepted[0] && !accepted[0].startsWith("[")
      ? accepted[0]
      : "um alimento seguro do perfil";

  const lastAssistant =
    [...history].reverse().find((m) => m.role === "assistant")?.content || "";

  // Vary tone by the question itself (not always the same opening)
  const vary =
    Math.abs(
      [...question].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) + lastAssistant.length
    ) % 3;

  const greetings = [
    `Entendi sua pergunta sobre ${name}.`,
    `Boa pergunta — vou responder bem no ponto, pensando em ${name}.`,
    `Olá, sou a TIA Nutri. Vamos olhar isso no contexto de ${name}.`,
  ];
  const greet = greetings[vary];

  let core = "";
  let steps: string[] = [];

  switch (intent) {
    case "escada":
      core = foodLabel
        ? `Para ${foodLabel}, a Escada do Comer trata o progresso alimento por alimento: o degrau de hoje pode ser só tolerar, olhar ou cheirar — não precisa ser “comer”. Registre o degrau atual de ${name} na Escada e só avance quando estiver confortável.`
        : `A Escada do Comer organiza o progresso do passo 1 (tolerar) ao 26 (mastigar e comer). Cada alimento de ${name} tem seu próprio degrau. Não pule etapas por pressão.`;
      steps = [
        `Abra Escada do Comer e anote o alimento${foodLabel ? ` (${foodLabel})` : ""} + o degrau atual.`,
        `Mantenha ${safeLabel} no prato junto com a novidade.`,
        "Celebre olhar/cheirar/tocar — isso já é progresso.",
      ];
      break;

    case "recusa":
      core = foodLabel
        ? `Quando ${name} recusa ${foodLabel}, isso costuma ser proteção sensorial ou previsibilidade — não “birra”. Continue oferecendo sem insistir, no degrau em que ${name} está, perto de ${safeLabel}.`
        : `A recusa alimentar de ${name} costuma ligar-se a sensorialidade, rotina e segurança. A resposta educativa é reduzir pressão e mapear o que já tolera (olhar, cheirar, tocar).`;
      if (refused.length) {
        core += ` No perfil, já constam recusas como: ${refused.slice(0, 3).join(", ")}.`;
      }
      steps = [
        `Ofereça a novidade longe do centro do prato, com ${safeLabel} presente.`,
        "Evite frases de pressão (“só mais uma colher”).",
        "Use a Escada para registrar o degrau real de hoje.",
      ];
      break;

    case "sensorial":
      core = `Preferências de textura/cor/forma são o mapa sensorial de ${name}.${
        textures.length ? ` No perfil: texturas ${textures.join(", ")}.` : ""
      } Use isso para escolher o próximo alimento com carga sensorial parecida (encadeamento).`;
      steps = [
        "Mantenha formato e porção previsíveis.",
        foodLabel
          ? `Com ${foodLabel}, ajuste secura/umidade ou corte para ficar mais parecido com o que ${name} já tolera.`
          : `Compare a novidade com ${safeLabel} (mesmo crocante/seco, por exemplo).`,
        "Se o cheiro for intenso, comece pelo degrau de cheirar no ambiente.",
      ];
      break;

    case "receita":
      core = foodLabel
        ? `Para preparar algo com ${foodLabel} para ${name}, priorize previsibilidade: mesmo corte, mesma textura-alvo, sem pressão para comer. Há vídeos em desenho e ebooks em Receitas.`
        : `Posso orientar o preparo de forma sensorial e previsível para ${name}. No app, em Receitas, há vídeos em desenho e ebooks (bolos, sopas, sem glúten/leite, etc.).`;
      steps = [
        "Abra Receitas → Assistir desenhos e filtre pela categoria.",
        `Sirva perto de ${safeLabel}, em porção simbólica.`,
        `Deixe ${name} só olhar o preparo se esse for o degrau de hoje.`,
      ];
      break;

    case "pressao":
      core = `Forçar ${name} a comer costuma aumentar ansiedade e piorar a seletividade. Troque “provar agora” por microconvites: olhar, cheirar, tocar, ou só tolerar no prato.`;
      steps = [
        "Reduza fala à mesa; um comando curto por vez.",
        "Ofereça escolha limitada (dois utensílios / dois lugares no prato).",
        `Volte ao degrau da Escada em que ${name} está segura.`,
      ];
      break;

    case "tea":
      core = `No TEA, a seletividade de ${name} costuma ligar-se a hipersensibilidade (textura, cheiro, cor) e necessidade de previsibilidade. Nutrição não “cura” o TEA, mas a forma de oferecer comida pode reduzir crise à mesa.`;
      steps = [
        "Mantenha rotina visual e mudanças mínimas.",
        "Use Escada + alimento seguro sempre presente.",
        "Se houver TPS intenso, avalie TO; nutricionista para variedade.",
      ];
      break;

    case "tdah":
      core = `No TDAH, ${name} pode ter mais dificuldade de iniciar/permanecer na refeição (funções executivas). Ambiente calmo, porções claras e avisos curtos ajudam mais do que sermão longo.`;
      steps = [
        "Avise 5 minutos antes: “já já é hora da mesa”.",
        "Tempo de mesa realista + pausas curtas planejadas.",
        "Evite telas se dispersar demais; um estímulo por vez.",
      ];
      break;

    case "funcoes":
      core = `Funções executivas da alimentação (planejar, iniciar, prestar atenção, inibir impulso, flexibilidade) impactam como ${name} se organiza à mesa. Apoios externos — rotina, um passo por vez — reduzem a carga.`;
      steps = [
        "Sequência fixa: lavar mãos → sentar → um alimento por vez.",
        "Lembretes gentis de um único passo (“agora mastiga”).",
        "Se a fuga da mesa for intensa, combine tempo curto e previsível.",
      ];
      break;

    case "comportamento":
      core = `Alimentação, fome irregular, desconforto sensorial ou GI podem acompanhar mudanças de humor em ${name}, sem serem a única causa. Ajuste a mesa (menos pressão, mais previsibilidade) e observe se dor/constipação entram na história — isso é com profissional de saúde.`;
      steps = [
        "Veja o conteúdo Nutrição e comportamento (TEA/TDAH) no app.",
        "Mantenha horários de refeição mais estáveis.",
        "Anote se crises coincidem com alimentos novos ou ambiente barulhento.",
      ];
      break;

    case "nutrientes":
      core = `Dietas muito restritas podem envolver risco de inadequação de alguns nutrientes, o que às vezes se associa a cansaço ou irritabilidade — mas só avaliação profissional confirma. Eu não informo doses nem protocolos de suplementação.`;
      steps = [
        `Leve o registro de alimentos aceitos/recusados de ${name} à nutricionista.`,
        "Não inicie suplemento por conta própria.",
        "Enquanto isso, use Escada/Receitas para ampliar variedade com segurança.",
      ];
      break;

    case "gastro":
      core = `Sintomas gastrointestinais (dor, gases, constipação, diarreia) em ${name} merecem olhar médico/nutricional. Hipóteses como disbiose ou má digestão são educativas aqui — não automedicação.`;
      steps = [
        "Anote o que comeu e os sintomas (horário).",
        "Procure pediatra/gastro e nutricionista se for persistente.",
        "Na mesa, evite pressão extra enquanto investigam o desconforto.",
      ];
      break;

    case "encadeamento":
      core = `Encadeamento = mudanças mínimas a partir do que ${name} já aceita (${safeLabel}). Ex.: mesma textura crocante, formato parecido, depois outra marca.`;
      steps = [
        "Abra Encadeamento alimentar no app e veja as cadeias prontas.",
        `Parta de ${safeLabel} e altere só UMA coisa por vez.`,
        "Só avance quando o passo atual estiver estável.",
      ];
      break;

    case "jogo":
      core = `Jogos e o boneco de ${name} ajudam a ensaiar alimentos com leveza. Não substituem a Escada, mas reduzem carga emocional à mesa.`;
      steps = [
        "Em Perfis, ajuste o avatar da criança.",
        "Em Jogos, escolha atividades com o grupo alimentar-alvo.",
        "Depois, ofereça o alimento real no degrau adequado.",
      ];
      break;

    default:
      core = `Sobre o que você perguntou (“${question.trim().slice(0, 120)}${
        question.trim().length > 120 ? "…" : ""
      }”), o caminho mais seguro com ${name} é: observar o perfil sensorial, usar a Escada do Comer sem pressão e combinar com alimento seguro.`;
      steps = [
        `Relacione a dúvida ao que ${name} já aceita (${safeLabel}).`,
        "Se for sobre um alimento específico, diga o nome que eu detalho o degrau/estratégia.",
        "Receitas em desenho e Escada estão no menu do app.",
      ];
  }

  const stepsBlock = steps.map((s, i) => `${i + 1}. ${s}`).join("\n");

  // Usa a biblioteca internamente (sem citar "Trecho da biblioteca / FAQ XX" — confunde a família)
  let enrichedCore = core;
  const primary = chunk || chunks[0] || null;
  if (primary && primary.content) {
    const body = primary.content
      .replace(/^Pergunta frequente[\s\S]*?Resposta educativa[^:]*:\s*/i, "")
      .replace(/\n?O acompanhamento com nutricionista[\s\S]*$/i, "")
      .replace(/\s+/g, " ")
      .trim();
    const insight = pickSnippet(body, 280);
    if (insight && !enrichedCore.includes(insight.slice(0, 40))) {
      enrichedCore = `${core}\n\n${insight}`;
    }
  }

  const closings = [
    `\n\nSe quiser, me diga o alimento e o que aconteceu na última oferta (olhou? cheirou? chorou?) que eu afino o próximo passo para ${name}.`,
    `\n\nPosso detalhar mais: é sobre textura, Escada, receita ou comportamento à mesa?`,
    `\n\nLembro: sou educativa — não diagnostico e não passo dose de suplemento. Posso falar de outro ângulo se você reformular a pergunta.`,
  ];

  const titles = [
    "O que fazer agora (ligado à sua pergunta):",
    "Passos práticos para esta dúvida:",
    "Roteiro curto para tentar com " + name + ":",
  ];

  return `${greet}

${enrichedCore}

${titles[vary]}
${stepsBlock}${closings[vary]}`;
}
