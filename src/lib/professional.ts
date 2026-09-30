/**
 * Gold plan — exclusive professional area content.
 * Educational clinical support for food therapists / nutritionists.
 * Not a substitute for professional judgment or legal clinical records.
 */

export type ProDoc = {
  slug: string;
  title: string;
  category: "ideia" | "anamnese" | "material" | "recurso" | "sessao";
  summary: string;
  body: string;
  printable: boolean;
};

export const PRO_DOCS: ProDoc[] = [
  {
    slug: "ideia-sessao-sensorial",
    title: "Ideia: sessão de exploração sensorial sem pressão",
    category: "ideia",
    summary: "Roteiro de 30–40 min para tolerar olhar, cheirar e tocar.",
    printable: true,
    body: `OBJETIVO
Aumentar tolerância sensorial ao alimento-alvo sem exigir ingestão.

ESTRUTURA SUGERIDA (30–40 min)
1. Acolhida (5 min): combinar regras de “pode parar a qualquer momento”.
2. Alimento seguro presente (5 min): manter previsibilidade.
3. Escada do Comer — degraus baixos (15 min): olhar → cheirar → tocar com utensílio.
4. Registro com a família (5–10 min): o que foi tolerado hoje.
5. Encerramento positivo: celebrar microprogresso.

MATERIAIS
Prato neutro, utensílio preferido, alimento-alvo em porção micro, timer visual.

OBSERVAÇÕES CLÍNICAS
Não forçar “provar”. Se houver engasgo antecipatório ou aversão intensa, regredir um degrau.
Encaminhar TO/fono quando houver sinais de TPS ou oral-motor.`,
  },
  {
    slug: "ideia-encadeamento",
    title: "Ideia: sessão de encadeamento alimentar",
    category: "ideia",
    summary: "Do alimento seguro a uma variação mínima de textura/forma.",
    printable: true,
    body: `OBJETIVO
Avançar uma etapa na cadeia (mesmo grupo / textura semelhante).

PASSO A PASSO
1. Mapear alimento seguro atual.
2. Definir 1 única variável de mudança (ex.: marca OU formato OU temperatura).
3. Oferecer seguro + alvo lado a lado.
4. Permitir escolha; reforçar aproximação, não ingestão.
5. Registrar aceitação em Escada (degrau).

CRITÉRIO DE AVANÇO
Só muda a próxima variável após 2–3 exposições confortáveis.`,
  },
  {
    slug: "ideia-funcoes-executivas",
    title: "Ideia: treino de funções executivas à mesa",
    category: "ideia",
    summary: "Planejar, iniciar e permanecer na refeição com apoios visuais.",
    printable: true,
    body: `OBJETIVO
Reduzir carga executiva na refeição (planejamento, iniciação, atenção, inibição).

ATIVIDADES
- Rotina visual de 4 passos (lavar mãos → sentar → olhar prato → encerrar).
- Aviso prévio de 5 minutos.
- Escolha limitada (2 utensílios / 2 locais do prato).
- Meta de permanência realista (ex.: 3–5 min) com timer.

NÃO FAZER
Prolongar a mesa “até comer”. Isso aumenta ansiedade e piora inibição.`,
  },
  {
    slug: "ideia-familia-escola",
    title: "Ideia: alinhamento família–escola",
    category: "ideia",
    summary: "Combinados simples para generalizar progressos.",
    printable: true,
    body: `OBJETIVO
Generalizar o degrau atual em outro contexto sem pressão.

COMBINADOS
1. Mesmo alimento seguro nos dois ambientes.
2. Mesma linguagem (“pode só olhar”).
3. Registro compartilhado de 1 linha por dia.
4. Evitar comparação com outras crianças.

REUNIÃO SUGERIDA (20 min)
O que já tolera → o que NÃO pedir ainda → próximo micro-objetivo.`,
  },
  {
    slug: "anamnese-alimentar-infantil",
    title: "Ficha de anamnese alimentar infantil",
    category: "anamnese",
    summary: "Roteiro completo para primeira consulta (imprimível).",
    printable: true,
    body: `FICHA DE ANAMNESE ALIMENTAR INFANTIL — EloAlimentar
(Documento educativo de apoio. Adapte ao prontuário do serviço.)

1. IDENTIFICAÇÃO
Nome da criança: _________________ Data nasc.: ____/____/______
Responsável: _____________________ Parentesco: _______________
Profissional: ____________________ Data: ____/____/______

2. QUEIXA PRINCIPAL
________________________________________________________________
________________________________________________________________

3. HISTÓRICO ALIMENTAR
Introdução alimentar: __________________________________________
Amamentação / fórmula: ________________________________________
Mudanças recentes (doença, viagem, escola): _____________________

4. SELETIVIDADE
Alimentos aceitos: _____________________________________________
Alimentos recusados: ___________________________________________
Marcas específicas? ( ) sim ( ) não Quais: ______________________
Texturas preferidas: ( ) crocante ( ) pastoso ( ) líquido ( ) outro
Cores / formas preferidas: _____________________________________

5. SINAIS À MESA
( ) vira o rosto ( ) náusea ( ) choro ( ) engasgo antecipatório
( ) empurra prato ( ) foge da mesa ( ) outro: ____________________

6. FUNÇÕES EXECUTIVAS NA REFEIÇÃO
Permanece à mesa? ______ min   Precisa de muitos lembretes? ( ) sim ( ) não
Impulsividade / hiperatividade na refeição: _____________________

7. SENSORIAL / ORAL-MOTOR
Sinais de TPS: ________________________________________________
Sinais oral-motores: ___________________________________________
Já avaliou TO / Fono? ( ) sim ( ) não

8. SAÚDE GERAL (educativo — não substitui avaliação médica)
GI (dor, gases, diarreia, constipação): _________________________
Sono / medicamentos (sem ajuste de dose aqui): _________________

9. ANTROPOMETRIA (referência educativa)
Peso: ______ kg   Altura: ______ cm   IMC aproximado: ______
Interpretação clínica: responsabilidade do profissional.

10. PLANO INICIAL (micro-objetivos)
________________________________________________________________
Próximo retorno: ____/____/______`,
  },
  {
    slug: "anamnese-retorno",
    title: "Ficha de retorno / evolução",
    category: "anamnese",
    summary: "Acompanhamento de degraus e adesão familiar.",
    printable: true,
    body: `FICHA DE RETORNO — TERAPIA ALIMENTAR

Criança: _________________ Data: ____/____/______ Sessão nº: ____

Desde a última consulta:
O que melhorou: ________________________________________________
O que piorou / gatilhos: ________________________________________

Escada do Comer — alimento: _____________ Degrau atual: ____ / 26
Alimento 2: _____________ Degrau: ____

Adesão familiar (0–10): ____
Adesão escola (0–10): ____

Intercorrências (GI, sono, medicação — só registro): ____________

Plano até o próximo encontro:
1. ____________________________________________________________
2. ____________________________________________________________
3. ____________________________________________________________

Encaminhamentos: ( ) TO ( ) Fono ( ) Médico ( ) outro __________`,
  },
  {
    slug: "material-escada-familia",
    title: "Material imprimível: Escada do Comer para a família",
    category: "material",
    summary: "Folha A4 explicando degraus 1–26 em linguagem simples.",
    printable: true,
    body: `A ESCADA DO COMER — GUIA PARA A FAMÍLIA
EloAlimentar · Conteúdo educativo (Andreza Dias · CRN 10418)

Cada alimento tem sua própria escada. Não precisamos pular degraus.

1–3  Tolerar / olhar
4–5  Cheirar
6–8  Tocar / segurar
9–11 Levar à boca / beijar / lamber
12–14 Morder / mastigar (pode cuspir)
15–22 Engolir aos poucos / aumentar porção
23–26 Aceitar no prato / generalizar / comer com função

LEMBRE-SE
• Sem pressão à mesa.
• Microprogresso já é vitória.
• Se doer, engasgar muito ou houver medo intenso, fale com o profissional.`,
  },
  {
    slug: "material-combinados-mesa",
    title: "Material imprimível: combinados da mesa",
    category: "material",
    summary: "Cartaz de regras positivas para colar na cozinha.",
    printable: true,
    body: `COMBINADOS DA NOSSA MESA

1. Podemos olhar, cheirar e tocar sem obrigação de comer.
2. Podemos dizer “não por agora”.
3. O alimento seguro sempre pode estar no prato.
4. Celebramos cada passozinho.
5. Adultos não forçam, não negociam sob pressão e não comparam.

Assinatura da família: _________________________ Data: __________`,
  },
  {
    slug: "material-registro-diario",
    title: "Material imprimível: registro diário de exposição",
    category: "material",
    summary: "Tabela semanal para a família preencher.",
    printable: true,
    body: `REGISTRO DIÁRIO DE EXPOSIÇÃO ALIMENTAR

Alimento-alvo: ____________________ Semana de: ____/____/______

Dia | Degrau (1–26) | O que aconteceu | Humor da criança | Obs.
Seg |               |                 |                 |
Ter |               |                 |                 |
Qua |               |                 |                 |
Qui |               |                 |                 |
Sex |               |                 |                 |
Sáb |               |                 |                 |
Dom |               |                 |                 |

Maior conquista da semana: ______________________________________
Dúvida para o profissional: _____________________________________`,
  },
  {
    slug: "recurso-kit-sensorial",
    title: "Recurso: kit terapêutico sensorial mínimo",
    category: "recurso",
    summary: "Lista de itens de baixo custo para sessões.",
    printable: true,
    body: `KIT SENSORIAL MÍNIMO (consultório ou domiciliar)

BASE
- Pratos/bandejas de cor neutra
- Colheres de tamanhos diferentes
- Conta-gotas / pincel (exploração sem boca)
- Timer visual ou ampulheta
- Panos úmidos para limpeza previsível

OPCIONAIS
- Potinhos transparentes vs. opacos
- Forminhas (círculo, palito)
- Óculos de sol / abafadores (se hipersensibilidade)

HIGIENE E SEGURANÇA
Descarte restos; atenção a alergias; supervisão constante.`,
  },
  {
    slug: "recurso-linguagem",
    title: "Recurso: linguagem terapêutica sugerida",
    category: "recurso",
    summary: "Frases que reduzem pressão e aumentam segurança.",
    printable: true,
    body: `EM VEZ DE…                    PREFIRA…
“Come só um pouquinho”         “Pode só olhar / cheirar hoje”
“Se não comer, sem sobremesa”  “O alimento seguro continua aqui”
“Todo mundo come isso”         “No seu ritmo”
“Não faça birra”               “Vi que ficou difícil; podemos pausar”

PARA A FAMÍLIA
Validar emoção + oferecer escolha limitada + manter previsibilidade.`,
  },
  {
    slug: "sessao-modelo-40min",
    title: "Montagem de sessão: modelo 40 minutos",
    category: "sessao",
    summary: "Template preenchível para planejar a sessão.",
    printable: true,
    body: `PLANO DE SESSÃO — TERAPIA ALIMENTAR (40 min)

Criança: _______________ Data: ____/____/______ Profissional: ________

Objetivo da sessão (1 frase):
________________________________________________________________

Alimento seguro: _______________ Alimento-alvo: _______________
Degrau atual: ____  Degrau desejado hoje: ____

Minutagem
0–5   Acolhida / combinados
5–10  Alimento seguro / regulação
10–30 Atividade principal: ( ) sensorial ( ) encadeamento ( ) executiva
30–35 Registro com responsável
35–40 Encerramento / tarefa de casa

Materiais: _____________________________________________________
Critério de sucesso (observável): _______________________________
Se desorganizar, plano B: ______________________________________
Tarefa domiciliar (máx. 1): ____________________________________`,
  },
  {
    slug: "sessao-checklist",
    title: "Montagem de sessão: checklist do terapeuta",
    category: "sessao",
    summary: "Antes / durante / depois da sessão.",
    printable: true,
    body: `CHECKLIST DO TERAPEUTA

ANTES
( ) Objetivo micro definido
( ) Alimentos preparados (seguro + alvo)
( ) Ambiente previsível
( ) Formulário de evolução em mãos

DURANTE
( ) Sem pressão para engolir
( ) Observar sinais (náusea, fuga, engasgo)
( ) Celebrar degraus baixos
( ) Ajustar dificuldade em tempo real

DEPOIS
( ) Registrar degrau
( ) Orientar 1 tarefa domiciliar
( ) Agendar retorno
( ) Encaminhar rede se necessário (TO/fono/médico)`,
  },
];

