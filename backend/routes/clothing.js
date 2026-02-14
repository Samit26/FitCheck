import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { generateOutfitWithAI } from "../controllers/aiController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "user-photo-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed."),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

/**
 * POST /api/generate-outfit
 * Generate AI virtual try-on image
 *
 * Body (multipart/form-data):
 *   - userPhoto: File (required) - the user's photo
 *   - clothingItems: JSON string (required) - array of { id, name, category, image }
 */
router.post(
  "/generate-outfit",
  upload.single("userPhoto"),
  async (req, res) => {
    try {
      const { clothingItems } = req.body;
      const userPhoto = req.file;

      // Validate user photo
      if (!userPhoto) {
        return res.status(400).json({
          success: false,
          message: "Please upload your photo",
        });
      }

      // Validate and parse clothing items
      let parsedClothingItems;
      try {
        parsedClothingItems = JSON.parse(clothingItems);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: "Invalid clothing items data",
        });
      }

      if (
        !Array.isArray(parsedClothingItems) ||
        parsedClothingItems.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Please select at least one clothing item",
        });
      }

      console.log("Generating outfit:", {
        clothingItems: parsedClothingItems.map((i) => i.name + " (" + i.category + ")"),
        userPhotoPath: userPhoto.path,
      });

      // Generate outfit with AI
      const result = await generateOutfitWithAI({
        clothingItems: parsedClothingItems,
        userPhotoPath: userPhoto.path,
      });

      // Clean up uploaded user photo after processing
      setTimeout(() => {
        fs.unlink(userPhoto.path, (err) => {
          if (err) console.log("Failed to delete temp file:", err);
        });
      }, 60000);

      res.json({
        success: true,
        generatedImageUrl: result.generatedImageUrl,
      });
    } catch (error) {
      console.error("Generation error:", error);

      // Clean up uploaded file on error
      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }

      res.status(500).json({
        success: false,
        message:
          error.message || "Failed to generate outfit. Please try again.",
      });
    }
  },
);

export default router;
