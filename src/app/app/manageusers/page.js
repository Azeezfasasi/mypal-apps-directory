"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Not authenticated. Please login.");
          setLoading(false);
          return;
        }

        const response = await axios.get("/api/profiles", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    setDeletingId(userId);
    try {
      await axios.delete(`/api/profiles/${userId}`, {
        headers: getAuthHeaders(),
      });
      setUsers(users.filter((u) => u._id !== userId));
      setDeleteConfirm(null);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setEditError(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    setEditLoading(true);
    setEditError(null);

    try {
      const response = await axios.put(
        `/api/profiles/${editingUser}`,
        editFormData,
        {
          headers: getAuthHeaders(),
        }
      );
      setUsers(users.map((u) => (u._id === editingUser ? response.data : u)));
      setEditingUser(null);
      setEditFormData({});
    } catch (error) {
      setEditError(error.response?.data?.message || "Failed to update user");
    } finally {
      setEditLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    setTogglingId(userId);
    try {
      const response = await axios.patch(
        `/api/profiles/${userId}/status`,
        {
          isDisabled: !currentStatus,
        },
        {
          headers: getAuthHeaders(),
        }
      );
      setUsers(users.map((u) => (u._id === userId ? response.data : u)));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update user status");
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-orange-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md border border-red-200">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Manage Users</h1>
          <p className="text-gray-600">Total users: <span className="font-semibold text-orange-600">{users.length}</span></p>
        </div>

        {/* Empty State */}
        {users.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Users Yet</h3>
            <p className="text-gray-600">Start by adding your first user</p>
          </div>
        ) : (
          /* Desktop Table View */
          <>
            <div className="hidden md:block bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-linear-to-r from-orange-600 to-orange-700 text-white">
                      <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-blue-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                              {user.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <span className="font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 break-all">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === "admin"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {user.role === "admin" ? "🔑" : "👤"} {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            user.isDisabled
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}>
                            {user.isDisabled ? "🚫 Disabled" : "✅ Active"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditClick(user)}
                              className="inline-flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 font-medium text-sm"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleToggleStatus(user._id, user.isDisabled)}
                              disabled={togglingId === user._id}
                              className="inline-flex items-center gap-1 px-3 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors duration-200 font-medium text-sm disabled:opacity-50"
                            >
                              {togglingId === user._id ? "..." : user.isDisabled ? "🔓 Enable" : "🔒 Disable"}
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(user._id)}
                              className="inline-flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium text-sm"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {users.map((user) => (
                <div key={user._id} className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold shrink-0">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg">{user.name}</h3>
                      <p className="text-gray-600 text-sm break-all">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {user.role === "admin" ? "🔑" : "👤"} {user.role}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isDisabled
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {user.isDisabled ? "🚫 Disabled" : "✅ Active"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="px-2 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 font-medium text-xs"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user._id, user.isDisabled)}
                        disabled={togglingId === user._id}
                        className="px-2 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors duration-200 font-medium text-xs disabled:opacity-50"
                      >
                        {togglingId === user._id ? "..." : user.isDisabled ? "🔓" : "🔒"}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(user._id)}
                        className="px-2 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium text-xs"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Edit User</h3>
            <p className="text-gray-600 text-sm mb-6">Update user information</p>

            {editError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
                {editError}
              </div>
            )}

            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border-2 border-gray-200 focus:border-blue-500 focus:bg-blue-50 rounded-lg focus:outline-none font-medium"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border-2 border-gray-200 focus:border-blue-500 focus:bg-blue-50 rounded-lg focus:outline-none font-medium"
                />
              </div>

              {/* Role Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <select
                  name="role"
                  value={editFormData.role}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border-2 border-gray-200 focus:border-blue-500 focus:bg-blue-50 rounded-lg focus:outline-none font-medium cursor-pointer"
                >
                  <option value="viewer">👤 Viewer - Limited access</option>
                  <option value="admin">🔑 Admin - Full access</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingUser(null)}
                disabled={editLoading}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {editLoading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Saving...
                  </>
                ) : (
                  <>💾 Save</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete User?</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone. Are you sure you want to delete this user?</p>
            <div className="flex gap-3 sm:gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirm)}
                disabled={deletingId === deleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium disabled:opacity-50"
              >
                {deletingId === deleteConfirm ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl sm:rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete User?</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone. Are you sure you want to delete this user?</p>
            <div className="flex gap-3 sm:gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirm)}
                disabled={deletingId === deleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium disabled:opacity-50"
              >
                {deletingId === deleteConfirm ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

