/** Conteúdo educativo sobre medicações e apetite — sem doses nem prescrição. */

export type MedInfo = {
  id: string;
  name: string;
  classLabel: string;
  usedFor: string;
  organism: string;
  appetite: string;
  weight: string;
  note: string;
};

export const MEDICATIONS_TEA_TDAH: MedInfo[] = [
  {
    id: "estimulantes",
    name: "Estimulantes (ex.: metilfenidato, lisdexanfetamina)",
    classLabel: "TDAH — atenção e impulsividade",
    usedFor:
      "Frequentemente prescritos no TDAH para apoiar atenção, iniciação de tarefas e controle de impulsos — sempre sob orientação médica.",
    organism:
      "Atuam em circuitos de dopamina/noradrenalina ligados à atenção e às funções executivas. Cada criança responde de forma diferente.",
    appetite:
      "É comum redução do apetite durante o efeito do medicamento. Algumas crianças “pulam” refeições no pico e comem mais quando o efeito passa.",
    weight:
      "Em alguns casos há menor ganho de peso ou estagnação ponderal enquanto o apetite está baixo. Isso deve ser acompanhado pelo prescritor e pela nutricionista — nunca ajuste dose por conta própria.",
    note: "A EloAlimentar não indica, troca nem suspende medicação. Converse sempre com o médico.",
  },
  {
    id: "nao-estimulantes-tdah",
    name: "Não estimulantes para TDAH (ex.: atomoxetina, guanfacina)",
    classLabel: "TDAH — alternativas / adjuvantes",
    usedFor:
      "Opções quando estimulantes não são adequados ou como complemento, conforme critérios clínicos do médico.",
    organism:
      "Mecanismos variam (ex.: noradrenérgico ou moduladores de receptores). O tempo até efeito clínico pode ser diferente dos estimulantes.",
    appetite:
      "Alterações de apetite podem ocorrer, em geral com perfil diferente dos estimulantes. Observe padrões de fome e saciedade no diário alimentar.",
    weight:
      "Mudanças de peso devem ser monitoradas em consultas. Relacione com sono, rotina e seletividade — não apenas com o remédio.",
    note: "Conteúdo educativo. Decisões de tratamento são exclusivas do médico responsável.",
  },
  {
    id: "antipsicoticos",
    name: "Antipsicóticos atípicos (quando indicados no TEA)",
    classLabel: "TEA — irritabilidade / comportamentos específicos",
    usedFor:
      "Em alguns casos de TEA, o médico pode indicar para irritabilidade intensa ou agressividade — não “para seletividade alimentar”.",
    organism:
      "Modulam neurotransmissores; efeitos colaterais metabólicos são conhecidos e exigem acompanhamento.",
    appetite:
      "Podem aumentar apetite e busca por alimentos calóricos. Isso pode coexistir com seletividade sensorial (comer muito de poucos itens).",
    weight:
      "Ganho de peso e alterações metabólicas são riscos relatados. Monitoramento clínico (peso, glicemia, lipídios) é responsabilidade da equipe de saúde.",
    note: "Nunca inicie ou pare esses fármacos sem o prescritor. A TIA Nutri não discute doses.",
  },
  {
    id: "ssri",
    name: "ISRS / ansiolíticos (quando prescritos)",
    classLabel: "Ansiedade / comorbidades",
    usedFor:
      "Podem ser usados em ansiedade, TOC ou outras indicações definidas pelo médico — inclusive em contextos que afetam a mesa.",
    organism:
      "Atuam em vias serotoninérgicas (e outras). Resposta e efeitos colaterais são individuais.",
    appetite:
      "Alguns relatam mudança de apetite (aumento ou redução) e náusea no início. Observe se a ânsia à mesa piorou ou melhorou após início do fármaco.",
    weight:
      "Variações de peso podem ocorrer. Registre tendências e leve ao médico/nutricionista.",
    note: "Educativo apenas. Interações e indicações são do profissional prescritor.",
  },
  {
    id: "geral-apetite",
    name: "Visão geral: medicação × mesa",
    classLabel: "Orientação familiar",
    usedFor:
      "Qualquer medicação que altere sono, agitação, foco ou humor pode indiretamente mudar o comportamento alimentar.",
    organism:
      "Apetite é regulado por cérebro, intestino, emoção e rotina. Medicação é só uma peça desse sistema.",
    appetite:
      "Estratégias úteis (educativas): oferecer alimento seguro nos horários de maior fome; evitar pressão; manter Escada do Comer mesmo com apetite baixo.",
    weight:
      "Curvas de crescimento devem ser acompanhadas pelo pediatra. A nutricionista ajuda a proteger variedade e densidade nutricional sem forçar.",
    note: "Se houver perda/ganho acelerado de peso, vômitos ou recusa total, procure a equipe clínica com urgência relativa.",
  },
];
