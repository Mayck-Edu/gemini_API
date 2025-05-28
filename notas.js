// // Adicione "type": "module" no seu package.json
// // Exemplo:
// // {
// //   "name": "meu-projeto",
// //   "version": "1.0.0",
// //   "type": "module", // <-- Adicione esta linha
// //   "main": "index.js",
// //   "scripts": {
// //     "start": "node index.js"
// //   }
// // }

// import 'dotenv/config'; // <-- Mude esta linha para carregar o .env
// import { GoogleGenAI } from "@google/genai";

// const apiKey = process.env.GOOGLE_API_KEY;

// const ai = new GoogleGenAI({ apiKey: apiKey });

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.0-flash",
//     contents: "bom diaa",
//   });
//   console.log(response.text);
// }

// await main();

