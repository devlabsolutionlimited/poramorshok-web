import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Home from '@/pages/Home';
import MentorSearch from '@/pages/MentorSearch';
import MentorProfile from '@/pages/MentorProfile';
import BecomeMentor from '@/pages/BecomeMentor';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import AdminRoutes from './admin.routes';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/mentors" element={<MentorSearch />} />
      <Route path="/mentor/:id" element={<MentorProfile />} />
      <Route path="/become-mentor" element={<BecomeMentor />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* Admin Routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
}