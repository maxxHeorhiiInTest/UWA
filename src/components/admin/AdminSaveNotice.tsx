"use client";

import { useEffect } from "react";

export function AdminSaveNotice({
  open,
  title,
  message,
  error,
  onClose,
}: {
  open: boolean;
  title?: string;
  message?: string;
  error?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Закрити"
        onClick={onClose}
        className="absolute inset-0 bg-black/75"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-save-title"
        className="relative z-10 w-full max-w-md border border-[#6e6a6b] bg-uwa-black p-6"
      >
        <h2
          id="admin-save-title"
          className="font-heading text-2xl uppercase tracking-wide text-uwa-white"
        >
          {error ? "Помилка" : title ?? "Збережено"}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-uwa-white/70">
          {error ?? message ?? "Зміни збережено і вже мають бути на сайті."}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 bg-uwa-red px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-uwa-white hover:bg-uwa-red-dark"
        >
          Ок
        </button>
      </div>
    </div>
  );
}
