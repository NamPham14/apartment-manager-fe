import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

export function useHasPermission(permissionName?: string) {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) return false;

  // Nếu là ADMIN thì luôn có quyền
  const isAdmin = user.roles?.some(role => role.name === 'ADMIN');
  if (isAdmin) return true;

  // Nếu không truyền permissionName, Hook chỉ trả về true (vì đã login)
  if (!permissionName) return true;

  // Kiểm tra trong danh sách permissions của tất cả các roles
  return user.roles?.some(role => 
    role.permissions?.some(p => p.name === permissionName)
  );
}
