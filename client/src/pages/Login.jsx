import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await login(email, password);
      const user = res.user;

      if (!user || !user.role) {
        return setErr("Invalid response from server.");
      }

      setUser(user);

      // Redirect user based on role
      if (user.role === "customer") {
        navigate("/customer-dashboard");
      } else if (user.role === "driver") {
        navigate("/driver-dashboard");
      } else {
        navigate("/dashboard"); // fallback
      }
    } catch (error) {
      setErr("Invalid credentials or server error.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100 relative"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <form
        className="relative bg-white bg-opacity-90 p-8 rounded-lg shadow-md w-full max-w-sm z-10"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">
          Login
        </h2>

        <input
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative mb-4">
          <input
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-2/4 transform -translate-y-1/2 text-gray-500 focus:outline-none"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {err && <div className="mb-4 text-red-600 text-sm">{err}</div>}

        <button
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          type="submit"
        >
          Login
        </button>

        <button
  type="button"
  onClick={handleGoogleLogin}
  className="w-full mt-3 flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 py-2 rounded hover:bg-gray-100 transition"
>
  <FcGoogle className="text-xl" />
  <span>Login with Google</span>
</button>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}
