import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLogin from '@/pages/admin/auth/Login';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminUsers from '@/pages/admin/Users';
import AdminMentors from '@/pages/admin/Mentors';
import AdminModerators from '@/pages/admin/Moderators';
import AdminSessions from '@/pages/admin/Sessions';
import AdminReports from '@/pages/admin/Reports';
import AdminSettings from '@/pages/admin/Settings';
import AdminContent from '@/pages/admin/Content';
import AdminTransactions from '@/pages/admin/Transactions';
import AdminLiveSupport from '@/pages/admin/LiveSupport';
import FraudManagement from '@/pages/admin/FraudManagement';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAdmin();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
}

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route
        path="/"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />
      <Route
        path="/moderators"
        element={
          <AdminRoute>
            <AdminModerators />
          </AdminRoute>
        }
      />
      <Route
        path="/mentors"
        element={
          <AdminRoute>
            <AdminMentors />
          </AdminRoute>
        }
      />
      <Route
        path="/sessions"
        element={
          <AdminRoute>
            <AdminSessions />
          </AdminRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <AdminRoute>
            <AdminTransactions />
          </AdminRoute>
        }
      />
      <Route
        path="/live-support"
        element={
          <AdminRoute>
            <AdminLiveSupport />
          </AdminRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <AdminRoute>
            <AdminReports />
          </AdminRoute>
        }
      />
      <Route
        path="/fraud-management"
        element={
          <AdminRoute>
            <FraudManagement />
          </AdminRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <AdminRoute>
            <AdminSettings />
          </AdminRoute>
        }
      />
      <Route
        path="/content"
        element={
          <AdminRoute>
            <AdminContent />
          </AdminRoute>
        }
      />
    </Routes>
  );
}