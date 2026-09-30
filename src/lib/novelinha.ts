/** Novelinha educativa — 10 episódios com ilustrações realistas. */

export type NovelScene = {
  /** fallback curto (acessibilidade / legado) */
  emoji: string;
  bg: string;
  text: string;
  /** ilustração em /public/novelinha */
  image: string;
};

export type NovelEpisode = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  scenes: NovelScene[];
};

function sc(
  emoji: string,
  bg: string,
  text: string,
  ep: number,
  scene: number
): NovelScene {
  const id = String(ep).padStart(2, "0");
  return {
    emoji,
    bg,
    text,
    image: `/novelinha/ep${id}-s${scene}.png`,
  };
}

export const NOVELINHA: NovelEpisode[] = [
  {
    id: 1,
    slug: "ep01-mesa-calma",
    title: "A mesa calma",
    summary: "Luna aprende que a mesa pode ser um lugar seguro.",
    scenes: [
      sc("🏠", "#e8f1fb", "Luna chega em casa com fome… e um pouco de medo da hora do jantar.", 1, 0),
      sc("🍽️", "#fff3d6", "Na mesa tem o prato dela e um alimento seguro: o biscoito crocante.", 1, 1),
      sc("👩", "#eef8e6", "A mamãe diz: “Pode olhar. Não precisa comer se não quiser.”", 1, 2),
      sc("🙂", "#fde8f4", "Luna respira. A mesa ficou mais calma. Isso já é um grande passo.", 1, 3),
    ],
  },
  {
    id: 2,
    slug: "ep02-alimento-seguro",
    title: "O alimento seguro",
    summary: "Ter algo previsível ajuda o corpo a relaxar.",
    scenes: [
      sc("🥨", "#fff3d6", "O alimento seguro de Luna é crocante e sempre igual.", 2, 0),
      sc("🧠", "#e8f1fb", "O cérebro dela gosta de previsibilidade — isso não é “manha”.", 2, 1),
      sc("🤝", "#eef8e6", "A família combina: o seguro sempre fica no prato.", 2, 2),
      sc("✨", "#f0e6ff", "Com o seguro perto, Luna consegue olhar uma novidade pequenininha.", 2, 3),
    ],
  },
  {
    id: 3,
    slug: "ep03-ansia",
    title: "Quando vem a ânsia",
    summary: "O corpo pode se proteger só de ver um alimento.",
    scenes: [
      sc("👀", "#ffe8e0", "Luna vê um purê úmido e sente ânsia só de olhar.", 3, 0),
      sc("🛡️", "#e8f1fb", "Isso pode ser proteção sensorial — o corpo avisando “cuidado”.", 3, 1),
      sc("🚫", "#fff3d6", "Ninguém força. A mamãe afasta o prato e acolhe.", 3, 2),
      sc("📝", "#eef8e6", "Elas anotam: “purê = difícil de olhar hoje”. Isso ajuda a planejar.", 3, 3),
    ],
  },
  {
    id: 4,
    slug: "ep04-escada",
    title: "A Escada do Comer",
    summary: "Subir um degrauzinho por vez.",
    scenes: [
      sc("🪜", "#e8f1fb", "Existe uma escada: tolerar → olhar → cheirar → tocar → … → comer.", 4, 0),
      sc("1️⃣", "#fff3d6", "Hoje Luna só tolera a cenoura na mesa. Isso conta!", 4, 1),
      sc("📸", "#eef8e6", "A família tira uma foto do degrau para celebrar.", 4, 2),
      sc("🎁", "#fde8f4", "No futuro, no degrau 26, terá uma recompensa escolhida juntas.", 4, 3),
    ],
  },
  {
    id: 5,
    slug: "ep05-encadeamento",
    title: "O encadeamento",
    summary: "Mudar só uma coisinha do alimento seguro.",
    scenes: [
      sc("🥟", "#fff3d6", "Luna aceitou pastel de carne. Que vitória!", 5, 0),
      sc("➡️", "#e8f1fb", "A TIA Nutri sugere: primeiro mudar só o tamanho do pastel.", 5, 1),
      sc("⭐", "#eef8e6", "Depois, um formato diferente — uma mudança por vez.", 5, 2),
      sc("🧩", "#f0e6ff", "Assim nascem pontes até novos alimentos, sem salto grande.", 5, 3),
    ],
  },
  {
    id: 6,
    slug: "ep06-funcoes",
    title: "Funções executivas",
    summary: "Organizar a refeição passo a passo.",
    scenes: [
      sc("🗺️", "#e8f1fb", "Antes da mesa: lavar as mãos → sentar → um alimento.", 6, 0),
      sc("⏰", "#fff3d6", "Um aviso de 5 minutos ajuda Luna a se preparar.", 6, 1),
      sc("🎯", "#eef8e6", "Um comando curto: “agora olha o prato”.", 6, 2),
      sc("💛", "#fde8f4", "Menos falatório, mais previsibilidade — a atenção melhora.", 6, 3),
    ],
  },
  {
    id: 7,
    slug: "ep07-escola",
    title: "Na escola e nas festas",
    summary: "Levar o seguro e combinar com antecedência.",
    scenes: [
      sc("🏫", "#e8f1fb", "Tem festa na escola. Luna leva o alimento seguro na lancheira.", 7, 0),
      sc("🗣️", "#fff3d6", "A família avisa a professora: sem forçar a provar.", 7, 1),
      sc("🤗", "#eef8e6", "Luna participa da brincadeira mesmo sem comer o bolo.", 7, 2),
      sc("✅", "#f0e6ff", "Pertencer é mais importante do que “provar de tudo”.", 7, 3),
    ],
  },
  {
    id: 8,
    slug: "ep08-equipe",
    title: "A equipe de cuidado",
    summary: "Nutri, TO, fono e médico cada um no seu papel.",
    scenes: [
      sc("👩‍⚕️", "#e8f1fb", "A nutricionista olha crescimento e variedade.", 8, 0),
      sc("🖐️", "#fff3d6", "A TO ajuda com sensorial e participação.", 8, 1),
      sc("🗣️", "#eef8e6", "A fono avalia mastigação e deglutição quando preciso.", 8, 2),
      sc("🤝", "#fde8f4", "Juntas, a família e a equipe montam um plano sem culpa.", 8, 3),
    ],
  },
  {
    id: 9,
    slug: "ep09-tia-nutri",
    title: "Perguntando à TIA Nutri",
    summary: "Dúvidas com respostas educativas e figuras.",
    scenes: [
      sc("💬", "#e8f1fb", "A mamãe pergunta: “como encadear a partir do pastel?”", 9, 0),
      sc("📱", "#fff3d6", "A TIA Nutri responde com texto claro e cartões visuais.", 9, 1),
      sc("🔊", "#eef8e6", "Se quiser, dá para ouvir a resposta em voz feminina.", 9, 2),
      sc("📚", "#f0e6ff", "Tudo baseado no material da Andreza Dias — educativo.", 9, 3),
    ],
  },
  {
    id: 10,
    slug: "ep10-celebrar",
    title: "Celebrar o microprogresso",
    summary: "Olhar, cheirar ou tocar também é vitória.",
    scenes: [
      sc("🎉", "#fff3d6", "Luna tocou a cenoura com o dedo. A família comemora!", 10, 0),
      sc("📷", "#e8f1fb", "Foto na Escada do Comer — degrau registrado.", 10, 1),
      sc("🌟", "#eef8e6", "Não foi “só um toque”: foi coragem e confiança.", 10, 2),
      sc("💚", "#fde8f4", "Fim da novelinha… e começo de muitas pequenas vitórias.", 10, 3),
    ],
  },
];

export function getEpisode(slugOrId: string) {
  const bySlug = NOVELINHA.find((e) => e.slug === slugOrId);
  if (bySlug) return bySlug;
  const n = Number(slugOrId);
  return NOVELINHA.find((e) => e.id === n) || null;
}