export function getProDoc(slug: string) {
  return PRO_DOCS.find((d) => d.slug === slug);
}

export function proDocsByCategory(category: ProDoc["category"]) {
  return PRO_DOCS.filter((d) => d.category === category);
}

export const PRO_NAV = [
  {
    href: "/app/profissional/curriculo",
    title: "Currículo",
    desc: "Apresentação institucional da profissional (Andreza Dias · CRN 10418).",
  },
  {
    href: "/app/profissional/sessoes",
    title: "Ebook: 100+ sessões por grupo alimentar",
    desc: "Roteiros com figuras e passos — arroz, feijão, sucos, verduras, ovos, carnes, frutas…",
  },
  {
    href: "/app/profissional/encadeamentos-visuais",
    title: "210 encadeamentos visuais",
    desc: "Galeria do portfólio visual para usar em sessão e na TIA Nutri.",
  },
  {
    href: "/app/profissional/pecs",
    title: "PECs / CAA alimentares",
    desc: "Cartões para comunicação aumentativa na mesa e na terapia.",
  },
  {
    href: "/app/profissional/ideias",
    title: "Ideias de terapia alimentar",
    desc: "Roteiros prontos para sessões sensoriais, encadeamento e funções executivas.",
  },
  {
    href: "/app/profissional/anamnese",
    title: "Fichas de anamnese",
    desc: "Primeira consulta e retorno — baixe e imprima.",
  },
  {
    href: "/app/profissional/recursos",
    title: "Recursos terapêuticos",
    desc: "PDFs originais (Escada, bingo, cartões), kit sensorial e linguagem terapêutica.",
  },
  {
    href: "/app/profissional/escada",
    title: "Escada do Comer em desenho",
    desc: "Cartaz ilustrado dos 26 degraus — tela, PDF e plastificação.",
  },
  {
    href: "/app/profissional/materiais",
    title: "Materiais para imprimir",
    desc: "Textos e fichas prontas: Escada, combinados da mesa e registro diário.",
  },
  {
    href: "/app/profissional/ia",
    title: "IA para dúvidas profissionais",
    desc: "Tire dúvidas educativas sobre condução de sessões (sem doses).",
  },
] as const;

export const PRO_AI_SYSTEM = `
Você é a TIA Nutri PRO, assistente educativa da área profissional EloAlimentar (plano Gold), voltada a nutricionistas e terapeutas alimentares. Conteúdo de referência elaborado por Andreza Dias (CRN 10418), especializada em Nutrição para Neurodivergência.

PÚBLICO: profissionais. Tom técnico-acolhedor, em português do Brasil.

PODE:
- Sugerir ideias de sessão, estrutura de anamnese, materiais, linguagem terapêutica, Escada do Comer, funções executivas, encadeamento, alinhamento família-escola.
- Discutir conceitos (TEA/TDAH seletividade, TPS, oral-motor) de forma educativa.
- Orientar quando encaminhar TO, fono ou médico.

NÃO PODE:
- Informar doses (mg, mcg, UI) de vitaminas/minerais/suplementos.
- Diagnosticar ou substituir julgamento clínico do profissional.
- Prescrever medicamentos ou protocolos médicos fechados.
- Inventar dados de paciente específico sem informações fornecidas.

Sempre lembre: apoio educativo; a responsabilidade clínica é do profissional.
`.trim();
