/** Portfólio jurídico educativo — seletividade alimentar TEA/TDAH (Andreza Dias · CRN 10418). */

export type JuridicoItem = {
  n: number;
  question: string;
  answer: string;
};

export type JuridicoSection = {
  id: string;
  title: string;
  items: JuridicoItem[];
};

export const JURIDICO_CLOSING = "O acompanhamento nutricional e, quando necessário, jurídico é fundamental para avaliar o caso da criança, reunir documentos e definir a medida adequada.";

export const JURIDICO_META = {
  title: "Direitos e leis — seletividade alimentar",
  subtitle: "Perguntas e respostas educativas sobre legislação federal brasileira (TEA/TDAH e alimentação escolar).",
  author: "Andreza Dias · CRN 10418",
  date: "27/09/2026",
  disclaimer: "Conteúdo educativo. Não é consultoria jurídica individual, não promete resultado judicial e não substitui advogado(a) nem equipe de saúde. Minuta editorial para revisão jurídica.",
} as const;

export const JURIDICO_SECTIONS: JuridicoSection[] = [
  {
    id: "sec-1",
    title: "1. Direitos fundamentais e terapia alimentar",
    items: [
      {
        n: 1,
        question: "A seletividade alimentar é “birra” para a lei?",
        answer: "Não existe uma lei que defina toda recusa como diagnóstico. A escola deve considerar barreiras reais que impeçam participação e alimentação; o FNDE orienta que seletividade persistente pode exigir manejo individual, sem reduzi-la a “birra”. A avaliação clínica define repercussões e necessidades. [L4,L7]",
      },
      {
        n: 2,
        question: "A pessoa com TEA tem direito à nutrição adequada e terapia nutricional?",
        answer: "Sim. A Lei 12.764/2012, atualizada pela Lei 15.131/2025, incluiu expressamente nutrição adequada e terapia nutricional entre as ações e serviços de saúde para atenção integral à pessoa com TEA. A modalidade, o serviço disponível e o encaminhamento concreto dependem da avaliação e das normas de atendimento. [L1,L2]",
      },
      {
        n: 3,
        question: "O que a Lei 15.131/2025 mudou?",
        answer: "Explicitou que nutrição adequada e terapia nutricional incluem ações de promoção e proteção nutricional realizadas por profissional legalmente habilitado, observados protocolos e diretrizes competentes. Ela fortalece a fundamentação do pedido, mas não estabelece, sozinha, um número fixo de sessões ou pagamento automático de qualquer técnica. [L2]",
      },
      {
        n: 4,
        question: "TDAH isolado dá os mesmos direitos da Lei Berenice Piana?",
        answer: "Não automaticamente. A Lei 12.764 trata de TEA. A Lei 14.254/2021 prevê acompanhamento integral do estudante com TDAH, incluindo apoio educacional na rede e apoio terapêutico especializado na rede de saúde; outras proteções gerais à criança também se aplicam. Se houver deficiência concomitante, a análise muda. [L1,L6]",
      },
      {
        n: 5,
        question: "Preciso esperar o diagnóstico final para cuidar da alimentação?",
        answer: "Não. Família e equipe de saúde devem investigar risco e iniciar cuidado pertinente. Na escola pública, o FNDE orienta acolher e planejar adaptações para seletividade sem condicionar todo atendimento a laudo imediato; já a confecção de cardápio especial para condição específica exige avaliação e informações técnicas adequadas. [L1,L5,L7]",
      },
      {
        n: 6,
        question: "O município deve oferecer terapia alimentar semanal?",
        answer: "A lei reconhece atenção integral e terapia nutricional no TEA, mas não fixa “uma sessão por semana” para todos. Frequência precisa ser justificada pela avaliação profissional e discutida com a rede de saúde; negativas e filas podem exigir análise jurídica concreta. [L1,L2]",
      },
      {
        n: 7,
        question: "O SUS pode negar todo atendimento só porque é seletividade alimentar?",
        answer: "A atenção às necessidades de saúde não deve ser descartada apenas pelo rótulo. Peça avaliação formal e encaminhamento na rede; registre recusa por escrito e busque ouvidoria do SUS, Secretaria de Saúde, Defensoria ou MP conforme a situação. O serviço específico e o prazo dependem do caso e da organização local. [L1,L3]",
      },
      {
        n: 8,
        question: "Plano de saúde deve pagar toda terapia alimentar indicada?",
        answer: "Não há resposta automática. É preciso examinar tipo de contrato, segmentação, procedimento, Rol da ANS, indicação clínica e justificativa de eventual negativa. A Lei 15.131 reforça o direito à atenção nutricional no TEA, mas não substitui a análise de cobertura contratual e regulatória. Solicite protocolo e negativa escrita e procure a ANS/advogado se necessário. [L1,L8]",
      },
      {
        n: 9,
        question: "Relatório da nutricionista ajuda no pedido?",
        answer: "Sim: descreva repertório, ingestão, crescimento, riscos, metas, frequência proposta e necessidade funcional, de modo individualizado. Relatório fundamenta avaliação, mas não substitui sozinho as decisões da equipe escolar, do SUS ou da operadora. [L1,L2,L7]",
      },
    ],
  },
  {
    id: "sec-2",
    title: "2. Matrícula, inclusão e apoio na escola",
    items: [
      {
        n: 10,
        question: "A escola pode recusar matrícula por TEA ou seletividade alimentar?",
        answer: "Não pode recusar matrícula por deficiência. A Lei 12.764 prevê sanção para recusa de matrícula de estudante com TEA/deficiência, e a LBI garante educação inclusiva. Se a justificativa for alimentação, peça a recusa por escrito para analisar os fatos. [L1,L3]",
      },
      {
        n: 11,
        question: "Escola particular pode cobrar taxa extra por inclusão?",
        answer: "A LBI proíbe cobrar valores adicionais nas mensalidades, anuidades ou matrículas para cumprir as medidas de inclusão dos incisos aplicáveis do art. 28. Essa regra não resolve automaticamente qualquer despesa alimentar particular; uma cobrança específica deve ser examinada no contrato e no contexto. [L3]",
      },
      {
        n: 12,
        question: "Toda criança com TEA tem direito a acompanhante individual?",
        answer: "A Lei 12.764 assegura acompanhante especializado em classe comum **em caso de comprovada necessidade**. A oferta concreta deve ser avaliada por estudo de caso e pelo apoio necessário, sem concluir que cada diagnóstico gera um profissional exclusivo o tempo todo. [L1,L5]",
      },
      {
        n: 13,
        question: "O profissional de apoio escolar pode ajudar na hora de comer?",
        answer: "Sim, quando o apoio for necessário: o Decreto 12.686/2025, alterado pelo Decreto 12.773/2025, inclui higiene e alimentação entre suas atribuições, respeitando corpo, privacidade, tempo e escolhas do estudante. Não significa que o profissional possa realizar procedimento clínico de deglutição ou alimentação sem qualificação e plano apropriado. [L5]",
      },
      {
        n: 14,
        question: "A escola pode exigir laudo médico para sequer analisar o pedido de apoio?",
        answer: "O decreto federal prevê estudo de caso para a oferta do profissional de apoio escolar e afirma que ela independe do resultado de laudo ou relatório de saúde. Documentos clínicos podem colaborar, mas não devem ser barreira automática à avaliação educacional. [L5]",
      },
      {
        n: 15,
        question: "O que são PEI e PAEE? A alimentação pode aparecer neles?",
        answer: "O decreto estabelece documentos pedagógicos individualizados derivados do estudo de caso: Plano Educacional Individualizado (PEI) e Plano de Atendimento Educacional Especializado (PAEE), conforme sua aplicação. Estratégias para participar das refeições e comunicar necessidades podem ser articuladas ao plano escolar, quando pertinentes; não confundir com prescrição nutricional. [L5]",
      },
      {
        n: 16,
        question: "TDAH sozinho garante profissional de apoio ou AEE?",
        answer: "A Lei 14.254/2021 prevê acompanhamento integral, mas não concede automaticamente acompanhante ou AEE a todo estudante com TDAH. Avalie barreiras concretas, regras da rede e eventual deficiência associada; peça por escrito qual apoio será oferecido. [L5,L6]",
      },
      {
        n: 17,
        question: "Pode haver adaptação de horário, ambiente ou apresentação do prato?",
        answer: "São medidas a considerar quando necessárias para participação: rotina previsível, menos odores e ruído, tempo adequado, alimentos separados e apresentação tolerável. A nota técnica do FNDE orienta essas medidas na escola pública e recomenda planejamento com nutricionista e equipe escolar. A medida específica depende de viabilidade e avaliação individual. [L3,L7]",
      },
      {
        n: 18,
        question: "A escola pode obrigar a criança a provar ou terminar o prato?",
        answer: "A orientação técnica do FNDE recomenda experiências graduais e seguras, evitando exposições forçadas; o apoio escolar deve respeitar tempo e escolhas. Relate constrangimento ou força à direção, peça mudança de procedimento e documente episódios, sem concluir automaticamente uma tipificação penal. [L5,L7]",
      },
      {
        n: 19,
        question: "Pode colocar a criança para comer separada de todos?",
        answer: "Isolamento imposto pode criar barreira à participação. Um local mais tranquilo pode ser combinado quando ajuda e respeita preferências da criança, com plano para convivência e revisão periódica; ouvir a família e o estudante é essencial. [L3,L5,L7]",
      },
      {
        n: 20,
        question: "Escola pode pedir à mãe que compareça todos os dias para alimentar a criança?",
        answer: "A escola deve avaliar e organizar os apoios educacionais necessários à participação, inclusive na alimentação quando cabível. Uma solução provisória negociada não deve dispensar a rede de estudar e planejar o suporte; solicite resposta formal e plano com prazo. [L3,L5]",
      },
      {
        n: 21,
        question: "Pode restringir horário ou dispensar o aluno antes do almoço por seletividade?",
        answer: "Uma redução unilateral de permanência por deficiência pode comprometer inclusão. Peça justificativa escrita, estudo de caso e alternativas de apoio; situações de segurança clínica requerem avaliação individual, não uma regra geral de exclusão. [L1,L3,L5]",
      },
    ],
  },
  {
    id: "sec-3",
    title: "3. Alimentação escolar pública e privada",
    items: [
      {
        n: 22,
        question: "A alimentação escolar pública é direito?",
        answer: "Sim. A Lei 11.947/2009 estabelece a alimentação escolar como direito dos alunos da educação básica pública e dever do Estado, por meio das diretrizes do PNAE. O cardápio é planejado por nutricionista responsável da rede. [L4]",
      },
      {
        n: 23,
        question: "A Lei da Alimentação Escolar prevê cardápio especial?",
        answer: "Sim. O art. 12, §2º da Lei 11.947, incluído pela Lei 12.982/2014, prevê cardápio especial para aluno que necessite atenção nutricional individualizada devido a estado ou condição de saúde específica, baseado em recomendações médicas e nutricionais, avaliação e demandas diferenciadas. [L4]",
      },
      {
        n: 24,
        question: "Seletividade sem alergia também pode justificar adaptação no PNAE?",
        answer: "Sim, a Nota Técnica FNDE nº 5339254/2026 orienta reconhecer seletividade, inclusive em TEA e outros transtornos do neurodesenvolvimento, e estudar ajustes de textura, apresentação, temperatura e combinações. Isso não equivale a garantir sempre uma marca comercial ou a mesma preparação de casa. [L7]",
      },
      {
        n: 25,
        question: "A escola pública pode dizer “só adapto com laudo fechado de autismo”?",
        answer: "O FNDE orienta acolhimento e planejamento mesmo sem apresentação imediata de laudo, evitando que a demora diagnóstica impeça acesso à refeição. Para cardápio especial ligado a doença/alergia, avaliações e orientações técnicas são importantes; a documentação necessária depende do pedido. [L4,L7]",
      },
      {
        n: 26,
        question: "Quem decide o cardápio especial?",
        answer: "No PNAE, o nutricionista responsável técnico planeja o cardápio, em diálogo com família, escola e profissionais de saúde e considerando condição clínica, segurança alimentar e estrutura da rede. O pedido dos pais deve ser ouvido e analisado, mas não equivale a prescrição unilateral do cardápio escolar. [L4,L7]",
      },
      {
        n: 27,
        question: "A escola precisa comprar exatamente a marca do nugget aceito?",
        answer: "Não há garantia federal geral de marca específica. Documente por que marca/formato são decisivos, proponha alternativas e peça análise da nutricionista da rede. Se a falta de adaptação viável faz a criança ficar sem comer, esse impacto deve ser registrado e enfrentado pela gestão. [L4,L7]",
      },
      {
        n: 28,
        question: "Pode servir os alimentos separados e mudar a textura?",
        answer: "O FNDE aponta separação, textura, temperatura, apresentação e modo de preparo como dimensões relevantes. Peça avaliação de uma solução viável e nutricionalmente adequada, com observação da aceitação e revisão. [L7]",
      },
      {
        n: 29,
        question: "A criança pode levar comida de casa?",
        answer: "Não presuma proibição nem um direito irrestrito de substituir permanentemente a refeição pública. Solicite à direção regras sanitárias e da rede, explique a necessidade e peça plano transitório seguro enquanto o nutricionista do PNAE avalia opções. Para escola privada, examine regras contratuais e obrigações de inclusão; alergias podem demandar protocolos próprios. [L3,L4,L7]",
      },
      {
        n: 30,
        question: "A escola pode impedir água em recipiente próprio?",
        answer: "Se recipiente, canudo ou acesso à água funcionam como adaptação necessária, peça análise individual considerando higiene e segurança. Não há nesta base uma lei federal que garanta qualquer modelo de copo em toda escola; a recusa sem alternativa acessível pode ser questionada. [L3,L5]",
      },
      {
        n: 31,
        question: "Se o estudante passa a manhã sem comer, basta avisar a família?",
        answer: "A comunicação é importante, mas a rede pública deve investigar a barreira e planejar acesso efetivo à alimentação; a nota técnica recomenda prevenir situações em que o aluno fique sem comer pela ausência de adaptações adequadas. Risco à saúde exige providência imediata. [L4,L7]",
      },
      {
        n: 32,
        question: "Escola privada também segue a Lei 11.947/PNAE?",
        answer: "Em regra, o PNAE atende a educação básica pública e determinadas modalidades conveniadas conforme as regras do programa; não se deve aplicar automaticamente a obrigação de cardápio do PNAE a toda escola privada. Mesmo fora do PNAE, a LBI, o ECA e normas contratuais/educacionais orientam inclusão e proteção. [L3,L4]",
      },
      {
        n: 33,
        question: "Alergia ao leite, glúten ou amendoim dá direito a adaptação?",
        answer: "Condição de saúde específica que exige atenção nutricional fundamenta cardápio especial no PNAE, com recomendações e avaliação. Oriente plano de prevenção de contato cruzado e resposta a reações com nutricionista e equipe de saúde; não confundir alergia ao trigo com doença celíaca ou intolerância à lactose. [L4]",
      },
      {
        n: 34,
        question: "A escola pode usar doce ou punição para obrigar a comer?",
        answer: "A orientação técnica do FNDE rejeita exposição forçada e recomenda estratégias graduais e respeitosas. Registre o episódio e peça revisão das práticas; se há humilhação, violência ou risco, buscar proteção da criança e avaliação jurídica individual. [L3,L7]",
      },
      {
        n: 35,
        question: "A escola pode realizar terapia alimentar durante a merenda?",
        answer: "A merenda e a educação alimentar da escola não substituem terapia clínica. Pode haver estratégias pedagógicas e sensoriais pactuadas, com segurança e sem coerção, articuladas com profissionais; a terapia formal segue responsabilidade de profissional habilitado e plano individual. [L1,L2,L7]",
      },
    ],
  },
  {
    id: "sec-4",
    title: "4. Família, documentos e caminho diante de negativa",
    items: [
      {
        n: 36,
        question: "O que enviar à escola no primeiro pedido?",
        answer: "Carta simples com identificação da criança, dificuldades observáveis (o que come/recusa e riscos), medidas tentadas, adaptação solicitada e pedido de reunião com direção, coordenação e nutricionista. Anexe relatórios disponíveis sem expor dados além do necessário. Peça número de protocolo. [L4,L7]",
      },
      {
        n: 37,
        question: "Precisa ser laudo médico?",
        answer: "Nem toda medida pedagógica ou acolhimento do PNAE depende de laudo diagnóstico; relatórios médicos e nutricionais podem ser necessários para justificar cardápio especial de condição clínica e segurança. Se a escola invocar exigência absoluta, peça a base normativa específica por escrito. [L4,L5,L7]",
      },
      {
        n: 38,
        question: "Como documentar que a criança não consegue comer na escola?",
        answer: "Registre datas, cardápio oferecido, quantidade efetivamente ingerida, sintomas, comunicação com a escola e impacto no bem-estar; peça registros oficiais. Não divulgue imagens ou dados de outros estudantes. [L7]",
      },
      {
        n: 39,
        question: "O que fazer quando a direção responde “não podemos adaptar”?",
        answer: "Solicite justificativa escrita e reunião com nutricionista responsável e coordenação de inclusão. Apresente pedido concreto e alternativas viáveis, fixando prazo de resposta. Se houver risco nutricional, acione também equipe de saúde e instâncias da Secretaria de Educação. [L4,L5,L7]",
      },
      {
        n: 40,
        question: "Existe prazo legal fixo para qualquer escola responder?",
        answer: "Não há, nas normas federais citadas, um prazo único para todo pedido alimentar em toda rede e escola privada. Verifique regulamento local e canal usado; peça protocolo e prazo informado. Situação de risco à saúde não deve aguardar um fluxo burocrático comum. [L3,L4,L7]",
      },
      {
        n: 41,
        question: "A quem recorrer se a escola pública mantiver a negativa?",
        answer: "Em geral: direção → Secretaria Municipal/Estadual de Educação e nutricionista da entidade executora → ouvidoria do órgão/Conselho de Alimentação Escolar para questões do PNAE → Defensoria Pública, Conselho Tutelar ou Ministério Público conforme urgência e violação. O advogado analisa medidas administrativas e judiciais. [L4,L7]",
      },
      {
        n: 42,
        question: "E se for escola privada?",
        answer: "Peça resposta formal da direção/mantenedora, documente o contrato e as necessidades, procure canais de proteção do consumidor e órgãos de garantia de direitos da criança/deficiência conforme o caso. Advogada pode avaliar medida específica; a LBI proíbe discriminação e cobrança adicional por medidas de inclusão previstas. [L3]",
      },
      {
        n: 43,
        question: "Conselho Tutelar resolve cardápio?",
        answer: "Pode atuar para proteger direitos de criança e adolescente diante de ameaça ou violação, mas não substitui nutricionista no planejamento do cardápio nem advogado no exame de um litígio. Acione também a rede de educação e saúde. [L3,L4]",
      },
      {
        n: 44,
        question: "Preciso entrar com ação judicial logo?",
        answer: "Primeiro avalie urgência e reúna protocolo, negativa e relatórios. Algumas situações podem ser resolvidas por reunião e ajuste; risco grave ou recusa persistente pode justificar avaliação jurídica imediata. A IA não promete liminar. [L3,L4,L7]",
      },
      {
        n: 45,
        question: "Posso gravar reuniões ou publicar vídeo da criança?",
        answer: "As regras de gravação, privacidade e proteção de dados dependem de circunstâncias; obtenha orientação jurídica antes de divulgar gravações, sobretudo envolvendo outras crianças. Prefira ata da reunião e comunicação formal, protegendo dados sensíveis da criança. [L3]",
      },
      {
        n: 46,
        question: "Posso pedir que escola e terapeuta conversem?",
        answer: "Sim, com autorização da família e compartilhamento mínimo necessário de informações. Família, nutricionista da rede e equipe escolar podem elaborar medidas coerentes, respeitando atribuições de cada profissional. [L5,L7]",
      },
      {
        n: 47,
        question: "A criança deve participar das decisões?",
        answer: "Sempre que possível, sim: suas escolhas, formas de comunicação, desconfortos e objetivos precisam ser ouvidos. O decreto menciona respeito ao tempo e às escolhas na alimentação, e o FNDE recomenda atendimento individualizado. [L5,L7]",
      },
      {
        n: 48,
        question: "Quando rever as adaptações?",
        answer: "Após mudança de repertório, alergia, medicamento, estágio escolar ou aceitação, e periodicamente no estudo de caso/plano escolar. Medida não precisa ser eterna nem retirada sem monitorar se a criança continua se alimentando. [L5,L7]",
      },
    ],
  },
  {
    id: "sec-5",
    title: "5. Respostas de segurança para a IA",
    items: [
      {
        n: 49,
        question: "A IA pode dizer que toda criança com seletividade “tem direito a merendeira exclusiva”?",
        answer: "Não. Deve distinguir direito à alimentação e apoio necessário de uma pretensão por profissional exclusivo; escola e rede analisam estudo de caso, função e viabilidade, observando lei e decreto. [L4,L5,L7]",
      },
      {
        n: 50,
        question: "Pode dizer “sem laudo, não há direito algum”?",
        answer: "Não. O FNDE orienta acolher seletividade antes do laudo final; o decreto afasta o laudo como condição para avaliação do apoio escolar/AEE. A IA deve pedir os documentos úteis sem transformar ausência de CID em negativa automática. [L5,L7]",
      },
      {
        n: 51,
        question: "A IA pode prometer que plano de saúde é obrigado a pagar “sessões ilimitadas de terapia nutricional”?",
        answer: "Não. Deve separar o direito à saúde e à nutrição da análise de cobertura ANS, contrato, procedimento e justificativa clínica; encaminhar negativa escrita à ANS/advogado. [L2,L8]",
      },
      {
        n: 52,
        question: "O que dizer se a família relata engasgo ou alergia na escola?",
        answer: "Priorizar segurança clínica, plano de prevenção e encaminhamento de saúde; não sugerir exposição alimentar como adaptação escolar. Solicitar à escola registro do evento e protocolo individual de segurança. [L4,L7]",
      },
      {
        n: 53,
        question: "Como diferenciar “direito” de “boa prática”?",
        answer: "Dizer em linguagem simples: “A lei estabelece X; o decreto detalha Y; a nota técnica do FNDE recomenda Z; a medida concreta depende de estudo de caso”. Cada ficha da IA deve registrar qual tipo de fonte sustenta a resposta. [L1–L8]",
      },
      {
        n: 54,
        question: "E se o município ou escola citar uma regra contrária?",
        answer: "Solicitar texto, número e data da norma; conferir sua vigência e compatibilidade com normas superiores, considerando o tipo de escola. Não declarar a norma local inválida sem análise jurídica. [L1–L8]",
      },
      {
        n: 55,
        question: "Quem revisa esta base antes da publicação?",
        answer: "Advogadas habilitadas devem revisar as interpretações e fluxos; nutricionista valida a parte alimentar e profissional da educação verifica aplicação escolar. Registrar data, versão e alterações da legislação em cada resposta. [L1–L8]",
      },
    ],
  },
];

export function allJuridicoItems() {
  return JURIDICO_SECTIONS.flatMap((s) => s.items);
}

