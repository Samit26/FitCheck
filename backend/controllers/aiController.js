import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy initialization of Gemini AI
let genAI = null;
function getGenAI() {
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAI;
}

/**
 * Get MIME type from file extension
 */
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };
  return mimeTypes[ext] || "image/jpeg";
}

/**
 * Generate virtual try-on image using Gemini Nano Banana (gemini-2.5-flash-image)
 *
 * @param {Object} params
 * @param {Array} params.clothingItems - Array of { id, name, category, image }
 * @param {string} params.userPhotoPath - Path to the uploaded user photo on disk
 * @returns {{ generatedImageUrl: string }}
 */
export async function generateOutfitWithAI({ clothingItems, userPhotoPath }) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file.",
    );
  }

  console.log("\uD83C\uDFA8 Generating virtual try-on with:");
  clothingItems.forEach((item) => {
    console.log("   " + item.category + ": " + item.name);
  });

  try {
    // Read user photo
    const userMimeType = getMimeType(userPhotoPath);
    const userImageData = fs.readFileSync(userPhotoPath);
    const userBase64 = userImageData.toString("base64");

    // Build clothing description for the prompt
    const clothingDescription = clothingItems
      .map((item) => "- " + item.name + " (" + item.category + ")")
      .join("\n");

    // Determine which body parts are being changed
    const selectedCategories = clothingItems.map((i) => i.category);
    const keepInstructions = [];
    if (
      !selectedCategories.includes("tops") &&
      !selectedCategories.includes("dresses")
    ) {
      keepInstructions.push(
        "Keep the person's existing upper-body clothing unchanged.",
      );
    }
    if (
      !selectedCategories.includes("bottoms") &&
      !selectedCategories.includes("dresses")
    ) {
      keepInstructions.push(
        "Keep the person's existing lower-body clothing unchanged.",
      );
    }

    const promptText =
      "You are a professional virtual clothing try-on system. " +
      "Generate a photorealistic image of the person in the FIRST image " +
      "wearing the clothing items shown in the FOLLOWING image(s).\n\n" +
      "Selected clothing items to dress the person in:\n" +
      clothingDescription +
      "\n\nCRITICAL requirements:\n" +
      "- Maintain the person's EXACT facial features, body shape, skin tone, hair style, and pose from the first image.\n" +
      "- Fit each clothing item naturally on the person's body with realistic sizing and proportions.\n" +
      "- Use natural lighting that matches the original photo.\n" +
      "- Add proper fabric textures, shadows, and natural wrinkles on the clothing.\n" +
      (keepInstructions.length > 0 ? keepInstructions.join("\n") + "\n" : "") +
      "- Keep the original background intact.\n" +
      "- The result must look like an authentic photograph, not a digital composite.\n" +
      "- Seamlessly blend clothing onto the person's body.";

    // Build contents array: prompt text + user photo + clothing images
    const contents = [
      { text: promptText },
      {
        inlineData: {
          mimeType: userMimeType,
          data: userBase64,
        },
      },
    ];

    // Add each selected clothing image
    for (const item of clothingItems) {
      // item.image is like "/Images/Denim Shirt.webp"
      const clothingImagePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        item.image,
      );

      if (fs.existsSync(clothingImagePath)) {
        const clothingMimeType = getMimeType(clothingImagePath);
        const clothingData = fs.readFileSync(clothingImagePath);
        const clothingBase64 = clothingData.toString("base64");
        contents.push({
          inlineData: {
            mimeType: clothingMimeType,
            data: clothingBase64,
          },
        });
      } else {
        console.warn("Warning: Clothing image not found: " + clothingImagePath);
      }
    }

    // Call Gemini Nano Banana (gemini-2.5-flash-image)
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: contents,
      config: {
        responseModalities: ["Text", "Image"],
      },
    });

    // Extract the generated image from the response
    let generatedImageUrl = null;

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageBuffer = Buffer.from(part.inlineData.data, "base64");
        const outputFilename = "generated-" + uuidv4() + ".png";
        const outputPath = path.join(
          __dirname,
          "..",
          "uploads",
          outputFilename,
        );

        fs.writeFileSync(outputPath, imageBuffer);
        generatedImageUrl = "/uploads/" + outputFilename;

        console.log("Image generated successfully: " + outputPath);

        // Schedule cleanup after 1 hour
        setTimeout(() => {
          fs.unlink(outputPath, (err) => {
            if (err) console.log("Failed to delete generated file:", err);
            else console.log("Cleaned up generated file:", outputFilename);
          });
        }, 3600000);

        break;
      } else if (part.text) {
        console.log("AI Response (text):", part.text);
      }
    }

    if (!generatedImageUrl) {
      throw new Error(
        "No image was generated. The AI model may not support this request or it was filtered.",
      );
    }

    return { generatedImageUrl };
  } catch (error) {
    console.error("Gemini API Error:", error);

    if (
      error.message?.includes("API_KEY") ||
      error.message?.includes("apiKey")
    ) {
      throw new Error(
        "Invalid API key. Please check your Gemini API configuration.",
      );
    }

    if (error.message?.includes("SAFETY")) {
      throw new Error(
        "Image could not be generated due to content safety filters. Please try a different photo.",
      );
    }

    if (
      error.message?.includes("quota") ||
      error.message?.includes("RESOURCE_EXHAUSTED")
    ) {
      throw new Error("API quota exceeded. Please try again later.");
    }

    if (
      error.message?.includes("not found") ||
      error.message?.includes("not supported")
    ) {
      throw new Error(
        "The AI model is not available. Please check your API configuration.",
      );
    }

    throw new Error(
      error.message || "Failed to generate outfit. Please try again.",
    );
  }
}

export default { generateOutfitWithAI };
