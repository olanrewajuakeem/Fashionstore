import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedIsAdmin = localStorage.getItem('is_admin') === 'true';
    if (token && storedUser) {
      setUser({ token, ...JSON.parse(storedUser) });
      setIsAdmin(storedIsAdmin);
    }
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Sending login request:', { email, password });
      const response = await axios.post('http://127.0.0.1:5000/api/login', { email, password });
      console.log('Login response:', response.data);
      const { access_token, is_admin, user } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('is_admin', is_admin.toString());
      setUser({ token: access_token, ...user });
      setIsAdmin(is_admin);
      if (is_admin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
      return { success: true };
    } catch (err) {
      console.error('Login error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const signup = async (username, email, password) => {
    try {
      console.log('Sending signup request:', { username, email, password });
      await axios.post('http://127.0.0.1:5000/api/signup', { username, email, password });
      return { success: true };
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      return { success: false, message: err.response?.data?.message || 'Signup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('is_admin');
    setUser(null);
    setIsAdmin(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);