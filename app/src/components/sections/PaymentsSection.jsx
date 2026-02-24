import React, { useState } from "react";

// Mock transactions
const MOCK_TRANSACTIONS = [
  {
    id: "T1001",
    orderId: "O1001",
    email: "john@example.com",
    amount: 500,
    method: "Razorpay",
    status: "Success",
    orderStatus: "Delivered",
    date: "2025-08-20",
  },
  {
    id: "T1002",
    orderId: "O1002",
    email: "alice@example.com",
    amount: 200,
    method: "UPI",
    status: "Refund Requested",
    orderStatus: "Returned",
    date: "2025-08-21",
  },
  {
    id: "T1003",
    orderId: "O1003",
    email: "bob@example.com",
    amount: 800,
    method: "Card",
    status: "Failed",
    orderStatus: "Pending",
    date: "2025-08-23",
  },
];

const statusColors = {
  Success: "bg-green-200 text-green-700",
  Failed: "bg-red-200 text-red-700",
  "Refund Requested": "bg-yellow-200 text-yellow-700",
  "Refund Completed": "bg-green-300 text-green-900",
};

function PaymentsSection() {
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");

  const filtered = transactions.filter((t) => {
    if (
      query &&
      !t.id.toLowerCase().includes(query.toLowerCase()) &&
      !t.orderId.toLowerCase().includes(query.toLowerCase()) &&
      !t.email.toLowerCase().includes(query.toLowerCase())
    )
      return false;
    if (filter !== "All" && t.status !== filter) return false;
    return true;
  });

  const processRefund = () => {
    if (!selected) return;
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === selected.id
          ? { ...t, status: "Refund Completed" }
          : t
      )
    );
    setSelected(null);
    setRefundAmount("");
    setRefundReason("");
  };

  return (
    <div className="p-4 space-y-4">
      {/* Top Filters */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Search by Txn ID / Order ID / Email"
          className="flex-1 px-3 py-2 border rounded-xl"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border rounded-xl"
        >
          <option>All</option>
          <option>Success</option>
          <option>Failed</option>
          <option>Refund Requested</option>
          <option>Refund Completed</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="overflow-y-auto max-h-[65vh]">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Txn ID</th>
              <th className="p-2 text-left">Order ID</th>
              <th className="p-2 text-left">Customer Email</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Method</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="p-2">{t.id}</td>
                <td className="p-2">{t.orderId}</td>
                <td className="p-2">{t.email}</td>
                <td className="p-2">₹{t.amount}</td>
                <td className="p-2">{t.method}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 text-xs rounded ${statusColors[t.status]}`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="p-2">{t.date}</td>
                <td className="p-2">
                  {t.status === "Refund Requested" && (
                    <button
                      onClick={() => {
                        setSelected(t);
                        setRefundAmount(t.amount);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs"
                    >
                      Refund
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Refund Modal */}
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg space-y-4">
            <h2 className="text-lg font-semibold">Refund Transaction {selected.id}</h2>
            <p><b>Order ID:</b> {selected.orderId}</p>
            <p><b>Customer:</b> {selected.email}</p>
            <p><b>Amount:</b> ₹{selected.amount}</p>

            <input
              type="number"
              placeholder="Refund Amount"
              className="w-full px-3 py-2 border rounded-xl"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
            />
            <textarea
              placeholder="Reason"
              className="w-full px-3 py-2 border rounded-xl"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={processRefund}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentsSection;
