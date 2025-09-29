import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './authStore';

const AdminRoute = () => {
  const { isAdmin } = useAuthStore();

  return isAdmin ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default AdminRoute;
