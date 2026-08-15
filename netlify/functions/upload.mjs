import { getStore } from "@netlify/blobs";
import { getDatabase } from "@netlify/database";
import { json, hashIp } from "./_shared.mjs";

const MAX_IMAGES = 3;
const MAX_BYTES_PER_IMAGE = 4 * 1024 * 1024; // 4 MB Sicherheitsnetz (Client komprimiert adaptiv auf ~1,5 MB)
const RATE_LIMIT_PER_HOUR = 8;

export default async (req) => {
  if (req.method !== "POST") return json(405, { error: "method not allowed" });

  let body;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "invalid json" });
  }

  // Honeypot: Bots fuellen versteckte Felder aus. Wir tun so, als waere alles ok,
  // speichern aber nichts.
  if (body.website) {
    return json(200, { ok: true });
  }

  const images = Array.isArray(body.images) ? body.images : [];
  const thumbs = Array.isArray(body.thumbs) ? body.thumbs : [];
  if (images.length === 0 || images.length > MAX_IMAGES || images.length !== thumbs.length) {
    return json(400, { error: "1-3 Bilder erforderlich" });
  }
  for (const img of images) {
    const approxBytes = (img.length * 3) / 4;
    if (approxBytes > MAX_BYTES_PER_IMAGE) {
      return json(400, { error: "Bild zu gross" });
    }
  }

  const ip = req.headers.get("x-nf-client-connection-ip") || "unknown";
  const ipHash = hashIp(ip);

  const rl = getStore("rate-limit");
  const rlKey = `${ipHash}:${new Date().toISOString().slice(0, 13)}`; // pro Stunde
  const current = (await rl.get(rlKey, { type: "text" })) || "0";
  const count = parseInt(current, 10);
  if (count >= RATE_LIMIT_PER_HOUR) {
    return json(429, { error: "Zu viele Uploads, bitte spaeter erneut versuchen" });
  }
  await rl.set(rlKey, String(count + 1));

  const displayName = typeof body.displayName === "string" ? body.displayName.slice(0, 80) : null;
  const locationText = typeof body.locationText === "string" ? body.locationText.slice(0, 160) : null;
  const comment = typeof body.comment === "string" ? body.comment.slice(0, 500) : null;

  // GPS ist bereits clientseitig auf ~3 Nachkommastellen (~100m) gerundet.
  let lat = null, lng = null;
  if (typeof body.lat === "number" && typeof body.lng === "number") {
    if (body.lat >= -90 && body.lat <= 90 && body.lng >= -180 && body.lng <= 180) {
      lat = Math.round(body.lat * 1000) / 1000;
      lng = Math.round(body.lng * 1000) / 1000;
    }
  }

  const store = getStore("post-images");
  const imageKeys = [];
  const thumbKeys = [];

  try {
    for (let i = 0; i < images.length; i++) {
      const id = crypto.randomUUID();
      const fullKey = `full/${id}.webp`;
      const thumbKey = `thumb/${id}.webp`;
      await store.set(fullKey, Buffer.from(images[i], "base64"));
      await store.set(thumbKey, Buffer.from(thumbs[i], "base64"));
      imageKeys.push(fullKey);
      thumbKeys.push(thumbKey);
    }
  } catch (e) {
    return json(500, { error: "Speichern fehlgeschlagen" });
  }

  const db = getDatabase();
  const allKeys = imageKeys.map((k, i) => `${k}|${thumbKeys[i]}`);

  const [row] = await db.sql`
    INSERT INTO posts (image_keys, display_name, location_text, lat, lng, comment, status, client_ip_hash)
    VALUES (${allKeys}, ${displayName}, ${locationText}, ${lat}, ${lng}, ${comment}, 'pending', ${ipHash})
    RETURNING id
  `;

  return json(200, { ok: true, id: row.id });
};

export const config = { path: "/.netlify/functions/upload" };
