export async function GET() {
  return Response.json({
    ok: true,
    service: "family-tree-designer",
    timestamp: new Date().toISOString(),
  });
}
