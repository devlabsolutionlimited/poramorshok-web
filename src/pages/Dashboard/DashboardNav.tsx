import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  MessageSquare,
  Wallet,
  FileText,
  BarChart3,
  Clock,
  LogOut,
  UserCircle,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardNav() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const isMentor = user?.role === 'mentor';

  const navItems = [
    {
      title: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Messages',
      href: '/dashboard/messages',
      icon: MessageSquare,
    },
    {
      title: 'Payments',
      href: '/dashboard/payments',
      icon: Wallet,
    },
    {
      title: 'Profile',
      href: '/dashboard/profile',
      icon: UserCircle,
    },
    {
      title: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
    },
    ...(isMentor ? [
      {
        title: 'Manage Sessions',
        href: '/dashboard/manage-sessions',
        icon: FileText,
      },
      {
        title: 'Analytics',
        href: '/dashboard/analytics',
        icon: BarChart3,
      },
      {
        title: 'Availability',
        href: '/dashboard/availability',
        icon: Clock,
      }
    ] : [])
  ];

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
              isActive ? 'bg-accent' : 'transparent'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
      <Button
        variant="ghost"
        className="w-full justify-start gap-3"
        onClick={logout}
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </nav>
  );
}