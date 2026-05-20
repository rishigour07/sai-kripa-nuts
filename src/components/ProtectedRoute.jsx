import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { safeReadString } from '../utils/storage';

const ProtectedRoute = ({ children }) => {
  const isAuth = safeReadString('isAdminAuth', 'false') === 'true';
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
