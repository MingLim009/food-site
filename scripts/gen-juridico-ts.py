# -*- coding: utf-8 -*-
from pathlib import Path
import re, json

p = Path(r"C:\Users\Administrator\Documents\Workana-task\kelvin\content\juridico\Portfolio_Juridico_Seletividade_Alimentar_TEA_TDAH_Andreza_Dias.md")
t = p.read_text(encoding="utf-8")

closing = "O acompanhamento nutricional e, quando necessário, jurídico é fundamental para avaliar o caso da criança, reunir documentos e definir a medida adequada."

sections = []
current = None
qa_re = re.compile(r"^\*\*(\d+)\.\s+(.*?)\*\*\s+(.*)$")
sec_re = re.compile(r"^##\s+(.+)$")

for line in t.splitlines():
    m = sec_re.match(line)
    if m:
        title = m.group(1).strip()
        if title.startswith("Regras da IA"):
            current = None
            continue
        if re.match(r"^\d+\.", title) or title.startswith("Fontes"):
            current = {"id": f"sec-{len(sections)+1}", "title": title, "items": []}
            sections.append(current)
        else:
            current = None
        continue
    if current is None:
        continue
    m = qa_re.match(line)
    if m:
        current["items"].append({
            "n": int(m.group(1)),
            "question": m.group(2).strip(),
            "answer": m.group(3).strip(),
        })

sections = [s for s in sections if s["items"]]

out = Path(r"C:\Users\Administrator\Documents\Workana-task\kelvin\src\lib\juridico-seletividade.ts")

def esc(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)

lines = []
lines.append("/** Portfólio jurídico educativo — seletividade alimentar TEA/TDAH (Andreza Dias · CRN 10418). */")
lines.append("")
lines.append("export type JuridicoItem = {")
lines.append("  n: number;")
lines.append("  question: string;")
lines.append("  answer: string;")
lines.append("};")
lines.append("")
lines.append("export type JuridicoSection = {")
lines.append("  id: string;")
lines.append("  title: string;")
lines.append("  items: JuridicoItem[];")
lines.append("};")
lines.append("")
lines.append(f"export const JURIDICO_CLOSING = {esc(closing)};")
lines.append("")
lines.append("export const JURIDICO_META = {")
lines.append(f'  title: {esc("Direitos e leis — seletividade alimentar")},')
lines.append(f'  subtitle: {esc("Perguntas e respostas educativas sobre legislação federal brasileira (TEA/TDAH e alimentação escolar).")},')
lines.append(f'  author: {esc("Andreza Dias · CRN 10418")},')
lines.append(f'  date: {esc("27/09/2026")},')
lines.append(f'  disclaimer: {esc("Conteúdo educativo. Não é consultoria jurídica individual, não promete resultado judicial e não substitui advogado(a) nem equipe de saúde. Minuta editorial para revisão jurídica.")},')
lines.append("} as const;")
lines.append("")
lines.append("export const JURIDICO_SECTIONS: JuridicoSection[] = [")
for s in sections:
    lines.append("  {")
    lines.append(f'    id: {esc(s["id"])},')
    lines.append(f'    title: {esc(s["title"])},')
    lines.append("    items: [")
    for it in s["items"]:
        lines.append("      {")
        lines.append(f'        n: {it["n"]},')
        lines.append(f'        question: {esc(it["question"])},')
        lines.append(f'        answer: {esc(it["answer"])},')
        lines.append("      },")
    lines.append("    ],")
    lines.append("  },")
lines.append("];")
lines.append("")
lines.append("export function allJuridicoItems() {")
lines.append("  return JURIDICO_SECTIONS.flatMap((s) => s.items);")
lines.append("}")
lines.append("")

out.write_text("\n".join(lines) + "\n", encoding="utf-8")
print("wrote", out, "sections", len(sections), "items", sum(len(s["items"]) for s in sections))
