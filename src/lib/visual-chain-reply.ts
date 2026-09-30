/**
 * Monta encadeamento visual em texto (figuras emoji) quando a família pede imagens/figuras.
 * Estilo do material educativo Andreza Dias — sem gerar PNG externo obrigatório.
 */

export type GeneratedChainRow = {
  title: string;
  description: string;
  steps: { label: string; emoji: string }[];
};

const FOOD_EMOJI: Record<string, string> = {
  pastel: "🥟",
  carne: "🥩",
  frango: "🍗",
  nugget: "🍗",
  batata: "🥔",
  chips: "🥔",
  banana: "🍌",
  maca: "🍎",
  maçã: "🍎",
  arroz: "🍚",
  pao: "🍞",
  pão: "🍞",
  biscoito: "🍪",
  iogurte: "🥛",
  queijo: "🧀",
  ovo: "🥚",
  macarrao: "🍝",
  macarrão: "🍝",
  pizza: "🍕",
  hamburguer: "🍔",
  hambúrguer: "🍔",
  sfiha: "🥟",
  torta: "🥧",
};

function detectFood(message: string): string {
  const q = message.toLowerCase();
  const known = Object.keys(FOOD_EMOJI).sort((a, b) => b.length - a.length);
  for (const k of known) {
    if (q.includes(k)) return k;
  }
  const m = q.match(
    /aceit(?:ou|a)\s+([^,.!?]+)|come\s+([^,.!?]+)|seguro[:\s]+([^,.!?]+)|partir d[eo]\s+([^,.!?]+)/i
  );
  if (m) {
    const raw = (m[1] || m[2] || m[3] || m[4] || "").trim().slice(0, 40);
    if (raw) return raw;
  }
  return "alimento seguro";
}

function emojiFor(food: string): string {
  const k = food.toLowerCase();
  for (const [key, em] of Object.entries(FOOD_EMOJI)) {
    if (k.includes(key)) return em;
  }
  return "🍽️";
}

export function wantsVisualChain(message: string): boolean {
  const q = message.toLowerCase();
  const asksVisual = /figura|imagem|desenho|mostre|mostra|visual|foto|ilustr/.test(q);
  const asksChain = /encade|encadam|cadeia|partir d|aceitou|como (posso )?fazer/.test(q);
  return asksVisual || (asksChain && /mostre|mostra|figura|imagem|com figura/.test(q));
}

export function wantsTextOnly(message: string): boolean {
  return /somente texto|s[oó] texto|sem imagem|sem figura|n[aã]o quero imagem/.test(
    message.toLowerCase()
  );
}

export function buildVisualChainReply(message: string, childName: string): string {
  const food = detectFood(message);
  const em = emojiFor(food);
  const label = food.charAt(0).toUpperCase() + food.slice(1);

  const rows: GeneratedChainRow[] = [
    {
      title: "1. Mudar o formato",
      description: "Mesmo alimento, geometria diferente — um formato por vez.",
      steps: [
        { label: `${label} habitual`, emoji: em },
        { label: "Formato menor / mini", emoji: "🫓" },
        { label: "Formato triangular", emoji: "🔺" },
        { label: "Formato em estrela / cortador", emoji: "⭐" },
      ],
    },
    {
      title: "2. Mudar a textura do recheio / proteína",
      description: "Do mais previsível ao um pouco mais “real”.",
      steps: [
        { label: "Recheio fino / homogêneo", emoji: "🥣" },
        { label: "Desfiado curto", emoji: "🍜" },
        { label: "Cubinhos pequenos", emoji: "🧊" },
        { label: "Tiras finas", emoji: "🥩" },
      ],
    },
    {
      title: "3. Introduzir ingredientes mínimos",
      description: "Só um item novo por oferta, em quantidade simbólica.",
      steps: [
        { label: `${label} puro`, emoji: em },
        { label: "+ milho (poucos grãos)", emoji: "🌽" },
        { label: "+ ervilha", emoji: "🟢" },
        { label: "+ legume picadinho", emoji: "🫑" },
      ],
    },
    {
      title: "4. Mudar a “massa” / base",
      description: "Mesma ideia de recheio, envoltório diferente.",
      steps: [
        { label: "Massa habitual", emoji: "🥟" },
        { label: "Assado em vez de frito", emoji: "🍞" },
        { label: "Massa de queijo / wrap", emoji: "🧀" },
        { label: "Base de milho / integral", emoji: "🌽" },
      ],
    },
    {
      title: "5. Outras apresentações",
      description: "Mesma família sensorial, outro “nome” no prato.",
      steps: [
        { label: `Mini ${label}`, emoji: em },
        { label: "Esfiha / tortinha", emoji: "🥧" },
        { label: "Rolinho / panquinha", emoji: "🥞" },
        { label: "Tartelete", emoji: "🧁" },
      ],
    },
    {
      title: "6. Ampliar proteínas / pratos",
      description: "Só depois dos passos anteriores estáveis.",
      steps: [
        { label: "Mini burger", emoji: "🍔" },
        { label: "Almôndega pequena", emoji: "🧆" },
        { label: "Tirinhas de frango", emoji: "🍗" },
        { label: "Arroz + carne moída leve", emoji: "🍚" },
      ],
    },
  ];

  const figBlocks = rows
    .map((row) => {
      const figs = row.steps.map((s) => `[${s.emoji} ${s.label}]`).join(" → ");
      return `**${row.title}**\n_${row.description}_\n${figs}`;
    })
    .join("\n\n");

  return `Olá! Sou a TIA Nutri. Montei um **encadeamento visual** a partir de **${label}**, pensado para ${childName} — no estilo do material educativo (figuras + explicação). Cada seta é um passo; avance só quando o atual estiver confortável.

### Encadeamento alimentar: a partir de ${label}

O encadeamento usa um alimento já aceito como base e introduz mudanças mínimas (cor, textura, formato, apresentação), sem saltos grandes.

${figBlocks}

### Dicas importantes
• Ofereça porções bem pequenas.
• Não force a comer — tolerar olhar/cheirar/tocar já conta.
• Ambiente calmo e previsível.
• Mantenha o alimento seguro no prato.

### Sinais de que está funcionando
• Tolera o alimento na mesa ou no prato
• Olha, cheira ou toca sem crise
• Aceita uma variação mínima (mesmo sem engolir)

### Lembre-se
Cada criança tem seu ritmo. Isso é educativo e não substitui nutricionista / TO / fono / médico.

Se quiser, diga o próximo alimento-alvo que eu monto outra trilha com figuras.`;
}
