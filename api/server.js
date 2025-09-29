const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Variáveis de ambiente da Vercel
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const PIXEL_ID = process.env.PIXEL_ID;

// 📡 Rota para enviar eventos ao Facebook
app.post('/api/fb-event', async (req, res) => {
  const { eventName, userData } = req.body;

  try {
    await axios.post(`https://graph.facebook.com/v18.0/${PIXEL_ID}/events`, {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(new Date().getTime() / 1000),
          action_source: 'website',
          user_data: userData,
        }
      ],
      access_token: ACCESS_TOKEN,
    });

    res.status(200).json({ success: true, message: 'Evento enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar evento:', error.response.data);
    res.status(500).json({ success: false, message: 'Erro ao enviar evento' });
  }
});

// 🌐 Porta padrão para Vercel
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
