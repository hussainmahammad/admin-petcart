import React from "react";

export default function CenteredModal({ children, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-semibold">Products</h3>
          <button
            onClick={onClose}
            className="px-2 py-0.5 rounded hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-4 max-h-[85vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
