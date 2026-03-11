import { useDispatch } from "react-redux"
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";
import { setUserProfile } from "../../store/authSlice";
import { Navigate, Outlet } from "react-router-dom";
import { useHasPermission } from "../../hooks/useHasPermission";

interface Props {
  requiredPermission?: string;
}

export default function ProtectedRoute({ requiredPermission }: Props) {

  const dispatch = useDispatch();

  const { isAuthenticated, user, isLoading } = useAuth();
  const hasPermission = useHasPermission(requiredPermission || "");

  useEffect(() => {
    if(user?.data){
        dispatch(setUserProfile(user.data));
    }
  },[user, dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600 text-lg">Đang tải...</div>
      </div>
    );
  }

  if(!isAuthenticated) {
    return <Navigate to={"/auth/login"} replace/>
  }

  // Nếu trang yêu cầu quyền cụ thể mà user không có -> chuyển sang trang Forbidden
  if (requiredPermission && !hasPermission) {
    return <Navigate to={"/forbidden"} replace />;
  }

  return <Outlet />;
}
