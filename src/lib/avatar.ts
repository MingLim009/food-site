export type ChildAvatar = {
  skin: "claro" | "medio" | "moreno" | "escuro";
  hair: "curto" | "longo" | "cacheado" | "crespo" | "rabo";
  hairColor: "preto" | "castanho" | "loiro" | "ruivo";
  eyes: "castanhos" | "pretos" | "verdes" | "azuis";
  accessory: "nenhum" | "oculos" | "chapeu" | "laco";
};

export const DEFAULT_AVATAR: ChildAvatar = {
  skin: "medio",
  hair: "curto",
  hairColor: "castanho",
  eyes: "castanhos",
  accessory: "nenhum",
};

export const AVATAR_OPTIONS = {
  skin: [
    { id: "claro", label: "Pele clara", color: "#F5D0B0" },
    { id: "medio", label: "Pele média", color: "#D2A679" },
    { id: "moreno", label: "Pele morena", color: "#A66B3D" },
    { id: "escuro", label: "Pele escura", color: "#6B3F24" },
  ],
  hair: [
    { id: "curto", label: "Cabelo curto" },
    { id: "longo", label: "Cabelo longo" },
    { id: "cacheado", label: "Cacheado" },
    { id: "crespo", label: "Crespo" },
    { id: "rabo", label: "Rabo de cavalo" },
  ],
  hairColor: [
    { id: "preto", label: "Preto", color: "#1a1a1a" },
    { id: "castanho", label: "Castanho", color: "#5C3317" },
    { id: "loiro", label: "Loiro", color: "#C9A227" },
    { id: "ruivo", label: "Ruivo", color: "#B55233" },
  ],
  eyes: [
    { id: "castanhos", label: "Olhos castanhos", color: "#6B3F24" },
    { id: "pretos", label: "Olhos pretos", color: "#111" },
    { id: "verdes", label: "Olhos verdes", color: "#3A7A4A" },
    { id: "azuis", label: "Olhos azuis", color: "#3A6EA5" },
  ],
  accessory: [
    { id: "nenhum", label: "Nenhum" },
    { id: "oculos", label: "Óculos" },
    { id: "chapeu", label: "Chapéu" },
    { id: "laco", label: "Laço" },
  ],
} as const;

export function parseAvatar(raw: string | null | undefined): ChildAvatar {
  try {
    const data = JSON.parse(raw || "{}");
    return {
      skin: data.skin || DEFAULT_AVATAR.skin,
      hair: data.hair || DEFAULT_AVATAR.hair,
      hairColor: data.hairColor || DEFAULT_AVATAR.hairColor,
      eyes: data.eyes || DEFAULT_AVATAR.eyes,
      accessory: data.accessory || DEFAULT_AVATAR.accessory,
    };
  } catch {
    return { ...DEFAULT_AVATAR };
  }
}

export function skinColor(skin: ChildAvatar["skin"]) {
  return AVATAR_OPTIONS.skin.find((s) => s.id === skin)?.color || "#D2A679";
}

export function hairColorHex(c: ChildAvatar["hairColor"]) {
  return AVATAR_OPTIONS.hairColor.find((s) => s.id === c)?.color || "#5C3317";
}

export function eyeColorHex(c: ChildAvatar["eyes"]) {
  return AVATAR_OPTIONS.eyes.find((s) => s.id === c)?.color || "#6B3F24";
}
