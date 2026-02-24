import React, { useMemo, useState, useRef } from "react";
import { fileOrUrlToPreview } from "./helpers";

export default function RemoveForm({ products, onRemove, onCancel }) {
  const [pid, setPid] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const prod = products.find(
    (p) =>
      p.id.toLowerCase() === pid.trim().toLowerCase() ||
      p.name.toLowerCase() === pid.trim().toLowerCase()
  );

  const suggestions = useMemo(() => {
    const q = pid.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map((p) => ({ id: p.id, name: p.name }));
  }, [pid, products]);

  return (
    <>
      <h2 className="text-lg font-semibold">Remove Product</h2>
      <div className="relative">
        <input
          ref={inputRef}
          className="w-full px-3 py-2 border rounded-xl mb-2"
          placeholder="Enter Product ID or Name"
          value={pid}
          onChange={(e) => {
            setPid(e.target.value);
            setShowSuggestions(true);
          }}
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border rounded-xl mt-[-0.5rem] w-full shadow-lg max-h-40 overflow-y-auto">
            {suggestions.map((s) => (
              <li
                key={s.id}
                onMouseDown={() => {
                  setPid(s.id); // put ID in input
                  setShowSuggestions(false); // hide dropdown
                  setTimeout(() => inputRef.current?.focus(), 0); // refocus input
                }}
                className="px-3 py-2 hover:bg-orange-100 cursor-pointer text-sm"
              >
                {s.id} — {s.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {prod ? (
        <div className="space-y-3">
          <div className="p-3 border rounded-xl bg-gray-50">
            <div className="font-semibold">{prod.name}</div>
            <div className="text-sm text-gray-600">ID: {prod.id}</div>
            <img
              src={fileOrUrlToPreview(prod.banner)}
              alt=""
              className="w-full h-36 object-cover rounded mt-2"
            />
          </div>

          <div className="p-3 border rounded-xl">
            <p className="font-medium mb-2">
              Are you sure you want to delete this product?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onRemove(prod.id)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Yes, Remove
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500">
          Search by Product ID or Name to proceed.
        </div>
      )}
    </>
  );
}
