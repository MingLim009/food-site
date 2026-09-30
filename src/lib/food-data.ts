export type FoodGroupId =
  | "carnes"
  | "verduras"
  | "frutas"
  | "sucos"
  | "arroz"
  | "feijao";

export type FoodItem = {
  id: string;
  name: string;
  emoji: string;
  group: FoodGroupId;
};

export const FOOD_GROUPS: {
  id: FoodGroupId;
  label: string;
  emoji: string;
  color: string;
}[] = [
  { id: "carnes", label: "Carnes", emoji: "🥩", color: "#E86A5B" },
  { id: "verduras", label: "Verduras", emoji: "🥬", color: "#65B21E" },
  { id: "frutas", label: "Frutas", emoji: "🍎", color: "#E8A317" },
  { id: "sucos", label: "Sucos", emoji: "🧃", color: "#F08C4A" },
  { id: "arroz", label: "Arroz", emoji: "🍚", color: "#F5F0E6" },
  { id: "feijao", label: "Feijão", emoji: "🫘", color: "#8B5A2B" },
];

export const FOODS: FoodItem[] = [
  { id: "carne-bovina", name: "Carne bovina", emoji: "🥩", group: "carnes" },
  { id: "frango", name: "Frango", emoji: "🍗", group: "carnes" },
  { id: "peixe", name: "Peixe", emoji: "🐟", group: "carnes" },
  { id: "ovo", name: "Ovo", emoji: "🥚", group: "carnes" },
  { id: "alface", name: "Alface", emoji: "🥬", group: "verduras" },
  { id: "brocolis", name: "Brócolis", emoji: "🥦", group: "verduras" },
  { id: "cenoura", name: "Cenoura", emoji: "🥕", group: "verduras" },
  { id: "tomate", name: "Tomate", emoji: "🍅", group: "verduras" },
  { id: "maca", name: "Maçã", emoji: "🍎", group: "frutas" },
  { id: "banana", name: "Banana", emoji: "🍌", group: "frutas" },
  { id: "laranja", name: "Laranja", emoji: "🍊", group: "frutas" },
  { id: "morango", name: "Morango", emoji: "🍓", group: "frutas" },
  { id: "suco-laranja", name: "Suco de laranja", emoji: "🍊", group: "sucos" },
  { id: "suco-uva", name: "Suco de uva", emoji: "🍇", group: "sucos" },
  { id: "suco-abacaxi", name: "Suco de abacaxi", emoji: "🍍", group: "sucos" },
  { id: "suco-melancia", name: "Suco de melancia", emoji: "🍉", group: "sucos" },
  { id: "arroz-branco", name: "Arroz branco", emoji: "🍚", group: "arroz" },
  { id: "arroz-integral", name: "Arroz integral", emoji: "🌾", group: "arroz" },
  { id: "arroz-prato", name: "Arroz no prato", emoji: "🍽️", group: "arroz" },
  { id: "feijao-preto", name: "Feijão preto", emoji: "🫘", group: "feijao" },
  { id: "feijao-carioca", name: "Feijão carioca", emoji: "🥣", group: "feijao" },
  { id: "feijoada", name: "Feijão no prato", emoji: "🍲", group: "feijao" },
];

export function foodsByGroup(group: FoodGroupId) {
  return FOODS.filter((f) => f.group === group);
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function groupLabel(id: FoodGroupId) {
  return FOOD_GROUPS.find((g) => g.id === id)?.label || id;
}
