import { getDatabase } from "@netlify/database";
import { json } from "./_shared.mjs";

export default async (req) => {
  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "60", 10), 100);
  const before = url.searchParams.get("before"); // ISO-Datum fuer Pagination

  const db = getDatabase();
  const rows = before
    ? await db.sql`
        SELECT id, image_keys, display_name, location_text, lat, lng, comment, created_at
        FROM posts
        WHERE status = 'approved' AND created_at < ${before}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `
    : await db.sql`
        SELECT id, image_keys, display_name, location_text, lat, lng, comment, created_at
        FROM posts
        WHERE status = 'approved'
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;

  const posts = rows.map((r) => {
    const pairs = r.image_keys.map((pair) => {
      const [full, thumb] = pair.split("|");
      return { full: `/img/${full}`, thumb: `/img/${thumb}` };
    });
    return {
      id: r.id,
      images: pairs,
      displayName: r.display_name,
      locationText: r.location_text,
      lat: r.lat,
      lng: r.lng,
      comment: r.comment,
      createdAt: r.created_at,
    };
  });

  return json(200, { posts });
};

export const config = { path: "/.netlify/functions/posts" };
