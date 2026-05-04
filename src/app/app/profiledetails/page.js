"use client";

import { useProfile } from "@/assets/contextAPI/ProfileContext";
import { useEffect, useState } from "react";

export default function ProfileDetailsPage() {
  const { user, loading } = useProfile();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Note: Using isClient to prevent hydration mismatch

  if (!isClient || loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Not Logged In</h2>
          <p className="text-gray-600">No user data available. Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";
  };

  const getRoleColor = (role) => {
    return role === "Admin"
      ? "bg-linear-to-r from-amber-50 to-orange-50 border border-orange-200"
      : "bg-linear-to-r from-blue-50 to-cyan-50 border border-blue-200";
  };

  const getRoleBadgeColor = (role) => {
    return role === "Admin"
      ? "bg-linear-to-r from-orange-500 to-red-500 text-white"
      : "bg-linear-to-r from-blue-500 to-cyan-500 text-white";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Profile Details</h1>
          <p className="text-gray-600">View and manage your account information</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {/* Profile Header */}
          <div className="bg-linear-to-r from-orange-600 to-orange-700 px-6 sm:px-8 py-8 sm:py-12">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center border-2 border-white border-opacity-30 shrink-0">
                <span className="text-3xl sm:text-4xl font-bold text-white">{getInitials(user.name)}</span>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{user.name || "N/A"}</h2>
                <p className="text-blue-100 break-all">{user.email || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-6 sm:px-8 py-8 sm:py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {/* Email */}
              <div className="bg-linear-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  📧 Email Address
                </label>
                <p className="text-lg sm:text-xl font-semibold text-gray-900 break-all">{user.email || "N/A"}</p>
              </div>

              {/* Role */}
              <div className={`${getRoleColor(user.role)} rounded-xl p-6 border`}>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  👤 Role
                </label>
                <div className="flex items-center gap-3">
                  <span className={`${getRoleBadgeColor(user.role)} px-4 py-2 rounded-lg font-semibold text-sm`}>
                    {user.role || "N/A"}
                  </span>
                </div>
              </div>

              {/* Phone */}
              {user.phone && (
                <div className="bg-linear-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    📱 Phone
                  </label>
                  <p className="text-lg sm:text-xl font-semibold text-gray-900">{user.phone}</p>
                </div>
              )}

              {/* Account Status */}
              <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  ✅ Account Status
                </label>
                <p className="text-lg sm:text-xl font-semibold text-green-700">Active</p>
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-500 text-center">
                Your profile information is securely stored and protected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
