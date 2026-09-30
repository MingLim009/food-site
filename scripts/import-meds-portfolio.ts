/**
 * Importa portfólio de medicamentos / apetite / interocepção.
 * npx tsx scripts/import-meds-portfolio.ts
 */
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const CLOSING =
  "O acompanhamento com nutricionista e equipe de saúde é fundamental para avaliar as causas, acompanhar crescimento e ingestão e planejar intervenções seguras.";

async function main() {
  const file = path.join(
    process.cwd(),
    "content",
    "Portfolio_IA_Medicamentos_Apetite_Interocepcao_Andreza_Dias.md"
  );
  const md = fs.readFileSync(file, "utf8");

  await prisma.knowledgeChunk.deleteMany({
    where: {
      OR: [{ category: "Portfolio Meds" }, { title: { startsWith: "Med FAQ" } }],
    },
  });

  const chunks: { title: string; category: string; tags: string; content: string }[] = [];
  const rules = md.match(/## 1\.[\s\S]*?(?=\n## 2\.)/);
  if (rules) {
    chunks.push({
      title: "Regras — medicamentos, apetite e interocepção",
      category: "Portfolio Meds",
      tags: JSON.stringify(["medicamento", "apetite", "interocepcao", "portfolio"]),
      content: `${rules[0].trim()}\n\n${CLOSING}`,
    });
  }

  const qaRe = /\*\*(\d{2})\.\s*([^*]+?)\*\*\s*([\s\S]*?)(?=\*\*\d{2}\.|\n## |\n### |$)/g;
  let m: RegExpExecArray | null;
  while ((m = qaRe.exec(md)) !== null) {
    const q = m[2].replace(/\s+/g, " ").trim();
    let a = m[3]
      .replace(/\s+/g, " ")
      .replace(/\s*\[R[\d,\s]+\]\s*$/i, "")
      .trim();
    if (!q || !a) continue;
    chunks.push({
      title: `Med FAQ ${m[1]} — ${q}`,
      category: "Portfolio Meds",
      tags: JSON.stringify([
        "medicamento",
        "apetite",
        "tea",
        "tdah",
        "faq",
        ...q
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .split(/\W+/)
          .filter((t) => t.length > 3)
          .slice(0, 6),
      ]),
      content: `Pergunta frequente: ${q}\n\nResposta educativa (Andreza Dias · CRN 10418):\n${a}\n\n${CLOSING}`,
    });
  }

  for (const c of chunks) {
    await prisma.knowledgeChunk.create({ data: { ...c, published: true } });
  }
  console.log(`Imported ${chunks.length} meds chunks. Total: ${await prisma.knowledgeChunk.count()}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
