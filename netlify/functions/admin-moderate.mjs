import { getDatabase } from "@netlify/database";
import { getStore } from "@netlify/blobs";
import { json, checkAdminAuth } from "./_shared.mjs";

async function sendAdminPush(title, body, url) {
  const vapidKey = process.env.VAPID_PRIVATE_KEY;
  // Ohne VAPID-Key: stille Benachrichtigung via Mailjet
  const apiKey = process.env.MAILJET_API_KEY;
  const secret = process.env.MAILJET_SECRET_KEY;
  const toEmail = process.env.NOTIFY_EMAIL || "lukasfra437@gmail.com";
  if (!apiKey || !secret) return;
  try {
    await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Basic " + btoa(`${apiKey}:${secret}`) },
      body: JSON.stringify({ Messages: [{ From: { Email: "noreply@koeln50969.de", Name: "Köln 50969" }, To: [{ Email: toEmail }], Subject: title, TextPart: body + "\n\nhttps://koeln50969.de" + url }] }),
    });
  } catch(e) {}
}

async function sendNotification(subject, body) {
  const apiKey = process.env.MAILJET_API_KEY;
  const secret = process.env.MAILJET_SECRET_KEY;
  const toEmail = process.env.NOTIFY_EMAIL || "lukasfra437@gmail.com";
  if (!apiKey || !secret) return; // kein Mailjet konfiguriert → still überspringen
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
          Subject: subject,
          TextPart: body,
        }],
      }),
    });
  } catch (e) {
    console.error("Mail-Fehler:", e);
  }
}

export default async (req) => {
  if (!checkAdminAuth(req)) return json(401, { error: "unauthorized" });
  if (req.method !== "POST") return json(405, { error: "method not allowed" });

  const body = await req.json().catch(() => null);
  if (!body || !body.id || !["approve", "feature", "murks", "delete"].includes(body.action)) {
    return json(400, { error: "invalid request" });
  }

  const db = getDatabase();

  if (body.action === "feature") {
    await db.sql`UPDATE posts SET featured = false WHERE featured = true`;
    await db.sql`UPDATE posts SET featured = true WHERE id = ${body.id}`;
    return json(200, { ok: true });
  } else if (body.action === "approve") {
    await db.sql`UPDATE posts SET status = 'approved', moderated_at = now() WHERE id = ${body.id}`;
    // Push-Benachrichtigung an Admin (du bekommst Bescheid wenn jemand freigeschaltet wird)
    sendAdminPush("✅ Fund freigeschaltet", `Fund #${body.id} ist jetzt in der Galerie sichtbar.`, "/admin.html").catch(()=>{});
  } else if (body.action === "murks") {
    await db.sql`UPDATE posts SET status = 'rejected', moderated_at = now() WHERE id = ${body.id}`;
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



