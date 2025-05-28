

import 'dotenv/config';
import express from 'express';
import { GoogleGenAI } from '@google/genai'; // <-- Use esta SDK
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error('Erro: A chave da API do Google (GOOGLE_API_KEY) não foi encontrada no arquivo .env.');
  console.error('Por favor, crie um arquivo .env na raiz do projeto com GOOGLE_API_KEY=SUA_CHAVE_AQUI');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: apiKey });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Nenhuma mensagem fornecida.' });
  }

  console.log(`Recebida pergunta: "${message}"`);

  try {
    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: message,
    });

    // console.log("Resultado completo da API:", result); // Manter para depuração se quiser

    // --- CORREÇÃO AQUI ---
    let responseText = 'Desculpe, não consegui gerar uma resposta.'; // Default message
    if (result && result.candidates && result.candidates.length > 0 && result.candidates[0].content) {
      // Acesse o texto da resposta corretamente para a SDK @google/genai
      // Pode ser result.candidates[0].content.parts[0].text
      // Ou direto result.candidates[0].content.text
      // Vamos tentar o mais provável para 'content: [Object]'
      
      // A maneira mais robusta para a SDK @google/genai:
      const parts = result.candidates[0].content.parts;
      if (parts && parts.length > 0 && parts[0].text) {
          responseText = parts[0].text;
      } else if (result.candidates[0].content.text) { // fallback, caso o .text esteja direto em content
          responseText = result.candidates[0].content.text;
      }
      
    } else {
      console.error("Erro: Resposta da API inválida ou ausente (sem candidates ou content).");
      res.status(500).json({ error: 'Erro ao gerar resposta: Resposta da API inválida.' });
      return; // Sair da função para não continuar o processamento
    }
    // --- FIM DA CORREÇÃO ---


    console.log(`Resposta Gemini: "${responseText}"`);
    res.json({ reply: responseText });

  } catch (error) {
    console.error('Erro ao comunicar com a API Gemini:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor ao gerar resposta.', details: error.message });
  }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Abra http://localhost:${PORT} no seu navegador.`);
});