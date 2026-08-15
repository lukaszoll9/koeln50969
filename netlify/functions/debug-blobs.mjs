import { getStore } from "@netlify/blobs";
import { json } from "./_shared.mjs";

export default async (req) => {
  const store = getStore("post-images");
  const { blobs } = await store.list();
  const details = [];
  for (const b of blobs.slice(0, 20)) {
    const meta = await store.getMetadata(b.key).catch((e) => ({ error: String(e) }));
    details.push({ key: b.key, etag: b.etag, metadata: meta?.metadata || meta });
  }
  return json(200, { count: blobs.length, details });
};

export const config = { path: "/.netlify/functions/debug-blobs" };
