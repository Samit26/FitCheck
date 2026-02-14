import React, { useState, useCallback, useRef } from "react";
import ClothingSelector from "@/components/ClothingSelector";
import GenderSelector from "@/components/GenderSelector";
import ResultDisplay from "@/components/ResultDisplay";
import MobileBottomSheet from "@/components/MobileBottomSheet";
import Toast from "@/components/Toast";
import { generateOutfit } from "@/lib/api";
import { maleClothingItems, femaleClothingItems } from "@/data/clothingData";
import {
  Sparkles,
  Menu,
  Camera,
  ShoppingBag,
  ArrowRight,
  Heart,
  CheckCircle,
  Zap,
  Ruler,
  Store,
  TrendingUp,
  Users,
  Shirt,
  Download,
  Share2,
  Image,
  AlertCircle,
  Check,
  Twitter,
  Instagram,
  Linkedin,
  X,
  ArrowLeft,
  Upload,
} from "lucide-react";

// ── Mobile Try-On View (preview on top, bottom sheet, sticky CTA) ──
const MobileTryOnView = ({
  generatedImage,
  isLoading,
  error,
  onRetry,
  userPhoto,
  onPhotoSelect,
  canGenerate,
  onGenerate,
  selectedClothing,
  onSelectClothing,
  gender,
}) => {
  const fileInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleFileSelect = useCallback(
    (file) => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setPhotoPreview(reader.result);
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

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    onPhotoSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const hasPhoto = userPhoto && photoPreview;

  return (
    <div className="flex flex-col rounded-3xl overflow-hidden bg-gray-50 shadow-xl border border-gray-100">
      {/* ─── Preview Area (top) ─── */}
      <div className="relative bg-gradient-to-b from-gray-100 to-gray-50 flex items-center justify-center min-h-[380px]">
        {!hasPhoto ? (
          /* Upload prompt */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center text-center p-6 cursor-pointer"
          >
            <div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-violet-500" />
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-1">
              Upload your photo
            </p>
            <p className="text-xs text-gray-400 mb-4">Tap to choose a photo</p>
            <span className="px-5 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-full text-xs font-semibold shadow-lg">
              Choose Photo
            </span>
          </div>
        ) : isLoading ? (
          /* Loading */
          <div className="text-center p-6">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-violet-200" />
              <div className="absolute inset-0 rounded-full border-4 border-violet-600 border-t-transparent animate-spin" />
              <div className="absolute inset-3 rounded-full bg-violet-50 flex items-center justify-center">
                <Shirt className="w-7 h-7 text-violet-600 animate-pulse" />
              </div>
            </div>
            <p className="text-gray-900 font-semibold text-sm animate-pulse">
              AI is working...
            </p>
            <p className="text-xs text-gray-400">
              Fitting clothes to your photo
            </p>
          </div>
        ) : error ? (
          /* Error */
          <div className="text-center p-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-3">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <p className="text-gray-900 font-semibold text-sm mb-1">
              Generation failed
            </p>
            <p className="text-xs text-gray-500 mb-3">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-5 py-2 bg-gray-900 text-white rounded-full text-xs font-medium"
              >
                Try Again
              </button>
            )}
          </div>
        ) : generatedImage ? (
          /* Generated result */
          <div className="w-full">
            <img
              src={generatedImage}
              className="w-full object-contain max-h-[420px]"
              alt="Virtual Try-On Result"
            />
            <div className="absolute top-3 right-3 glass px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-medium text-gray-700">
                AI Generated
              </span>
            </div>
          </div>
        ) : (
          /* Photo uploaded, waiting for selection */
          <div className="w-full relative">
            <img
              src={photoPreview}
              className="w-full object-contain max-h-[420px]"
              alt="Your photo"
            />
            <button
              onClick={handleRemovePhoto}
              className="absolute top-3 right-3 w-7 h-7 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md"
            >
              <X className="w-3.5 h-3.5 text-gray-600" />
            </button>
          </div>
        )}
      </div>

      {/* ─── Bottom Sheet (outfit selector) ─── */}
      <MobileBottomSheet
        selectedClothing={selectedClothing}
        onSelectClothing={onSelectClothing}
        gender={gender}
      />

      {/* ─── Sticky Generate CTA ─── */}
      <div className="px-4 pb-4 pt-1 bg-white">
        <button
          onClick={onGenerate}
          disabled={!canGenerate || isLoading}
          className="w-full py-3.5 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 text-white rounded-2xl font-bold text-base shadow-xl shadow-violet-200/50 flex items-center justify-center gap-2 group disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
        >
          <Sparkles className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
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

function App() {
  const [selectedClothing, setSelectedClothing] = useState({});
  const [userPhoto, setUserPhoto] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [gender, setGender] = useState(null); // null | 'male' | 'female'
  const [toast, setToast] = useState(null);
  const tryOnRef = useRef(null);

  const canGenerate = userPhoto && Object.keys(selectedClothing).length > 0;

  const showToast = useCallback((message, type = "error") => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const handleSelectClothing = useCallback((itemId, category) => {
    setSelectedClothing((prev) => {
      const next = { ...prev };
      if (next[category] === itemId) {
        delete next[category];
      } else {
        next[category] = itemId;
      }
      return next;
    });
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const allItems =
        gender === "female" ? femaleClothingItems : maleClothingItems;
      const selectedItems = Object.values(selectedClothing)
        .map((id) => allItems.find((item) => item.id === id))
        .filter(Boolean);

      if (selectedItems.length === 0) {
        showToast("Please select at least one clothing item", "error");
        setIsLoading(false);
        return;
      }

      const result = await generateOutfit(selectedItems, userPhoto);

      if (result.success && result.generatedImageUrl) {
        setGeneratedImage(result.generatedImageUrl);
        showToast("Virtual try-on generated successfully!", "success");
      } else {
        throw new Error(result.message || "Failed to generate image");
      }
    } catch (err) {
      console.error("Generation error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to generate outfit. Please try again.";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  }, [canGenerate, selectedClothing, userPhoto, gender, showToast]);

  const handleRetry = useCallback(() => {
    setError(null);
    setGeneratedImage(null);
  }, []);

  const scrollToTryOn = () => {
    tryOnRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePhotoUpload = (photo) => {
    setUserPhoto(photo);
  };

  const handleSelectGender = (g) => {
    setGender(g);
    setSelectedClothing({});
    setGeneratedImage(null);
    setError(null);
  };

  return (
    <div className="bg-gray-50 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 glass border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse-glow">
                <Sparkles className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                FitCheck
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#"
                className="text-gray-700 hover:text-violet-600 font-medium transition-colors"
              >
                How it Works
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-violet-600 font-medium transition-colors"
              >
                For Stores
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-violet-600 font-medium transition-colors"
              >
                Pricing
              </a>
              <button className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-all transform hover:scale-105">
                Get Started
              </button>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass border-t border-gray-200/50">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <a
                href="#"
                className="block px-3 py-2 text-gray-700 hover:text-violet-600 font-medium"
              >
                How it Works
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-gray-700 hover:text-violet-600 font-medium"
              >
                For Stores
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-gray-700 hover:text-violet-600 font-medium"
              >
                Pricing
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-orange-50 animate-gradient"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-delayed"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-violet-200 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-violet-600 animate-pulse"></span>
                <span className="text-sm font-medium text-violet-900">
                  AI-Powered Fashion Tech
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Try Before You{" "}
                <span className="text-gradient font-serif italic">Buy</span>
                <br />
                With AI Magic
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Upload your photo and see how any outfit looks on you instantly.
                No dressing rooms, no hassle—just pure fashion confidence.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={scrollToTryOn}
                  className="group bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  Try It Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 rounded-full font-semibold text-lg border-2 border-gray-300 hover:border-violet-600 hover:text-violet-600 transition-all">
                  For Retailers
                </button>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  <img
                    src="https://i.pravatar.cc/150?img=1"
                    className="w-10 h-10 rounded-full border-2 border-white"
                    alt="User"
                  />
                  <img
                    src="https://i.pravatar.cc/150?img=2"
                    className="w-10 h-10 rounded-full border-2 border-white"
                    alt="User"
                  />
                  <img
                    src="https://i.pravatar.cc/150?img=3"
                    className="w-10 h-10 rounded-full border-2 border-white"
                    alt="User"
                  />
                  <img
                    src="https://i.pravatar.cc/150?img=4"
                    className="w-10 h-10 rounded-full border-2 border-white"
                    alt="User"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-bold text-gray-900">10,000+</span> happy
                  users
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative lg:h-[600px] flex items-center justify-center">
              <div className="relative w-full max-w-md animate-float">
                <div className="glass rounded-3xl p-6 shadow-2xl border border-white/50">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 relative mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop"
                      alt="Virtual Try-On Demo"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="glass-dark rounded-xl p-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                          <Shirt className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-white">
                          <p className="text-xs opacity-80">Trying on</p>
                          <p className="font-semibold text-sm">
                            Summer Collection 2026
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Casual Blazer
                      </p>
                      <p className="text-sm text-gray-500">$89.00</p>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center hover:bg-violet-600 hover:text-white transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 glass rounded-2xl p-4 shadow-xl animate-float-delayed">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Size Match</p>
                      <p className="font-bold text-gray-900">98% Accurate</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 shadow-xl animate-float">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-violet-600" />
                    <span className="text-sm font-medium text-gray-700">
                      AI Generated
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main App Interface */}
      <section
        ref={tryOnRef}
        className="py-16 bg-gradient-to-b from-gray-50/80 to-white relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Create Your Look
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm lg:text-base">
              Pick your style and see how it looks on you instantly
            </p>
          </div>

          {!gender ? (
            /* ── Gender Selection Screen ── */
            <GenderSelector onSelectGender={handleSelectGender} />
          ) : (
            <>
              {/* Back / Switch Gender */}
              <div className="mb-4 lg:mb-6">
                <button
                  onClick={() => setGender(null)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-violet-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Switch gender
                </button>
              </div>

              {/* ═══════ DESKTOP LAYOUT (lg+) ═══════ */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-stretch">
                {/* Left Sidebar – Outfit Selector */}
                <div className="lg:col-span-4">
                  <ClothingSelector
                    selectedClothing={selectedClothing}
                    onSelectClothing={handleSelectClothing}
                    gender={gender}
                  />
                </div>

                {/* Right – Preview Panel */}
                <div className="lg:col-span-8">
                  <ResultDisplay
                    generatedImage={generatedImage}
                    isLoading={isLoading}
                    error={error}
                    onRetry={handleRetry}
                    userPhoto={userPhoto}
                    onPhotoSelect={handlePhotoUpload}
                    canGenerate={canGenerate}
                    onGenerate={handleGenerate}
                  />
                </div>
              </div>

              {/* ═══════ MOBILE LAYOUT (<lg) ═══════ */}
              <div className="lg:hidden">
                <MobileTryOnView
                  generatedImage={generatedImage}
                  isLoading={isLoading}
                  error={error}
                  onRetry={handleRetry}
                  userPhoto={userPhoto}
                  onPhotoSelect={handlePhotoUpload}
                  canGenerate={canGenerate}
                  onGenerate={handleGenerate}
                  selectedClothing={selectedClothing}
                  onSelectClothing={handleSelectClothing}
                  gender={gender}
                />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose FitCheck?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Revolutionary technology that changes how you shop for clothes
              online
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow card-3d">
              <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Instant Results
              </h3>
              <p className="text-gray-600 leading-relaxed">
                See how clothes look on you in seconds, not minutes. Our AI
                processes images in real-time.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow card-3d">
              <div className="w-14 h-14 rounded-2xl bg-fuchsia-100 flex items-center justify-center mb-6">
                <Ruler className="w-7 h-7 text-fuchsia-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Perfect Fit
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced body mapping technology ensures clothes fit your unique
                body shape accurately.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow card-3d">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mb-6">
                <Store className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Store Integration
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Easy integration for clothing stores. Add your inventory and let
                customers try before buying.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Retailers Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl opacity-20 blur-2xl"></div>
                <div className="relative bg-gray-900 rounded-3xl p-8 text-white">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-gray-400 text-sm">Total Try-ons</p>
                      <p className="text-3xl font-bold">24,592</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                          <Shirt className="w-5 h-5 text-violet-400" />
                        </div>
                        <span>Summer Collection</span>
                      </div>
                      <span className="text-green-400 font-semibold">
                        +142%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-fuchsia-500/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-fuchsia-400" />
                        </div>
                        <span>New Customers</span>
                      </div>
                      <span className="text-green-400 font-semibold">+89%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 font-medium text-sm">
                <Store className="w-4 h-4" />
                For Retailers
              </div>
              <h2 className="text-4xl font-bold text-gray-900">
                Boost Sales with Virtual Try-On
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Join hundreds of clothing stores already using FitCheck to
                reduce returns and increase customer confidence.
              </p>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    Reduce return rates by up to 40%
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    Increase conversion rates by 3x
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    Simple API integration in minutes
                  </span>
                </li>
              </ul>

              <button className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all transform hover:scale-105">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold">FitCheck</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Revolutionizing online fashion shopping with AI-powered virtual
                try-on technology.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Docs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2026 FitCheck. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
