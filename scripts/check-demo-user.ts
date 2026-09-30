import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const u = await p.user.findUnique({ where: { email: "mae@demo.com" } });
console.log({ plan: u?.plan, exp: u?.planExpiresAt });
await p.$disconnect();
