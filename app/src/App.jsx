import React, { useState } from "react";
import Topbar from "./components/layout/Topbar";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import LoginModal from "./components/layout/LoginModal";

import NotificationsSection from "./components/sections/NotificationsSection";
import UserDetailsSection from "./components/sections/UserDetailsSection";
import TicketsSection from "./components/sections/TicketsSection";
import ProductsSection from "./components/sections/products/ProductsSection";
import OrdersSection from "./components/sections/OrdersSection";
import PaymentsSection from "./components/sections/PaymentsSection";
import ReportsSection from "./components/sections/ReportsSection";
import AdminsSection from "./components/sections/AdminsSection";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [active, setActive] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const centerText = loggedIn
    ? "Select the menu items to administrate the PetCart.shop"
    : "Login to administrate the PetCart.shop";

  return (
    <div className="flex flex-col h-screen">
      {/* Topbar */}
      <Topbar
        loggedIn={loggedIn}
        userEmail={userEmail}
        onLoginClick={() => setShowLogin(true)}
        onLogout={() => {
          setLoggedIn(false);
          setUserEmail("");
          setActive("");
        }}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar active={active} setActive={setActive} />

        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto bg-gray-50">
          {loggedIn ? (
            active === "Notifications / Alerts" ? (
              <NotificationsSection />
            ) : active === "User Details" ? (
              <UserDetailsSection />
            ) : active === "Tickets" ? (
              <TicketsSection />
            ) : active === "Products & Stock" ? (
              <ProductsSection />
            ) : active === "Order Management" ? (
              <OrdersSection />
            ) : active === "Payments & Refunds" ? (
              <PaymentsSection />
            ) : active === "Reports & Analytics" ? (
              <ReportsSection />
            ) : active === "Admins Data" ? (
              <AdminsSection />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-gray-600 text-lg text-center px-4">
                  {centerText}
                </div>
              </div>
            )
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-600 text-lg text-center px-4">
                {centerText}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={(email) => {
            setLoggedIn(true);
            setUserEmail(email);
            setShowLogin(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
