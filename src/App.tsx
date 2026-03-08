import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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

function App() {
  return (
    <Router>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<AuthPage />} />
        
        {/* App Routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashBoardPage />} />
          <Route path="/rooms" element={<RoomPage />} />
          <Route path="/tenants" element={<TenantPage />} />
          <Route path="/users" element={<UserPage />} />
          <Route path="/contracts" element={<ContractPage />} />
          <Route path="/invoices" element={<InvoicePage />} />
          <Route path="/measures" element={<MeasurePage />} />
          <Route path="/roles" element={<RolePage />} />
          <Route path="/permissions" element={<PermissionPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Redirect to dashboard by default */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
