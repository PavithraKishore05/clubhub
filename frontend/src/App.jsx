import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import AllEvents from './pages/AllEvents';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/"        element={<Home />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/signup"  element={<Signup />} />
        <Route path="/all-events" element={<AllEvents />} />

        {/* User protected */}
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Admin only */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
