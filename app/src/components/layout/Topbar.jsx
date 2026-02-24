import React from "react";

function Topbar({ loggedIn, userEmail, onLoginClick, onLogout }) {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-orange-500 text-white shadow">
      <div className="font-bold text-xl">PetCart Admin</div>
      <div>
        {!loggedIn ? (
          <button
            onClick={onLoginClick}
            className="bg-white text-orange-600 px-4 py-2 rounded-xl shadow hover:bg-gray-100 font-bold"
          >
            Login
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <span>{userEmail}</span>
            <button
              onClick={onLogout}
              className="bg-white text-orange-600 px-3 py-1.5 rounded-xl shadow hover:bg-gray-100 font-bold"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Topbar;
