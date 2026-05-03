import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Initialize from localStorage only on client side
  useEffect(() => {
    setIsClient(true);
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      localStorage.removeItem("user");
    }

    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    const loadUser = async () => {
      if (token && !user) {
        try {
          const response = await axios.get('/api/profiles/me');
          setUser(response.data);
        } catch (error) {
          logout();
        }
      }
    };
    loadUser();
  }, [token, user]);

  // Profile management functions
  const registerProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/profiles/register', profileData);
      setUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    } finally {
      setLoading(false);
    }
  };

  // Login function with error handling
  const loginProfile = async (credentials) => {
    try {
      setLoading(true);      
      const response = await axios.post('/api/profiles/login', credentials);
      setUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error.response?.data || error.message;
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile by ID
  const fetchProfile = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/profiles/${userId}`);
      setUser(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userId, updatedData) => {
    try {
      const response = await axios.put(`/api/profiles/${userId}`, updatedData);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  // Delete user profile  
  const deleteProfile = async (userId) => {
    try {
      setLoading(true);
      await axios.delete(`/api/profiles/${userId}`);
      logout();
    } catch (error) {
      throw error.response?.data || error.message;
    } finally {
      setLoading(false);
    }
  };

  // Logout function to clear user data and token
  const logout = () => {
    setUser(null);
    setToken('');
  };

  // Admin function to add a new user
  const addUserByAdmin = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/profiles/admin/add-user', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        user,
        loading,
        registerProfile,
        loginProfile,
        fetchProfile,
        updateProfile,
        deleteProfile,
        logout,
        addUserByAdmin,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

