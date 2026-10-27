import { getDatabase } from "@netlify/database";
import { getStore } from "@netlify/blobs";
import { json, requireAdmin } from "./_shared.mjs";

const ACTIONS = ["approve", "reject", "murks", "ablehnen", "feature", "delete", "update", "replace-image"];

function cleanText(v, max) {
  if (v === undefined) return undefined;
  if (v === null) return null;
  const s = String(v).trim().slice(0, max);
  return s.length ? s : null;
}

export default async (req) => {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  if (req.method !== "POST") return json(405, { error: "method not allowed" });

  const body = await req.json().catch(() => null);
  const id = body && parseInt(body.id, 10);
  if (!body || !Number.isFinite(id) || !ACTIONS.includes(body.action)) {
    return json(400, { error: "invalid request" });
  }

  const db = getDatabase();

  if (body.action === "feature") {
    await db.sql`UPDATE posts SET featured = false WHERE featured = true`;
    await db.sql`UPDATE posts SET featured = true WHERE id = ${id}`;
  } else if (body.action === "approve") {
    await db.sql`UPDATE posts SET status = 'approved', moderated_at = now() WHERE id = ${id}`;
  } else if (["reject", "murks", "ablehnen"].includes(body.action)) {
    await db.sql`UPDATE posts SET status = 'rejected', moderated_at = now() WHERE id = ${id}`;
  } else if (body.action === "update") {
    // Ort, Name, Kommentar und Koordinaten nachtraeglich korrigieren
    const [cur] = await db.sql`SELECT display_name, location_text, lat, lng, comment FROM posts WHERE id = ${id}`;
    if (!cur) return json(404, { error: "not found" });
    const name = cleanText(body.displayName, 80);
    const loc = cleanText(body.locationText, 160);
    const comment = cleanText(body.comment, 500);
    let lat = cur.lat, lng = cur.lng;
    if (body.lat === null || body.lng === null) { lat = null; lng = null; }
    else if (typeof body.lat === "number" && typeof body.lng === "number" &&
             body.lat >= -90 && body.lat <= 90 && body.lng >= -180 && body.lng <= 180) {
      lat = Math.round(body.lat * 10000) / 10000;
      lng = Math.round(body.lng * 10000) / 10000;
    }
    await db.sql`
      UPDATE posts SET
        display_name = ${name === undefined ? cur.display_name : name},
        location_text = ${loc === undefined ? cur.location_text : loc},
        comment = ${comment === undefined ? cur.comment : comment},
        lat = ${lat}, lng = ${lng}
      WHERE id = ${id}
    `;
  } else if (body.action === "replace-image") {
    // Bild ersetzen (z. B. im Admin gedreht): neue Keys, damit der CDN-Cache nicht das alte Bild liefert
    const idx = parseInt(body.index, 10);
    const [row] = await db.sql`SELECT image_keys FROM posts WHERE id = ${id}`;
    if (!row || !Number.isFinite(idx) || idx < 0 || idx >= row.image_keys.length) return json(400, { error: "invalid image" });
    const decode = (b64) => (typeof b64 === "string" && b64.length < 6_000_000 ? Buffer.from(b64, "base64") : null);
    const full = decode(body.full), thumb = decode(body.thumb);
    const isJpeg = (b) => b && b.length > 100 && b[0] === 0xff && b[1] === 0xd8;
    if (!isJpeg(full) || !isJpeg(thumb)) return json(400, { error: "invalid image data" });
    const store = getStore("post-images");
    const uid = crypto.randomUUID();
    const fullKey = `full/${uid}.jpg`, thumbKey = `thumb/${uid}.jpg`;
    await store.set(fullKey, new Blob([full], { type: "image/jpeg" }), { metadata: { contentType: "image/jpeg" } });
    await store.set(thumbKey, new Blob([thumb], { type: "image/jpeg" }), { metadata: { contentType: "image/jpeg" } });
    const keys = row.image_keys.slice();
    const [oldFull, oldThumb] = keys[idx].split("|");
    keys[idx] = `${fullKey}|${thumbKey}`;
    await db.sql`UPDATE posts SET image_keys = ${keys} WHERE id = ${id}`;
    await store.delete(oldFull).catch(() => {});
    await store.delete(oldThumb).catch(() => {});
  } else if (body.action === "delete") {
    const [row] = await db.sql`SELECT image_keys FROM posts WHERE id = ${id}`;
    if (row) {
      const store = getStore("post-images");
      for (const pair of row.image_keys) {
        const [full, thumb] = pair.split("|");
        await store.delete(full);
        await store.delete(thumb);
      }
    }
    await db.sql`DELETE FROM posts WHERE id = ${id}`;
  }

  return json(200, { ok: true });
};

export const config = { path: "/.netlify/functions/admin-moderate" };
