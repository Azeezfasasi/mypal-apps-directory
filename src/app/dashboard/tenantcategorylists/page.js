"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function TenantCategoryListsPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmDisable, setConfirmDisable] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

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

  useEffect(() => {
    // eslint-disable-next-line
    fetchCategories();
  }, []);

  const handleEdit = (category) => {
    setEditingId(category._id);
    setEditForm({ name: category.name, description: category.description || "" });
  };

  const handleSaveEdit = async () => {
    if (!editForm.name.trim()) {
      alert("Name is required");
      return;
    }
    setActionLoading(true);
    try {
      await axios.put(`/api/tenant-categories/${editingId}`, editForm);
      setEditingId(null);
      await fetchCategories();
    } catch (err) {
      alert("Failed to update category");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await axios.delete(`/api/tenant-categories/${id}`);
      setConfirmDelete(null);
      await fetchCategories();
    } catch (err) {
      alert("Failed to delete category");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisable = async (id) => {
    setActionLoading(true);
    try {
      await axios.patch(`/api/tenant-categories/${id}`, { disabled: true });
      setConfirmDisable(null);
      await fetchCategories();
    } catch (err) {
      alert("Failed to disable category");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Website Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category._id}
            className={`border rounded-lg p-4 hover:shadow-lg transition ${
              category.disabled ? "bg-gray-100 opacity-60" : ""
            }`}
          >
            <h3 className="font-bold text-lg">{category.name}</h3>
            <p className="text-gray-600 text-sm mt-2">{category.description || "No description"}</p>
            {category.disabled && <p className="text-red-600 text-xs font-semibold mt-2">DISABLED</p>}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(category)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={actionLoading}
              >
                Edit
              </button>
              <button
                onClick={() => setConfirmDelete(category._id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                disabled={actionLoading}
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDisable(category._id)}
                className={`px-3 py-1 text-sm rounded text-white disabled:opacity-50 ${
                  category.disabled ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"
                }`}
                disabled={actionLoading}
              >
                {category.disabled ? "Enable" : "Disable"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  rows="3"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setEditingId(null)}
                  className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 disabled:opacity-50"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  disabled={actionLoading}
                >
                  {actionLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this category? This action cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 disabled:opacity-50"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                disabled={actionLoading}
              >
                {actionLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disable/Enable Confirmation */}
      {confirmDisable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Confirm Action</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to {categories.find((c) => c._id === confirmDisable)?.disabled ? "enable" : "disable"} this category?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmDisable(null)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 disabled:opacity-50"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDisable(confirmDisable)}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                disabled={actionLoading}
              >
                {actionLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
