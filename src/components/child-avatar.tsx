"use client";

import type { ChildAvatar } from "@/lib/avatar";
import { eyeColorHex, hairColorHex, skinColor } from "@/lib/avatar";

export function ChildAvatarView({
  avatar,
  name,
  size = 96,
}: {
  avatar: ChildAvatar;
  name?: string;
  size?: number;
}) {
  const skin = skinColor(avatar.skin);
  const hair = hairColorHex(avatar.hairColor);
  const eyes = eyeColorHex(avatar.eyes);
  const s = size;

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div
        className="relative overflow-hidden rounded-full border-4 border-white shadow-md"
        style={{ width: s, height: s, background: "#E8F3FF" }}
        aria-hidden
      >
        {/* hair back */}
        {(avatar.hair === "longo" || avatar.hair === "cacheado" || avatar.hair === "crespo") && (
          <div
            className="absolute left-1/2 top-[18%] -translate-x-1/2 rounded-full"
            style={{
              width: s * 0.78,
              height: s * 0.7,
              background: hair,
              opacity: 0.95,
            }}
          />
        )}
        {/* face */}
        <div
          className="absolute left-1/2 top-[28%] -translate-x-1/2 rounded-full"
          style={{ width: s * 0.55, height: s * 0.55, background: skin }}
        />
        {/* hair top */}
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{
            top: avatar.hair === "curto" ? "14%" : "10%",
            width: avatar.hair === "crespo" ? s * 0.7 : s * 0.58,
            height: avatar.hair === "rabo" ? s * 0.28 : s * 0.32,
            background: hair,
          }}
        />
        {avatar.hair === "rabo" && (
          <div
            className="absolute rounded-full"
            style={{
              right: "18%",
              top: "22%",
              width: s * 0.14,
              height: s * 0.28,
              background: hair,
            }}
          />
        )}
        {/* eyes */}
        <div
          className="absolute rounded-full"
          style={{ left: "35%", top: "48%", width: s * 0.08, height: s * 0.08, background: eyes }}
        />
        <div
          className="absolute rounded-full"
          style={{ right: "35%", top: "48%", width: s * 0.08, height: s * 0.08, background: eyes }}
        />
        {/* smile */}
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full border-b-2 border-[var(--ink)]"
          style={{ top: "62%", width: s * 0.16, height: s * 0.08 }}
        />
        {/* accessories */}
        {avatar.accessory === "oculos" && (
          <div
            className="absolute left-1/2 top-[46%] flex -translate-x-1/2 gap-1"
            style={{ width: s * 0.42 }}
          >
            <span className="h-3 flex-1 rounded-full border-2 border-[var(--ink)] bg-white/40" />
            <span className="h-3 flex-1 rounded-full border-2 border-[var(--ink)] bg-white/40" />
          </div>
        )}
        {avatar.accessory === "chapeu" && (
          <div
            className="absolute left-1/2 top-[6%] -translate-x-1/2 rounded-t-full bg-[var(--brand)]"
            style={{ width: s * 0.5, height: s * 0.18 }}
          />
        )}
        {avatar.accessory === "laco" && (
          <div
            className="absolute text-lg"
            style={{ right: "20%", top: "12%" }}
          >
            🎀
          </div>
        )}
      </div>
      {name ? <p className="text-xs font-bold text-[var(--brand-deep)]">{name}</p> : null}
    </div>
  );
}
