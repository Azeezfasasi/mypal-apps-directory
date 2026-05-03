"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function TenantCategoryListsPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/tenant-categories");
        setCategories(response.data);
      } catch (err) {
        setError("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Website Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category._id} className="border rounded-lg p-4 hover:shadow-lg transition">
            <h3 className="font-bold text-lg">{category.name}</h3>
            <p className="text-gray-600 text-sm mt-2">{category.description || "No description"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
