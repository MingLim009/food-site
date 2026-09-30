const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
p.message
  .findMany({ orderBy: { createdAt: "desc" }, take: 6, select: { role: true, content: true } })
  .then((ms) => {
    for (const m of ms) {
      console.log("---", m.role);
      console.log(m.content.slice(0, 280));
    }
    return p.$disconnect();
  });
