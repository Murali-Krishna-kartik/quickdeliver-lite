import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaBoxOpen,
  FaWeightHanging,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";
import api from "../api/api";
import toast from "react-hot-toast";

const CreateDelivery = ({ onClose }) => {
  const [formData, setFormData] = useState({
    pickupAddress: "",
    dropoffAddress: "",
    packageNote: "",
    weight: "Small (up to 2kg)",
    deliverySpeed: "Standard (24-48 hrs)",
    deliveryTime: "Anytime",
    deliveryDate: "",
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData();
  Object.entries(formData).forEach(([key, value]) =>
    data.append(key, value)
  );
  if (file) data.append("itemImage", file);

  try {
    await api.post("/deliveries", data, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    toast.success("Delivery request created successfully!");

    // Reset the form
    setFormData({
      pickupAddress: "",
      dropoffAddress: "",
      packageNote: "",
      weight: "Small (up to 2kg)",
      deliverySpeed: "Standard (24-48 hrs)",
      deliveryTime: "Anytime",
      deliveryDate: "",
    });
    setFile(null);

    if (typeof onClose === "function") {
      onClose(); // Only handles refresh
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to create delivery");
  }
};


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Pickup */}
      <div className="relative">
        <FaMapMarkerAlt className="absolute top-3 left-3 text-indigo-500" />
        <input
          name="pickupAddress"
          value={formData.pickupAddress}
          onChange={handleChange}
          placeholder="Pickup Address"
          required
          className="w-full pl-10 p-3 border rounded shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
        />
      </div>

      {/* Dropoff */}
      <div className="relative">
        <FaMapMarkerAlt className="absolute top-3 left-3 text-indigo-500" />
        <input
          name="dropoffAddress"
          value={formData.dropoffAddress}
          onChange={handleChange}
          placeholder="Dropoff Address"
          required
          className="w-full pl-10 p-3 border rounded shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
        />
      </div>

      {/* Package Note */}
      <div className="relative">
        <FaBoxOpen className="absolute top-3 left-3 text-indigo-500" />
        <textarea
          name="packageNote"
          value={formData.packageNote}
          onChange={handleChange}
          placeholder="Describe your package (size, weight, fragility, etc.)"
          required
          className="w-full pl-10 p-3 border rounded shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
        />
      </div>

      {/* Weight and Delivery Speed */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FaWeightHanging className="absolute top-3 left-3 text-indigo-500" />
          <select
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="w-full pl-10 p-3 border rounded shadow-sm"
          >
            <option>Small (up to 2kg)</option>
            <option>Medium (2kg - 5kg)</option>
            <option>Large (5kg+)</option>
          </select>
        </div>

        <div className="relative flex-1">
          <FaClock className="absolute top-3 left-3 text-indigo-500" />
          <select
            name="deliverySpeed"
            value={formData.deliverySpeed}
            onChange={handleChange}
            className="w-full pl-10 p-3 border rounded shadow-sm"
          >
            <option>Standard (24-48 hrs)</option>
            <option>Express (12 hrs)</option>
            <option>Same Day</option>
          </select>
        </div>
      </div>

      {/* Date and Time */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FaCalendarAlt className="absolute top-3 left-3 text-indigo-500" />
          <input
            type="date"
            name="deliveryDate"
            value={formData.deliveryDate}
            onChange={handleChange}
            className="w-full pl-10 p-3 border rounded shadow-sm"
          />
        </div>

        <div className="relative flex-1">
          <FaClock className="absolute top-3 left-3 text-indigo-500" />
          <select
            name="deliveryTime"
            value={formData.deliveryTime}
            onChange={handleChange}
            className="w-full pl-10 p-3 border rounded shadow-sm"
          >
            <option>Anytime</option>
            <option>Morning (8AM - 12PM)</option>
            <option>Afternoon (12PM - 4PM)</option>
            <option>Evening (4PM - 8PM)</option>
          </select>
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload Item Photo (optional)
        </label>
        <input type="file" onChange={handleFileChange} />
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="mt-2 w-24 h-24 object-cover rounded border"
          />
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-3 rounded transition"
      >
        Submit Delivery Request
      </button>
    </form>
  );
};

export default CreateDelivery;
