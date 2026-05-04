"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function TenantAppsPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await axios.get("/api/apps");
        setApps(response.data);
      } catch (err) {
        setError("Failed to fetch apps");
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">All Apps</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apps.map((app) => (
          <div key={app._id} className="border rounded-lg p-4 hover:shadow-lg transition">
            <h3 className="font-bold text-lg">{app.name}</h3>
            <p className="text-gray-600 text-sm mt-2">{app.description || "No description"}</p>
            {app.link && (
              <a
                href={app.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-3 inline-block"
              >
                View App →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
