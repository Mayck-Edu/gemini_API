// server.js (ou index.js)

import 'dotenv/config'; // Garante que as variáveis de ambiente do .env sejam carregadas
import express from 'express'; // Importa o Express.js
import { GoogleGenAI } from "@google/genai";

// --- Configuração da API Gemini ---
const apiKey = process.env.GOOGLE_API_KEY;

// Verifica se a chave da API está presente
if (!apiKey) {
  console.error('Erro: A chave da API do Google (GOOGLE_API_KEY) não foi encontrada no arquivo .env.');
  console.error('Por favor, crie um arquivo .env na raiz do projeto com GOOGLE_API_KEY=SUA_CHAVE_AQUI');
  process.exit(1); // Encerra a aplicação se a chave não estiver configurada
}

const ai = new GoogleGenAI({ apiKey: apiKey });
const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Usando um modelo otimizado para chat

// --- Configuração do Servidor Express ---
const app = express();
const PORT = process.env.PORT || 3000; // Define a porta, padrão 3000

// Middleware para permitir JSON no corpo das requisições
app.use(express.json());

// --- Rota da API para o Chatbot ---
app.post('/chat', async (req, res) => {
  const { message } = req.body; // Pega a mensagem do corpo da requisição JSON

  // Verifica se a mensagem foi enviada
  if (!message) {
    return res.status(400).json({ error: 'Nenhuma mensagem fornecida.' });
  }

  console.log(`Recebida pergunta: "${message}"`);

  try {
    // Inicia um chat com o modelo (você pode gerenciar histórico aqui se quiser)
    const chat = model.startChat({
      history: [], // Para um chat stateless por requisição, ou adicione history do req.body
      generationConfig: {
        maxOutputTokens: 500, // Limita o tamanho da resposta
      },
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    console.log(`Resposta Gemini: "${responseText}"`);

    // Retorna a resposta do Gemini em JSON
    res.json({ reply: responseText });

  } catch (error) {
    console.error('Erro ao comunicar com a API Gemini:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao gerar resposta.' });
  }
});

// --- Iniciar o Servidor ---
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Envie POST para http://localhost:${PORT}/chat com um JSON {"message": "Sua pergunta"}`);
});