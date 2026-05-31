"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DisabledApps() {
  const [categories, setCategories] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch all disabled items
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [catRes, tenantRes, appRes] = await Promise.all([
          axios.get("/api/tenant-categories?disabled=true"),
          axios.get("/api/tenants?disabled=true"),
          axios.get("/api/apps?disabled=true"),
        ]);
        setCategories(catRes.data);
        setTenants(tenantRes.data);
        setApps(appRes.data);
      } catch (err) {
        setError("Failed to fetch disabled items");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Enable handler
  const handleEnable = async (type, id) => {
    setActionLoading(true);
    setError(null);
    try {
      let url = "";
      if (type === "category") url = `/api/tenant-categories/${id}`;
      if (type === "tenant") url = `/api/tenants/${id}`;
      if (type === "app") url = `/api/apps/${id}`;
      await axios.patch(url, { disabled: false });
      // Remove from UI
      if (type === "category") setCategories((prev) => prev.filter((c) => c._id !== id));
      if (type === "tenant") setTenants((prev) => prev.filter((t) => t._id !== id));
      if (type === "app") setApps((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      setError("Failed to enable item");
    }
    setActionLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-orange-700">Disabled Items Management</h1>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Disabled Categories */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-orange-600">Categories</h2>
            {categories.length === 0 ? (
              <p className="text-gray-400 italic">No disabled categories</p>
            ) : (
              <ul>
                {categories.map((cat) => (
                  <li key={cat._id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <div className="font-bold">{cat.name}</div>
                      <div className="text-sm text-gray-500">{cat.description}</div>
                    </div>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow disabled:opacity-50"
                      disabled={actionLoading}
                      onClick={() => handleEnable("category", cat._id)}
                    >
                      Enable
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Disabled Tenants */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-orange-600">Tenants</h2>
            {tenants.length === 0 ? (
              <p className="text-gray-400 italic">No disabled tenants</p>
            ) : (
              <ul>
                {tenants.map((tenant) => (
                  <li key={tenant._id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <div className="font-bold">{tenant.name}</div>
                      <div className="text-sm text-gray-500">{tenant.description}</div>
                    </div>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow disabled:opacity-50"
                      disabled={actionLoading}
                      onClick={() => handleEnable("tenant", tenant._id)}
                    >
                      Enable
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Disabled Apps */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-orange-600">Apps</h2>
            {apps.length === 0 ? (
              <p className="text-gray-400 italic">No disabled apps</p>
            ) : (
              <ul>
                {apps.map((app) => (
                  <li key={app._id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <div className="font-bold">{app.name}</div>
                      <div className="text-sm text-gray-500">{app.description}</div>
                    </div>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow disabled:opacity-50"
                      disabled={actionLoading}
                      onClick={() => handleEnable("app", app._id)}
                    >
                      Enable
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
