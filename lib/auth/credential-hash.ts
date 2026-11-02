import { createHash } from "node:crypto";

import { isDemoMode } from "@/lib/runtime";

/**
 * Hashes an invitation or session credential for storage. Raw credentials are
 * never stored. Outside the synthetic demo a server-side pepper is mandatory,
 * so a missing secret fails loudly instead of silently weakening every hash.
 */
export function hashPilotCredential(rawCredential: string) {
  const pepper = process.env.INVITE_TOKEN_PEPPER;

  if (!pepper && !isDemoMode()) {
    throw new Error(
      "INVITE_TOKEN_PEPPER must be configured before invitations or sessions can be issued or checked.",
    );
  }

  const value = pepper ? `${pepper}:${rawCredential}` : rawCredential;
  return createHash("sha256").update(value, "utf8").digest("hex");
}
