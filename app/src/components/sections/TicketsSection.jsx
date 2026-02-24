import React, { useState, useRef } from "react";

// Mock tickets data (15 entries)
const MOCK_TICKETS = [
  {
    id: "T001",
    user: "john@example.com",
    phone: "9876543210",
    description: "Issue logging in",
    details: "User unable to login with correct credentials",
    status: "Open",
    created: "1 hour ago",
    latestComment: "Still facing issue",
    comments: ["User reported issue", "Support asked for more info"],
  },
  {
    id: "T002",
    user: "alice@example.com",
    phone: "9123456780",
    description: "Order delayed",
    details: "Order not delivered after 7 days",
    status: "In Progress",
    created: "2 hours ago",
    latestComment: "Investigating delay",
    comments: ["User reported delay", "Support checking order status"],
  },
  {
    id: "T003",
    user: "bob@example.com",
    phone: "9988776655",
    description: "Refund not processed",
    details: "Refund requested but not received",
    status: "Awaiting Customer",
    created: "3 hours ago",
    latestComment: "Waiting for user reply",
    comments: ["Support requested screenshots"],
  },
  {
    id: "T004",
    user: "jane@example.com",
    phone: "9001122334",
    description: "Payment failed",
    details: "Payment failed twice with Razorpay",
    status: "Solved Proposed",
    created: "5 hours ago",
    latestComment: "Proposed solution sent",
    comments: ["Payment failed", "Support proposed fix"],
  },
  {
    id: "T005",
    user: "mark@example.com",
    phone: "9112233445",
    description: "App crashing on iOS",
    details: "App closes unexpectedly when opening orders page",
    status: "Solved Confirmed",
    created: "1 day ago",
    latestComment: "Fixed and confirmed",
    comments: ["Bug reported", "Patch applied", "Confirmed resolved"],
  },
  {
    id: "T006",
    user: "sam@example.com",
    phone: "9011223344",
    description: "Address update not saving",
    details: "User cannot update address in profile",
    status: "Open",
    created: "3 hours ago",
    latestComment: "Investigating",
    comments: ["Reported by user"],
  },
  {
    id: "T007",
    user: "peter@example.com",
    phone: "9900112233",
    description: "Order stuck in processing",
    details: "Order O1003 not moving past processing",
    status: "In Progress",
    created: "6 hours ago",
    latestComment: "Backend investigating",
    comments: ["Reported delay"],
  },
  {
    id: "T008",
    user: "nancy@example.com",
    phone: "9099887766",
    description: "Invoice not received",
    details: "Invoice not generated for last purchase",
    status: "Awaiting Customer",
    created: "8 hours ago",
    latestComment: "Asked user to check spam",
    comments: ["Support replied, awaiting response"],
  },
  {
    id: "T009",
    user: "chris@example.com",
    phone: "9876501234",
    description: "Unable to reset password",
    details: "Password reset link not working",
    status: "Solved Proposed",
    created: "10 hours ago",
    latestComment: "Suggested workaround sent",
    comments: ["Reported issue", "Shared workaround"],
  },
  {
    id: "T010",
    user: "ravi@example.com",
    phone: "9123001122",
    description: "Refund amount mismatch",
    details: "Partial refund received instead of full",
    status: "Solved Confirmed",
    created: "12 hours ago",
    latestComment: "Confirmed correct refund processed",
    comments: ["Refund requested", "Refund verified"],
  },
  {
    id: "T011",
    user: "leo@example.com",
    phone: "9321004433",
    description: "Order cancellation not working",
    details: "Cancel button disabled for recent order",
    status: "Open",
    created: "15 hours ago",
    latestComment: "Developer checking issue",
    comments: ["Cancellation issue reported"],
  },
  {
    id: "T012",
    user: "diana@example.com",
    phone: "9888776655",
    description: "Shipping address missing",
    details: "Order placed without address attached",
    status: "In Progress",
    created: "18 hours ago",
    latestComment: "Fix in progress",
    comments: ["Support escalated"],
  },
  {
    id: "T013",
    user: "steve@example.com",
    phone: "9888001122",
    description: "Coupon not applying",
    details: "Discount coupon not being applied",
    status: "Awaiting Customer",
    created: "20 hours ago",
    latestComment: "Asked for coupon screenshot",
    comments: ["Waiting for customer"],
  },
  {
    id: "T014",
    user: "emma@example.com",
    phone: "9556677889",
    description: "Wrong product delivered",
    details: "Received Cat Food instead of Dog Food",
    status: "Solved Proposed",
    created: "22 hours ago",
    latestComment: "Proposed replacement",
    comments: ["User complained", "Replacement proposed"],
  },
  {
    id: "T015",
    user: "lucas@example.com",
    phone: "9445566778",
    description: "App showing blank screen",
    details: "Blank screen on startup for Android v10",
    status: "Solved Confirmed",
    created: "1 day ago",
    latestComment: "Bug fixed and confirmed",
    comments: ["Bug reported", "Patch deployed"],
  },
];

// Color mapping
const statusColors = {
  Open: "bg-red-200 text-red-700",
  "In Progress": "bg-yellow-200 text-yellow-700",
  "Awaiting Customer": "bg-orange-200 text-orange-700",
  "Solved Proposed": "bg-blue-200 text-blue-700",
  "Solved Confirmed": "bg-green-200 text-green-700",
};

