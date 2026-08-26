import { getStore } from "@netlify/blobs";
import { getDatabase } from "@netlify/database";
import { json, hashIp } from "./_shared.mjs";

async function notifyNewUpload(locationText, displayName, possibleDuplicate = false) {
  const apiKey = process.env.MAILJET_API_KEY;
  const secret = process.env.MAILJET_SECRET_KEY;
  const toEmail = process.env.NOTIFY_EMAIL || "lukasfra437@gmail.com";
  if (!apiKey || !secret) return;
  const who = displayName || "Anonym";
  const where = locationText || "unbekannter Ort";
  const dupHint = possibleDuplicate ? "\n⚠️ MÖGLICHES DUPLIKAT — gleicher Standort bereits vorhanden!" : "";
  try {
    await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(`${apiKey}:${secret}`),
      },
      body: JSON.stringify({
        Messages: [{
          From: { Email: "noreply@koeln50969.de", Name: "Köln 50969" },
          To: [{ Email: toEmail }],
          Subject: possibleDuplicate ? `⚠️ Mögl. Duplikat: ${where}` : `🗓️ Neuer Fund: ${where}`,
          TextPart: `Ein neuer Fund wurde eingereicht!${dupHint}\n\nOrt: ${where}\nName: ${who}\n\nZum Admin-Panel:\nhttps://koeln50969.de/admin.html`,
        }],
      }),
    });
  } catch (e) { console.error("Mail-Fehler:", e); }
}

const MAX_IMAGES = 2;
const MAX_BYTES_PER_IMAGE = 4 * 1024 * 1024; // 4 MB Sicherheitsnetz (Client komprimiert adaptiv auf ~1,5 MB)
const RATE_LIMIT_PER_HOUR = 8;

