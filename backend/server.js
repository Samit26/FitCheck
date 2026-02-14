import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import clothingRoutes from "./routes/clothing.js";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve static files from the dist folder (production build)
const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));

// API Routes
app.use("/api", clothingRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File too large. Maximum size is 10MB.",
    });
  }

  if (err.message.includes("Unexpected field")) {
    return res.status(400).json({
      success: false,
      message: "Invalid file field name.",
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// SPA fallback - serve index.html for all non-API routes
// This ensures the app works on page refresh
app.get("*", (req, res) => {
  // Don't handle API routes here
  if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
    return res.status(404).json({
      success: false,
      message: "Endpoint not found",
    });
  }
  
  // Serve index.html for all other routes (SPA fallback)
  const indexPath = path.join(distPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({
        success: false,
        message: "Application not found. Please build the frontend first.",
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${path.join(__dirname, "uploads")}`);
});

export default app;
