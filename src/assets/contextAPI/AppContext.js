import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const TenantAppContext = createContext();

export const useTenantApp = () => useContext(TenantAppContext);

const API_URL = '/api/apps';

export const TenantAppProvider = ({ children }) => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all apps
  const fetchApps = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setApps(response.data);
    } catch (err) {
      setError(err.response?.data || "Error fetching apps");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  // Fetch all apps by tenant
  const fetchAppsByTenant = async (tenantId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/${tenantId}`);
      setApps(response.data);
    } catch (err) {
      setError(err.response?.data || "Error fetching apps");
    } finally {
      setLoading(false);
    }
  };

  // Create a new app
  const createApp = async ({ name, description, tenantId, link }) => {
    setLoading(true);
    try {
      const response = await axios.post(API_URL, { name, description, tenantId, link });
      setApps((prev) => [...prev, response.data]);
    } catch (err) {
      setError(err.response?.data || "Error creating app");
    } finally {
      setLoading(false);
    }
  };

  // Update an app
  const updateApp = async (appId, updatedData) => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/${appId}`, updatedData);
      setApps((prev) => prev.map((app) => (app._id === appId ? response.data : app)));
    } catch (err) {
      setError(err.response?.data || "Error updating app");
    } finally {
      setLoading(false);
    }
  };

  // Delete an app
  const deleteApp = async (appId) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${appId}`);
      setApps((prev) => prev.filter((app) => app._id !== appId));
    } catch (err) {
      setError(err.response?.data || "Error deleting app");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TenantAppContext.Provider
      value={{
        apps,
        loading,
        error,
        fetchAppsByTenant,
        createApp,
        updateApp,
        deleteApp,
        fetchApps,
      }}
    >
      {children}
    </TenantAppContext.Provider>
  );
};