import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "./authStore";
import { useEffect } from "react";

const AdminRoute = () => {
  const { isAdmin } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      alert("접근 권한이 없습니다.");
      navigate("/", { replace: true });
    }
  }, [isAdmin, navigate]);

  return isAdmin ? <Outlet /> : null;
};

export default AdminRoute;
