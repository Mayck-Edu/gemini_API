// Importa a biblioteca 'dotenv' para carregar variáveis de ambiente de um arquivo .env
// O '/config' no final faz com que ele carregue as variáveis imediatamente ao ser importado.
import 'dotenv/config'; 
// Importa o framework Express para criar e gerenciar o servidor web.
import express from 'express';
// Importa a SDK oficial do Google para interagir com a API Gemini (GenAI).
import { GoogleGenAI } from '@google/genai'; 
// Importa o módulo 'path' para lidar com caminhos de arquivos e diretórios de forma cross-platform.
import path from 'path';
// Importa 'fileURLToPath' e 'url' para obter __filename e __dirname em módulos ES (ESM).
// Em Node.js moderno (módulos ES), __filename e __dirname não são variáveis globais por padrão.
import { fileURLToPath } from 'url';

// Converte a URL do módulo atual para um caminho de arquivo, obtendo o nome do arquivo atual.
const __filename = fileURLToPath(import.meta.url);
// Obtém o nome do diretório do arquivo atual. Isso é útil para servir arquivos estáticos.
const __dirname = path.dirname(__filename);

// Tenta obter a chave da API do Google a partir das variáveis de ambiente.
// Ela é carregada do arquivo .env graças ao 'dotenv/config'.
const apiKey = process.env.GOOGLE_API_KEY;

// Verifica se a chave da API foi encontrada. Se não, exibe uma mensagem de erro e sai do processo.
// if (!apiKey) {
//   console.error('Erro: A chave da API do Google (GOOGLE_API_KEY) não foi encontrada no arquivo .env.');
//   console.error('Por favor, crie um arquivo .env na raiz do projeto com GOOGLE_API_KEY=SUA_CHAVE_AQUI');
//   process.exit(1); // Encerra a aplicação com um código de erro.
// }

// Inicializa a SDK do Google GenAI com a chave da API fornecida.
// 'ai' será a instância que usaremos para interagir com os modelos da Google AI.
const ai = new GoogleGenAI({ apiKey: apiKey });

// Cria uma nova instância do aplicativo Express.
const app = express();
// Define a porta do servidor. Tenta usar a variável de ambiente PORT (para ambientes de produção)
// ou define 3000 como padrão se PORT não estiver definida.
const PORT = process.env.PORT || 3000;

// Middleware do Express:
// Serve arquivos estáticos (como HTML, CSS, JavaScript do frontend) da pasta 'public'.
// Isso significa que requisições para /index.html, /style.css, etc., serão respondidas
// com os arquivos correspondentes dentro de 'public'.
app.use(express.static(path.join(__dirname, 'public')));
// Middleware do Express:
// Habilita o Express a analisar corpos de requisição JSON. Isso é necessário para
// receber dados JSON enviados do cliente (ex: a mensagem do usuário no POST /chat).
app.use(express.json());

// Rota POST para o endpoint '/chat'.
// Esta rota é onde o frontend enviará as mensagens do usuário para serem processadas pela IA.
app.post('/chat', async (req, res) => {
  // Extrai a 'message' do corpo da requisição JSON.
  const { message } = req.body;

  // Validação básica: verifica se uma mensagem foi fornecida.
  if (!message) {
    return res.status(400).json({ error: 'Nenhuma mensagem fornecida.' });
  }

  // console.log(`Recebida pergunta: "${message}"`);

  try {
    // Chama a API Gemini para gerar conteúdo.
    const result = await ai.models.generateContent({
      // Especifica o modelo Gemini a ser usado. "gemini-1.5-flash" é um modelo otimizado para velocidade.
      model: "gemini-1.5-flash",
      // Passa a mensagem do usuário como parte do conteúdo para o modelo.
      // O Gemini aceita 'contents' como um array de objetos, mas a SDK simplifica
      // aceitando uma string para casos simples como este.
      contents: message, 
    });

    // A resposta da API Gemini vem em uma estrutura de objeto complexa.
    let responseText = 'Desculpe, não consegui gerar uma resposta.'; // Mensagem padrão em caso de falha.

    // Verifica se a resposta da API é válida e contém candidatos (respostas).
    // if (result && result.candidates && result.candidates.length > 0 && result.candidates[0].content) {
    //   // Acesse o texto da resposta corretamente para a SDK @google/genai.
    //   // A estrutura pode ser: result.candidates[0].content.parts[0].text
    //   const parts = result.candidates[0].content.parts;
    //   if (parts && parts.length > 0 && parts[0].text) {
    //       responseText = parts[0].text; // Extrai o texto da primeira parte do conteúdo.
    //   } else if (result.candidates[0].content.text) { 
    //       // Este é um fallback, caso o texto esteja diretamente em .content (menos comum para respostas completas)
    //       responseText = result.candidates[0].content.text;
    //   }
    // } else {
    //   // Se a resposta da API não tiver a estrutura esperada, registra um erro.
    //   console.error("Erro: Resposta da API inválida ou ausente (sem candidates ou content).");
    //   // Envia uma resposta de erro para o cliente.
    //   res.status(500).json({ error: 'Erro ao gerar resposta: Resposta da API inválida.' });
    //   return; // Sai da função para evitar processamento adicional.
    // }

    // console.log(`Resposta Gemini: "${responseText}"`);
    // Envia a resposta da IA de volta para o cliente como JSON.
    res.json({ reply: responseText });

  } catch (error) {
    // Captura quaisquer erros que ocorram durante a comunicação com a API Gemini.
    // console.error('Erro ao comunicar com a API Gemini:', error.message);
    // Envia uma resposta de erro interno do servidor para o cliente.
    res.status(500).json({ error: 'Erro interno do servidor ao gerar resposta.', details: error.message });
  }
});

// Rota GET para a raiz do servidor ('/').
// Quando o navegador acessa http://localhost:PORT/, esta rota envia o arquivo 'index.html'.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia o servidor Express.
// Ele começa a escutar por requisições na porta definida (PORT).
// app.listen(PORT, () => {
//   console.log(`Servidor rodando em http://localhost:${PORT}`);
//   console.log(`Abra http://localhost:${PORT} no seu navegador.`);
// });