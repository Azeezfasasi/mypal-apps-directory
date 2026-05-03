import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const TenantCategoryContext = createContext();

export const useTenantCategory = () => useContext(TenantCategoryContext);

const API_URL = '/api/tenant-categories';

export const TenantCategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setCategories(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  // Add a new category
const addCategory = async (categoryData) => {
    try {
      const response = await axios.post(`${window.location.origin}/api/tenant-categories`, categoryData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to add category";
    }
  };
  

  // Update a category
  const updateCategory = async (id, data) => {
    if (!id) {
      console.error("Invalid ID provided for updateCategory:", id);
      return;
    }
  
    try {
      const response = await axios.put(`${window.location.origin}/api/tenant-categories/${id}`, data);
      console.log("Update response:", response.data);
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
    }
  };  
  

  // Delete a category
  const deleteCategory = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setCategories((prev) => prev.filter((category) => category._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting category");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <TenantCategoryContext.Provider
      value={{ categories, loading, error, addCategory, updateCategory, deleteCategory }}
    >
      {children}
    </TenantCategoryContext.Provider>
  );
};
