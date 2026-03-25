import { demoBundle } from "@/lib/data/demo-tree";
import { resetDemoStore } from "@/lib/data/demo-store";
import { hasConfiguredBackend } from "@/lib/runtime";

export async function seedDemoData() {
  resetDemoStore();

  if (hasConfiguredBackend()) {
    console.log(
      "Supabase/Postgres is configured. Database seeding is not automated yet; using demo store reset instead.",
    );
  }

  return demoBundle;
}
