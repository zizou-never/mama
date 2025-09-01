export const runtime = "edge";
export function GET() { return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } }); }
