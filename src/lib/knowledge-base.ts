/**
 * Biblioteca geral de seletividade alimentar em TEA e TDAH
 * (conteúdo educativo — Andreza Dias · CRN 10418 / EloAlimentar)
 */

export type KnowledgeSeed = {
  title: string;
  category: string;
  tags: string;
  content: string;
};

function k(
  title: string,
  category: string,
  tags: string[],
  content: string
): KnowledgeSeed {
  return { title, category, tags: JSON.stringify(tags), content };
}

export const KNOWLEDGE_BASE: KnowledgeSeed[] = [
  k(
    "Principais causas da seletividade em TEA",
    "TEA",
    ["tea", "seletividade", "causas", "sensorial"],
    "Na TEA, a seletividade alimentar costuma relacionar-se a hipersensibilidade sensorial (textura, cheiro, temperatura, cor), necessidade de previsibilidade, padrões rígidos e, em alguns casos, dificuldades oral-motoras. A abordagem deve ser gradual, sem pressão coercitiva à mesa, respeitando o sistema nervoso da criança e integrando família e escola."
  ),
  k(
    "Principais causas da seletividade em TDAH",
    "TDAH",
    ["tdah", "seletividade", "atencao", "impulsividade"],
    "No TDAH, a seletividade pode ligar-se a desatenção durante a refeição, busca por estímulos intensos (sabores fortes), impulsividade, dificuldade de permanecer à mesa, regulação emocional e funções executivas da alimentação (planejar, iniciar, sustentar atenção, inibir impulsos). Rotinas previsíveis, ambiente calmo, porções visuais claras e passos curtos ajudam. Não se trata de 'birra'; é regulação."
  ),
  k(
    "Sinais que a criança dá na seletividade",
    "Sinais",
    ["sinais", "recusa", "sensorial"],
    "Sinais comuns: virar o rosto, engasgo antecipatório, náusea, choro, engolir saliva em excesso, empurrar o prato, aceitar só marcas específicas, preferir seco ou só líquido, recusar misturas. Observe o que ocorre antes da recusa (cheiro, visual, barulho do ambiente)."
  ),
  k(
    "Escada do Comer — visão geral",
    "Escada",
    ["escada", "passos", "tolerar", "mastigar"],
    "A Escada do Comer organiza o progresso do passo 1 (tolerar a presença do alimento) até o 26 (mastigar e comer de forma funcional). Cada alimento tem seu próprio degrau. Não se pula etapas por pressão. Celebrar microprogressos reduz ansiedade familiar."
  ),
  k(
    "Preferências por texturas, cores e formas",
    "Sensorial",
    ["textura", "cor", "forma"],
    "Muitas crianças aceitam melhor alimentos crocantes OU pastosos, cores claras OU vibrantes, formatos previsíveis (palito, círculo). Mapear preferências permite escolher o próximo alimento da cadeia com menor carga sensorial."
  ),
  k(
    "Profissionais além do nutricionista",
    "Rede",
    ["to", "fono", "tps", "oral-motor"],
    "Além do nutricionista: Terapeuta Ocupacional quando há sinais de Transtorno do Processamento Sensorial (TPS); Fonoaudiólogo para dificuldades oral-motoras (mastigação, deglutição, tônus); médico pediatra/gastro conforme sintomas sistêmicos. A TIA Nutri não substitui esses profissionais."
  ),
  k(
    "Vitaminas, minerais e aminoácidos na seletividade",
    "Nutrientes",
    ["vitaminas", "minerais", "aminoacidos"],
    "Dietas muito restritas podem envolver risco de inadequação de ferro, zinco, cálcio, vitamina D, vitaminas do complexo B, ômega-3 e aminoácidos essenciais — entre outros. A plataforma NÃO informa quantidades. Avaliação laboratorial e suplementação, se necessária, é exclusiva de consulta."
  ),
  k(
    "Verminoses, leaky gut, má digestão e enzimas",
    "Gastro",
    ["verminose", "leaky gut", "enzimas", "digestao"],
    "Queixas gastrointestinais (dor, gases, diarreia, constipação, desconforto após comer) merecem avaliação médica. Hipóteses como verminoses, aumento da permeabilidade intestinal (leaky gut), má digestão ou baixa de enzimas digestivas exigem investigação clínica — não automedicação nem protocolo pela TIA Nutri."
  ),
  k(
    "Disbiose, SIBO e SIFO — quando investigar",
    "Gastro",
    ["disbiose", "sibo", "sifo"],
    "Investigar disbiose, SIBO ou SIFO quando há sintomas persistentes (inchaço, distensão, alteração do hábito intestinal, desconforto crônico) sob orientação médica especializada. A plataforma apenas educa sobre o conceito; exames e conduta são clínicos."
  ),
  k(
    "Antropometria educativa sem diagnóstico",
    "Antropometria",
    ["imc", "peso", "altura"],
    "Peso e altura permitem calcular IMC aproximado (peso / altura²). Em crianças, a interpretação usa curvas de crescimento e percentis — isso é papel do profissional de saúde. Na plataforma, o IMC é apenas referência educativa, sem classificar desnutrição/obesidade como diagnóstico."
  ),
  k(
    "Limites clínicos da TIA Nutri",
    "Seguranca",
    ["limites", "lgpd", "seguranca", "tia nutri"],
    "A TIA Nutri responde só sobre a criança do perfil ativo; não compara com outras crianças; não dá doses; não diagnostica; usa biblioteca especializada (RAG). Dados pessoais são tratados conforme LGPD, com finalidade de apoio educativo aos responsáveis legais."
  ),
  k(
    "Interações medicamentosas e apetite",
    "Medicamentos",
    ["medicamento", "apetite", "interacao", "efeito"],
    "Alguns medicamentos usados em TEA/TDAH ou outras condições podem alterar apetite (aumentar ou reduzir), sede, náusea ou preferências alimentares. A TIA Nutri NÃO interpreta bulas nem recomenda ajuste de dose. Qualquer mudança de apetite com medicação deve ser conversada com o médico prescritor e, se possível, com nutricionista."
  ),
  k(
    "Cardápio educativo para compulsão alimentar",
    "Compulsao",
    ["compulsao", "cardapio", "rotina", "refeicao"],
    "Em contextos de compulsão ou hiperfagia, ajudam: horários previsíveis, ambiente calmo, refeições estruturadas com proteína + carboidrato + gordura de qualidade, evitar restrição extrema (que pode piorar compulsão), e mapear gatilhos emocionais/sensoriais. Isto é orientação educativa — avaliação de transtorno alimentar exige profissional de saúde mental e nutricionista."
  ),
  k(
    "Ovo, leites vegetais e bases preliminares",
    "Suplementos",
    ["ovo", "leite vegetal", "proteina", "substituicao"],
    "Ovo é alimento versátil (proteína e micronutrientes). Leites vegetais (aveia, amêndoa, soja, coco etc.) variam em proteína e cálcio — muitos precisam ser fortificados. A escolha depende de alergias, aceitação sensorial e orientação nutricional. A TIA Nutri não indica marcas nem doses de suplementos derivados; discute conceitos e remete à consulta."
  ),
  k(
    "Suplementos e disbiose — abordagem educativa",
    "Disbiose",
    ["disbiose", "suplemento", "probiotico", "intestino"],
    "Disbiose envolve desequilíbrio da microbiota e pode coincidir com sintomas gastrointestinais. Estratégias alimentares (fibras, variedade quando tolerada) e, em alguns casos, probióticos/prebióticos são discutidos em consulta. A plataforma NÃO recomenda produtos, doses ou protocolos. Investigação e suplementação, se indicadas, são responsabilidade médica/nutricional."
  ),
  k(
    "Funções executivas da alimentação — visão geral",
    "Funções executivas",
    ["funcoes executivas", "alimentacao", "planejamento", "atencao", "tdah", "tea"],
    "As funções executivas da alimentação são habilidades mentais que organizam o ato de comer: planejar a refeição, iniciar e terminar, manter atenção à mesa, controlar impulsos (ex.: sair correndo ou só pedir o preferido), flexibilidade para lidar com mudanças no cardápio e memória de trabalho para seguir uma sequência (lavar as mãos → sentar → mastigar → engolir). Em TEA e TDAH, dificuldades nessas funções costumam aparecer como refeição caótica, abandono precoce da mesa, necessidade de muitos lembretes ou recusa quando a rotina muda. Apoiar com rotina visual, passos curtos e ambiente previsível reduz a carga cognitiva — sem pressão coercitiva."
  ),
  k(
    "Planejamento e iniciação na refeição",
    "Funções executivas",
    ["planejamento", "iniciacao", "rotina", "refeicao"],
    "Planejamento alimentar executivo inclui saber o que vem a seguir (lanche, jantar), reunir utensílios e prever a sequência da refeição. Iniciação é conseguir começar a comer sem muitos prompts. Estratégias educativas: aviso com antecedência (“em 5 minutos é a hora da mesa”), rotina fixa de pré-refeição (lavar mãos → prato → sentar), cardápio visual do dia e um único passo por vez. A Escada do Comer combina bem com isso: combinar o degrau atual do alimento com um plano simples e previsível."
  ),
  k(
    "Atenção sustentada e memória de trabalho à mesa",
    "Funções executivas",
    ["atencao", "memoria de trabalho", "mesa", "tdah"],
    "Atenção sustentada à mesa permite permanecer na refeição o tempo necessário sem dispersar a cada estímulo. Memória de trabalho guarda a sequência “pegar → levar à boca → mastigar → engolir”. Em TDAH, barulho, telas e conversas longas elevam a carga. Apoios: ambiente mais calmo, porções visuais claras, tempo de mesa realista (não eternizar), lembretes gentis de um passo por vez e pausas curtas planejadas. Não é “falta de educação”: é regulação executiva e sensorial."
  ),
  k(
    "Controle inibitório e flexibilidade alimentar",
    "Funções executivas",
    ["inibicao", "impulsividade", "flexibilidade", "novidade"],
    "Controle inibitório ajuda a pausar o impulso de rejeitar imediatamente, empurrar o prato ou só aceitar a marca preferida. Flexibilidade cognitiva permite lidar com pequena variação (mesmo alimento em formato ligeiramente diferente, outra marca com textura parecida). Na prática: mudanças mínimas e previsíveis (encadeamento), aviso prévio da novidade, alimento seguro sempre presente e celebrar microprogressos. Forçar “provar agora” sobrecarrega inibição e piora a ansiedade à mesa."
  ),
  k(
    "Regulação emocional e funções executivas na hora de comer",
    "Funções executivas",
    ["regulacao emocional", "ansiedade", "mesa", "pressao"],
    "Funções executivas e regulação emocional andam juntas na alimentação: frustração, medo sensorial ou pressão familiar reduzem a capacidade de planejar, esperar e persistir. Sinais: choro, fuga da mesa, engasgo antecipatório, shutdown. Estratégias: reduzir exigência verbal, manter tom calmo, oferecer escolha limitada (dois utensílios, dois locais do prato), validar o desconforto e voltar ao degrau da Escada em que a criança está segura. Se a desorganização for intensa e persistente, avaliar com nutricionista e, conforme o caso, TO, fonoaudiólogo ou saúde mental infantil."
  ),
  k(
    "Nutrição e comportamento no TEA",
    "Comportamento",
    ["nutricao", "comportamento", "tea", "sensorial"],
    "No TEA, a nutrição não 'cura' o transtorno, mas padrões alimentares muito restritos, desconforto gastrointestinal e sobrecarga sensorial à mesa podem acompanhar mais irritabilidade, ansiedade e desorganização. Hipersensibilidade a textura/cheiro/cor e necessidade de previsibilidade explicam parte da recusa. Abordagem: Escada do Comer, alimento seguro presente, sem pressão coercitiva, e avaliação nutricional/multiprofissional quando a variedade for muito baixa. A TIA Nutri educa e não diagnostica."
  ),
  k(
    "Nutrição e comportamento no TDAH",
    "Comportamento",
    ["nutricao", "comportamento", "tdah", "atencao"],
    "No TDAH, funções executivas da alimentação (iniciar, sustentar atenção, terminar) e rotinas irregulares de fome podem influenciar humor e energia. Refeições puladas, ambiente barulhento e busca por estímulos intensos na comida são comuns. Estratégias educativas: horários previsíveis, porções visuais claras, passos curtos, ambiente mais calmo. Medicamentos podem alterar apetite — isso é conversa com o médico prescritor. A plataforma não indica doses nem ajuste de medicação."
  ),
  k(
    "Dietas restritas, micronutrientes e disposição",
    "Comportamento",
    ["micronutrientes", "seletividade", "ferro", "disposicao"],
    "Cardápios muito curtos podem envolver risco de inadequação de ferro, zinco, cálcio, vitamina D, complexo B, ômega-3 e proteína de qualidade. Em alguns casos isso se associa a cansaço ou irritabilidade — mas só avaliação profissional confirma. A EloAlimentar/TIA Nutri não informa quantidades nem protocolos de suplementação; orienta a buscar nutricionista e, se preciso, exames com o médico."
  ),

  // —— Expansão TEA / TDAH / seletividade ——
  k(
    "TEA: previsibilidade à mesa",
    "TEA",
    ["tea", "previsibilidade", "rotina", "mesa"],
    "Crianças com TEA frequentemente precisam saber o que vem a seguir. Surpresas no prato (nova marca, novo corte, misturas) elevam a carga sensorial e comportamental. Apoios: cardápio visual, aviso prévio da novidade, mesmo utensílio, mesmo local à mesa e alimento seguro sempre presente."
  ),
  k(
    "TEA: hipersensibilidade olfativa e gustativa",
    "TEA",
    ["tea", "cheiro", "gosto", "sensorial"],
    "Cheiros de fritura, temperos fortes ou alimentos quentes próximos podem gerar recusa antes mesmo do toque. Estratégia: começar com tolerar o alimento no ambiente (longe), depois aproximar; servir frio ou morno conforme preferência; evitar perfumes fortes na cozinha na hora da oferta."
  ),
  k(
    "TEA: seletividade por marca e embalagem",
    "TEA",
    ["tea", "marca", "embalagem", "rigidez"],
    "Aceitar só uma marca é comum no TEA (mesma textura, cor e sabor). Encadeamento: mesma marca em formato ligeiramente diferente → marca parecida → alimento-alvo. Nunca retirar o seguro de uma vez."
  ),
  k(
    "TEA: misturas e molhos",
    "TEA",
    ["tea", "mistura", "molho", "prato"],
    "Muitas crianças com TEA recusam alimentos misturados (arroz com feijão, molho sobre a massa). Sirva componentes separados no prato; avance para contato mínimo (molho ao lado) só depois de tolerar os itens isolados."
  ),
  k(
    "TDAH: fome irregular e hiperfoco",
    "TDAH",
    ["tdah", "fome", "hiperfoco", "pulo de refeicao"],
    "No TDAH, hiperfoco em brincadeira/tela pode fazer a criança “esquecer” de comer e depois chegar à mesa irritada ou seletiva. Alarmes suaves, lanches previstos e ambiente sem disputa de estímulos ajudam a regular o apetite ao longo do dia."
  ),
  k(
    "TDAH: busca por crocância e sabor intenso",
    "TDAH",
    ["tdah", "crocante", "sabor", "estimulo"],
    "Algumas crianças com TDAH preferem texturas crocantes e sabores mais intensos (mais estímulo). Use isso a favor no encadeamento: parta do crocante seguro e avance para versões um pouco diferentes, sem saltar para pastosos pegajosos de uma vez."
  ),
  k(
    "TDAH: tempo de mesa e fuga",
    "TDAH",
    ["tdah", "fuga", "tempo", "mesa"],
    "Ficar sentado por muito tempo é difícil. Combine tempo curto e previsível (“vamos ficar 5 minutos”), use timer visual se ajudar, e permita pausa planejada. Pressão para “terminar o prato” piora a fuga."
  ),
  k(
    "Seletividade: alimento seguro",
    "Seletividade",
    ["alimento seguro", "preferido", "seletividade"],
    "Alimento seguro é aquele que a criança aceita com regularidade e baixa ansiedade. Deve estar presente nas ofertas de novidade. Ele ancora a segurança sensorial e emocional — não é “fazer birra”, é regulação."
  ),
  k(
    "Seletividade: exposição sem pressão",
    "Seletividade",
    ["exposicao", "pressao", "oferta"],
    "Exposição positiva = alimento presente, visível, tocável, sem exigência de comer. Pressão (“só uma colher”, “não sai da mesa sem comer”) aumenta aversão. Celebre degraus baixos da Escada."
  ),
  k(
    "Seletividade: neofobia alimentar",
    "Seletividade",
    ["neofobia", "novo", "medo"],
    "Neofobia é o medo/recusa de alimentos novos, comum na infância e mais intensa em alguns perfis neurodivergentes. A Escada do Comer e o encadeamento reduzido em passos pequenos são estratégias educativas compatíveis."
  ),
  k(
    "Arroz e feijão na seletividade",
    "Alimentos",
    ["arroz", "feijao", "brasileiro", "prato"],
    "Arroz e feijão juntos podem ser desafiadores (mistura + texturas). Comece com arroz soltinho sozinho; feijão com caldo limpo ou batido à parte; só depois aproxime no mesmo prato sem misturar. Use a Escada por alimento."
  ),
  k(
    "Verduras e folhas: por que são difíceis",
    "Alimentos",
    ["verdura", "folha", "fibra", "amargo"],
    "Folhas úmidas, fibrosas ou amargas costumam ser recusadas. Versões crocantes secas (chips de couve), floretes iguais ou palitos assados reduzem a carga. Cheiro no ambiente primeiro; toque depois."
  ),
  k(
    "Frutas: acidez, sementes e suculência",
    "Alimentos",
    ["fruta", "acidez", "semente", "suco"],
    "Frutas podem incomodar por acidez, sementes ou líquido escorrendo. Cortes iguais, secar a superfície, remover sementes e começar por frutas já próximas do aceite da criança ajudam."
  ),
  k(
    "Proteínas: carne, frango e ovo",
    "Alimentos",
    ["carne", "frango", "ovo", "proteina"],
    "Carnes fibrosas ou ovo com gema mole podem ser gatilho. Tiras iguais bem cozidas e secas, desfiado fino ou ovo em rodelas firmes são pontos de partida comuns. Sem temperos fortes no início."
  ),
  k(
    "Laticínios e texturas cremosas",
    "Alimentos",
    ["iogurte", "leite", "creme", "liso"],
    "Iogurte liso sem pedaços é frequentemente alimento seguro. Evite misturar granola/fruta no início. Encadeie depois para microtextura (fruta peneirada) conforme a Escada."
  ),
  k(
    "Sem glúten e sem leite — quando a família pergunta",
    "Alimentos",
    ["gluten", "leite", "restricao", "alergia"],
    "Restrições de glúten/leite por seletividade sensorial são diferentes de alergia/intolerância diagnosticada. A plataforma oferece receitas alternativas educativas; diagnóstico e exclusão clínica são do profissional. Não retire grupos sem orientação se houver risco nutricional."
  ),
  k(
    "Ambiente da refeição: luz, barulho e cheiros",
    "Ambiente",
    ["ambiente", "barulho", "luz", "cheiro"],
    "Ambiente hiperestimulante piora TEA e TDAH à mesa. Reduza TV/urgência, cheiros concorrentes e discussões. Luz confortável e poucos utensílios no campo visual ajudam."
  ),
  k(
    "Escola e seletividade",
    "Contexto",
    ["escola", "lanche", "rotina"],
    "Na escola, imprevisibilidade do cardápio e pressão social aumentam a recusa. Alinhe com a escola: alimento seguro na lancheira, tempo sem pressão, comunicação do degrau atual. A TIA Nutri orienta a família; não substitui projeto pedagógico."
  ),
  k(
    "Irmãos e comparação à mesa",
    "Contexto",
    ["irmaos", "comparacao", "pressao"],
    "Comparar com irmãos (“fulano come de tudo”) eleva vergonha e rigidez. Cada criança tem seu ritmo na Escada. Foque no microprogresso individual."
  ),
  k(
    "Quando a recusa piora de repente",
    "Sinais",
    ["piora", "doenca", "dor", "dente"],
    "Piora súbita pode coincidir com doença, dor dentária, otite, constipação, mudança de rotina ou medicação. Avalie saúde com o pediatra; na mesa, volte temporariamente a degraus mais baixos e ao alimento seguro."
  ),
  k(
    "Constipação e comportamento alimentar",
    "Gastro",
    ["constipacao", "intestino", "dor", "comportamento"],
    "Constipação pode gerar dor, irritabilidade e menos disposição para novidades alimentares. Hidratação e fibras dependem do que a criança tolera — condução é clínica. Enquanto investiga, evite pressão extra à mesa."
  ),
  k(
    "Oral-motor: mastigação e engasgo",
    "Rede",
    ["oral-motor", "engasgo", "mastigacao", "fono"],
    "Engasgos frequentes, baba excessiva, mastigação ineficiente ou recusa de texturas que exigem mastigação merecem avaliação fonoaudiológica. A Escada respeita o sistema oral: não force sólidos se o degrau ainda é líquido/pastoso liso."
  ),
  k(
    "TPS e seletividade",
    "Rede",
    ["tps", "to", "sensorial", "processamento"],
    "Transtorno do Processamento Sensorial (quando presente) amplifica respostas a textura, temperatura e cheiro. Terapeuta Ocupacional com abordagem sensorial pode integrar com o plano nutricional. A TIA Nutri não diagnostica TPS."
  ),
  k(
    "Como registrar progresso na Escada",
    "Escada",
    ["escada", "registro", "observacao", "degrau"],
    "Para cada alimento: anote o degrau atual (1–26) e uma observação curta (ex.: “cheirou sem chorar”). Compare semana a semana. Subir um degrau já é vitória. O app Escada do Comer foi feito para isso."
  ),
  k(
    "Encadeamento alimentar — regra de ouro",
    "Encadeamento",
    ["encadeamento", "mudanca minima", "seguro"],
    "Altere só UMA propriedade por vez: tamanho, marca, tempero, formato ou temperatura. Parta sempre do alimento seguro. Se a criança regredir, volte um passo — não reinicie do zero com pressão."
  ),
  k(
    "Jogos e brincar com comida (educativo)",
    "Jogos",
    ["jogo", "brincar", "exposicao"],
    "Jogos alimentares no app (dado sensorial, classificação, memória) ensaiam grupos e texturas com baixa pressão. Não substituem a Escada, mas reduzem ansiedade e aumentam familiaridade visual/tátil com alimentos."
  ),
  k(
    "Receitas em desenho — para que servem",
    "Receitas",
    ["receita", "desenho", "video", "preparo"],
    "Os vídeos em desenho mostram o preparo passo a passo de forma previsível para a mãe assistir com a criança. O objetivo não é “obrigar a comer o prato”, e sim familiarizar com o processo e a aparência do alimento."
  ),
  k(
    "Perguntas frequentes: “ele só come besteira”",
    "Seletividade",
    ["besteira", "ultraprocessado", "seguro"],
    "Muitas vezes o “seguro” é um ultraprocessado crocante previsível. Em vez de retirar de súbito, use-o como âncora e encadeie para versões caseiras/crocantes semelhantes (ex.: chips de batata-doce). Avaliação nutricional orienta o equilíbrio."
  ),
  k(
    "Perguntas frequentes: “e se não comer nada no jantar?”",
    "Seletividade",
    ["jantar", "nao comeu", "fome"],
    "Ofereça a refeição estruturada sem teatro. Se não comer, mantenha calma; evite virar a noite em negociação. Lanche previsto depois, sem culpar. Consistência reduz ansiedade familiar e da criança."
  ),
  k(
    "TEA + TDAH juntos na alimentação",
    "Comportamento",
    ["tea", "tdah", "comorbidade", "mesa"],
    "Quando TEA e TDAH coexistem, somam-se sensorialidade/rigidez com desatenção e impulsividade. Priorize ambiente calmo, previsibilidade visual, tempo de mesa curto e Escada por alimento. A equipe multiprofissional (nutri, TO, fono, médico) costuma ser ainda mais importante."
  ),
  k(
    "Sono, fome e seletividade",
    "Comportamento",
    ["sono", "fome", "cansaço"],
    "Má qualidade de sono piora regulação emocional e tolerância a novidades alimentares em TEA/TDAH. Em dias de cansaço, mantenha alimentos seguros e evite avançar degraus difíceis."
  ),
  k(
    "Água e líquidos na Escada",
    "Alimentos",
    ["agua", "liquido", "canudo"],
    "Alguns preferem só líquidos. Canudo, temperatura estável e copo previsível ajudam. A Escada também se aplica a novos líquidos (ex.: suco peneirado). Cuidado com engasgo — adaptar à idade."
  ),
  k(
    "Temperatura dos alimentos",
    "Sensorial",
    ["temperatura", "quente", "frio", "morno"],
    "Muitas crianças neurodivergentes têm faixa estreita de temperatura aceita (só frio ou só morno). Respeite a preferência no início; variar temperatura é um degrau avançado da Escada."
  ),
  k(
    "Como a TIA Nutri usa esta biblioteca",
    "Seguranca",
    ["rag", "biblioteca", "tia nutri"],
    "A TIA Nutri busca trechos desta biblioteca conforme a pergunta (RAG), combina com o perfil da criança ativa e responde de forma educativa. Sem chave OpenAI usa motor local especializado; com chave, o modelo gera formulação mais livre ainda ancorada nesta base e nas regras de segurança."
  ),
];

export function knowledgeCount() {
  return KNOWLEDGE_BASE.length;
}
