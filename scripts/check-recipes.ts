import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

async function main() {
  const n = await p.recipe.count();
  const withScenes = await p.recipe.count({
    where: { NOT: { cartoonScenes: "[]" } },
  });
  const r = await p.recipe.findFirst();
  console.log(JSON.stringify({ n, withScenes, sampleTitle: r?.title, scenesStart: r?.cartoonScenes?.slice(0, 100) }));
  await p.$disconnect();
}

main();
