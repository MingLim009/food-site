/**
 * Importa o portfólio Andreza Dias (FAQ seletividade TEA/TDAH) na biblioteca RAG.
 * Uso: npx tsx scripts/import-portfolio.ts
 */
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CLOSING =
  "O acompanhamento com nutricionista e equipe de saúde é fundamental para avaliar as causas, acompanhar crescimento e ingestão e planejar intervenções seguras.";

function parsePortfolio(md: string) {
  const chunks: { title: string; category: string; tags: string; content: string }[] = [];

  // Rules section
  const rulesMatch = md.match(/## 1\. Regras de funcionamento da IA([\s\S]*?)(?=\n## 2\.)/);
  if (rulesMatch) {
    chunks.push({
      title: "Regras de funcionamento da TIA Nutri (portfólio Andreza Dias)",
      category: "Portfolio",
      tags: JSON.stringify([
        "regras",
        "portfolio",
        "andreza",
        "urgencia",
        "triagem",
        "faixa etaria",
      ]),
      content: `${rulesMatch[1].trim()}\n\nFechamento obrigatório em cada resposta: ${CLOSING}`,
    });
  }

  const qaRe = /\*\*(\d{2})\.\s*([^*]+?)\*\*\s*([\s\S]*?)(?=\*\*\d{2}\.|\n## |\n### |$)/g;
  let m: RegExpExecArray | null;
  while ((m = qaRe.exec(md)) !== null) {
    const num = m[1];
    const question = m[2].replace(/\s+/g, " ").trim();
    let answer = m[3].replace(/\s+/g, " ").trim();
    answer = answer.replace(/\s*\[R[\d,\s]+\]\s*$/i, "").trim();
    if (!question || !answer) continue;

    const section =
      md.slice(0, m.index).match(/##\s+\d+\.\s+([^\n]+)/g)?.pop()?.replace(/^##\s+\d+\.\s+/, "") ||
      "Seletividade";

    chunks.push({
      title: `FAQ ${num} — ${question}`,
      category: "Portfolio FAQ",
      tags: JSON.stringify([
        "portfolio",
        "faq",
        "tea",
        "tdah",
        "seletividade",
        question
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .split(/\W+/)
          .filter((t) => t.length > 3)
          .slice(0, 8),
      ].flat()),
      content: `Pergunta frequente (famílias TEA/TDAH): ${question}\n\nResposta educativa (Andreza Dias · CRN 10418 · ${section}):\n${answer}\n\n${CLOSING}`,
    });
  }

  return chunks;
}

async function main() {
  const file = path.join(process.cwd(), "content", "Portfolio_IA_Seletividade_Alimentar_Andreza_Dias.md");
  if (!fs.existsSync(file)) {
    throw new Error(`Arquivo não encontrado: ${file}`);
  }
  const md = fs.readFileSync(file, "utf8");
  const chunks = parsePortfolio(md);
  console.log(`Parsed ${chunks.length} chunks`);

  // Remove previous portfolio imports only
  await prisma.knowledgeChunk.deleteMany({
    where: {
      OR: [{ category: "Portfolio" }, { category: "Portfolio FAQ" }, { title: { contains: "FAQ " } }],
    },
  });

  for (const c of chunks) {
    await prisma.knowledgeChunk.create({
      data: {
        title: c.title,
        category: c.category,
        tags: c.tags,
        content: c.content,
        published: true,
      },
    });
  }

  const total = await prisma.knowledgeChunk.count();
  console.log(`Imported ${chunks.length}. Total knowledge chunks: ${total}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
