"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function AddTenantAppPage() {
  const [tenants, setTenants] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    link: "",
    tenantId: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get("/api/tenants");
        setTenants(response.data);
      } catch (error) {
        console.error("Failed to fetch tenants");
      }
    };

    fetchTenants();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/apps", formData);
      setMessage({ type: "success", text: "App created successfully!" });
      setFormData({ name: "", description: "", link: "", tenantId: "" });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to create app" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Create App</h1>

      {message && (
        <div className={`p-4 rounded mb-4 ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Website Type</label>
          <select
            name="tenantId"
            value={formData.tenantId}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select a website type</option>
            {tenants.map((tenant) => (
              <option key={tenant._id} value={tenant._id}>
                {tenant.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows="4"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">App Link</label>
          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="https://example.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create App"}
        </button>
      </form>
    </div>
  );
}
