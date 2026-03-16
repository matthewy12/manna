# 📖 Manna: AI-Powered Study Guide Generator

Manna is a full-stack web application designed to help community and study groups engage with dense reading materials. By pasting a chapter of text, users instantly receive a structured, multimodal study guide along with a short media form summary of the text.

The application orchestrates multiple AI models to extract core concepts, format discussion questions, and synthesize a dynamic, podcast-style audio summary.

## ✨ Features
* **Intelligent Summarization:** Extracts the absolute core concepts into a 3-point, high-energy summary.
* **Dynamic Audio Synthesis:** Generates a highly realistic, 1-minute podcast summarizing the chapter for on-the-go listening.
* **Discussion Generation:** Automatically crafts 4 thought-provoking questions tailored for small group discussion.
* **Strict Data Structuring:** Utilizes the Vercel AI SDK and Zod to enforce strict JSON schema outputs from the LLM, ensuring a stable, crash-free UI.

## 🏗️ Architecture & Tech Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Next.js (App Router), React, Tailwind CSS | Responsive, state-driven user interface. |
| **Text AI Engine** | Google Gemini API (`gemini-2.5-flash`) | Fast, large-context text processing and JSON generation. |
| **Audio Engine** | OpenAI API (`tts-1`) | High-fidelity text-to-speech voice synthesis. |
| **Orchestration** | Vercel AI SDK | Streaming, model abstraction, and Zod schema enforcement. |
| **Hosting** | Vercel | Serverless edge deployment and CI/CD. |

## 🚀 Local Development Setup

1. Clone the repository: `git clone https://github.com/yourusername/manna.git`
2. Navigate to the directory: `cd manna`
3. Install dependencies: `npm install`
4. Create a `.env.local` file in the root directory and add your API keys:
   * `GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key`
   * `OPENAI_API_KEY=your_openai_key`
5. Start the development server: `npm run dev`
6. Open `http://localhost:3000` in your browser.