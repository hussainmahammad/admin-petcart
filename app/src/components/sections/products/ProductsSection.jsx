import React, { useMemo, useRef, useState } from "react";
import {
  MOCK_PRODUCTS,
  PET_TYPES,
  CATEGORIES,
  getNextProductId,
  fileOrUrlToPreview,
} from "./helpers";
import Toast from "./Toast";
import CenteredModal from "./CenteredModal";
import AddForm from "./AddForm";
import EditForm from "./EditForm";
import RemoveForm from "./RemoveForm";

export default function ProductsSection() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [mode, setMode] = useState(null); // add | edit | remove
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState(""); // raw search input
  const [petType, setPetType] = useState("all");
  const [category, setCategory] = useState("all");
  const [visible, setVisible] = useState(10);
  const [toast, setToast] = useState("");
  const [previewImg, setPreviewImg] = useState(null); // for full image popup

  // compute results only after pressing enter/search
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const q = query.trim().toLowerCase();
      if (q && p.id.toLowerCase() !== q && !p.name.toLowerCase().includes(q))
        return false;
      if (petType !== "all" && p.petType !== petType) return false;
      if (category !== "all" && p.category !== category) return false;
      return true;
    });
  }, [products, query, petType, category]);

  /** Suggestions list */
  const suggestions = useMemo(() => {
    const q = searchInput.trim().toLowerCase();
    if (!q || q === query.toLowerCase()) return []; // hide once selected
    return products
      .filter(
        (p) =>
          p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map((p) => ({ id: p.id, name: p.name }));
  }, [searchInput, query, products]);

  /** Handlers */
  const handleAdd = (prod) => {
    const newId = getNextProductId(products);
    setProducts([
      ...products,
      {
        ...prod,
        id: newId,
        addedDate: new Date().toISOString().slice(0, 10),
        banner:
          typeof prod.banner === "string"
            ? prod.banner
            : fileOrUrlToPreview(prod.banner),
        images: (prod.images || []).map((im) =>
          typeof im === "string" ? im : fileOrUrlToPreview(im)
        ),
      },
    ]);
    setMode(null);
    setToast(`Product added successfully with Product ID: ${newId}`);
  };

  const handleUpdate = (prod) => {
    const normalized = {
      ...prod,
      banner:
        typeof prod.banner === "string"
          ? prod.banner
          : fileOrUrlToPreview(prod.banner),
      images: (prod.images || []).map((im) =>
        typeof im === "string" ? im : fileOrUrlToPreview(im)
      ),
    };
    setProducts(products.map((p) => (p.id === normalized.id ? normalized : p)));
    setMode(null);
    setToast("Changes saved successfully");
  };

  const handleRemove = (id) => {
    setProducts(products.filter((p) => p.id !== id));
    setMode(null);
    setToast(`Product ${id} removed successfully`);
  };

  const handleSearch = () => {
    setQuery(searchInput.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Toast text={toast} onClose={() => setToast("")} />

      {/* Top Menu */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setMode("add")}
          className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white"
        >
          Add Product
        </button>
        <button
          onClick={() => setMode("edit")}
          className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white"
        >
          Edit Product
        </button>
        <button
          onClick={() => setMode("remove")}
          className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white"
        >
          Remove Product
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-2 relative">
        <div className="flex gap-2 items-stretch">
          <input
            type="text"
            placeholder="Search by Product Name or ID"
            className="flex-1 px-3 py-2 rounded-xl border"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 rounded-xl bg-orange-500 text-white"
          >
            Search
          </button>
        </div>

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute top-12 left-0 w-full bg-white border rounded-xl shadow-lg z-20 max-h-40 overflow-y-auto">
            {suggestions.map((s) => (
              <li
                key={s.id}
                onMouseDown={(e) => {
                  e.preventDefault(); // prevent input blur
                  setSearchInput(s.id); // only fill input
                }}
                className="px-3 py-2 hover:bg-orange-100 cursor-pointer text-sm"
              >
                {s.id} — {s.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-4 flex-wrap">
        <select
          value={petType}
          onChange={(e) => setPetType(e.target.value)}
          className="px-3 py-2 border rounded-xl"
        >
          <option value="all">All Pets</option>
          {PET_TYPES.map((pt) => (
            <option key={pt} value={pt}>
              {pt}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 border rounded-xl"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[60vh]">
        {filtered.slice(0, visible).map((p) => (
          <div
            key={p.id}
            onClick={() => setSelected(p)}
            className="cursor-pointer p-4 rounded-xl border bg-white shadow hover:bg-gray-50"
          >
            <img
              src={fileOrUrlToPreview(p.banner)}
              alt={p.name}
              className="w-full h-32 object-cover rounded-lg mb-2"
            />
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-gray-500">ID: {p.id}</div>
            <div className="text-xs text-gray-400">Added: {p.addedDate}</div>
          </div>
        ))}
      </div>
      {visible < filtered.length && (
        <div className="text-center pt-2">
          <button
            onClick={() => setVisible((c) => c + 10)}
            className="text-sm text-orange-600 hover:underline"
          >
            Load More
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold">{selected.name}</h2>

            {/* 🔥 Fixed ID & Added Date styling */}
            <p>
              <b>ID:</b> {selected.id}
            </p>
            <p>
              <b>Added:</b> {selected.addedDate}
            </p>

            <p>
              <b>Brand:</b> {selected.brand}
            </p>
            <p>
              <b>Price:</b> ₹{selected.price} ({selected.discount}% off)
            </p>
            <p>
              <b>Stock Left:</b> {selected.stock}
            </p>
            <p>
              <b>Pet Type:</b> {selected.petType} &nbsp; | &nbsp;{" "}
              <b>Category:</b> {selected.category}
            </p>
            <p>
              <b>Short Desc:</b> {selected.shortDesc}
            </p>
            <div className="text-sm bg-gray-100 p-2 rounded whitespace-pre-wrap">
              <span
                dangerouslySetInnerHTML={{
                  __html: selected.detailedDesc.replace(
                    /\*\*(.*?)\*\*/g,
                    "<b>$1</b>"
                  ),
                }}
              />
            </div>
            <div>
              <b>Banner Image:</b>
              <img
                src={fileOrUrlToPreview(selected.banner)}
                alt=""
                onClick={() => setPreviewImg(fileOrUrlToPreview(selected.banner))}
                className="w-full h-48 object-cover rounded mt-2 cursor-pointer hover:opacity-90"
              />
            </div>
            <div>
              <b>All Images:</b>
              <div className="flex flex-wrap gap-2 mt-2">
                {selected.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={fileOrUrlToPreview(img)}
                    alt=""
                    onClick={() => setPreviewImg(fileOrUrlToPreview(img))}
                    className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-90"
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 rounded-xl bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Image Popup */}
      {previewImg && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-[60]">
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

      {/* Add/Edit/Remove Modals (scrollable popups) */}
      {mode === "add" && (
        <CenteredModal onClose={() => setMode(null)}>
          <AddForm onSave={handleAdd} onCancel={() => setMode(null)} />
        </CenteredModal>
      )}
      {mode === "edit" && (
        <CenteredModal onClose={() => setMode(null)}>
          <EditForm
            products={products}
            onSave={handleUpdate}
            onCancel={() => setMode(null)}
          />
        </CenteredModal>
      )}
      {mode === "remove" && (
        <CenteredModal onClose={() => setMode(null)}>
          <RemoveForm
            products={products}
            onRemove={handleRemove}
            onCancel={() => setMode(null)}
          />
        </CenteredModal>
      )}
    </div>
  );
}
