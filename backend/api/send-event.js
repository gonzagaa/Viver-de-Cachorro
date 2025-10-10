import axios from "axios";
import crypto from "crypto";

export default async function handler(req, res) {
  // 🔧 Configuração básica
  const PIXEL_ID = process.env.FACEBOOK_PIXEL_ID;
  const ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
  const FB_API_URL = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`;

  // 🛡️ Tratamento de CORS
  res.setHeader("Access-Control-Allow-Origin", "https://comunidadeadestramento.com.br");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 🧾 Recebendo dados do frontend
  const { event_name, event_source_url, fbp, fbc, email, phone } = req.body;

  if (!event_name) {
    return res.status(400).json({ error: "event_name é obrigatório." });
  }

  try {
    // 🔒 Hash SHA-256 para dados pessoais (mesmo fictícios)
    const hashedEmail = email ? crypto.createHash("sha256").update(email).digest("hex") : undefined;
    const hashedPhone = phone ? crypto.createHash("sha256").update(phone).digest("hex") : undefined;

    // 📦 Montagem do payload
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

    // 🚀 Envio para o Facebook
    const response = await axios.post(`${FB_API_URL}?access_token=${ACCESS_TOKEN}`, payload);

    console.log("✅ Evento enviado com sucesso:", event_name);
    return res.status(200).json({ success: true, event: event_name, fbResponse: response.data });
  } catch (error) {
    console.error("❌ Erro ao enviar evento:", error.response?.data || error.message);
    return res.status(500).json({ error: "Erro ao enviar evento para o Facebook." });
  }
}
