import React, { useState } from "react";

// Mock orders
const MOCK_ORDERS = [
  {
    id: "O1001",
    customer: "John Doe",
    email: "john@example.com",
    products: ["Dog Food Premium"],
    amount: 500,
    status: "Pending",
    shipping: { partner: "", trackingId: "", url: "" },
    updated: "2 hours ago",
    notes: ["Order received"],
  },
  {
    id: "O1002",
    customer: "Alice Smith",
    email: "alice@example.com",
    products: ["Cat Toy Mouse"],
    amount: 100,
    status: "Shipped",
    shipping: { partner: "BlueDart", trackingId: "BD123", url: "https://bluedart.com/track/BD123" },
    updated: "1 day ago",
    notes: ["Packed", "Handed to courier"],
  },
  {
    id: "O1003",
    customer: "allen john",
    email: "allen@example.com",
    products: ["dog Toy Mouse"],
    amount: 2050,
    status: "Delivered",
    shipping: { partner: "BlueDart", trackingId: "BD123", url: "https://bluedart.com/track/BD123" },
    updated: "1 day ago",
    notes: ["Packed", "Handed to courier"],
  },
  {
    id: "O1004",
    customer: "Shafi Mahammad",
    email: "shafi@example.com",
    products: ["Cat Toy Mouse"],
    amount: 400,
    status: "Cancelled",
    shipping: { partner: "BlueDart", trackingId: "BD123", url: "https://bluedart.com/track/BD123" },
    updated: "1 day ago",
    notes: ["Packed", "Handed to courier"],
  },
  {
    id: "O1005",
    customer: "Hussain Smith",
    email: "hussain@example.com",
    products: ["fish Toy Mouse"],
    amount: 300,
    status: "Returned",
    shipping: { partner: "BlueDart", trackingId: "BD123", url: "https://bluedart.com/track/BD123" },
    updated: "1 day ago",
    notes: ["Packed", "Handed to courier"],
  },
];

const statusColors = {
  Pending: "bg-yellow-200 text-yellow-700",
  Processing: "bg-blue-200 text-blue-700",
  Shipped: "bg-purple-200 text-purple-700",
  Delivered: "bg-green-200 text-green-700",
  Cancelled: "bg-red-200 text-red-700",
  Returned: "bg-gray-300 text-gray-700",
};

function OrdersSection() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [newShipping, setNewShipping] = useState({});
  const [newNote, setNewNote] = useState("");

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "All" && o.status !== statusFilter) return false;
    if (
      query &&
      !o.id.toLowerCase().includes(query.toLowerCase()) &&
      !o.email.toLowerCase().includes(query.toLowerCase())
    )
      return false;
    return true;
  });

  const updateOrder = () => {
    if (!selected) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selected.id
          ? {
              ...o,
              status: newStatus || o.status,
              shipping: { ...o.shipping, ...newShipping },
              notes: newNote ? [...o.notes, newNote] : o.notes,
              updated: "Just now",
            }
          : o
      )
    );
    setSelected(null);
    setNewStatus("");
    setNewShipping({});
    setNewNote("");
  };

  return (
    <div className="p-4 space-y-4">
      {/* Top Bar */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Search by Order ID or Customer Email"
          className="flex-1 px-3 py-2 rounded-xl border"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border"
        >
          <option>All</option>
          <option>Pending</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>
          <option>Returned</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-y-auto max-h-[65vh]">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Order ID</th>
              <th className="p-2 text-left">Customer</th>
              <th className="p-2 text-left">Products</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Shipping</th>
              <th className="p-2 text-left">Last Updated</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-2">{o.id}</td>
                <td className="p-2">{o.customer}</td>
                <td className="p-2">{o.products.join(", ")}</td>
                <td className="p-2">₹{o.amount}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 text-xs rounded ${statusColors[o.status]}`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="p-2 text-xs">
                  {o.shipping.partner && (
                    <div>
                      <div>{o.shipping.partner}</div>
                      <div>{o.shipping.trackingId}</div>
                      <a
                        href={o.shipping.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        Track
                      </a>
                    </div>
                  )}
                </td>
                <td className="p-2">{o.updated}</td>
                <td className="p-2">
                  <button
                    onClick={() => {
                      setSelected(o);
                      setNewStatus(o.status);
                      setNewShipping(o.shipping);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs"
                  >
                    View / Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Popup */}
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg space-y-4">
            <h2 className="text-lg font-semibold">Order {selected.id}</h2>
            <p><b>Customer:</b> {selected.customer} ({selected.email})</p>
            <p><b>Products:</b> {selected.products.join(", ")}</p>
            <p><b>Amount:</b> ₹{selected.amount}</p>

            {/* Status */}
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl"
            >
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
              <option>Returned</option>
            </select>

            {/* Shipping */}
            <div>
              <h3 className="font-semibold mt-2">Shipping Partner Details</h3>
              <input
                type="text"
                placeholder="Partner Name"
                className="w-full px-3 py-2 border rounded-xl mt-1"
                value={newShipping.partner || ""}
                onChange={(e) =>
                  setNewShipping({ ...newShipping, partner: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Tracking ID"
                className="w-full px-3 py-2 border rounded-xl mt-1"
                value={newShipping.trackingId || ""}
                onChange={(e) =>
                  setNewShipping({ ...newShipping, trackingId: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Tracking URL"
                className="w-full px-3 py-2 border rounded-xl mt-1"
                value={newShipping.url || ""}
                onChange={(e) =>
                  setNewShipping({ ...newShipping, url: e.target.value })
                }
              />
            </div>

            {/* Notes */}
            <div>
              <h3 className="font-semibold mt-2">Notes / Comments</h3>
              <ul className="list-disc list-inside text-sm">
                {selected.notes.map((n, idx) => (
                  <li key={idx}>{n}</li>
                ))}
              </ul>
              <textarea
                placeholder="Add a note"
                className="w-full mt-2 px-3 py-2 border rounded-xl"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={updateOrder}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersSection;
