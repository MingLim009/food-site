"use client";

import { FormEvent, useEffect, useState } from "react";

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
};

function listFromCsv(v: string) {
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Child | null>(null);

  async function load() {
    const res = await fetch("/api/children");
    const data = await res.json();
    if (res.ok) setChildren(data.children);
  }

  useEffect(() => {
    load();
  }, []);

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
    };
    const res = await fetch(editing ? `/api/children/${editing.id}` : "/api/children", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erro ao salvar");
      return;
    }
    setEditing(null);
    (e.target as HTMLFormElement).reset();
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir este perfil?")) return;
    await fetch(`/api/children/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="space-y-5">
      <h1 className="display text-3xl font-bold">
        Perfis infantis
      </h1>
      <p className="text-sm text-[var(--muted)]">
        A TIA Nutri só responde sobre a criança selecionada no chat — nunca sobre outra.
      </p>

      <form onSubmit={onSubmit} className="card space-y-3 p-4">
        <h2 className="font-bold">{editing ? "Editar perfil" : "Novo perfil"}</h2>
        <input className="input" name="name" placeholder="Nome" defaultValue={editing?.name || ""} required />
        <input className="input" name="birthDate" type="date" defaultValue={editing?.birthDate?.slice(0, 10) || ""} />
        <input className="input" name="textures" placeholder="Texturas (vírgula)" defaultValue={editing ? JSON.parse(editing.textures || "[]").join(", ") : ""} />
        <input className="input" name="colors" placeholder="Cores" defaultValue={editing ? JSON.parse(editing.colors || "[]").join(", ") : ""} />
        <input className="input" name="shapes" placeholder="Formas" defaultValue={editing ? JSON.parse(editing.shapes || "[]").join(", ") : ""} />
        <input className="input" name="acceptedFoods" placeholder="Alimentos aceitos" defaultValue={editing ? JSON.parse(editing.acceptedFoods || "[]").join(", ") : ""} />
        <input className="input" name="refusedFoods" placeholder="Alimentos recusados" defaultValue={editing ? JSON.parse(editing.refusedFoods || "[]").join(", ") : ""} />
        <div className="grid grid-cols-2 gap-2">
          <input className="input" name="heightCm" type="number" step="0.1" placeholder="Altura cm" defaultValue={editing?.heightCm ?? ""} />
          <input className="input" name="weightKg" type="number" step="0.1" placeholder="Peso kg" defaultValue={editing?.weightKg ?? ""} />
        </div>
        <textarea className="input min-h-20" name="diagnosisNotes" placeholder="Notas de acompanhamento (não diagnóstico da TIA Nutri)" defaultValue={editing?.diagnosisNotes || ""} />
        <textarea className="input min-h-20" name="notes" placeholder="Observações" defaultValue={editing?.notes || ""} />
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        <button className="btn btn-primary w-full">{editing ? "Atualizar" : "Salvar perfil"}</button>
        {editing ? (
          <button type="button" className="btn btn-ghost w-full" onClick={() => setEditing(null)}>
            Cancelar edição
          </button>
        ) : null}
      </form>

      <div className="space-y-3">
        {children.map((c) => (
          <div key={c.id} className="card p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold">{c.name}</h3>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Preferências: {JSON.parse(c.textures || "[]").join(", ") || "—"}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="chip" onClick={() => setEditing(c)}>
                  Editar
                </button>
                <button className="chip" onClick={() => remove(c.id)}>
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
