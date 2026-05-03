import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const TenantContext = createContext();

export const useTenant = () => useContext(TenantContext);

export const TenantProvider = ({ children }) => {
  const [tenants, setTenants] = useState([]);
  const [tenantApps, setTenantApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

const API_URL = '/api/tenants';

  // Fetch all tenants
  const fetchTenants = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setTenants(response.data);
    } catch (err) {
      setError(err.response?.data || 'Error fetching tenants');
    } finally {
      setLoading(false);
    }
  };

  // Fetch apps for a specific tenant
  const fetchTenantApps = async (tenantId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/${tenantId}/apps`);
      setTenantApps(response.data);
    } catch (err) {
      setError(err.response?.data || 'Error fetching tenant apps');
    } finally {
      setLoading(false);
    }
  };

  // Create a new tenant
const createTenant = async ({ name, description, tenantCategoryId }) => {
  setLoading(true);
  try {
    const response = await axios.post(API_URL, { name, description, tenantCategoryId });
    setTenants((prev) => [...prev, response.data]);
  } catch (err) {
    setError(err.response?.data || "Error creating tenant");
    console.error("Create Tenant Error:", err.response?.data || err);
  } finally {
    setLoading(false);
  }
};

  // Update an existing tenant
  const updateTenant = async (tenantId, updatedData) => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/${tenantId}`, updatedData);
      setTenants((prev) => prev.map((t) => (t._id === tenantId ? response.data : t)));
    } catch (err) {
      setError(err.response?.data || 'Error updating tenant');
    } finally {
      setLoading(false);
    }
  };

  // Delete a tenant
  const deleteTenant = async (tenantId) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${API_URL}/${tenantId}`);
      console.log("Delete response:", response.data); // Log the response
      setTenants((prev) => prev.filter((t) => t._id !== tenantId));
    } catch (err) {
      setError(err.response?.data || "Error deleting tenant");
      console.error("Delete Tenant Error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    fetchTenants(); // Load tenants on mount
  }, []);

  return (
    <TenantContext.Provider
      value={{
        tenants,
        tenantApps,
        loading,
        error,
        fetchTenants,
        fetchTenantApps,
        createTenant,
        updateTenant,
        deleteTenant,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};