export default async (req) => {
  if (req.method !== "POST") return json(405, { error: "method not allowed" });

  let body;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "invalid json" });
  }

  // Honeypot: Bots fuellen versteckte Felder aus. Wir tun so, als waere alles ok,
  // speichern aber nichts.
  if (body.website) {
      // E-Mail-Benachrichtigung
  notifyNewUpload(body.locationText, body.displayName).catch(() => {});

  return json(200, { ok: true });
  }

  const images = Array.isArray(body.images) ? body.images : [];
  const thumbs = Array.isArray(body.thumbs) ? body.thumbs : [];
  const imageMimes = Array.isArray(body.imageMimes) ? body.imageMimes : [];
  const thumbMimes = Array.isArray(body.thumbMimes) ? body.thumbMimes : [];
  if (images.length === 0 || images.length > MAX_IMAGES || images.length !== thumbs.length) {
    return json(400, { error: "1-3 Bilder erforderlich" });
  }
  const ALLOWED_MIME = ['image/jpeg','image/png','image/webp','image/heic','image/gif'];
  for (let i = 0; i < images.length; i++) {
    const approxBytes = (images[i].length * 3) / 4;
    if (approxBytes > MAX_BYTES_PER_IMAGE) {
      return json(400, { error: "Bild zu gross" });
    }
    // MIME-Typ serverseitig prüfen
    const mime = imageMimes[i] || '';
    if (!ALLOWED_MIME.includes(mime)) {
      return json(400, { error: "Ungültiges Bildformat" });
    }
    // Base64-Prefix prüfen: echte Bilder haben spezifische Magic Bytes
    const sample = Buffer.from(images[i].slice(0, 16), 'base64');
    const isJpeg = sample[0] === 0xFF && sample[1] === 0xD8;
    const isPng  = sample[0] === 0x89 && sample[1] === 0x50;
    const isWebP = sample[8] === 0x57 && sample[9] === 0x45; // WEBP
    const isHeic = true; // HEIC schwer zu prüfen, MIME reicht
    if (!isJpeg && !isPng && !isWebP) {
      // Nur ablehnen wenn eindeutig kein Bild
      const b64start = images[i].slice(0, 8);
      if (b64start === 'AAAAAAA=' || images[i].length < 100) {
        return json(400, { error: "Kein gültiges Bild" });
      }
    }
  }

  const ip = req.headers.get("x-nf-client-connection-ip") || "unknown";
  const ipHash = hashIp(ip);

  const rl = getStore("rate-limit");
  // Stündliches Limit
  const rlKey = `${ipHash}:${new Date().toISOString().slice(0, 13)}`;
  const current = (await rl.get(rlKey, { type: "text" })) || "0";
  const count = parseInt(current, 10);
  if (count >= RATE_LIMIT_PER_HOUR) {
    return json(429, { error: "Zu viele Uploads, bitte spaeter erneut versuchen" });
  }
  // Tägliches Limit: max 20 pro Tag pro IP
  const rlDayKey = `${ipHash}:day:${new Date().toISOString().slice(0, 10)}`;
  const dayCount = parseInt((await rl.get(rlDayKey, { type: "text" })) || "0", 10);
  if (dayCount >= 20) {
    return json(429, { error: "Tageslimit erreicht, bitte morgen erneut versuchen" });
  }
  await rl.set(rlKey, String(count + 1));
  await rl.set(rlDayKey, String(dayCount + 1), { expirationTtl: 86400 });

  const displayName = typeof body.displayName === "string" ? body.displayName.slice(0, 80) : null;
  const locationText = typeof body.locationText === "string" ? body.locationText.slice(0, 160) : null;
  const comment = typeof body.comment === "string" ? body.comment.slice(0, 500) : null;

  // GPS-Validierung: nur plausible, nicht-null Koordinaten speichern
  let lat = null, lng = null;
  if (typeof body.lat === "number" && typeof body.lng === "number") {
    const rawLat = body.lat;
    const rawLng = body.lng;
    // Grundlegende Gültigkeitsprüfung
    const validRange = rawLat >= -90 && rawLat <= 90 && rawLng >= -180 && rawLng <= 180;
    // 0,0 ist ein häufiger Fallback bei kaputten EXIF-Daten (Golf von Guinea, West-Afrika)
    const notNullIsland = Math.abs(rawLat) > 0.1 || Math.abs(rawLng) > 0.1;
    // Koordinaten müssen auf Land liegen (grobe Prüfung: nicht mitten im Ozean)
    // Wir akzeptieren alle Koordinaten die gültig und nicht 0,0 sind
    if (validRange && notNullIsland) {
      // 4 Nachkommastellen ≈ 11 m Genauigkeit
      lat = Math.round(rawLat * 10000) / 10000;
      lng = Math.round(rawLng * 10000) / 10000;
    }
  }

  const store = getStore("post-images");
  const imageKeys = [];
  const thumbKeys = [];

  try {
    for (let i = 0; i < images.length; i++) {
      const id = crypto.randomUUID();
      // Bild-Typ kommt vom Client (spiegelt, was toBlob() dort tatsaechlich erzeugt hat --
      // webp normalerweise, jpeg als Fallback bei aelteren Browsern). Nie blind "webp" annehmen.
      const fullMime = imageMimes[i] === "image/jpeg" ? "image/jpeg" : "image/webp";
      const thumbMime = thumbMimes[i] === "image/jpeg" ? "image/jpeg" : "image/webp";
      const fullExt = fullMime === "image/jpeg" ? "jpg" : "webp";
      const thumbExt = thumbMime === "image/jpeg" ? "jpg" : "webp";
      const fullKey = `full/${id}.${fullExt}`;
      const thumbKey = `thumb/${id}.${thumbExt}`;
      // Als Blob (nicht als roher Node-Buffer) speichern -- das ist der dokumentiert
      // unterstuetzte Typ fuer Netlify Blobs und traegt den Content-Type gleich mit.
      const fullBlob = new Blob([Buffer.from(images[i], "base64")], { type: fullMime });
      const thumbBlob = new Blob([Buffer.from(thumbs[i], "base64")], { type: thumbMime });
      await store.set(fullKey, fullBlob, { metadata: { contentType: fullMime } });
      await store.set(thumbKey, thumbBlob, { metadata: { contentType: thumbMime } });
      imageKeys.push(fullKey);
      thumbKeys.push(thumbKey);
    }
  } catch (e) {
    return json(500, { error: "Speichern fehlgeschlagen" });
  }

  const db = getDatabase();
  const allKeys = imageKeys.map((k, i) => `${k}|${thumbKeys[i]}`);

  // Duplikat-Erkennung: Prüfe ob innerhalb ~50m schon ein Fund existiert
  // 0.0005 Grad ≈ 55m — gut genug um doppelte Einreichungen am gleichen Spot zu erkennen
  let possibleDuplicate = false;
  if (lat !== null && lng !== null) {
    const radius = 0.0005;
    const nearby = await db.sql`
      SELECT id FROM posts
      WHERE status IN ('approved', 'pending')
        AND lat IS NOT NULL AND lng IS NOT NULL
        AND lat BETWEEN ${lat - radius} AND ${lat + radius}
        AND lng BETWEEN ${lng - radius} AND ${lng + radius}
      LIMIT 1
    `;
    if (nearby.length > 0) possibleDuplicate = true;
  }

  const [row] = await db.sql`
    INSERT INTO posts (image_keys, display_name, location_text, lat, lng, comment, status, client_ip_hash)
    VALUES (${allKeys}, ${displayName}, ${locationText}, ${lat}, ${lng}, ${comment}, 'pending', ${ipHash})
    RETURNING id
  `;

  // E-Mail-Benachrichtigung (auch bei Duplikat, aber mit Hinweis)
  notifyNewUpload(locationText, displayName, possibleDuplicate).catch(() => {});

  return json(200, { ok: true, id: row.id, possibleDuplicate });
};

export const config = { path: "/.netlify/functions/upload" };





