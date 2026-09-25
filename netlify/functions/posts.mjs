import { getDatabase } from "@netlify/database";
import { json } from "./_shared.mjs";

export default async (req) => {
  const url = new URL(req.url);
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "60", 10) || 60, 1), 1000);
  const before = url.searchParams.get("before"); // ISO-Datum fuer Pagination
  const idParam = parseInt(url.searchParams.get("id") || "", 10);

  const db = getDatabase();
  const rows = Number.isFinite(idParam)
    ? await db.sql`
        SELECT id, image_keys, display_name, location_text, lat, lng, comment, created_at
        FROM posts
        WHERE status = 'approved' AND id = ${idParam}
        LIMIT 1
      `
    : before
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
      // Direkt die Function ansprechen statt ueber /img/* -- die Weiterleitungsregel
      // hat den "key"-Query-Parameter nicht zuverlaessig durchgereicht.
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
      createdAt: r.created_at,
    };
  });

  // Kurz am CDN cachen (30 s) und danach im Hintergrund aktualisieren -- spart Function-Aufrufe
  return new Response(JSON.stringify({ posts }), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "netlify-cdn-cache-control": "public, max-age=30, stale-while-revalidate=60",
    },
  });
};

export const config = { path: "/.netlify/functions/posts" };
