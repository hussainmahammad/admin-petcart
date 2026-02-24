import React from "react";

export default function RichBar({ textareaRef }) {
  const applyBold = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    const before = ta.value.slice(0, start);
    const sel = ta.value.slice(start, end) || "text";
    const after = ta.value.slice(end);
    const next = `${before}**${sel}**${after}`;
    ta.value = next;
    ta.dispatchEvent(new Event("input", { bubbles: true }));
    const pos = start + 2 + sel.length + 2;
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(pos, pos);
    });
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        type="button"
        onClick={applyBold}
        className="px-2 py-1 rounded border hover:bg-gray-50 font-bold"
        title="Bold"
      >
        B
      </button>
    </div>
  );
}
