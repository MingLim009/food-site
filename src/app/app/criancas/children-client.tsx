"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { AvatarBuilder } from "@/components/avatar-builder";
import {
  DEFAULT_AVATAR,
  avatarEmoji,
  parseAvatar,
  type ChildAvatar,
} from "@/lib/games";

type Child = {
  id: string;
  name: string;
  textures: string;
  colors: string;
  shapes: string;
  acceptedFoods: string;
  refusedFoods: string;
  heightCm: number | null;
  weightKg: number | null;
  notes: string | null;
  diagnosisNotes: string | null;
  birthDate: string | null;
  avatar: string;
};

function listFromCsv(v: string) {
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ChildrenClient({ initialChildren }: { initialChildren: Child[] }) {
  const [children, setChildren] = useState<Child[]>(initialChildren);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Child | null>(null);
  const [avatar, setAvatar] = useState<ChildAvatar>(DEFAULT_AVATAR);

  async function load() {
    const res = await fetch("/api/children", { credentials: "include" });
    const data = await res.json();
    if (res.ok) setChildren(data.children);
  }

  useEffect(() => {
    if (editing) setAvatar(parseAvatar(editing.avatar));
    else setAvatar(DEFAULT_AVATAR);
  }, [editing]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      birthDate: String(fd.get("birthDate") || "") || null,
      diagnosisNotes: String(fd.get("diagnosisNotes") || "") || null,
      textures: listFromCsv(String(fd.get("textures") || "")),
      colors: listFromCsv(String(fd.get("colors") || "")),
      shapes: listFromCsv(String(fd.get("shapes") || "")),
      acceptedFoods: listFromCsv(String(fd.get("acceptedFoods") || "")),
      refusedFoods: listFromCsv(String(fd.get("refusedFoods") || "")),
      heightCm: fd.get("heightCm") ? Number(fd.get("heightCm")) : null,
      weightKg: fd.get("weightKg") ? Number(fd.get("weightKg")) : null,
      notes: String(fd.get("notes") || "") || null,
      avatar,
    };
    const res = await fetch(editing ? `/api/children/${editing.id}` : "/api/children", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erro ao salvar");
      return;
    }
    setEditing(null);
    setAvatar(DEFAULT_AVATAR);
    (e.target as HTMLFormElement).reset();
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir este perfil?")) return;
    await fetch(`/api/children/${id}`, { method: "DELETE", credentials: "include" });
    await load();
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="display text-3xl font-bold sm:text-4xl">Perfis infantis</h1>
        <p className="mt-1 text-sm text-[var(--muted)] sm:text-base">
          Cadastre a criança, monte o boneco dos jogos e use no chat da TIA Nutri. Celular e
          notebook.
        </p>
      </div>

      <form onSubmit={onSubmit} className="card space-y-3 p-4 md:grid md:grid-cols-2 md:gap-4">
        <h2 className="font-bold md:col-span-2">{editing ? "Editar perfil" : "Novo perfil"}</h2>
        <input
          className="input"
          name="name"
          placeholder="Nome"
          defaultValue={editing?.name || ""}
          required
        />
        <input
          className="input"
          name="birthDate"
          type="date"
          defaultValue={editing?.birthDate?.slice(0, 10) || ""}
        />

        <div className="md:col-span-2">
          <AvatarBuilder
            value={avatar}
            onChange={setAvatar}
            childName={editing?.name || "criança"}
          />
        </div>

        <input
          className="input"
          name="textures"
          placeholder="Texturas (vírgula)"
          defaultValue={editing ? JSON.parse(editing.textures || "[]").join(", ") : ""}
        />
        <input
          className="input"
          name="colors"
          placeholder="Cores"
          defaultValue={editing ? JSON.parse(editing.colors || "[]").join(", ") : ""}
        />
        <input
          className="input"
          name="shapes"
          placeholder="Formas"
          defaultValue={editing ? JSON.parse(editing.shapes || "[]").join(", ") : ""}
        />
        <input
          className="input"
          name="acceptedFoods"
          placeholder="Alimentos aceitos"
          defaultValue={editing ? JSON.parse(editing.acceptedFoods || "[]").join(", ") : ""}
        />
        <input
          className="input"
          name="refusedFoods"
          placeholder="Alimentos recusados"
          defaultValue={editing ? JSON.parse(editing.refusedFoods || "[]").join(", ") : ""}
        />
        <input
          className="input"
          name="heightCm"
          type="number"
          step="0.1"
          placeholder="Altura cm"
          defaultValue={editing?.heightCm ?? ""}
        />
        <input
          className="input"
          name="weightKg"
          type="number"
          step="0.1"
          placeholder="Peso kg"
          defaultValue={editing?.weightKg ?? ""}
        />
        <textarea
          className="input min-h-20 md:col-span-2"
          name="diagnosisNotes"
          placeholder="Notas de acompanhamento (não diagnóstico da TIA Nutri)"
          defaultValue={editing?.diagnosisNotes || ""}
        />
        <textarea
          className="input min-h-20 md:col-span-2"
          name="notes"
          placeholder="Observações"
          defaultValue={editing?.notes || ""}
        />
        {error ? <p className="text-sm text-[var(--danger)] md:col-span-2">{error}</p> : null}
        <button className="btn btn-primary w-full md:col-span-2" type="submit">
          {editing ? "Atualizar" : "Salvar perfil"}
        </button>
        {editing ? (
          <button
            type="button"
            className="btn btn-ghost w-full md:col-span-2"
            onClick={() => setEditing(null)}
          >
            Cancelar edição
          </button>
        ) : null}
      </form>

      <div className="grid gap-3 sm:grid-cols-2">
        {children.map((c) => {
          const av = parseAvatar(c.avatar);
          return (
            <div key={c.id} className="card p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex gap-3">
                  <span className="text-3xl">{avatarEmoji(av)}</span>
                  <div>
                    <h3 className="font-bold">{c.name}</h3>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      Preferências: {JSON.parse(c.textures || "[]").join(", ") || "—"}
                    </p>
                    <Link
                      href={`/app/jogos?child=${c.id}`}
                      className="mt-2 inline-block text-sm font-bold text-[var(--brand)]"
                    >
                      Jogar com este boneco →
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button type="button" className="chip" onClick={() => setEditing(c)}>
                    Editar
                  </button>
                  <button type="button" className="chip" onClick={() => remove(c.id)}>
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
