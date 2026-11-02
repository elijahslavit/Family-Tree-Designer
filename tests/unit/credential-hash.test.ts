import { afterEach, describe, expect, it, vi } from "vitest";

import { hashPilotCredential } from "@/lib/auth/credential-hash";

describe("hashPilotCredential", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("refuses to hash real credentials without a pepper", () => {
    vi.stubEnv("DEMO_MODE", "false");
    vi.stubEnv("INVITE_TOKEN_PEPPER", "");
    expect(() => hashPilotCredential("raw-token")).toThrow(/INVITE_TOKEN_PEPPER/);
  });

  it("mixes in the pepper so stored hashes cannot be reproduced without it", () => {
    vi.stubEnv("DEMO_MODE", "false");
    vi.stubEnv("INVITE_TOKEN_PEPPER", "pepper-one");
    const first = hashPilotCredential("raw-token");
    vi.stubEnv("INVITE_TOKEN_PEPPER", "pepper-two");
    expect(hashPilotCredential("raw-token")).not.toBe(first);
    expect(first).toMatch(/^[0-9a-f]{64}$/);
  });

  it("still works in the synthetic demo without a pepper", () => {
    vi.stubEnv("DEMO_MODE", "true");
    vi.stubEnv("INVITE_TOKEN_PEPPER", "");
    expect(hashPilotCredential("raw-token")).toMatch(/^[0-9a-f]{64}$/);
  });
});
