import React, { useRef, useState, useCallback } from "react";
import { Camera, X, CheckCircle } from "lucide-react";

const PhotoUploader = ({ onPhotoSelect, selectedPhoto }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = useCallback(
    (file) => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
        onPhotoSelect(file);
      }
    },
    [onPhotoSelect],
  );

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onPhotoSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-50 rounded-3xl p-8 border-2 border-dashed border-gray-300 hover:border-violet-400 transition-colors">
      {!preview ? (
        <div
          className="text-center space-y-4 cursor-pointer"
          onClick={handleClick}
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-violet-100 flex items-center justify-center">
            <Camera className="w-10 h-10 text-violet-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              Upload your photo
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag & drop or click to browse
            </p>
          </div>
          <button className="px-6 py-2.5 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:border-violet-600 hover:text-violet-600 transition-colors shadow-sm">
            Choose File
          </button>
          <p className="text-xs text-gray-400">JPG, PNG up to 10MB</p>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            className="w-full rounded-2xl shadow-lg"
            alt="Uploaded photo"
          />
          <button
            onClick={handleRemove}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-3 right-3 glass rounded-xl p-3">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Photo uploaded successfully</span>
            </div>
          </div>
        </div>
      )}

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

export default PhotoUploader;
