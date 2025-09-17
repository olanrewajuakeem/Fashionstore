import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const ProtectedAdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  return user && isAdmin ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedAdminRoute;