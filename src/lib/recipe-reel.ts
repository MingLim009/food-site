import type { RecipeDetails } from "@/lib/recipe-details";

export type ReelBeat = {
  id: string;
  /** texto grande no estilo do vídeo de referência */
  bigText: string;
  line: string;
  emoji: string;
  /** cor do fundo da “cozinha” */
  bg: string;
  /** o que aparece na tigela */
  bowl: string;
};

/** Monta beats do reel vertical a partir da ficha da receita */
export function buildRecipeReel(
  title: string,
  details: RecipeDetails,
  foodEmoji = "🍽️"
): ReelBeat[] {
  const shortTitle = title.length > 28 ? title.slice(0, 26) + "…" : title;
  const ings = details.ingredients.slice(0, 5);
  const methods = details.method.slice(0, 4);

  const beats: ReelBeat[] = [
    {
      id: "open",
      bigText: "VAMOS!",
      line: `Oi! Sou a TIA Nutri. Vamos fazer ${shortTitle} juntas, sem pressa.`,
      emoji: "👩‍🍳",
      bg: "linear-gradient(165deg,#FFE8F2 0%,#FFF6E0 55%,#E8F3FF 100%)",
      bowl: "✨",
    },
  ];

  ings.forEach((ing, i) => {
    const word = bigWordFromIngredient(ing);
    beats.push({
      id: `ing-${i}`,
      bigText: word,
      line: ing,
      emoji: emojiForIngredient(ing, foodEmoji),
      bg: i % 2 === 0
        ? "linear-gradient(165deg,#FFF3D6 0%,#FFE8D0 100%)"
        : "linear-gradient(165deg,#E8F8E0 0%,#E8F3FF 100%)",
      bowl: emojiForIngredient(ing, foodEmoji),
    });
  });

  methods.forEach((step, i) => {
    const labels = ["MISTURA", "PREPARA", "ASSA", "PRONTO"];
    beats.push({
      id: `m-${i}`,
      bigText: labels[i] || `PASSO ${i + 1}`,
      line: step,
      emoji: i === 2 ? "🔥" : i === 3 ? "💛" : "🥣",
      bg: "linear-gradient(165deg,#FFE8D0 0%,#FFD0A8 50%,#FFF6E0 100%)",
      bowl: i >= 2 ? foodEmoji : "🥄",
    });
  });

  beats.push({
    id: "oven",
    bigText: "FORNO",
    line: details.oven,
    emoji: "🔥",
    bg: "linear-gradient(165deg,#FFCCBC 0%,#FFE0B2 100%)",
    bowl: "⏲️",
  });
  beats.push({
    id: "air",
    bigText: "AIR FRYER",
    line: details.airFryer,
    emoji: "🌬️",
    bg: "linear-gradient(165deg,#B3E5FC 0%,#E1F5FE 100%)",
    bowl: "🍟",
  });
  beats.push({
    id: "end",
    bigText: "BOM APETITE!",
    line: `${details.tip} Olhar, cheirar ou tocar já conta na Escada.`,
    emoji: foodEmoji,
    bg: "linear-gradient(165deg,#E8F8E0 0%,#FFF9C4 100%)",
    bowl: foodEmoji,
  });

  return beats;
}

function bigWordFromIngredient(ing: string): string {
  const t = ing
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (/farinha|polvilho|po |pó |po de/.test(t)) return "PÓ";
  if (/acucar|açúcar|acúcar/.test(t)) return "AÇÚCAR";
  if (/ovo/.test(t)) return "OVO";
  if (/leite/.test(t)) return "LEITE";
  if (/oleo|óleo|azeite|manteiga/.test(t)) return "ÓLEO";
  if (/fermento/.test(t)) return "FERMENTO";
  if (/sal/.test(t)) return "SAL";
  if (/agua|água/.test(t)) return "ÁGUA";
  if (/cenoura/.test(t)) return "CENOURA";
  if (/banana/.test(t)) return "BANANA";
  if (/cacau|chocolate/.test(t)) return "CACAU";
  if (/frango|carne|nugget/.test(t)) return "PROTEÍNA";
  if (/arroz/.test(t)) return "ARROZ";
  if (/feijao|feijão/.test(t)) return "FEIJÃO";
  const first = ing.replace(/^[\d⁄\/\s.\-xícarascolhereskggtbsp]+\s*/i, "").split(/[,(]/)[0].trim();
  const word = first.split(/\s+/).slice(0, 2).join(" ").toUpperCase();
  return (word || "INGREDIENTE").slice(0, 12);
}

function emojiForIngredient(ing: string, fallback: string): string {
  const t = ing.toLowerCase();
  if (/farinha|pó|po |polvilho/.test(t)) return "🧂";
  if (/açúcar|acucar/.test(t)) return "🍬";
  if (/ovo/.test(t)) return "🥚";
  if (/leite/.test(t)) return "🥛";
  if (/óleo|oleo|azeite|manteiga/.test(t)) return "🫒";
  if (/cenoura/.test(t)) return "🥕";
  if (/banana/.test(t)) return "🍌";
  if (/cacau|chocolate/.test(t)) return "🍫";
  if (/frango|carne/.test(t)) return "🍗";
  if (/arroz/.test(t)) return "🍚";
  if (/feijão|feijao/.test(t)) return "🫘";
  if (/água|agua/.test(t)) return "💧";
  return fallback;
}
