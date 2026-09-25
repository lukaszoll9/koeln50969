import { getDatabase } from "@netlify/database";

// Dynamische Sitemap: feste Seiten + jeder freigeschaltete Fund
const STATIC = [
  ["/", "daily", "1.0"],
  ["/karte.html", "daily", "0.9"],
  ["/statistik.html", "weekly", "0.6"],
  ["/hochladen.html", "monthly", "0.7"],
  ["/faq.html", "monthly", "0.5"],
  ["/kontakt.html", "yearly", "0.3"],
  ["/impressum.html", "yearly", "0.2"],
  ["/datenschutz.html", "yearly", "0.2"],
];

export default async () => {
  let rows = [];
  try {
    const db = getDatabase();
    rows = await db.sql`SELECT id, created_at FROM posts WHERE status = 'approved' ORDER BY created_at DESC LIMIT 5000`;
  } catch (e) { rows = []; }
  const base = "https://koeln50969.de";
  const urls = STATIC.map(([p, f, pr]) => `<url><loc>${base}${p}</loc><changefreq>${f}</changefreq><priority>${pr}</priority></url>`)
    .concat(rows.map((r) => `<url><loc>${base}/fund.html?id=${r.id}</loc><lastmod>${new Date(r.created_at).toISOString().slice(0, 10)}</lastmod><priority>0.5</priority></url>`));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "netlify-cdn-cache-control": "public, max-age=3600",
    },
  });
};

export const config = { path: "/sitemap.xml" };
