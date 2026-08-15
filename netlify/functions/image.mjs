import { getStore } from "@netlify/blobs";

export default async (req) => {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  if (!key || key.includes("..")) {
    return new Response("not found", { status: 404 });
  }

  const store = getStore("post-images");
  const data = await store.get(key, { type: "arrayBuffer" });
  if (!data) return new Response("not found", { status: 404 });

  return new Response(data, {
    status: 200,
    headers: {
      "content-type": "image/webp",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
};

export const config = { path: "/.netlify/functions/image" };
