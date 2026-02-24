import React, { useState } from "react";

// Mock alerts with extra details
const MOCK_ALERTS = [
  {
    id: 1,
    type: "order",
    text: "Order #12345 placed by John Doe",
    time: "5 mins ago",
    details: {
      orderId: "12345",
      email: "john@example.com",
      date: "2025-08-25",
      productId: "P1001",
      qty: 2,
    },
  },
  {
    id: 2,
    type: "stock",
    text: "Low stock: Dog Food Premium",
    time: "12 mins ago",
    details: {
      productId: "DF-202",
      stockLeft: 8,
      name: "Dog Food Premium",
      brand: "PetCare",
    },
  },
  {
    id: 3,
    type: "ticket",
    text: "New ticket raised by Alice (Login issue)",
    time: "25 mins ago",
    details: {
      ticketId: "T789",
      short: "Login issue",
      desc: "Customer unable to login since password reset.",
      email: "alice@example.com",
      mobile: "9876543210",
    },
  },
  {
    id: 4,
    type: "order",
    text: "Order #12346 placed by Jane Smith",
    time: "40 mins ago",
    details: {
      orderId: "12346",
      email: "jane@example.com",
      date: "2025-08-24",
      productId: "P1002",
      qty: 1,
    },
  },
  {
    id: 5,
    type: "ticket",
    text: "New ticket raised by Bob (Payment failed)",
    time: "1 hr ago",
    details: {
      ticketId: "T790",
      short: "Payment failed",
      desc: "Customer payment failed for order #12348",
      email: "bob@example.com",
      mobile: "9876500000",
    },
  },
  {
    id: 6,
    type: "stock",
    text: "Low stock: Cat Toy Mouse",
    time: "2 hrs ago",
    details: {
      productId: "CT-909",
      stockLeft: 3,
      name: "Cat Toy Mouse",
      brand: "KittyFun",
    },
  },
];

function NotificationsSection() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [filter, setFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(4);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState("");

  const filtered = alerts.filter((a) => {
    if (filter === "all") return true;
    if (filter === "orders") return a.type === "order";
    if (filter === "stock") return a.type === "stock";
    if (filter === "tickets") return a.type === "ticket";
    return true;
  });

  const shown = filtered.slice(0, visibleCount);

  const getBg = (a) => {
    if (a.type === "stock") return "bg-red-100 border-red-300";
    if (a.type === "ticket") return "bg-blue-100 border-blue-300";
    return "bg-white border-gray-200";
  };

  const getIcon = (a) => {
    if (a.type === "stock") return "📦";
    if (a.type === "ticket") return "🎫";
    return "🛒";
  };

  const handleAction = (a) => {
    let message = "";
    if (a.type === "order") {
      message = `Order #${a.details.orderId} marked as shipped`;
    } else if (a.type === "stock") {
      message = `Restock action recorded for ${a.details.name}`;
    } else if (a.type === "ticket") {
      message = `Ticket from ${a.details.email} marked as under investigation`;
    }

    setAlerts((prev) => prev.filter((al) => al.id !== a.id)); // remove alert
    setSelected(null); // close modal
    setToast(message);

    setTimeout(() => setToast(""), 3000); // auto-hide toast
  };

  return (
    <div className="p-4 space-y-4">
      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-4">
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setVisibleCount(4);
          }}
          className="px-3 py-1.5 border rounded-xl text-sm"
        >
          <option value="all">All</option>
          <option value="orders">Orders</option>
          <option value="stock">Low Stock</option>
          <option value="tickets">Tickets</option>
        </select>
      </div>

      {/* Alerts */}
      <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-2">
        {shown.length === 0 ? (
          <div className="text-center text-gray-500 text-sm">
            No alerts found.
          </div>
        ) : (
          shown.map((a) => (
            <div
              key={a.id}
              className={`flex items-center justify-between px-3 py-2 rounded-xl border text-sm ${getBg(
                a
              )}`}
            >
              <div className="flex items-center gap-2">
                <span>{getIcon(a)}</span>
                <span>{a.text}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xs">{a.time}</span>
                <button
                  onClick={() => setSelected(a)}
                  className="text-orange-600 text-xs underline"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {visibleCount < filtered.length && (
        <div className="text-center pt-2">
          <button
            onClick={() => setVisibleCount((c) => c + 4)}
            className="text-sm text-orange-600 hover:underline"
          >
            Load More
          </button>
        </div>
      )}

      {/* Details Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-lg w-[400px]">
            <h3 className="font-semibold text-lg mb-4">Details</h3>
            {selected.type === "order" && (
              <div className="space-y-2 text-sm">
                <p>
                  <b>Order ID:</b> {selected.details.orderId}
                </p>
                <p>
                  <b>Email:</b> {selected.details.email}
                </p>
                <p>
                  <b>Date:</b> {selected.details.date}
                </p>
                <p>
                  <b>Product ID:</b> {selected.details.productId}
                </p>
                <p>
                  <b>Quantity:</b> {selected.details.qty}
                </p>
              </div>
            )}
            {selected.type === "stock" && (
              <div className="space-y-2 text-sm">
                <p>
                  <b>Product ID:</b> {selected.details.productId}
                </p>
                <p>
                  <b>Product Name:</b> {selected.details.name}
                </p>
                <p>
                  <b>Brand:</b> {selected.details.brand}
                </p>
                <p>
                  <b>Stock Left:</b> {selected.details.stockLeft}
                </p>
              </div>
            )}
            {selected.type === "ticket" && (
              <div className="space-y-2 text-sm">
                <p>
                  <b>Ticket ID:</b> {selected.details.ticketId}
                </p>
                <p>
                  <b>Short Issue:</b> {selected.details.short}
                </p>
                <p>
                  <b>Description:</b> {selected.details.desc}
                </p>
                <p>
                  <b>Email:</b> {selected.details.email}
                </p>
                <p>
                  <b>Mobile:</b> {selected.details.mobile}
                </p>
              </div>
            )}
            <div className="mt-6 flex justify-between">
              {/* Action Button */}
              {selected.type === "order" && (
                <button
                  onClick={() => handleAction(selected)}
                  className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 text-sm"
                >
                  Mark as Shipped
                </button>
              )}
              {selected.type === "stock" && (
                <button
                  onClick={() => handleAction(selected)}
                  className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 text-sm"
                >
                  Restock Action Taken
                </button>
              )}
              {selected.type === "ticket" && (
                <button
                  onClick={() => handleAction(selected)}
                  className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 text-sm"
                >
                  Investigation Started
                </button>
              )}
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-4 py-2 rounded-lg shadow z-[100]">
          {toast}
        </div>
      )}
    </div>
  );
}

export default NotificationsSection;
