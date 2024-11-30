import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardNav from './DashboardNav';
import DashboardHome from './DashboardHome';
import StudentDashboard from './StudentDashboard';
import Messages from './Messages';
import Payments from './Payments';
import MentorPayments from './MentorPayments';
import ManageSessions from './ManageSessions';
import Analytics from './Analytics';
import Availability from './Availability';
import Profile from './Profile';
import Settings from './Settings';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMentor = user?.role === 'mentor';

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile Menu Button */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside
          className={cn(
            "w-full md:w-64 md:block transition-all duration-300 ease-in-out",
            isSidebarOpen ? "block" : "hidden"
          )}
        >
          <div className="sticky top-8">
            <DashboardNav />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <Routes>
            <Route index element={isMentor ? <DashboardHome /> : <StudentDashboard />} />
            <Route path="messages" element={<Messages />} />
            <Route path="payments" element={isMentor ? <MentorPayments /> : <Payments />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            {isMentor && (
              <>
                <Route path="manage-sessions" element={<ManageSessions />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="availability" element={<Availability />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </div>
  );
}