import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Order from "./pages/Order"; 
import Register from "./pages/Register";
import Profile from "./components/Profile";
import CustomerDashboard from "./pages/CustomerDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import EditProfile from "./components/EditProfile";
import ChangePassword from "./components/ChangePassword";
import GoogleSuccess from "./pages/GoogleSuccess";
import Home from "./pages/Home";
import api from "./api/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Static pages
import About from "./pages/Static/About";
import PrivacyPolicy from "./pages/Static/PrivacyPolicy";
import Licensing from "./pages/Static/Licensing";
import Contact from "./pages/Static/Contact";


export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        console.log("❌ Not logged in");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  if (loading)
    return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="min-h-[80vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
         
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route
            path="/profile"
            element={<Profile user={user} onLogout={handleLogout} />}
          />
          <Route path="/settings" element={<EditProfile user={user} setUser={setUser} />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                {user?.role === "driver" ? (
                  <DriverDashboard user={user} />
                ) : (
                  <CustomerDashboard user={user} />
                )}
              </ProtectedRoute>
            }
          />
            <Route
    path="/order"
    element={
      <ProtectedRoute user={user}>
        {user?.role === "customer" ? (
          <Order user={user} />
        ) : (
          <Navigate to="/dashboard" replace />
        )}
      </ProtectedRoute>
    }
  />

          {/* ✅ Google OAuth Redirect Handler */}
          <Route
            path="/google-success"
            element={<GoogleSuccess setUser={setUser} />}
          />

          {/* Static Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/licensing" element={<Licensing />} />
          <Route path="/contact" element={<Contact />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
      <ToastContainer position="top-right" autoClose={2500} />
    </BrowserRouter>
  );
}
