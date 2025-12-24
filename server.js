import "dotenv/config";
import express from "express";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK;
if (!WEBHOOK_URL) console.warn("⚠️ Brak DISCORD_WEBHOOK w .env");

app.post("/api/buy", async (req, res) => {
  const { pack, page, time } = req.body || {};
  if (!WEBHOOK_URL) return res.status(500).json({ ok: false, error: "Missing DISCORD_WEBHOOK" });

  const payload = {
    embeds: [{
      title: "🛒 Kliknięto „Kupuję”",
      color: 0xFFD400,
      fields: [
        { name: "Pakiet", value: String(pack || "Nieznany"), inline: true },
        { name: "Strona", value: String(page || "-"), inline: false },
        { name: "Czas", value: String(time || new Date().toISOString()), inline: false }
      ],
      footer: { text: "LightningCode • localhost test" }
    }]
  };

  try {
    const r = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!r.ok) return res.status(500).json({ ok: false, error: "Webhook error" });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// ✅ TO JEST KLUCZOWE NA WINDOWS
const indexPath = fileURLToPath(new URL("./index.html", import.meta.url));
app.get("/", (req, res) => res.sendFile(indexPath));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Serwer działa: http://localhost:${PORT}`));
