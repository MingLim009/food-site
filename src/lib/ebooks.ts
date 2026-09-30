/** Ebooks de receitas sensoriais — conteúdo educativo para família (Premium/Gold). */

export type EbookRecipe = {
  title: string;
  focus: string;
  steps: string[];
  tip: string;
};

export type SensoryEbook = {
  slug: string;
  title: string;
  subtitle: string;
  coverEmoji: string;
  audience: string;
  recipes: EbookRecipe[];
  minPlan: "GOLD";
};

export const SENSORY_EBOOKS: SensoryEbook[] = [
  {
    slug: "ebook-crocantes-previsiveis",
    title: "Ebook 1 — Crocantes previsíveis",
    subtitle: "Receitas secas e crocantes para começar com segurança sensorial",
    coverEmoji: "🥨",
    audience: "Famílias TEA/TDAH com preferência por textura seca/crocante",
    minPlan: "GOLD",
    recipes: [
      {
        title: "Palitinhos de batata-doce",
        focus: "Cor alaranjada + crocância",
        steps: [
          "Corte palitos iguais",
          "Asse até secos por fora",
          "Ofereça para olhar/tolerar",
          "Pareie com alimento seguro",
        ],
        tip: "Formato igual reduz surpresa.",
      },
      {
        title: "Chips de maçã",
        focus: "Fruta em versão seca",
        steps: ["Fatias finas iguais", "Asse em fogo baixo", "Esfrie totalmente", "1–2 chips no prato"],
        tip: "Espessura uniforme = mordida previsível.",
      },
      {
        title: "Torradinhas em quadrados",
        focus: "Geometria previsível",
        steps: ["Torre cor uniforme", "Corte quadrados", "Esfrie", "Uma unidade simbólica"],
        tip: "Cor uniforme acalma o visual.",
      },
      {
        title: "Biscoito de polvilho",
        focus: "Alimento seguro crocante",
        steps: ["Asse bem seco", "Formato repetido", "1–2 unidades", "Use no encadeamento"],
        tip: "Ótimo elo para outros crocantes.",
      },
      {
        title: "Pipoca caseira seca",
        focus: "Leve e crocante",
        steps: ["Estoure sem excesso de gordura", "Separe só as secas", "Porção pequena", "Ambiente calmo"],
        tip: "Evite temperos fortes no início.",
      },
      {
        title: "Palitos de cenoura assada",
        focus: "Legume crocante",
        steps: ["Palitos iguais", "Asse até secar a superfície", "Sirva frios ou mornas", "Seguro ao lado"],
        tip: "Umidade residual é gatilho comum.",
      },
    ],
  },
  {
    slug: "ebook-lisos-e-cremosos",
    title: "Ebook 2 — Lisos e cremosos",
    subtitle: "Homogeneidade para reduzir surpresa tátil",
    coverEmoji: "🥣",
    audience: "Crianças que rejeitam pedaços, grumos ou misturas",
    minPlan: "GOLD",
    recipes: [
      {
        title: "Smoothie rosa suave",
        focus: "Líquido sem pedaços",
        steps: ["Bata até lisura total", "Copo opaco se a cor assustar", "Canudo opcional", "Sem pressão"],
        tip: "Homogeneidade primeiro.",
      },
      {
        title: "Iogurte liso",
        focus: "Cremoso estável",
        steps: ["Sem granola/pedaços", "Colher pequena", "Porção mínima", "Sem misturar fruta ainda"],
        tip: "Fruta só no encadeamento.",
      },
      {
        title: "Purê de batata",
        focus: "Pastoso claro",
        steps: ["Passe até zero grumos", "Temperatura estável", "Colher rasa", "Seguro ao lado"],
        tip: "Grumo = surpresa — peneire.",
      },
      {
        title: "Mingau de aveia liso",
        focus: "Consistência repetível",
        steps: ["Cozinhe dissolvendo grumos", "Passe se preciso", "Mesma espessura todo dia", "Porção simbólica"],
        tip: "Repetir a mesma textura acalma.",
      },
      {
        title: "Purê de abóbora",
        focus: "Laranja pastoso",
        steps: ["Bata sem fibras", "Cor estável", "Colher rasa", "Depois encadeie palitos"],
        tip: "Mesma família sensorial dos palitos.",
      },
      {
        title: "Abacate amassado",
        focus: "Verde pastoso",
        steps: ["Amasse liso", "Prepare na hora", "Porção mínima", "Com torrada segura"],
        tip: "Oxidação muda a cor — atenção visual.",
      },
    ],
  },
  {
    slug: "ebook-frutas-na-escada",
    title: "Ebook 3 — Frutas na Escada do Comer",
    subtitle: "Cortes previsíveis e progresso por degraus",
    coverEmoji: "🍎",
    audience: "Famílias introduzindo frutas com microprogressos",
    minPlan: "GOLD",
    recipes: [
      {
        title: "Banana em rodelas",
        focus: "Círculos iguais",
        steps: ["Espessura igual", "Fila no prato", "Olhar/tocar primeiro", "Morder só no degrau certo"],
        tip: "Simetria ajuda.",
      },
      {
        title: "Maçã ralada seca",
        focus: "Meio termo tátil",
        steps: ["Rale fino", "Esprema suco", "Montinho pequeno", "Depois cubos"],
        tip: "Ponte entre líquido e pedaço.",
      },
      {
        title: "Morango em meias-luas",
        focus: "Cor + corte",
        steps: ["Meias-luas iguais", "Seque um pouco", "Fila", "Observe sementes"],
        tip: "Sementes são microtextura.",
      },
      {
        title: "Melancia em cubos",
        focus: "Frio e firme",
        steps: ["Cubos sem semente", "Escorra", "Bem gelados", "Um cubo"],
        tip: "Líquido no prato pode incomodar.",
      },
      {
        title: "Uva pela metade",
        focus: "Segurança + formato",
        steps: ["Sempre cortar (idade)", "Seque", "Duas metades", "Sem pressa"],
        tip: "Adapte tamanho ao risco de engasgo.",
      },
      {
        title: "Manga em palitos firmes",
        focus: "Amarelo previsível",
        steps: ["Manga firme", "Palitos iguais", "Seque", "Um palito"],
        tip: "Madura demais escorre.",
      },
    ],
  },
  {
    slug: "ebook-cafe-previsivel",
    title: "Ebook 4 — Café da manhã previsível",
    subtitle: "Rotina matinal com pouca carga sensorial",
    coverEmoji: "🥞",
    audience: "Rotinas de manhã com funções executivas apoiadas",
    minPlan: "GOLD",
    recipes: [
      {
        title: "Panqueca em círculo",
        focus: "Forma fixa",
        steps: ["Massa uniforme", "Mesmo diâmetro", "Corte simétrico", "Variação depois"],
        tip: "Mudança de forma só após estabilidade.",
      },
      {
        title: "Vitamina de banana",
        focus: "Líquido denso",
        steps: ["Bata sem pedaços", "Mesma cor", "Canudo opcional", "Goles livres"],
        tip: "Previsibilidade visual diária.",
      },
      {
        title: "Ovo em rodelas",
        focus: "Proteína neutra",
        steps: ["Ponto firme", "Rodelas iguais", "Sem tempero", "Uma rodela"],
        tip: "Gema mole pode ser gatilho.",
      },
      {
        title: "Pão em tiras tostadas",
        focus: "Seco matinal",
        steps: ["Tiras iguais", "Torre uniforme", "Esfrie", "Uma tira"],
        tip: "Miolo úmido depois, não no início.",
      },
      {
        title: "Iogurte congelado em cubos",
        focus: "Frio preferido",
        steps: ["Congele liso", "Cubos firmes", "Porção mínima", "Guardanapo se escorrer"],
        tip: "Frio pode ser a preferência sensorial.",
      },
      {
        title: "Leite vegetal morno",
        focus: "Temperatura estável",
        steps: ["Sabor neutro", "Morne sem ferver", "Copo pequeno", "Sem espuma demais"],
        tip: "Mesma temperatura todos os dias.",
      },
    ],
  },
  {
    slug: "ebook-proteinas-e-salgados-suaves",
    title: "Ebook 5 — Proteínas e salgados suaves",
    subtitle: "Sabores neutros e formatos controlados",
    coverEmoji: "🧀",
    audience: "Ampliar cardápio além dos crocantes preferidos",
    minPlan: "GOLD",
    recipes: [
      {
        title: "Queijo em palitos",
        focus: "Formato palito",
        steps: ["Palitos iguais", "Sabor suave", "Frios", "Com biscoito seguro"],
        tip: "Aroma forte sobrecarrega — escolha leve.",
      },
      {
        title: "Omelete em tiras",
        focus: "Amarelo claro",
        steps: ["Fina e uniforme", "Tiras iguais", "Sem recheio", "Porção mínima"],
        tip: "Sem ervas/cebola no início.",
      },
      {
        title: "Frango em tiras",
        focus: "Proteína seca",
        steps: ["Cozido sem tempero forte", "Tiras iguais", "Bem seco", "Uma tira"],
        tip: "Depois desfie fino se a fibra incomodar.",
      },
      {
        title: "Hummus batido",
        focus: "Pasta bege lisa",
        steps: ["Lisura total", "Sem grãos", "Fino no prato", "Mergulhar o seguro"],
        tip: "Alho suave no começo.",
      },
      {
        title: "Wrap em rolinhos",
        focus: "Cilindro previsível",
        steps: ["Recheio seco mínimo", "Enrole firme", "Corte iguais", "Um rolinho"],
        tip: "Recheio úmido só depois.",
      },
      {
        title: "Bolinho de banana",
        focus: "Muffin macio",
        steps: ["Sem pedaços grandes", "Forminhas iguais", "Asse firmes", "Metades iguais"],
        tip: "Sem cobertura no início.",
      },
    ],
  },
  {
    slug: "ebook-cores-formatos-e-mesa-calma",
    title: "Ebook 6 — Cores, formatos e mesa calma",
    subtitle: "Organização visual + funções executivas à mesa",
    coverEmoji: "🧩",
    audience: "Famílias que precisam de previsibilidade visual e rotina curta",
    minPlan: "GOLD",
    recipes: [
      {
        title: "Arroz branco soltinho",
        focus: "Grãos separados",
        steps: ["Bem solto", "Sem molho", "Montinho pequeno", "Mesmo prato sempre"],
        tip: "Grãos grudados mudam o tátil.",
      },
      {
        title: "Gelatina em cubos",
        focus: "Cor única + cubo",
        steps: ["Cubos firmes", "Uma cor por vez", "Bem gelada", "Tolere no prato"],
        tip: "Evite derreter na mesa.",
      },
      {
        title: "Pepino em palitos",
        focus: "Frio crocante claro",
        steps: ["Descasque se preciso", "Seque água", "Palitos iguais", "Utensílio primeiro"],
        tip: "Água escorrendo incomoda muito.",
      },
      {
        title: "Couve-flor em floretes",
        focus: "Branco repetido",
        steps: ["Mesmo tamanho", "Ponto estável", "Escorra", "Um florete"],
        tip: "Comece pelo cheiro no ambiente.",
      },
      {
        title: "Tomate cereja ao meio",
        focus: "Vermelho controlado",
        steps: ["Corte ao meio", "Escorra se preciso", "Seque", "Longe no início"],
        tip: "Suculência = avance aos poucos.",
      },
      {
        title: "Chá gelado suave",
        focus: "Regulação sem comida nova",
        steps: ["Bem diluído", "Sem pedaços", "Copo previsível", "Goles livres"],
        tip: "Ajuda a ficar à mesa com menos pressão.",
      },
    ],
  },
];

