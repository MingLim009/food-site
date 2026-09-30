import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { email: true, role: true, plan: true, passwordHash: true },
  });
  console.log(
    "users:",
    users.map((u) => ({ email: u.email, role: u.role, plan: u.plan }))
  );

  const mae = users.find((u) => u.email === "mae@demo.com");
  if (!mae) {
    console.log("mae@demo.com MISSING — reseeding needed");
  } else {
    const ok = await bcrypt.compare("demo1234", mae.passwordHash);
    console.log("password demo1234 matches:", ok);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
