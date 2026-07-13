import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const PILOT_SESSION_COOKIE = "ftd_pilot_access";
export const PILOT_INVITE_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;
export const PILOT_SESSION_IDLE_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;
export const PILOT_SESSION_ABSOLUTE_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;

export function hashPilotCredential(rawCredential: string) {
  const pepper = process.env.INVITE_TOKEN_PEPPER;
  const value = pepper ? `${pepper}:${rawCredential}` : rawCredential;
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function credentialHashMatches(rawCredential: string, expectedHash: string) {
  const actual = Buffer.from(hashPilotCredential(rawCredential), "hex");
  const expected = Buffer.from(expectedHash, "hex");

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function createPilotSessionCredential(now = new Date()) {
  const rawToken = randomBytes(32).toString("base64url");
  const createdAt = now.toISOString();

  return {
    rawToken,
    tokenHash: hashPilotCredential(rawToken),
    createdAt,
    lastSeenAt: createdAt,
    idleExpiresAt: new Date(
      now.getTime() + PILOT_SESSION_IDLE_LIFETIME_MS,
    ).toISOString(),
    absoluteExpiresAt: new Date(
      now.getTime() + PILOT_SESSION_ABSOLUTE_LIFETIME_MS,
    ).toISOString(),
  };
}

export async function readPilotSessionCredential() {
  return (await cookies()).get(PILOT_SESSION_COOKIE)?.value ?? null;
}

export async function setPilotSessionCookie(
  rawToken: string,
  absoluteExpiresAt: string,
) {
  const cookieStore = await cookies();
  cookieStore.set(PILOT_SESSION_COOKIE, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(absoluteExpiresAt),
    path: "/",
    priority: "high",
  });
}

export async function clearPilotSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(PILOT_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    maxAge: 0,
    path: "/",
    priority: "high",
  });
}
