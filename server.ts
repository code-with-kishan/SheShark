import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Chat Endpoint
  app.post("/api/ai/chat", async (req, res) => {
    const { message, mode, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    try {
      const systemPrompt = mode === "health" 
        ? "You are SheShark Health Assistant, a supportive AI for women's health and wellness. Provide empathetic, accurate, and helpful advice specifically for women. Always include a disclaimer that you are an AI and not a doctor."
        : "You are SheShark Business Advisor, a strategic AI for women entrepreneurs in the clean energy sector. Provide professional, actionable business advice, market insights, and growth strategies.";

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ parts: [{ text: `${systemPrompt}\n\nUser: ${message}` }] }],
      });
      const text = response.text;

      res.json({ text });
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "Failed to generate AI response" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SheShark Server running on http://localhost:${PORT}`);
  });
}

startServer();
