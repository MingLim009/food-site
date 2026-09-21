export type Question = {
  id: string;
  text: string;
  options: { label: string; score: number }[];
};

export const SELECTIVITY_QUESTIONS: Question[] = [
  {
    id: "q1",
    text: "Quantos alimentos diferentes a criança aceita regularmente?",
    options: [
      { label: "Mais de 20", score: 0 },
      { label: "10 a 20", score: 1 },
      { label: "5 a 9", score: 2 },
      { label: "Menos de 5", score: 3 },
    ],
  },
  {
    id: "q2",
    text: "A criança recusa alimentos por textura (ex.: cremoso, crocante, fibroso)?",
    options: [
      { label: "Raramente", score: 0 },
      { label: "Às vezes", score: 1 },
      { label: "Frequentemente", score: 2 },
      { label: "Quase sempre", score: 3 },
    ],
  },
  {
    id: "q3",
    text: "Há preferência rígida por cor ou formato do alimento?",
    options: [
      { label: "Não", score: 0 },
      { label: "Leve", score: 1 },
      { label: "Moderada", score: 2 },
      { label: "Muito rígida", score: 3 },
    ],
  },
  {
    id: "q4",
    text: "Reações sensoriais (náusea, engasgo, choro) ao apresentar novos alimentos?",
    options: [
      { label: "Não", score: 0 },
      { label: "Leves", score: 1 },
      { label: "Moderadas", score: 2 },
      { label: "Intensas", score: 3 },
    ],
  },
  {
    id: "q5",
    text: "As refeições geram conflito ou estresse familiar frequente?",
    options: [
      { label: "Raramente", score: 0 },
      { label: "Às vezes", score: 1 },
      { label: "Frequentemente", score: 2 },
      { label: "Quase sempre", score: 3 },
    ],
  },
  {
    id: "q6",
    text: "Há histórico ou suspeita de TEA e/ou TDAH acompanhando a seletividade?",
    options: [
      { label: "Não", score: 0 },
      { label: "Em investigação", score: 1 },
      { label: "Sim, um deles", score: 2 },
      { label: "Sim, ambos / quadro complexo", score: 3 },
    ],
  },
  {
    id: "q7",
    text: "A criança aceita o alimento no prato, mas não leva à boca?",
    options: [
      { label: "Não se aplica", score: 0 },
      { label: "Às vezes", score: 1 },
      { label: "Frequentemente", score: 2 },
      { label: "É o padrão", score: 3 },
    ],
  },
  {
    id: "q8",
    text: "Existem sinais de dificuldade oral-motora (mastigação, baba, engasgos)?",
    options: [
      { label: "Não", score: 0 },
      { label: "Leves", score: 1 },
      { label: "Moderados", score: 2 },
      { label: "Importantes", score: 3 },
    ],
  },
];

export function summarizeSelectivityScore(score: number): { level: string; summary: string } {
  if (score <= 6) {
    return {
      level: "Baixa preocupação imediata",
      summary:
        "Sinais leves. Mantenha exposição positiva sem pressão. Este questionário é apenas investigação inicial e não substitui avaliação profissional.",
    };
  }
  if (score <= 14) {
    return {
      level: "Atenção moderada",
      summary:
        "Há indícios de seletividade relevante. Considere registrar preferências sensoriais e iniciar a Escada do Comer com alimentos seguros. Avalie nutricionista; se houver TPS, TO; se oral-motor, fonoaudiólogo.",
    };
  }
  return {
    level: "Atenção elevada (investigação inicial)",
    summary:
      "O escore sugere seletividade importante. Busque avaliação interdisciplinar (nutricionista, e conforme o caso médico, TO e fono). A plataforma oferece apoio educativo, sem diagnóstico.",
  };
}
