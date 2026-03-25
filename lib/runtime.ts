const requiredServerEnv = [
  "DATABASE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

const requiredPublicSupabaseEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

export function isDemoMode() {
  return process.env.DEMO_MODE !== "false";
}

export function hasConfiguredBackend() {
  return requiredServerEnv.every((key) => Boolean(process.env[key]));
}

export function hasConfiguredPublicSupabase() {
  return requiredPublicSupabaseEnv.every((key) => Boolean(process.env[key]));
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function requireEnv(name: typeof requiredServerEnv[number]) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
