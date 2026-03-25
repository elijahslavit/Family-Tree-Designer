import { seedDemoData } from "@/lib/data/seed";

async function main() {
  await seedDemoData();
  console.log("Seed complete.");
}

main().catch((error) => {
  console.error("Seed failed.", error);
  process.exit(1);
});
