"use client";

import { useProfile } from "@/assets/contextAPI/ProfileContext";
import { useEffect, useState } from "react";

export default function ProfileDetailsPage() {
  const { user, loading } = useProfile();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || loading) return <div className="p-8">Loading...</div>;

  if (!user) {
    return <div className="p-8">No user data available. Please log in.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Profile Details</h1>

      <div className="max-w-2xl bg-white border rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Name</label>
          <p className="text-lg">{user.name || "N/A"}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Email</label>
          <p className="text-lg">{user.email || "N/A"}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Role</label>
          <p className="text-lg">
            <span className={`px-3 py-1 rounded ${user.role === "Admin" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
              {user.role || "N/A"}
            </span>
          </p>
        </div>

        {user.phone && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Phone</label>
            <p className="text-lg">{user.phone}</p>
          </div>
        )}
      </div>
    </div>
  );
}
