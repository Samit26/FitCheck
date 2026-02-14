import axios from "axios";

// Use environment variable for backend URL, fallback to relative path for development
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes timeout for AI generation
});

/**
 * Generate virtual try-on image with AI
 * @param {Array<{id: string, name: string, category: string, image: string}>} clothingItems - Selected clothing items
 * @param {File} userPhoto - User's uploaded photo
 * @returns {Promise<{success: boolean, generatedImageUrl?: string, message?: string}>}
 */
export const generateOutfit = async (clothingItems, userPhoto) => {
  const formData = new FormData();
  formData.append("userPhoto", userPhoto);
  formData.append("clothingItems", JSON.stringify(clothingItems));

  const response = await api.post("/generate-outfit", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export default api;
