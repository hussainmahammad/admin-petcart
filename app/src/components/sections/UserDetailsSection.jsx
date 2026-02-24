import React, { useState, useRef } from "react";

// Mock user data
const MOCK_USERS = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "9876543210",
    tickets: [
      { id: "T001", subject: "Login issue", status: "Open", date: "2025-08-20" },
      { id: "T002", subject: "Order delayed", status: "Solved Confirmed", date: "2025-08-21" },
    ],
    orders: [
      { id: "O1001", product: "Dog Food Premium", status: "Delivered", date: "2025-08-15" },
      { id: "O1002", product: "Cat Toy", status: "Shipped", date: "2025-08-18" },
    ],
  },
  {
    id: 2,
    firstName: "Akhil",
    lastName: "Rao",
    email: "akhil@example.com",
    phone: "9876501122",
    tickets: [
      { id: "T003", subject: "Payment failed", status: "In Progress", date: "2025-08-22" },
    ],
    orders: [
      { id: "O1003", product: "Dog Leash", status: "Processing", date: "2025-08-19" },
    ],
  },
  {
    id: 3,
    firstName: "Imam",
    lastName: "Ali",
    email: "imam@example.com",
    phone: "9812345678",
    tickets: [
      { id: "T004", subject: "Refund not processed", status: "Awaiting Customer", date: "2025-08-20" },
    ],
    orders: [],
  },
  {
    id: 4,
    firstName: "Shafi",
    lastName: "Khan",
    email: "shafi@example.com",
    phone: "9765432100",
    tickets: [],
    orders: [
      { id: "O1004", product: "Cat Scratcher", status: "Delivered", date: "2025-08-16" },
    ],
  },
  {
    id: 5,
    firstName: "Hussain",
    lastName: "Syed",
    email: "hussain@example.com",
    phone: "9123456789",
    tickets: [
      { id: "T005", subject: "App crashing", status: "Solved Confirmed", date: "2025-08-21" },
    ],
    orders: [
      { id: "O1005", product: "Dog Collar", status: "Delivered", date: "2025-08-17" },
      { id: "O1006", product: "Bird Cage", status: "Shipped", date: "2025-08-20" },
    ],
  },
];

function UserDetailsSection() {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef(null); // input reference

  const suggestions = MOCK_USERS
    .map((u) => u.email)
    .filter((email) => email.toLowerCase().includes(query.toLowerCase()) && query)
    .slice(0, 5);

  const searchUser = () => {
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === query.toLowerCase()
    );
    if (found) {
      setUser(found);
      setError("");
    } else {
      setUser(null);
      setError("No user found with given details.");
    }
  };

  return (
    <div className="p-4 space-y-4 relative">
      {/* Search Bar with Suggestions */}
      <div className="relative">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter user email"
            className="flex-1 px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchUser();
                setShowSuggestions(false);
              }
            }}
          />
          <button
            onClick={searchUser}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow"
          >
            Search
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border rounded-xl mt-1 w-full shadow-lg max-h-40 overflow-y-auto">
            {suggestions.map((s, idx) => (
              <li
                key={idx}
                onClick={() => {
                  setQuery(s);
                  setShowSuggestions(false);
                  inputRef.current?.focus(); // bring cursor back
                }}
                className="px-3 py-2 hover:bg-orange-100 cursor-pointer text-sm"
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Result */}
      {error && <div className="text-red-600 text-sm">{error}</div>}

      {user && (
        <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2">
          {/* Profile */}
          <div className="p-4 rounded-xl border bg-white shadow">
            <h3 className="font-semibold mb-2">Profile</h3>
            <p>First Name: {user.firstName}</p>
            <p>Last Name: {user.lastName}</p>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
          </div>

          {/* Tickets */}
          <div className="p-4 rounded-xl border bg-white shadow">
            <h3 className="font-semibold mb-2">Tickets</h3>
            {user.tickets.length === 0 ? (
              <p>No tickets found.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-2">Ticket ID</th>
                    <th className="p-2">Subject</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {user.tickets.map((t) => (
                    <tr key={t.id} className="border-b last:border-0">
                      <td className="p-2">{t.id}</td>
                      <td className="p-2">{t.subject}</td>
                      <td className="p-2">{t.status}</td>
                      <td className="p-2">{t.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Orders */}
          <div className="p-4 rounded-xl border bg-white shadow">
            <h3 className="font-semibold mb-2">Orders</h3>
            {user.orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-2">Order ID</th>
                    <th className="p-2">Product</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {user.orders.map((o) => (
                    <tr key={o.id} className="border-b last:border-0">
                      <td className="p-2">{o.id}</td>
                      <td className="p-2">{o.product}</td>
                      <td className="p-2">{o.status}</td>
                      <td className="p-2">{o.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDetailsSection;
