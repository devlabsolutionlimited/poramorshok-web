import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/api/useAdminAuth';
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
import AdminFraudManagement from '@/pages/admin/FraudManagement';
import { PageLoader } from '@/components/ui/page-loader';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { adminUser, isLoading } = useAdminAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

export default function AdminRoutes() {
  const { adminUser } = useAdminAuth();

  // Redirect to dashboard if already logged in
  if (adminUser && window.location.pathname === '/admin/login') {
    return <Navigate to="/admin" replace />;
  }

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
            <AdminFraudManagement />
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

      {/* Catch all route - redirect to admin dashboard */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}