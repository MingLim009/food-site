/** Ficha completa da receita (ingredientes, preparo, forno, air fryer). */

export type RecipeDetails = {
  ingredients: string[];
  method: string[];
  oven: string;
  airFryer: string;
  prepMin: number;
  cookNote: string;
  tip: string;
};

function has(title: string, ...words: string[]) {
  const t = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return words.some((w) =>
    t.includes(
      w
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    )
  );
}

function baseDry(title: string, gf: boolean, df: boolean): string[] {
  const flour = gf ? "2 xícaras de farinha de arroz (ou mistura sem glúten)" : "2 xícaras de farinha de trigo";
  const fat = df ? "1/2 xícara de óleo ou azeite" : "1/2 xícara de manteiga ou óleo";
  const milk = df ? "3/4 xícara de leite vegetal (aveia/arroz/coco)" : "3/4 xícara de leite";
  return [flour, fat, milk, "2 ovos (ou substituto)", "1/2 xícara de açúcar (ajuste ao gosto)", "1 colher (chá) de fermento em pó", "Pitada de sal"];
}

function parseMethodFromSteps(steps: string): string[] {
  if (!steps?.trim()) return [];
  // JSON array?
  try {
    const j = JSON.parse(steps);
    if (Array.isArray(j)) {
      return j.map((s) => (typeof s === "string" ? s : String(s))).filter(Boolean);
    }
  } catch {
    /* text */
  }
  return steps
    .split(/\n+/)
    .map((l) => l.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean);
}

/**
 * Monta ficha completa a partir do que já existe no banco + regras por tipo de receita.
 * Funciona mesmo sem reseed.
 */
