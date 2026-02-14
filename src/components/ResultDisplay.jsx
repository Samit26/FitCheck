import React, { useRef, useState, useCallback } from "react";
import {
  Download,
  Share2,
  Image,
  AlertCircle,
  Shirt,
  Camera,
  X,
  CheckCircle,
  Sparkles,
  Upload,
} from "lucide-react";

const ResultDisplay = ({
  generatedImage,
  isLoading,
  error,
  onRetry,
  userPhoto,
  onPhotoSelect,
  canGenerate,
  onGenerate,
}) => {
  const fileInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = `virtual-try-on-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    if (generatedImage && navigator.share) {
      try {
        await navigator.share({
          title: "My Virtual Try-On",
          text: "Check out my virtual outfit!",
          url: generatedImage,
        });
      } catch (err) {
        // user cancelled share
      }
    }
  };

  const handleFileSelect = useCallback(
    (file) => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result);
        };
        reader.readAsDataURL(file);
        onPhotoSelect(file);
      }
    },
    [onPhotoSelect],
  );

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect],
  );

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    onPhotoSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const hasPhoto = userPhoto && photoPreview;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 h-full flex flex-col overflow-hidden">
      {/* Header Bar */}
      <div className="flex justify-between items-center px-6 pt-5 pb-3">
        <h3 className="text-lg font-bold text-gray-900">Preview</h3>
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            disabled={!generatedImage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      <div className="h-px bg-gray-100 mx-6" />

      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative min-h-[500px]">
        {!hasPhoto ? (
          /* ── Upload Prompt ── */
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-sm flex flex-col items-center justify-center text-center cursor-pointer group"
          >
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-50 to-fuchsia-50 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <Upload className="w-10 h-10 text-violet-500" />
            </div>
            <p className="text-xl font-semibold text-gray-900 mb-2">
              Upload your photo
            </p>
            <p className="text-sm text-gray-400 mb-5">
              Drag & drop or click to browse
            </p>
            <button className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-violet-200 hover:shadow-xl hover:scale-105 transition-all">
              Choose Photo
            </button>
            <p className="text-xs text-gray-400 mt-3">JPG, PNG up to 10MB</p>
          </div>
        ) : isLoading ? (
          /* ── Loading State ── */
          <div className="text-center space-y-4">
            <div className="relative w-28 h-28 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-violet-200" />
              <div className="absolute inset-0 rounded-full border-4 border-violet-600 border-t-transparent animate-spin" />
              <div className="absolute inset-4 rounded-full bg-violet-50 flex items-center justify-center">
                <Shirt className="w-8 h-8 text-violet-600 animate-pulse" />
              </div>
            </div>
            <p className="text-gray-900 font-semibold animate-pulse">
              AI is working its magic...
            </p>
            <p className="text-sm text-gray-400">
              Fitting clothes to your photo
            </p>
          </div>
        ) : error ? (
          /* ── Error State ── */
          <div className="text-center space-y-4 max-w-sm">
            <div className="w-24 h-24 mx-auto rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <p className="text-gray-900 font-semibold">Generation failed</p>
            <p className="text-sm text-gray-500">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        ) : generatedImage ? (
          /* ── Generated Result ── */
          <div className="w-full max-w-md">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={generatedImage}
                className="w-full"
                alt="Virtual Try-On Result"
              />
              <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-gray-700">
                  AI Generated
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* ── Photo Uploaded – Waiting for outfit selection ── */
          <div className="w-full max-w-sm flex flex-col items-center">
            <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-lg mb-4">
              <img
                src={photoPreview}
                className="w-full h-full object-cover"
                alt="Your photo"
              />
              <button
                onClick={handleRemovePhoto}
                className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3 glass rounded-xl px-3 py-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700 font-medium">
                  Photo ready
                </span>
              </div>
            </div>
            {!canGenerate && (
              <p className="text-sm text-gray-400 text-center">
                Select an outfit from the left to try on
              </p>
            )}
          </div>
        )}
      </div>

      {/* Generate Button (always at bottom) */}
      <div className="px-6 pb-5">
        <button
          onClick={onGenerate}
          disabled={!canGenerate || isLoading}
          className="w-full py-4 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-violet-200/50 hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
        >
          <Sparkles
            className={`w-5 h-5 ${isLoading ? "animate-spin" : "group-hover:animate-spin"}`}
          />
          {isLoading ? "Generating..." : "Generate Virtual Try-On"}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
};

export default ResultDisplay;
