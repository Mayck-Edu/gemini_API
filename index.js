import 'dotenv/config';
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error('Erro: A chave da API do Google (GOOGLE_API_KEY) não foi encontrada no arquivo .env.');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Nenhuma mensagem fornecida.' });
  }

  try {
    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: message,
    });

    let responseText = 'Desculpe, não consegui gerar uma resposta.';
    if (result && result.candidates && result.candidates.length > 0 && result.candidates[0].content) {
      const parts = result.candidates[0].content.parts;
      if (parts && parts.length > 0 && parts[0].text) {
        responseText = parts[0].text;
      } else if (result.candidates[0].content.text) {
        responseText = result.candidates[0].content.text;
      }
    } else {
      res.status(500).json({ error: 'Erro ao gerar resposta: Resposta da API inválida.' });
      return;
    }

    res.json({ reply: responseText });

  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor ao gerar resposta.', details: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
