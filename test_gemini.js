// test_gemini.js

import 'dotenv/config'; // Garante que as variáveis de ambiente do .env sejam carregadas
import { GoogleGenerativeAI } from '@google/generative-ai'; // Importa a SDK do Gemini

async function testGeminiAPI() {
    console.log('Iniciando teste de conexão com a API Gemini...');

    // 1. Obter a chave da API do .env
    const apiKey = process.env.GOOGLE_API_KEY;

    // 2. Verificar se a chave foi carregada
    if (!apiKey) {
        console.error('\n🚫 ERRO: A chave da API (GOOGLE_API_KEY) não foi encontrada no arquivo .env.');
        console.error('Certifique-se de que o arquivo ".env" existe na raiz do projeto e contém GOOGLE_API_KEY=SUA_CHAVE_AQUI.');
        console.error('Se você acabou de criar/alterar o .env, reinicie seu terminal.');
        return; // Sai da função
    } else {
        console.log('✅ Chave da API carregada com sucesso.');
    }

    try {
        // 3. Inicializar o cliente da API
        const genAI = new GoogleGenerativeAI({ apiKey: apiKey });

        // 4. Obter o modelo (usando gemini-1.5-flash, ideal para uso geral)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log('✅ Modelo Gemini inicializado.');

        // 5. Enviar uma pergunta simples
        const prompt = "Qual é a capital do Brasil?";
        console.log(`\n🤔 Enviando pergunta: "${prompt}"`);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 6. Exibir a resposta
        console.log('\n✨ Resposta do Gemini:');
        console.log(text);
        console.log('\n✅ Teste de conexão concluído com sucesso!');

    } catch (error) {
        // 7. Lidar com erros na comunicação da API
        console.error('\n❌ ERRO ao comunicar com a API Gemini:');
        console.error(`Mensagem de erro: ${error.message}`);
        if (error.message.includes('API key not valid')) {
            console.error('\n🚨 POSSÍVEL CAUSA: A chave da API não é válida ou não tem permissão.');
            console.error('Verifique no Google Cloud Console se a "Generative Language API" está ativada no seu projeto e se as restrições da chave estão corretas.');
            console.error('Tente gerar uma NOVA chave de API no Google AI Studio e atualize seu arquivo .env.');
        } else if (error.message.includes('permission denied')) {
            console.error('\n🚨 POSSÍVEL CAUSA: Permissão negada. Verifique as permissões da API no Google Cloud Console.');
        } else {
            console.error('\n🚨 Outro erro: ', error);
        }
    }
}

// Executar a função de teste
testGeminiAPI();