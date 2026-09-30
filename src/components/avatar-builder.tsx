"use client";

import {
  AVATAR_OPTIONS,
  type ChildAvatar,
  DEFAULT_AVATAR,
  avatarEmoji,
} from "@/lib/games";

type Props = {
  value: ChildAvatar;
  onChange: (next: ChildAvatar) => void;
  childName?: string;
};

export function AvatarBuilder({ value, onChange, childName }: Props) {
  const v = { ...DEFAULT_AVATAR, ...value };

  function set<K extends keyof ChildAvatar>(key: K, id: string) {
    onChange({ ...v, [key]: id });
  }

  return (
    <div className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] p-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-5xl shadow-sm">
          {avatarEmoji(v)}
        </div>
        <p className="text-sm font-bold text-[var(--brand)]">
          {childName ? `Boneco de ${childName}` : "Seu boneco"}
        </p>
        <p className="text-xs text-[var(--muted)]">Escolha as características físicas</p>
      </div>

      {(
        [
          ["skin", "Tom de pele", AVATAR_OPTIONS.skin],
          ["hair", "Cabelo", AVATAR_OPTIONS.hair],
          ["hairColor", "Cor do cabelo", AVATAR_OPTIONS.hairColor],
          ["eyes", "Olhos", AVATAR_OPTIONS.eyes],
          ["outfit", "Roupa", AVATAR_OPTIONS.outfit],
          ["accessory", "Acessório", AVATAR_OPTIONS.accessory],
        ] as const
      ).map(([key, label, options]) => (
        <div key={key}>
          <p className="label mb-2">{label}</p>
          <div className="flex flex-wrap gap-2">
            {options.map((opt) => {
              const active = v[key] === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`chip ${active ? "!bg-[var(--brand)] !text-white" : ""}`}
                  onClick={() => set(key, opt.id)}
                >
                  {"emoji" in opt ? opt.emoji + " " : ""}
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
