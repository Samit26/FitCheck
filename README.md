# Virtual Clothing Try-On

An AI-powered web application that allows users to virtually try on clothing items using Google's Gemini AI.

## Features

- 🎨 **Virtual Try-On**: See yourself wearing different outfits without physically trying them
- 👕 **Clothing Selection**: Choose from various tops and bottoms
- 📸 **Photo Upload**: Upload your full-body photo for personalized results
- ⚡ **AI-Powered**: Uses Google Gemini 2.0 Flash for realistic image generation
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend

- React 18 + Vite
- Tailwind CSS
- shadcn/ui components
- Axios for API calls

### Backend

- Express.js
- Google Generative AI SDK (Gemini)
- Multer for file uploads

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Google Gemini API key (get one at [Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository**

   ```bash
   cd Virtual_clothes_try
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

4. **Configure environment variables**

   ```bash
   # In the backend folder, copy the example env file
   cp .env.example .env

   # Edit .env and add your Gemini API key
   GEMINI_API_KEY=your_api_key_here
   ```

### Running the Application

1. **Start the backend server** (from the `backend` folder)

   ```bash
   npm start
   ```

   The API server will run on http://localhost:3001

2. **Start the frontend** (from the root folder, in a new terminal)
   ```bash
   npm run dev
   ```
   The app will open at http://localhost:5173

Or run both simultaneously:

```bash
npm run dev:all
```

## Usage

1. **Select a Top**: Browse the available tops and click to select one
2. **Select a Bottom**: Browse the available bottoms and click to select one
3. **Upload Your Photo**: Click or drag-and-drop a full-body photo
4. **Generate**: Click "Generate Outfit" to see your virtual try-on result
5. **Download**: Save your generated image

### Tips for Best Results

- Use a well-lit, front-facing photo
- Stand with arms slightly away from your body
- Plain backgrounds work best
- Higher resolution photos produce better results

## API Endpoints

### GET /api/health

Health check endpoint

### GET /api/clothing

Returns available clothing items

### POST /api/generate-outfit

Generate a virtual try-on image

**Request:**

- `topClothingId` (string): ID of the selected top
- `bottomClothingId` (string): ID of the selected bottom
- `userPhoto` (file): User's photo file

**Response:**

```json
{
  "success": true,
  "generatedImageUrl": "/uploads/generated-xxx.png"
}
```

## Project Structure

```
Virtual_clothes_try/
├── src/                    # Frontend source
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── ClothingSelector.jsx
│   │   ├── PhotoUploader.jsx
│   │   └── ResultDisplay.jsx
│   ├── lib/               # Utilities and API
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── backend/               # Backend source
│   ├── controllers/       # Business logic
│   ├── routes/           # API routes
│   ├── uploads/          # Temporary file storage
│   └── server.js         # Express server
├── package.json          # Frontend dependencies
└── README.md
```

## Environment Variables

### Backend (.env)

| Variable         | Description                 | Required |
| ---------------- | --------------------------- | -------- |
| `GEMINI_API_KEY` | Google Gemini API key       | Yes      |
| `PORT`           | Server port (default: 3001) | No       |

## Troubleshooting

### "Invalid API key" error

- Make sure you've added your Gemini API key to `backend/.env`
- Verify the key is valid at [Google AI Studio](https://aistudio.google.com/)

### "Image generation not supported" error

- The Gemini 2.0 Flash model may have limited availability
- Check if your API key has access to image generation features

### Upload fails

- Ensure the file is under 10MB
- Only JPEG, PNG, and WebP formats are supported

## License

MIT License
