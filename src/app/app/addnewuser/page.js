"use client";

import { useState } from "react";
import axios from "axios";

export default function AddNewUserPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    try {
      await axios.post("/api/profiles/admin/add-user", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      setMessage({ type: "success", text: "✅ User added successfully!" });
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "❌ Failed to add user" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Add a New User</h1>
          <p className="text-gray-600">Create and manage new user accounts</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 sm:p-6 rounded-xl font-medium animate-in fade-in slide-in-from-top-2 ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}>
            {message.text}
          </div>
        )}

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                👤 Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 ${
                  errors.name
                    ? "border-red-300 focus:border-red-500 bg-red-50 focus:bg-white"
                    : "border-gray-200 focus:border-orange-500 focus:bg-orange-50"
                } focus:outline-none text-gray-900 placeholder-gray-400`}
              />
              {errors.name && <p className="text-red-600 text-sm mt-1 font-medium">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 ${
                  errors.email
                    ? "border-red-300 focus:border-red-500 bg-red-50 focus:bg-white"
                    : "border-gray-200 focus:border-orange-500 focus:bg-orange-50"
                } focus:outline-none text-gray-900 placeholder-gray-400`}
              />
              {errors.email && <p className="text-red-600 text-sm mt-1 font-medium">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔐 Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 ${
                  errors.password
                    ? "border-red-300 focus:border-red-500 bg-red-50 focus:bg-white"
                    : "border-gray-200 focus:border-orange-500 focus:bg-orange-50"
                } focus:outline-none text-gray-900 placeholder-gray-400`}
              />
              {errors.password && <p className="text-red-600 text-sm mt-1 font-medium">{errors.password}</p>}
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔐 Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 ${
                  errors.confirmPassword
                    ? "border-red-300 focus:border-red-500 bg-red-50 focus:bg-white"
                    : "border-gray-200 focus:border-orange-500 focus:bg-orange-50"
                } focus:outline-none text-gray-900 placeholder-gray-400`}
              />
              {errors.confirmPassword && <p className="text-red-600 text-sm mt-1 font-medium">{errors.confirmPassword}</p>}
            </div>

            {/* Role Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                👥 Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:bg-orange-50 focus:outline-none text-gray-900 font-medium transition-colors duration-200 cursor-pointer"
              >
                <option value="user">👤 Viewer - Limited access</option>
                <option value="admin">🔑 Admin - Full access</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex gap-3 sm:gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-linear-to-r from-orange-600 to-orange-700 text-white font-semibold py-3 rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Adding User...
                </>
              ) : (
                <>✨ Add User</>
              )}
            </button>
            <button
              type="reset"
              disabled={loading}
              onClick={() => {
                setFormData({
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                  role: "user",
                });
                setErrors({});
                setMessage(null);
              }}
              className="px-6 sm:px-8 bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
            >
              Clear
            </button>
          </div>

          {/* Footer Help Text */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-500 text-center">
              💡 User credentials will be sent via email upon creation.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
