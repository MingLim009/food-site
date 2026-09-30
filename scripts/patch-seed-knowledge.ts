import fs from "fs";

const path = "prisma/seed.ts";
let s = fs.readFileSync(path, "utf8");

if (!s.includes("knowledge-base")) {
  s = s.replace(
    'import { recipesForSeed, recipeCount } from "../src/lib/recipes-catalog";',
    `import { recipesForSeed, recipeCount } from "../src/lib/recipes-catalog";
import { KNOWLEDGE_BASE, knowledgeCount } from "../src/lib/knowledge-base";`
  );
}

s = s.replace(
  /const knowledge = \[[\s\S]*?\];\r?\n\r?\nconst recipes/,
  "const knowledge = KNOWLEDGE_BASE;\n\nconst recipes"
);

if (!s.includes("Knowledge chunks")) {
  s = s.replace(
    "console.log(`Recipes with cartoon videos: ${recipeCount()}`);",
    "console.log(`Recipes with cartoon videos: ${recipeCount()}`);\n  console.log(`Knowledge chunks: ${knowledgeCount()}`);"
  );
}

fs.writeFileSync(path, s);
console.log({
  hasImport: s.includes("knowledge-base"),
  usesBase: s.includes("const knowledge = KNOWLEDGE_BASE"),
  oldArrayGone: !s.includes('title: "Principais causas da seletividade em TEA"'),
});