function TicketsSection() {
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef(null);

  // filter by status + applied search query
  const filteredTickets = tickets.filter((t) => {
    if (filter !== "all" && t.status !== filter) return false;
    if (
      appliedQuery &&
      !t.user.toLowerCase().includes(appliedQuery.toLowerCase()) &&
      !t.id.toLowerCase().includes(appliedQuery.toLowerCase()) &&
      !t.phone.toLowerCase().includes(appliedQuery.toLowerCase())
    )
      return false;
    return true;
  });

  // suggestions (IDs + Emails + Phones, based on live typing)
  const suggestions = tickets
    .map((t) => [t.id, t.user, t.phone])
    .flat()
    .filter(
      (item) =>
        searchQuery && item.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 5);

  const updateTicket = () => {
    if (!selected) return;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selected.id
          ? {
              ...t,
              status: newStatus || t.status,
              latestComment: newComment || t.latestComment,
              comments: newComment ? [...t.comments, newComment] : t.comments,
            }
          : t
      )
    );
    setSelected(null);
    setNewComment("");
    setNewStatus("");
  };

  return (
    <div className="p-4 space-y-4 relative">
      {/* Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          "Open",
          "In Progress",
          "Awaiting Customer",
          "Solved Proposed",
          "Solved Confirmed",
        ].map((status) => (
          <div
            key={status}
            onClick={() => {
              setFilter(status);
              setAppliedQuery("");
              setSearchQuery("");
            }}
            className={`cursor-pointer p-4 rounded-xl shadow ${statusColors[status]}`}
          >
            <div className="font-semibold">{status}</div>
            <div className="text-2xl font-bold">
              {tickets.filter((t) => t.status === status).length}
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar with suggestions */}
      <div className="relative">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by email, phone or ticket ID"
            className="flex-1 px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setAppliedQuery(searchQuery);
                setFilter("all");
                setShowSuggestions(false);
              }
            }}
          />
          <button
            onClick={() => {
              setAppliedQuery(searchQuery);
              setFilter("all");
              setShowSuggestions(false);
            }}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow"
          >
            Search
          </button>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border rounded-xl mt-1 w-full shadow-lg max-h-40 overflow-y-auto">
            {suggestions.map((s, idx) => (
              <li
                key={idx}
                onClick={() => {
                  setSearchQuery(s);
                  setShowSuggestions(false);
                  inputRef.current?.focus();
                }}
                className="px-3 py-2 hover:bg-orange-100 cursor-pointer text-sm"
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tickets List */}
      <div className="overflow-y-auto max-h-[60vh] space-y-3">
        {filteredTickets.map((t) => (
          <div
            key={t.id}
            className="p-4 rounded-xl border bg-white shadow space-y-1"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{t.id}</div>
                <div
                  className={`inline-block mt-1 px-2 py-0.5 text-xs rounded ${statusColors[t.status]}`}
                >
                  {t.status}
                </div>
              </div>
              {t.status === "Solved Confirmed" ? (
                <button
                  onClick={() => setSelected(t)}
                  className="px-3 py-1.5 rounded-xl bg-gray-500 hover:bg-gray-600 text-white text-sm"
                >
                  View
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelected(t);
                    setNewStatus(t.status);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm"
                >
                  Work
                </button>
              )}
            </div>

            {/* Highlighted details */}
            <div className="text-sm">
              <p>
                <span className="font-semibold">Short Description: </span>
                {t.description}
              </p>
              <p>
                <span className="font-semibold">Detailed Description: </span>
                {t.details}
              </p>
              <p>
                <span className="font-semibold">Email: </span>
                {t.user}
              </p>
              <p>
                <span className="font-semibold">Phone: </span>
                {t.phone}
              </p>
              <p className="text-xs text-gray-500">Created: {t.created}</p>
              <p className="text-xs text-gray-700">
                Latest Comment: {t.latestComment}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Work / View Modal */}
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg space-y-4">
            <h2 className="text-lg font-semibold">Ticket {selected.id}</h2>
            <p>
              <span className="font-semibold">Short Description: </span>
              {selected.description}
            </p>
            <p>
              <span className="font-semibold">Detailed Description: </span>
              {selected.details}
            </p>
            <p>
              <span className="font-semibold">Email: </span>
              {selected.user}
            </p>
            <p>
              <span className="font-semibold">Phone: </span>
              {selected.phone}
            </p>
            <p className="text-sm">Created: {selected.created}</p>

            {selected.status !== "Solved Confirmed" ? (
              <>
                {/* Status Dropdown */}
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Awaiting Customer</option>
                  <option>Solved Proposed</option>
                  <option>Solved Confirmed</option>
                </select>

                {/* Comments */}
                <div>
                  <h3 className="font-semibold mb-2">Comments</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {selected.comments.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                  <textarea
                    placeholder="Add a comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full mt-2 px-3 py-2 border rounded-xl"
                  />
                </div>
              </>
            ) : (
              <div>
                <h3 className="font-semibold mb-2">Comments</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {selected.comments.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
              >
                Close
              </button>
              {selected.status !== "Solved Confirmed" && (
                <button
                  onClick={updateTicket}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketsSection;
