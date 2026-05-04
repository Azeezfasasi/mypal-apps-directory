"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function TenantListsPage() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get("/api/tenants");
        setTenants(response.data);
      } catch (err) {
        setError("Failed to fetch website types");
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Website Types</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tenants.map((tenant) => (
          <div key={tenant._id} className="border rounded-lg p-4 hover:shadow-lg transition">
            <h3 className="font-bold text-lg">{tenant.name}</h3>
            <p className="text-gray-600 text-sm mt-2">{tenant.description || "No description"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
