import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/db/schema";
import { hasConfiguredBackend, requireEnv } from "@/lib/runtime";

declare global {
  var __familyTreeSqlClient: postgres.Sql | undefined;
}

export function getDb() {
  if (!hasConfiguredBackend()) {
    return null;
  }

  if (!globalThis.__familyTreeSqlClient) {
    globalThis.__familyTreeSqlClient = postgres(requireEnv("DATABASE_URL"), {
      prepare: false,
    });
  }

  return drizzle(globalThis.__familyTreeSqlClient, { schema });
}
