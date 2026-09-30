/**
 * Materiais originais enviados pela Andreza Dias (PDFs para plastificar / sessão).
 * Arquivos em content/materiais-andreza/ — entrega via API autenticada Gold + modo pro.
 */

export type AndrezaMaterial = {
  slug: string;
  file: string;
  title: string;
  summary: string;
  kind: "escada" | "jogo" | "sensorial" | "familia" | "guia";
};

export const ANDREZA_MATERIAIS: AndrezaMaterial[] = [
  {
    slug: "trilha-escada",
    file: "trilha-escada-do-comer.pdf",
    title: "Trilha da Escalada do Comer",
    summary: "Escada do Comer em desenho — cartaz para sessão e plastificação.",
    kind: "escada",
  },
  {
    slug: "bingo-alimentos",
    file: "bingo-dos-alimentos.pdf",
    title: "Bingo dos Alimentos",
    summary: "Jogo imprimível de reconhecimento e exposição positiva.",
    kind: "jogo",
  },
  {
    slug: "guia-bingo",
    file: "guia-bingo-alimentos.pdf",
    title: "Guia detalhado — Bingo dos Alimentos",
    summary: "Como conduzir o bingo na terapia / com a família.",
    kind: "guia",
  },
  {
    slug: "cartoes-sensoriais",
    file: "30-cartoes-sensoriais.pdf",
    title: "30 Cartões Sensoriais",
    summary: "Cartões para exploração sensorial sem pressão.",
    kind: "sensorial",
  },
  {
    slug: "guia-cartoes-sensoriais",
    file: "guia-cartoes-sensoriais.pdf",
    title: "Guia detalhado — Cartões Sensoriais",
    summary: "Orientações de uso dos cartões F2.",
    kind: "guia",
  },
  {
    slug: "roda-sensorial",
    file: "roda-sensorial.pdf",
    title: "Roda Sensorial",
    summary: "Roda para mapear respostas sensoriais ao alimento.",
    kind: "sensorial",
  },
  {
    slug: "dado-sentidos",
    file: "dado-dos-sentidos.pdf",
    title: "Dado dos Sentidos",
    summary: "Dado ilustrado para sortear olhar, cheirar, tocar…",
    kind: "jogo",
  },
  {
    slug: "dado-sentidos-print",
    file: "dado-dos-sentidos-print.pdf",
    title: "Dado dos Sentidos (versão impressão)",
    summary: "Versão alternativa para recortar e montar.",
    kind: "jogo",
  },
  {
    slug: "cartoes-conquista",
    file: "7-cartoes-conquista.pdf",
    title: "7 Cartões de Conquista",
    summary: "Recompensas visuais de microprogresso alimentar.",
    kind: "jogo",
  },
  {
    slug: "guia-conquista",
    file: "guia-cartoes-conquista.pdf",
    title: "Guia — Cartões de Conquista Alimentar",
    summary: "Como usar as conquistas com a criança e a família.",
    kind: "guia",
  },
  {
    slug: "album-alimentos",
    file: "album-de-alimentos.pdf",
    title: "Álbum de Alimentos",
    summary: "Álbum para registrar alimentos descobertos.",
    kind: "familia",
  },
  {
    slug: "guia-album",
    file: "guia-album-alimentos.pdf",
    title: "Guia — Álbum de Alimentos Descobertos",
    summary: "Passo a passo de uso do álbum com a família.",
    kind: "guia",
  },
  {
    slug: "cartilha-conduta",
    file: "cartilha-conduta.pdf",
    title: "Cartilha de Conduta",
    summary: "Material visual de conduta à mesa.",
    kind: "familia",
  },
  {
    slug: "guia-cartilha-familia",
    file: "guia-cartilha-conduta-familia.pdf",
    title: "Cartilha de Conduta para a Família",
    summary: "Guia/cartilha para entregar aos responsáveis.",
    kind: "familia",
  },
  {
    slug: "salada-mista",
    file: "salada-mista.pdf",
    title: "Salada mista (material visual)",
    summary: "Folha ilustrada de salada mista sem logo.",
    kind: "familia",
  },
];

export function getAndrezaMaterial(slug: string) {
  return ANDREZA_MATERIAIS.find((m) => m.slug === slug);
}
