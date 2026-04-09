import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Shop } from './pages/Shop';

function RootRedirect() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return <Navigate to={isAuthenticated ? '/dashboard/shop' : '/login'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="shop" element={<Shop />} />
            {/* Catch-all inside dashboard → shop */}
            <Route path="*" element={<Navigate to="/dashboard/shop" replace />} />
          </Route>
        </Route>

        {/* Root + unknown routes */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
