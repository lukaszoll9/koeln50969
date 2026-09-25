import { getDatabase } from "@netlify/database";
import { getStore } from "@netlify/blobs";
import { json, checkAdminAuth } from "./_shared.mjs";

const ACTIONS = ["approve", "reject", "murks", "ablehnen", "feature", "delete", "update"];

function cleanText(v, max) {
  if (v === undefined) return undefined;
  if (v === null) return null;
  const s = String(v).trim().slice(0, max);
  return s.length ? s : null;
}

export default async (req) => {
  if (!checkAdminAuth(req)) return json(401, { error: "unauthorized" });
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
