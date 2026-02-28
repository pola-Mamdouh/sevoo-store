// src/components/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../store/AdminContext';

const AdminRoute = ({ children }) => {
  const { adminState } = useAdmin();
  
  if (adminState.isLoading) {
    return <div className="p-8 text-center">جاري التحميل...</div>;
  }
  
  return adminState.isAdmin ? children : <Navigate to="/admin/login" />;
};

export default AdminRoute;