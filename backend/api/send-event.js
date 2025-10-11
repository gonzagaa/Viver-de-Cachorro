import axios from "axios";
import crypto from "crypto";

export default async function handler(req, res) {
  // 🧠 Lê o corpo manualmente se vier vazio
  let body = req.body;

  if (!body || Object.keys(body).length === 0) {
    try {
      const rawBody = await new Promise((resolve, reject) => {
        let data = "";
        req.on("data", (chunk) => (data += chunk));
        req.on("end", () => resolve(data));
        req.on("error", reject);
      });
      body = JSON.parse(rawBody || "{}");
    } catch (err) {
      console.error("Erro ao ler corpo:", err);
      return res.status(400).json({ error: "Corpo inválido ou ausente" });
    }
  }

  // 🔧 Configuração básica
  const PIXEL_ID = process.env.FACEBOOK_PIXEL_ID;
  const ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
  const FB_API_URL = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`;

  // 🛡️ CORS
  res.setHeader("Access-Control-Allow-Origin", "https://comunidadeadestramento.com.br");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { event_name, event_source_url, fbp, fbc, email, phone } = body;

  if (!event_name) {
    return res.status(400).json({ error: "event_name é obrigatório." });
  }

  try {
    // 🔒 Hash SHA-256 (dados fictícios)
    const hashedEmail = email ? crypto.createHash("sha256").update(email).digest("hex") : undefined;
    const hashedPhone = phone ? crypto.createHash("sha256").update(phone).digest("hex") : undefined;

    // 📦 Payload
    const payload = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url,
          user_data: {
            em: hashedEmail ? [hashedEmail] : [],
            ph: hashedPhone ? [hashedPhone] : [],
            fbp,
            fbc,
          },
        },
      ],
    };

    // 🚀 Envia pro Facebook
    const response = await axios.post(`${FB_API_URL}?access_token=${ACCESS_TOKEN}`, payload);

    console.log("✅ Evento enviado:", event_name);
    return res.status(200).json({ success: true, event: event_name, fbResponse: response.data });
  } catch (error) {
    console.error("❌ Erro ao enviar evento:", error.response?.data || error.message);
    return res.status(500).json({ error: "Erro ao enviar evento para o Facebook." });
  }
}
