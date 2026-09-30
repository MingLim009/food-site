import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const c = await p.recipe.count();
const rows = await p.recipe.findMany({
  take: 5,
  select: { id: true, title: true, cartoonScenes: true, published: true },
});
console.log("recipe count", c);
for (const x of rows) {
  let n = 0;
  try {
    n = JSON.parse(x.cartoonScenes || "[]").length;
  } catch {
    n = -1;
  }
  console.log(x.id, x.title, "scenes", n, "pub", x.published);
}
const empty = await p.recipe.count({
  where: { OR: [{ cartoonScenes: "" }, { cartoonScenes: "[]" }, { cartoonScenes: null }] },
});
console.log("empty scenes", empty);
const k = await p.knowledgeChunk.count();
console.log("knowledge", k);
await p.$disconnect();
