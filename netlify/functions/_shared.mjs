import { createHash, timingSafeEqual } from "node:crypto";
import { getStore } from "@netlify/blobs";

export function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

export function hashIp(ip) {
  return createHash("sha256").update(String(ip || "unknown")).digest("hex").slice(0, 16);
}

function sha(s) { return createHash("sha256").update(String(s)).digest(); }

// Passwort in konstanter Zeit vergleichen (kein Timing-Leck)
export function checkAdminAuth(req) {
  const auth = req.headers.get("authorization") || "";
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false; // kein Passwort gesetzt -> Zugriff verweigern
  return timingSafeEqual(sha(auth), sha(`Bearer ${expected}`));
}

const MAX_FAILS_PER_HOUR = 10;

// Admin-Schutz mit Sperre gegen Passwort-Raten: nach 10 Fehlversuchen pro Stunde und IP -> 429
export async function requireAdmin(req) {
  const ip = req.headers.get("x-nf-client-connection-ip") || "unknown";
  const key = `admin-fail:${hashIp(ip)}:${new Date().toISOString().slice(0, 13)}`;
  let store;
  try { store = getStore("rate-limit"); } catch { store = null; }
  const fails = store ? parseInt((await store.get(key, { type: "text" })) || "0", 10) : 0;
  if (fails >= MAX_FAILS_PER_HOUR) {
    return json(429, { error: "Zu viele Fehlversuche. Bitte in einer Stunde erneut versuchen." });
  }
  if (!checkAdminAuth(req)) {
    if (store) await store.set(key, String(fails + 1));
    return json(401, { error: "unauthorized" });
  }
  return null;
}
