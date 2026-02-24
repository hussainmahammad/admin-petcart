import React from "react";

export default function Toast({ text, onClose }) {
  if (!text) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100]">
      <div className="bg-black/80 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
        <span>{text}</span>
        <button
          onClick={onClose}
          className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
