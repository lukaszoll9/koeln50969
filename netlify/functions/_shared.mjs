import { createHash } from "node:crypto";

export function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export function hashIp(ip) {
  return createHash("sha256").update(String(ip || "unknown")).digest("hex").slice(0, 16);
}

export function checkAdminAuth(req) {
  const auth = req.headers.get("authorization") || "";
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false; // kein Passwort gesetzt -> Zugriff verweigern, nicht erlauben
  return auth === `Bearer ${expected}`;
}

// redeploy trigger: admin password refresh
