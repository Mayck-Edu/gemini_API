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

/**
 * Rota para processar mensagens do chat usando a API Gemini.
 * Espera um JSON no formato: { message: "sua mensagem" }
 * Retorna: { reply: "resposta da IA" }
 */
app.post('/chat', async (req, res) => {
  const { message } = req.body;

  // Validação da entrada
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Nenhuma mensagem válida fornecida.' });
  }

  try {
    // Chamada à API Gemini para gerar resposta
    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: message }] }],
    });

    // Extração segura da resposta da IA
    let responseText = 'Desculpe, não consegui gerar uma resposta.';
    if (
      result?.candidates?.length > 0 &&
      result.candidates[0]?.content?.parts?.length > 0 &&
      result.candidates[0].content.parts[0]?.text
    ) {
      responseText = result.candidates[0].content.parts[0].text;
    } else if (result?.candidates?.[0]?.content?.text) {
      responseText = result.candidates[0].content.text;
    } else {
      return res.status(500).json({ error: 'Erro ao gerar resposta: Resposta da API inválida.' });
    }

    res.json({ reply: responseText });

  } catch (error) {
    // Log detalhado para depuração
    console.error('Erro ao gerar resposta:', error);
    res.status(500).json({
      error: 'Erro interno do servidor ao gerar resposta.',
      details: error.message,
    });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