export function buildRecipeDetails(opts: {
  title: string;
  description?: string;
  steps: string;
  tips?: string | null;
  foodGroups?: string[];
}): RecipeDetails {
  const title = opts.title;
  const groups = (opts.foodGroups || []).map((g) => g.toLowerCase());
  const gf = groups.some((g) => g.includes("sem glúten") || g.includes("sem gluten"));
  const df = groups.some((g) => g.includes("sem leite"));
  const tip = (opts.tips || "").trim() || "Ofereça sem pressão; celebre olhar, cheirar e tocar.";
  const existingMethod = parseMethodFromSteps(opts.steps);

  // --- SOPAS ---
  if (has(title, "sopa", "canja", "caldo", "consomme", "consommé")) {
    return {
      ingredients: [
        "400–500 g do ingrediente principal (legume, tubérculo ou proteína)",
        "1 litro de água ou caldo vegetal",
        "1 colher (sopa) de azeite",
        "Sal leve a gosto",
        "Opcional: 1 dente de alho / 1/4 cebola bem cozidos",
      ],
      method: existingMethod.length
        ? existingMethod
        : [
            "Lave e corte o ingrediente principal em pedaços iguais.",
            "Refogue no azeite (opcional) e cubra com água/caldo.",
            "Cozinhe 20–30 min até amolecer.",
            "Bata no liquidificador até ficar liso (peneire se a criança rejeitar pedacinhos).",
            "Ajuste sal; sirva morno, em porção previsível.",
          ],
      oven: "Não se aplica (fogão).",
      airFryer: "Não se aplica (fogão).",
      prepMin: 10,
      cookNote: "Fogão: 20–30 min até amolecer; depois bater.",
      tip,
    };
  }

  // --- ARROZ ---
  if (has(title, "arroz", "risoto") && !has(title, "biscoito", "bolacha", "bolo", "farinha de arroz")) {
    return {
      ingredients: [
        "1 xícara de arroz",
        "2 xícaras de água (ajuste ao ponto desejado)",
        "1 colher (chá) de azeite ou óleo",
        "Sal leve a gosto",
        "Opcional: legume picado fino (conforme a receita)",
      ],
      method: existingMethod.length
        ? existingMethod
        : [
            "Lave o arroz se preferir.",
            "Aqueça o azeite, junte o arroz e mexa 1 minuto.",
            "Adicione água e sal; cozinhe em fogo baixo até secar.",
            "Solte os grãos com garfo; mantenha o mesmo ponto entre os dias.",
            "Sirva perto de um alimento seguro, sem pressão.",
          ],
      oven: "Opcional finalizar 5 min a 180 °C só para aquecer.",
      airFryer: "Não é o método principal — use fogão.",
      prepMin: 5,
      cookNote: "Fogão: 15–20 min.",
      tip,
    };
  }

  // --- FEIJÃO ---
  if (has(title, "feijão", "feijao", "tutu", "hummus")) {
    return {
      ingredients: [
        "2 xícaras de feijão cozido (ou 1 xícara seco, de molho)",
        "Água para cobrir",
        "1 colher (sopa) de azeite",
        "Sal leve",
        "Opcional: alho/cebola bem cozidos; legume em cubinhos mínimos",
      ],
      method: existingMethod.length
        ? existingMethod
        : [
            "Se for seco: deixe de molho e cozinhe até macio (panela de pressão ~25–35 min).",
            "Ajuste o caldo (mais ralo ou mais cremoso).",
            "Tempere com azeite e sal leve.",
            "Para versão batida: processe até lisinho.",
            "Sirva separado do arroz se a mistura for difícil.",
          ],
      oven: "Não se aplica (fogão / pressão).",
      airFryer: "Não se aplica.",
      prepMin: 10,
      cookNote: "Pressão: 25–35 min (depois do molho) ou use feijão já cozido 10 min.",
      tip,
    };
  }

  // --- VERDURAS / LEGUMES assados ---
  if (
    has(title, "grelhada", "assada", "palitos", "floretes", "chips", "crisps", "vagem", "abobrinha", "berinjela", "cenoura cozida", "brócolis", "brocolis", "alface", "tomate", "pepino", "repolho", "espinafre", "rúcula", "rucula", "quiabo", "chuchu", "mix de legumes")
  ) {
    const air = has(title, "chips", "crisps")
      ? "Air Fryer: 160 °C por 8–12 min, mexendo na metade (até crocante)."
      : "Air Fryer: 170 °C por 10–15 min, em camada única.";
    const oven = has(title, "chips", "crisps")
      ? "Forno: 180 °C por 15–20 min, virando na metade."
      : "Forno: 200 °C por 15–25 min (até macio ou dourado).";
    return {
      ingredients: [
        "300–400 g do vegetal da receita",
        "1–2 colheres (sopa) de azeite",
        "Sal leve a gosto",
        "Opcional: ervas suaves (sem pedaços grandes)",
      ],
      method: existingMethod.length
        ? existingMethod
        : [
            "Lave e corte em formato repetido (palito, cubo ou fatia).",
            "Seque bem (água demais impede crocância).",
            "Tempere com azeite e sal leve.",
            "Asse no forno ou Air Fryer no tempo indicado abaixo.",
            "Sirva seco, em porção simbólica, junto do alimento seguro.",
          ],
      oven,
      airFryer: air,
      prepMin: 10,
      cookNote: "Prefira Air Fryer para textura mais seca/crocante.",
      tip,
    };
  }

  // --- MUFFINS ---
  if (has(title, "muffin")) {
    return {
      ingredients: [
        ...baseDry(title, gf || has(title, "sem gluten", "sem glúten", "arroz"), df || has(title, "sem leite")),
        "Essência ou fruta/legume da receita (ex.: 1 banana / 1/2 xícara de cenoura ralada)",
      ],
      method: existingMethod.length
        ? existingMethod
        : [
            "Preaqueça o forno a 180 °C (ou a Air Fryer a 160 °C).",
            "Misture secos; em outra tigela, misture úmidos.",
            "Junte tudo até homogenizar (não bata demais).",
            "Distribua em forminhas iguais (mesma quantidade em cada).",
            "Asse até o palito sair limpo; esfrie antes de oferecer.",
          ],
      oven: "Forno: 180 °C por 18–22 minutos.",
      airFryer: "Air Fryer: 160 °C por 12–15 minutos (forminhas que caibam na cesta).",
      prepMin: 15,
      cookNote: "Rendimento: ~10–12 muffins.",
      tip,
    };
  }

  // --- BOLOS / BROWNIE ---
  if (has(title, "bolo", "brownie")) {
    return {
      ingredients: [
        ...baseDry(title, gf || has(title, "sem gluten", "sem glúten", "arroz", "amendoa", "amêndoa"), df || has(title, "sem leite", "lactose")),
        "Sabor da receita (cacau, cenoura, banana, etc.) conforme o título",
      ],
      method: existingMethod.length
        ? existingMethod
        : [
            "Preaqueça o forno a 180 °C.",
            "Unte e enfarinhe (ou forre) uma forma média.",
            "Misture os ingredientes secos; depois os úmidos; combine.",
            "Despeje a massa nivelada (superfície lisa ajuda a previsibilidade).",
            "Asse; espere amornar; corte fatias iguais.",
          ],
      oven: "Forno: 180 °C por 35–45 minutos (teste do palito).",
      airFryer:
        "Air Fryer: 160 °C por 25–35 minutos em forma baixa que caiba na cesta (teste do palito; pode precisar de mais alguns minutos).",
      prepMin: 20,
      cookNote: "Fatias iguais = mais previsível na Escada do Comer.",
      tip,
    };
  }

  // --- BISCOITOS / COOKIES / BOLACHA ---
  if (has(title, "biscoito", "cookie", "bolacha", "wafer", "cracker", "torrada")) {
    return {
      ingredients: [
        gf || has(title, "polvilho", "arroz", "maisena")
          ? "2 xícaras de farinha/polvilho sem glúten"
          : "2 xícaras de farinha de trigo",
        df ? "1/3 xícara de óleo" : "1/3 xícara de manteiga",
        "1/2 xícara de açúcar (ou menos)",
        "1 ovo (ou 2 colheres de água + óleo)",
        "Pitada de sal",
        "Recheio da receita (se houver): geleia, cacau, pasta fina — camada fina",
      ],
      method: existingMethod.length
        ? existingMethod
        : [
            "Misture até formar massa homogênea.",
            "Abra e corte em formatos iguais (círculo/quadrado).",
            "Se for recheada: espalhe camada fina e feche.",
            "Asse até dourar de leve (não deixe queimar — cheiro forte incomoda).",
            "Esfrie completamente para ficar crocante.",
          ],
      oven: "Forno: 170–180 °C por 12–18 minutos.",
      airFryer: "Air Fryer: 160 °C por 8–12 minutos (em camada única).",
      prepMin: 20,
      cookNote: "Deixe esfriar na grade para secar bem.",
      tip,
    };
  }

  // --- PANQUECA / CREPIOCA / WAFFLE / PÃO DE QUEIJO ---
  if (has(title, "panqueca", "crepioca", "waffle", "pao de queijo", "pão de queijo", "tapioca")) {
    return {
      ingredients: [
        has(title, "tapioca", "crepioca", "polvilho", "pao", "pão")
          ? "1 xícara de polvilho / tapioca"
          : "1 xícara de farinha (arroz se for sem glúten)",
        "1 ovo (ou substituto)",
        df ? "1/2 xícara de leite vegetal" : "1/2 xícara de leite",
        "1 colher (sopa) de óleo",
        "Sal ou açúcar leve, conforme a versão",
        "Recheio opcional em camada fina",
      ],
      method: existingMethod.length
        ? existingMethod
        : [
            "Misture até ficar homogêneo.",
            "Aqueça a frigideira ou pré-aqueça waffleira/Air Fryer.",
            "Faça porções iguais (mesmo tamanho todo dia).",
            "Cozinhe dos dois lados / asse até firme.",
            "Sirva simples primeiro; recheio só se o degrau permitir.",
          ],
      oven: "Forno (pães/bolinhos): 180 °C por 20–25 minutos.",
      airFryer: "Air Fryer: 160–170 °C por 10–15 minutos (bolinhos) ou frigideira para panqueca.",
      prepMin: 10,
      cookNote: "Panqueca: frigideira 2–3 min cada lado.",
      tip,
    };
  }

  // --- NUGGETS ---
  if (has(title, "nugget", "empanado")) {
    return {
      ingredients: [
        "400 g de frango em cubos ou moído",
        "1 ovo batido",
        "1 xícara de farinha de milho ou farinha sem glúten para empanar",
        "Sal leve",
        "Azeite ou spray para untar",
      ],
      method: existingMethod.length
        ? existingMethod
        : [
            "Tempere o frango levemente e modele em formatos iguais.",
            "Passe no ovo e depois na farinha.",
            "Disponha sem sobrepor.",
            "Asse ou use Air Fryer até dourar e cozinhar por dentro.",
            "Sirva seco, com alimento seguro ao lado.",
          ],
      oven: "Forno: 200 °C por 20–25 minutos, virando na metade.",
      airFryer: "Air Fryer: 180 °C por 12–15 minutos, virando na metade.",
      prepMin: 20,
      cookNote: "Certifique-se de que o interior está cozido.",
      tip,
    };
  }

  // --- SMOOTHIE / VITAMINA / MINGAU ---
  if (has(title, "smoothie", "vitamina", "mingau", "gelatina", "brigadeiro", "pure", "purê", "pastinha")) {
    return {
      ingredients: [
        "Ingrediente principal da receita (fruta, tubérculo ou cereal)",
        df ? "Leite vegetal ou água" : "Leite ou água",
        "Adoçante natural leve (opcional)",
        "Pitada de canela ou cacau se combinarem",
      ],
      method: existingMethod.length
        ? existingMethod
        : [
            "Prepare/cozinhe a base até macio (se precisar).",
            "Bata até ficar liso e homogêneo.",
            "Ajuste a espessura (mais líquido ou mais cremoso).",
            "Sirva na mesma tigela/copo de sempre.",
            "Sem pressão para terminar.",
          ],
      oven: "Não se aplica.",
      airFryer: "Não se aplica.",
      prepMin: 10,
      cookNote: "Fogão/liquidificador: 10–20 min no total.",
      tip,
    };
  }

  // --- PIZZA ---
  if (has(title, "pizza")) {
    return {
      ingredients: [
        "2 xícaras de polvilho (base sem glúten) ou massa preferida",
        "1 ovo + 2 colheres (sopa) de azeite",
        "Água até dar ponto",
        "Cobertura mínima (molho liso, sem pedaços)",
      ],
      method: existingMethod.length
        ? existingMethod
        : [
            "Misture a base até abrir uma massa fina.",
            "Preaqueça o forno a 200 °C.",
            "Asse a base 8–10 min; adicione cobertura fina; finalize.",
            "Corte em pedaços iguais.",
          ],
      oven: "Forno: 200 °C por 12–18 minutos no total.",
      airFryer: "Air Fryer: 180 °C por 8–12 minutos (tamanho que caiba na cesta).",
      prepMin: 15,
      cookNote: "Cobertura fina = menos surpresa sensorial.",
      tip,
    };
  }

  // --- DEFAULT (bolos genéricos / outros) ---
  return {
    ingredients: [
      ...baseDry(title, gf, df),
      "Ingredientes específicos do título (fruta, legume, cacau, etc.)",
    ],
    method: existingMethod.length
      ? existingMethod
      : [
          "Separe e pese os ingredientes (mesmas quantidades = previsibilidade).",
          "Misture na ordem: secos → úmidos → combine.",
          "Leve ao forno ou Air Fryer no tempo abaixo.",
          "Espere amornar; sirva em porção pequena.",
          "Ofereça sem insistir; use a Escada do Comer.",
        ],
    oven: "Forno: 180 °C por 25–40 minutos (ajuste ao formato — teste do palito).",
    airFryer: "Air Fryer: 160 °C por 15–25 minutos (forma baixa; teste do palito).",
    prepMin: 15,
    cookNote: "Tempos variam com a potência do aparelho — comece pelo menor tempo.",
    tip,
  };
}

/** Cenas extras do “vídeo” com ingredientes e tempos. */
export function buildDetailScenes(title: string, details: RecipeDetails, emoji: string) {
  return [
    {
      title: "Ingredientes",
      emoji: "🧾",
      bg: "#E8F3FF",
      narration: `Para ${title}: ${details.ingredients.slice(0, 4).join("; ")}${
        details.ingredients.length > 4 ? "…" : ""
      }. Tempo de preparo ~${details.prepMin} min.`,
    },
    {
      title: "Preparo",
      emoji: "👩‍🍳",
      bg: "#FFF6E0",
      narration: details.method[0] || "Prepare com calma, formato previsível.",
    },
    {
      title: "Forno e Air Fryer",
      emoji: "⏱️",
      bg: "#FFE8D0",
      narration: `${details.oven} · ${details.airFryer} ${details.cookNote}`,
    },
    {
      title: "Oferecer",
      emoji: emoji || "👀",
      bg: "#E8F8E0",
      narration: `${details.tip} Olhar, cheirar ou tocar já conta.`,
    },
  ];
}
