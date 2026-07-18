import { resetDemoStore } from "@/lib/data/demo-store";
import { resetPilotWorkspace } from "@/lib/pilot/store";
import { isDemoMode } from "@/lib/runtime";

/**
 * Restores the synthetic demo archive. Exists so end-to-end tests can undo a
 * real GEDCOM import, and so a demonstration can be reset between clients.
 */
export async function POST() {
  if (!isDemoMode()) {
    return Response.json(
      { error: "Reset is available in demo mode only." },
      { status: 404 },
    );
  }

  resetDemoStore();
  resetPilotWorkspace();

  return Response.json({ ok: true });
}
