import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const [show, setShow] = useState({
  current: false,
  new: false,
  confirm: false
});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      const res =await axios.put(
  "http://localhost:5000/api/auth/change-password",
  {
    currentPassword: form.currentPassword.trim(),
    newPassword: form.newPassword.trim()
  },
  { withCredentials: true }
);

      setSuccess(res.data.message);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Password change failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-700">
          Change Password
        </h2>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-sm">{success}</p>}

        <div className="relative mb-4">
  <input
    type={show.current ? "text" : "password"}
    name="currentPassword"
    value={form.currentPassword}
    onChange={handleChange}
    placeholder="Current Password"
    required
    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 pr-10"
  />
  <span
    onClick={() => setShow({ ...show, current: !show.current })}
    className="absolute right-3 top-3 text-gray-500 cursor-pointer"
  >
    {show.current ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>

       <div className="relative mb-4">
  <input
    type={show.new ? "text" : "password"}
    name="newPassword"
    value={form.newPassword}
    onChange={handleChange}
    placeholder="New Password"
    required
    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 pr-10"
  />
  <span
    onClick={() => setShow({ ...show, new: !show.new })}
    className="absolute right-3 top-3 text-gray-500 cursor-pointer"
  >
    {show.new ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>


       <div className="relative mb-6">
  <input
    type={show.confirm ? "text" : "password"}
    name="confirmPassword"
    value={form.confirmPassword}
    onChange={handleChange}
    placeholder="Confirm New Password"
    required
    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 pr-10"
  />
  <span
    onClick={() => setShow({ ...show, confirm: !show.confirm })}
    className="absolute right-3 top-3 text-gray-500 cursor-pointer"
  >
    {show.confirm ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>


        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
