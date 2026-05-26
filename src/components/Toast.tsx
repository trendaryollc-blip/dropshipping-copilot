"use client";

import { useEffect, useState } from "react";

export type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

let addToastFn: ((message: string, variant?: ToastVariant) => void) | null = null;

export function toast(message: string, variant: ToastVariant = "info") {
  addToastFn?.(message, variant);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    addToastFn = (message: string, variant: ToastVariant = "info") => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };
    return () => { addToastFn = null; };
  }, []);

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-lg border px-4 py-3 text-sm shadow-xl animate-in slide-in-from-right ${
              t.variant === "success"
                ? "border-emerald-500/30 bg-emerald-950 text-emerald-300"
                : t.variant === "error"
                  ? "border-red-500/30 bg-red-950 text-red-300"
                  : "border-zinc-600 bg-zinc-900 text-zinc-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">
                {t.variant === "success" ? "✓" : t.variant === "error" ? "✕" : "ℹ"}
              </span>
              <span>{t.message}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}