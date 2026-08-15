import { getDatabase } from "@netlify/database";
import { getStore } from "@netlify/blobs";
import { json, checkAdminAuth } from "./_shared.mjs";

export default async (req) => {
  if (!checkAdminAuth(req)) return json(401, { error: "unauthorized" });
  if (req.method !== "POST") return json(405, { error: "method not allowed" });

  const body = await req.json().catch(() => null);
  if (!body || !body.id || !["approve", "murks", "delete"].includes(body.action)) {
    return json(400, { error: "invalid request" });
  }

  const db = getDatabase();

  if (body.action === "approve") {
    await db.sql`UPDATE posts SET status = 'approved', moderated_at = now() WHERE id = ${body.id}`;
  } else if (body.action === "murks") {
    // "Murks": Beitrag bleibt gespeichert, wird aber standardmaessig aus der
    // oeffentlichen Galerie ausgeblendet (posts.mjs zeigt nur status='approved').
    await db.sql`UPDATE posts SET status = 'murks', moderated_at = now() WHERE id = ${body.id}`;
  } else if (body.action === "delete") {
    const [row] = await db.sql`SELECT image_keys FROM posts WHERE id = ${body.id}`;
    if (row) {
      const store = getStore("post-images");
      for (const pair of row.image_keys) {
        const [full, thumb] = pair.split("|");
        await store.delete(full);
        await store.delete(thumb);
      }
    }
    await db.sql`DELETE FROM posts WHERE id = ${body.id}`;
  }

  return json(200, { ok: true });
};

export const config = { path: "/.netlify/functions/admin-moderate" };
