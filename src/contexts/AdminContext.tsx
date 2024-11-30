import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Permission, hasPermission, checkPermissions } from '@/lib/permissions';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'moderator';
  name: string;
}

interface AdminContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  checkPermissions: (permissions: Permission[]) => boolean;
}

const ADMIN_CREDENTIALS = {
  admin: {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin' as const,
    name: 'Admin User'
  },
  moderator: {
    id: '2',
    email: 'moderator@example.com',
    password: 'mod123',
    role: 'moderator' as const,
    name: 'Moderator User'
  }
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored admin session
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Check against dummy credentials
    const adminUser = Object.values(ADMIN_CREDENTIALS).find(
      cred => cred.email === email && cred.password === password
    );

    if (!adminUser) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...userData } = adminUser;
    setUser(userData);
    localStorage.setItem('adminUser', JSON.stringify(userData));
  };

  const logout = () => {
    localStorage.removeItem('adminUser');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    hasPermission: (permission: Permission) => hasPermission(user, permission),
    checkPermissions: (permissions: Permission[]) => checkPermissions(user, permissions)
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}