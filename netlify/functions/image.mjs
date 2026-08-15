import { getStore } from "@netlify/blobs";

export default async (req) => {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  if (!key || key.includes("..")) {
    return new Response("not found", { status: 404 });
  }

  const store = getStore("post-images");
  const result = await store.getWithMetadata(key, { type: "arrayBuffer" });
  if (!result) return new Response("not found", { status: 404 });

  // Bevorzugt den beim Upload gespeicherten Content-Type. Fuer aeltere Eintraege
  // ohne Metadaten (vor diesem Fix hochgeladen) anhand der Dateiendung raten,
  // statt blind "webp" zu behaupten.
  const contentType =
    result.metadata?.contentType ||
    (key.endsWith(".jpg") || key.endsWith(".jpeg") ? "image/jpeg" : "image/webp");

  return new Response(result.data, {
    status: 200,
    headers: {
      "content-type": contentType,
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
};

export const config = { path: "/.netlify/functions/image" };
