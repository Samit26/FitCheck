import React, { useEffect } from "react";
import { X, AlertCircle, CheckCircle, Info } from "lucide-react";

const Toast = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => onDismiss(), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  if (!toast) return null;

  const styles = {
    error: {
      bg: "bg-red-50 border-red-200",
      text: "text-red-800",
      icon: <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
    },
    success: {
      bg: "bg-green-50 border-green-200",
      text: "text-green-800",
      icon: <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />,
    },
    info: {
      bg: "bg-blue-50 border-blue-200",
      text: "text-blue-800",
      icon: <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />,
    },
  };

  const style = styles[toast.type] || styles.info;

  return (
    <div className="fixed top-24 right-4 z-[100] animate-slide-up">
      <div
        className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-xl border ${style.bg}`}
      >
        {style.icon}
        <p className={`text-sm font-medium max-w-xs ${style.text}`}>
          {toast.message}
        </p>
        <button
          onClick={onDismiss}
          className="ml-1 hover:opacity-60 flex-shrink-0"
        >
          <X className={`w-4 h-4 ${style.text}`} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
