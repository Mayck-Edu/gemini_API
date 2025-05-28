# 🤖 Chat com Gemini API

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Google Gemini API](https://img.shields.io/badge/Google%20Gemini%20API-FF0000?style=for-the-badge&logo=google&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

Um projeto simples em Node.js que demonstra a integração com a **API Google Gemini** para criar um chatbot interativo via terminal. Converse com o modelo Gemini diretamente do seu prompt de comando!

---

## ✨ Funcionalidades

* **Interação via Terminal:** Envie mensagens e receba respostas do Gemini diretamente na linha de comando.
* **Integração com Gemini API:** Utiliza o poder do modelo de linguagem Gemini para gerar respostas.
* **Gerenciamento Seguro de Chave API:** Usa variáveis de ambiente (`.env`) para proteger sua chave de API.

---

## 🚀 Como Usar

Siga os passos abaixo para configurar e rodar o projeto em sua máquina.

### Pré-requisitos

Certifique-se de ter o Node.js e o npm (Node Package Manager) instalados:

* **Node.js**: [Download e Instalação](https://nodejs.org/pt-br/download/)
* **npm**: Vem junto com o Node.js

### 1. Clonar o Repositório e iniciar
```bash
git clone [https://github.com/Mayck-Edu/gemini_API.git](https://github.com/Mayck-Edu/gemini_API.git)
cd gemini_API
```

### 2. Configuração
defina a chave de api em:
**.env**
```bash
GOOGLE_API_KEY=sua_chave_de_api
```
caso não possua, crie sua chave gratuitamente no Google Gemini

### 3. Inicialização 
```bash
cd gemini_API

npm start
```