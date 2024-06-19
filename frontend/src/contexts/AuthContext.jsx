import React, { createContext, useState, useEffect } from 'react';
import api from '../api'; // Your API setup

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      // Fetch user information using the token
      const fetchUser = async () => {
        try {
          const response = await api.get('/users/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user', error);
          logout(); // Token might be invalid, so logout
        }
      };
      fetchUser();
    }
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await api.post('/users/login', credentials);
      const { token } = response.data;
      setToken(token);
      localStorage.setItem('authToken', token);
      // Fetch user information after login
      const userResponse = await api.get('/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(userResponse.data);
    } catch (error) {
      console.error('Error logging in', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
