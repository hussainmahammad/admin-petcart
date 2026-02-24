import React, { useRef, useState } from "react";
import RichBar from "./RichBar";
import { PET_TYPES, CATEGORIES, fileOrUrlToPreview } from "./helpers";

export default function AddForm({ onSave, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    discount: "",
    shortDesc: "",
    detailedDesc: "",
    stock: "",
    banner: "",
    images: [],
    petType: "Dogs",
    category: "Food",
  });
  const [previewImg, setPreviewImg] = useState(null);
  const [message, setMessage] = useState(""); // <-- new state for center popup
  const detailedRef = useRef(null);

  const addBannerFromFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setForm((prev) => ({ ...prev, banner: f }));
  };

  const addImagesFromFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  };
  const removeImageAt = (idx) =>
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));

  const handleSave = () => {
    onSave(form); // still call parent
    setMessage("✅ Product added successfully!"); // show overlay
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-2">Add Product</h2>

      {/* Basics */}
      <div className="grid md:grid-cols-2 gap-3">
        <input
          className="w-full px-3 py-2 border rounded-xl"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full px-3 py-2 border rounded-xl"
          placeholder="Brand"
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
        />
        <input
          type="number"
          className="w-full px-3 py-2 border rounded-xl"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          type="number"
          className="w-full px-3 py-2 border rounded-xl"
          placeholder="Discount %"
          value={form.discount}
          onChange={(e) => setForm({ ...form, discount: e.target.value })}
        />
      </div>

      <textarea
        className="w-full px-3 py-2 border rounded-xl mt-3"
        placeholder="Short Description"
        value={form.shortDesc}
        onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
      />

      <div className="mt-3 space-y-2">
        <RichBar textareaRef={detailedRef} />
        <textarea
          ref={detailedRef}
          className="w-full px-3 py-2 border rounded-xl"
          placeholder="Detailed Description (supports **bold**)"
          value={form.detailedDesc}
          onChange={(e) => setForm({ ...form, detailedDesc: e.target.value })}
          rows={6}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-3 mt-3">
        <input
          type="number"
          className="w-full px-3 py-2 border rounded-xl"
          placeholder="Stock Left"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />
        <select
          className="w-full px-3 py-2 border rounded-xl"
          value={form.petType}
          onChange={(e) => setForm({ ...form, petType: e.target.value })}
        >
          {PET_TYPES.map((pt) => (
            <option key={pt}>{pt}</option>
          ))}
        </select>
        <select
          className="w-full px-3 py-2 border rounded-xl"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Banner */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <b>Banner Image (1 only)</b>
          {!form.banner && (
            <label className="px-3 py-1 bg-orange-500 text-white rounded cursor-pointer">
              + Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={addBannerFromFile}
              />
            </label>
          )}
        </div>
        {form.banner && (
          <div className="relative mt-2">
            <img
              src={fileOrUrlToPreview(form.banner)}
              alt=""
              onClick={() => setPreviewImg(fileOrUrlToPreview(form.banner))}
              className="w-full h-40 object-cover rounded cursor-pointer"
            />
            <button
              onClick={() => setForm({ ...form, banner: "" })}
              className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded"
            >
              X
            </button>
          </div>
        )}
      </div>

      {/* Additional Images */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <b>Additional Images</b>
          <label className="px-3 py-1 bg-orange-500 text-white rounded cursor-pointer">
            + Upload
            <input
              type="file"
              accept="image/*"
              className="hidden"
              multiple
              onChange={addImagesFromFiles}
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {form.images.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={fileOrUrlToPreview(img)}
                className="w-20 h-20 object-cover rounded cursor-pointer"
                alt=""
                onClick={() => setPreviewImg(fileOrUrlToPreview(img))}
              />
              <button
                onClick={() => removeImageAt(i)}
                className="absolute top-1 right-1 bg-red-500 text-white px-1 rounded"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Full Image Popup */}
      {previewImg && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-[70]">
          <div className="relative">
            <img
              src={previewImg}
              alt="Preview"
              className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
            />
            <button
              onClick={() => setPreviewImg(null)}
              className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full px-2 py-1 shadow"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Centered Success Overlay */}
      {message && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[80]">
          <div className="bg-white px-6 py-4 rounded-xl shadow-lg text-center">
            <p className="text-lg font-medium">{message}</p>
            <button
              className="mt-3 px-4 py-2 bg-orange-500 text-white rounded-lg"
              onClick={() => setMessage("")}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-5">
        <button onClick={onCancel} className="px-4 py-2 rounded-xl bg-gray-200">
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-orange-500 text-white"
        >
          Add Product
        </button>
      </div>
    </>
  );
}
