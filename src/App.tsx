import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashBoardPage from './pages/DashBoardPage';
import RoomPage from './pages/RoomPage';
import TenantPage from './pages/TenantPage';
import UserPage from './pages/UserPage';
import ContractPage from './pages/ContractPage';
import InvoicePage from './pages/InvoicePage';
import MeasurePage from './pages/MeasurePage';
import RolePage from './pages/RolePage';
import PermissionPage from './pages/PermissionPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import MainLayout from './components/MainLayout';
import { useAuth } from './hooks/useAuth';
import PublicRoute from './components/auth/PublicRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Forbidden from './pages/auth/Forbidden';
import NotFound from './pages/auth/NotFound';


function RootRedirect() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to={"/auth/login"} />;
  return <Navigate to={"/dashboard"} />;
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },
 
  {
        path: "/auth",
        element: <PublicRoute />,
        children: [
          { path: "login", element: <AuthPage /> },
        ],
      },
    
  
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/dashboard', element: <DashBoardPage /> },
          { path: '/rooms', element: <RoomPage /> },
          { path: '/tenants', element: <TenantPage /> },
          { path: '/users', element: <UserPage /> },
          { path: '/contracts', element: <ContractPage /> },
          { path: '/invoices', element: <InvoicePage /> },
          { path: '/measures', element: <MeasurePage /> },
          { path: '/roles', element: <RolePage /> },
          { path: '/permissions', element: <PermissionPage /> },
          { path: '/settings', element: <SettingsPage /> },
          { path: '/profile', element: <ProfilePage /> },
          // Redirect mặc định trong app
          { path: '/', element: <Navigate to="/dashboard" replace /> },
        ],
      },
    ],
  },
 {
    path: "/forbidden",
    element: <Forbidden />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);



import { Toaster } from 'react-hot-toast';

function App() {
   
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <RouterProvider router={router}/>
    </>
  );
  
}

export default App;
