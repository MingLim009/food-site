"use client";

import { useMemo, useState } from "react";
import {
  AVATAR_OPTIONS,
  type ChildAvatar,
  DEFAULT_AVATAR,
} from "@/lib/avatar";
import { ChildAvatarView } from "@/components/child-avatar";

export function AvatarEditor({
  initial,
  onChange,
}: {
  initial?: ChildAvatar;
  onChange: (a: ChildAvatar) => void;
}) {
  const [avatar, setAvatar] = useState<ChildAvatar>(initial || DEFAULT_AVATAR);

  function update<K extends keyof ChildAvatar>(key: K, value: ChildAvatar[K]) {
    const next = { ...avatar, [key]: value };
    setAvatar(next);
    onChange(next);
  }

  const sections = useMemo(
    () =>
      [
        { key: "skin" as const, label: "Pele", options: AVATAR_OPTIONS.skin },
        { key: "hair" as const, label: "Cabelo", options: AVATAR_OPTIONS.hair },
        { key: "hairColor" as const, label: "Cor do cabelo", options: AVATAR_OPTIONS.hairColor },
        { key: "eyes" as const, label: "Olhos", options: AVATAR_OPTIONS.eyes },
        { key: "accessory" as const, label: "Acessório", options: AVATAR_OPTIONS.accessory },
      ] as const,
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-center py-2">
        <ChildAvatarView avatar={avatar} size={120} />
      </div>
      {sections.map((sec) => (
        <div key={sec.key}>
          <p className="label mb-2">{sec.label}</p>
          <div className="flex flex-wrap gap-2">
            {sec.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`chip ${avatar[sec.key] === opt.id ? "!bg-[var(--brand)] !text-white" : ""}`}
                onClick={() => update(sec.key, opt.id as ChildAvatar[typeof sec.key])}
              >
                {"color" in opt ? (
                  <span className="mr-1 inline-block h-3 w-3 rounded-full border border-black/10" style={{ background: opt.color }} />
                ) : null}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
