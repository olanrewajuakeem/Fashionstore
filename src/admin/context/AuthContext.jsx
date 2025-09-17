import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Use named export

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const storedUser = localStorage.getItem('admin_user');
    const storedIsAdmin = localStorage.getItem('admin_is_admin') === 'true';

    if (token && storedUser) {
      try {
        const decoded = jwtDecode(token); // Use jwtDecode
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          localStorage.removeItem('admin_is_admin');
          setUser(null);
          setIsAdmin(false);
        } else {
          setUser({ token, ...JSON.parse(storedUser) });
          setIsAdmin(storedIsAdmin);
        }
      } catch (err) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_is_admin');
        setUser(null);
        setIsAdmin(false);
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/login', { email, password });
      const { access_token, is_admin } = response.data;
      const userData = { email };
      localStorage.setItem('admin_token', access_token);
      localStorage.setItem('admin_user', JSON.stringify(userData));
      localStorage.setItem('admin_is_admin', is_admin.toString());
      setUser({ token: access_token, ...userData });
      setIsAdmin(is_admin);
      return { success: true, is_admin };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const signup = async (username, email, password) => {
    try {
      await axios.post('http://127.0.0.1:5000/api/signup', { username, email, password });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Signup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_is_admin');
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);