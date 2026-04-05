import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import cors from "cors";

// Import routes
import authRoutes from "./server/routes/auth";
import marketplaceRoutes from "./server/routes/marketplace";
import safetyRoutes from "./server/routes/safety";
import healthRoutes from "./server/routes/health";
import servicesRoutes from "./server/routes/services";

// Import middleware & database
import { errorHandler, rateLimit } from "./server/middleware/auth";
import { db } from "./server/models/index";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));
  app.use(cors());
  app.use(rateLimit(100, 60000)); // 100 requests per minute

  // Initialize database with seed data
  db.seedDummyData();

  // ========== API Routes ==========
  app.use("/api/auth", authRoutes);
  app.use("/api/marketplace", marketplaceRoutes);
  app.use("/api/safety", safetyRoutes);
  app.use("/api/health", healthRoutes);
  app.use("/api/services", servicesRoutes);

  app.post('/api/marketplace/upload-model-base64', async (req, res) => {
    try {
      const { fileName, data } = req.body as { fileName?: string; data?: string };

      if (!fileName || !data) {
        return res.status(400).json({ error: 'fileName and data are required' });
      }

      if (!fileName.toLowerCase().endsWith('.glb')) {
        return res.status(400).json({ error: 'Only .glb files are supported' });
      }

      const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, '')}`;
      const base64Data = data.includes(',') ? data.split(',')[1] : data;
      const outputDir = path.join(process.cwd(), 'public', 'models', 'uploads');
      const outputPath = path.join(outputDir, safeName);

      await fs.mkdir(outputDir, { recursive: true });
      await fs.writeFile(outputPath, Buffer.from(base64Data, 'base64'));

      return res.json({
        success: true,
        modelUrl: `/models/uploads/${safeName}`,
      });
    } catch (error) {
      console.error('Model upload error:', error);
      return res.status(500).json({ error: 'Failed to upload model' });
    }
  });

  // ========== AI & Voice ==========
  app.post("/api/ai/chat", async (req, res) => {
    const { message, mode = "general", language = "en" } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    try {
      const languageInstruction = 
        language === "hi" ? "Respond in Hindi." :
        language === "es" ? "Respond in Spanish." :
        "Respond in English.";

      let systemPrompt = "";
      if (mode === "health") {
        systemPrompt = `You are SheShark Health Assistant. Provide empathetic health advice. ${languageInstruction}`;
      } else if (mode === "business") {
        systemPrompt = `You are SheShark Business Advisor. Provide business guidance. ${languageInstruction}`;
      } else if (mode === "mental_health") {
        systemPrompt = `You are SheShark Mental Health Support. Provide empathetic emotional support. ${languageInstruction}`;
      } else {
        systemPrompt = `You are SheShark, an AI assistant for women empowerment. ${languageInstruction}`;
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ parts: [{ text: `${systemPrompt}\n\nUser: ${message}` }] }],
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "Failed to generate AI response" });
    }
  });

  app.post("/api/voice/command", async (req, res) => {
    try {
      const { transcript } = req.body;
      if (!transcript) return res.status(400).json({ error: "Transcript required" });

      const commands: Record<string, string> = {
        products: "/marketplace", marketplace: "/marketplace",
        safety: "/safety", help: "/safety",
        health: "/health", learning: "/learning",
        dashboard: "/dashboard", profile: "/profile",
      };

      for (const [key, path] of Object.entries(commands)) {
        if (transcript.toLowerCase().includes(key)) {
          return res.json({ matched: true, path, transcript });
        }
      }

      res.json({ matched: false, transcript });
    } catch (error) {
      console.error("Voice command error:", error);
      res.status(500).json({ error: "Failed to process command" });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date() });
  });

  app.get("/api/brands", async (req, res) => {
    try {
      const brands = await db.getAllBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brands" });
    }
  });

  // ========== Frontend ==========
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
      if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(distPath, "index.html"));
      } else {
        res.status(404).json({ error: "Not found" });
      }
    });
  }

  app.use(errorHandler);

  app.listen(PORT as number, "0.0.0.0", () => {
    console.log(`
🦈 SheShark Server Active - http://localhost:${PORT}
✅ Ready for production
    `);
  });
}

startServer().catch(err => {
  console.error("Server startup failed:", err);
  process.exit(1);
});
