import React from "react";

const menuItems = [
  "Notifications / Alerts",
  "User Details",
  "Tickets",
  "Products & Stock",
  "Order Management",
  "Payments & Refunds",
  "Reports & Analytics",
  "Admins Data",
];

function Sidebar({ active, setActive }) {
  return (
    <aside className="w-64 bg-gray-600 text-white flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-1 py-4">
          {menuItems.map((item) => (
            <li key={item}>
              <button
                onClick={() => setActive(item)}
                className={`w-full text-left px-4 py-2 rounded-xl transition ${
                  active === item
                    ? "bg-gray-700 font-semibold"
                    : "hover:bg-gray-700"
                }`}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
