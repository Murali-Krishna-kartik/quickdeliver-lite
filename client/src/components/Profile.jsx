import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile({ user, onLogout }) {
  const navigate = useNavigate();
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      // Fetch order count
      axios
        .get("http://localhost:5000/api/auth/profile", { withCredentials: true })
        .then((res) => {
          setOrderCount(res.data.deliveryCount || 0);
        })
        .catch((err) => {
          console.error("Failed to fetch delivery count", err);
        });
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      {/* You can include your Navbar component here if needed */}

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-lg">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-indigo-600 text-3xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-indigo-100">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Type</p>
                    <p className="font-medium capitalize">{user.role}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Account Actions</h2>
                <div className="space-y-4">
                  <Link
                    to="/settings"
                    className="block w-full px-4 py-2 text-center bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    Edit Profile
                  </Link>
                  <Link
                    to="/change-password"
                    className="block w-full px-4 py-2 text-center bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    Change Password
                  </Link>
                  {onLogout && (
                    <button
                      onClick={onLogout}
                      className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm text-sm font-medium transition"
                    >
                      Logout
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Additional sections can be added here */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Account Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-md shadow text-center">
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="font-medium">1 day ago</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow text-center">
                  <p className="text-sm text-gray-500">Orders</p>
                  <p className="font-medium">{orderCount}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow text-center">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium text-green-500">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}