export function getEbook(slug: string) {
  return SENSORY_EBOOKS.find((e) => e.slug === slug);
}

export function ebookToHtml(ebook: SensoryEbook) {
  const recipesHtml = ebook.recipes
    .map(
      (r, i) => `
<section class="recipe">
  <h2>${i + 1}. ${escapeHtml(r.title)}</h2>
  <p class="focus"><strong>Foco sensorial:</strong> ${escapeHtml(r.focus)}</p>
  <ol>
    ${r.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}
  </ol>
  <p class="tip">💡 ${escapeHtml(r.tip)}</p>
</section>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"/>
<title>${escapeHtml(ebook.title)} — EloAlimentar</title>
<style>
  body{font-family:Georgia,"Times New Roman",serif;max-width:720px;margin:28px auto;padding:0 18px;color:#1a1a1a;line-height:1.55;background:#fff}
  .cover{text-align:center;padding:28px 12px 20px;border-bottom:2px solid #e8d9a8;margin-bottom:24px}
  .emoji{font-size:3rem}
  h1{font-size:1.55rem;margin:8px 0 4px;color:#1e4d7b}
  .sub{color:#555;font-size:0.98rem;margin:0}
  .meta{color:#777;font-size:0.82rem;margin-top:10px}
  h2{font-size:1.15rem;color:#1e6bb8;margin:0 0 6px}
  .recipe{padding:14px 0;border-bottom:1px solid #eee;page-break-inside:avoid}
  .focus{font-size:0.92rem;color:#444;margin:0 0 8px}
  ol{margin:0 0 8px;padding-left:1.2rem}
  .tip{font-size:0.88rem;background:#fff8e8;border-left:3px solid #e0b84a;padding:8px 10px;margin:0}
  .foot{margin-top:28px;font-size:0.75rem;color:#888;border-top:1px solid #ddd;padding-top:12px}
  .badge{display:inline-block;background:#e8f3ff;color:#1e6bb8;font-size:0.7rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:4px 8px;border-radius:6px}
  @media print{body{margin:0;max-width:none}.cover{padding-top:8px}}
</style>
</head>
<body>
  <div class="cover">
    <div class="emoji">${ebook.coverEmoji}</div>
    <span class="badge">Receitas sensoriais · EloAlimentar</span>
    <h1>${escapeHtml(ebook.title)}</h1>
    <p class="sub">${escapeHtml(ebook.subtitle)}</p>
    <p class="meta">${escapeHtml(ebook.audience)} · Andreza Dias · CRN 10418</p>
  </div>
  <p>Use sem pressão à mesa. Cada receita combina com a <strong>Escada do Comer</strong> e com os <strong>vídeos em desenho</strong> no app. Avance só no degrau em que a criança está confortável.</p>
  ${recipesHtml}
  <p class="foot">Conteúdo educativo. Não substitui consulta nutricional ou multiprofissional. Sem doses, sem diagnóstico. LGPD · EloAlimentar / TIA Nutri.</p>
  <script>window.onload=function(){setTimeout(function(){window.print()},400)}</script>
</body>
</html>`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
