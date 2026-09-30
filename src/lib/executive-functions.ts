/** Funções executivas da alimentação — cards visuais educativos. */

export type ExecCard = {
  id: string;
  title: string;
  emoji: string;
  color: string;
  bg: string;
  short: string;
  tips: string[];
};

export const EXECUTIVE_FEEDING: ExecCard[] = [
  {
    id: "planejamento",
    title: "Planejamento",
    emoji: "🗺️",
    color: "#2872c3",
    bg: "#e8f1fb",
    short: "Organizar o que vem antes, durante e depois da refeição.",
    tips: [
      "Aviso de 5 minutos antes da mesa",
      "Sequência visual: lavar mãos → sentar → um alimento",
      "Deixar utensílio e prato previsíveis",
    ],
  },
  {
    id: "iniciacao",
    title: "Iniciação",
    emoji: "🚦",
    color: "#65b21e",
    bg: "#eef8e6",
    short: "Começar a refeição ou o próximo passo sem travar.",
    tips: [
      "Um comando curto por vez",
      "Começar pelo alimento seguro",
      "Timer visual de início (1–2 min)",
    ],
  },
  {
    id: "atencao",
    title: "Atenção à mesa",
    emoji: "🎯",
    color: "#e31794",
    bg: "#fde8f4",
    short: "Manter o foco no prato e no ambiente da refeição.",
    tips: [
      "Reduzir estímulos competindo (TV/celular se dispersar)",
      "Porção pequena e clara no campo visual",
      "Pausas curtas planejadas em vez de fuga",
    ],
  },
  {
    id: "inibicao",
    title: "Inibição",
    emoji: "✋",
    color: "#c47f1a",
    bg: "#fff3e0",
    short: "Frear impulso de empurrar o prato, gritar ou sair correndo.",
    tips: [
      "Combinar “pode pedir pausa” com palavra combinada",
      "Oferecer escolha limitada (2 opções)",
      "Não transformar a mesa em confronto",
    ],
  },
  {
    id: "flexibilidade",
    title: "Flexibilidade",
    emoji: "🔄",
    color: "#0056b3",
    bg: "#e8f0fa",
    short: "Aceitar pequenas mudanças de marca, formato ou lugar.",
    tips: [
      "Mudar só UMA variável por vez (encadeamento)",
      "Avisar a mudança com antecedência",
      "Manter o alimento seguro ao lado",
    ],
  },
  {
    id: "memoria",
    title: "Memória de trabalho",
    emoji: "🧠",
    color: "#0e7c7b",
    bg: "#d9efee",
    short: "Lembrar a sequência: mastigar → engolir → próximo passo.",
    tips: [
      "Lembrete gentil de um único passo",
      "Cartão visual com 3 passos no máximo",
      "Repetir a mesma rotina por vários dias",
    ],
  },
  {
    id: "emocao",
    title: "Regulação emocional",
    emoji: "💛",
    color: "#b45309",
    bg: "#fff7ed",
    short: "Lidar com ânsia, medo e frustração à mesa.",
    tips: [
      "Validar a sensação (“o corpo está se protegendo”)",
      "Recuar um degrau na Escada se houver pânico",
      "Encerrar a refeição com previsibilidade, sem humilhação",
    ],
  },
];
