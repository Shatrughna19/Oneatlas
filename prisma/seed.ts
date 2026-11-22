import { syncOpenRouterCatalog } from "../lib/sync";
import prisma from "../lib/prisma";

async function main() {
  await syncOpenRouterCatalog();
}

main()
  .catch((e) => {
    console.error("Seed execution failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
