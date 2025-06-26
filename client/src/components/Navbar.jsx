import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 shadow-md">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo with image */}
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="https://cdn-icons-png.flaticon.com/512/5969/5969059.png"
            alt="QuickDeliver Logo"
            className="w-10 h-10 object-contain rounded-full bg-white p-1 shadow"
          />
          <span className="text-2xl font-extrabold text-white tracking-tight drop-shadow">
            QuickDeliver Lite
          </span>
        </Link>

        {/* Hamburger (mobile) */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white md:hidden"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                isMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        {/* Nav Links */}
        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row md:items-center absolute md:static top-full left-0 w-full md:w-auto bg-black md:bg-transparent px-6 md:px-0 py-4 md:py-0 space-y-4 md:space-y-0 md:space-x-6 transition-all duration-300`}
        >
          <NavLink to="/">Home</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          
          {!user ? (
  <>
    <NavLink to="/login">Login</NavLink>
    <NavLink to="/register">Register</NavLink>
  </>
) : (
  <>
    {/* ✅ Show only for customers */}
    {user?.role === "customer" && (
      <NavLink to="/order">Create Order</NavLink>
    )}
              {/* Profile Avatar & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 rounded-full bg-white flex justify-center items-center overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-indigo-700 font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-yellow-100 text-sm font-medium">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-50 animate-fade-in">
                    <DropdownItem to="/profile">My Profile</DropdownItem>
                    <DropdownItem to="/settings">Settings</DropdownItem>
                    <DropdownItem to="/orders">My Orders</DropdownItem>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full font-medium shadow transition ml-0 md:ml-2"
                >
                  Logout
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// Reusable NavLink Component
function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-white font-semibold hover:text-yellow-300 transition"
    >
      {children}
    </Link>
  );
}

// Reusable DropdownItem Component
function DropdownItem({ to, children }) {
  return (
    <Link
      to={to}
      className="block px-4 py-2 text-gray-800 hover:bg-indigo-100 transition"
    >
      {children}
    </Link>
  );
}
