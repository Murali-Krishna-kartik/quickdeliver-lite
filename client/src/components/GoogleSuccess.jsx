import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function GoogleSuccess({ setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // First try to get user from /me endpoint
        const { data } = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });

        if (!data.user) {
          throw new Error("No user data returned");
        }

        // Set user in context/state
        setUser({
          _id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role
        });

        // Redirect based on role
        const redirectPath = data.user.role === 'customer' 
          ? '/customer-dashboard' 
          : data.user.role === 'driver' 
            ? '/driver-dashboard' 
            : '/dashboard';
        
        navigate(redirectPath);
      } catch (error) {
        console.error("Google auth verification failed:", error);
        navigate("/login", { 
          state: { 
            error: "Google login failed. Please try again." 
          } 
        });
      }
    };

    verifyAuth();
  }, [navigate, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-700">
          Finalizing your Google login...
        </p>
      </div>
    </div>
  );
}