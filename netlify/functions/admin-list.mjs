import { getDatabase } from "@netlify/database";
import { json, checkAdminAuth } from "./_shared.mjs";

export default async (req) => {
  if (!checkAdminAuth(req)) return json(401, { error: "unauthorized" });

  const url = new URL(req.url);
  const status = url.searchParams.get("status") || "pending";
  if (!["pending", "approved", "murks"].includes(status)) {
    return json(400, { error: "invalid status" });
  }

  const db = getDatabase();
  const rows = await db.sql`
    SELECT id, image_keys, display_name, location_text, lat, lng, comment, status, created_at
    FROM posts
    WHERE status = ${status}
    ORDER BY created_at DESC
    LIMIT 100
  `;

  const posts = rows.map((r) => {
    const pairs = r.image_keys.map((pair) => {
      const [full, thumb] = pair.split("|");
      return {
        full: `/.netlify/functions/image?key=${encodeURIComponent(full)}`,
        thumb: `/.netlify/functions/image?key=${encodeURIComponent(thumb)}`,
      };
    });
    return {
      id: r.id,
      images: pairs,
      displayName: r.display_name,
      locationText: r.location_text,
      lat: r.lat,
      lng: r.lng,
      comment: r.comment,
      status: r.status,
      createdAt: r.created_at,
    };
  });

  return json(200, { posts });
};

export const config = { path: "/.netlify/functions/admin-list" };
