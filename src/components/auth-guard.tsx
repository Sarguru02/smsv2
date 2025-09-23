"use client"

import { useEffect, useState } from 'react';
import { AuthClient } from '@/lib/auth-client';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'STUDENT' | 'TEACHER';
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = AuthClient.getToken();
      
      if (!token) {
        setIsAuthenticated(false);
        window.location.href = '/login';
        return;
      }

      try {
        const response = await AuthClient.authenticatedFetch('/api/auth/me');
        const data = await response.json();

        if (response.ok) {
          setIsAuthenticated(true);
          setUserRole(data.user.role);
          
          if (requiredRole && data.user.role !== requiredRole) {
            const redirectPath = data.user.role === 'STUDENT' ? '/dashboard/student' : '/dashboard/teacher';
            window.location.href = redirectPath;
          }
        } else {
          AuthClient.removeToken();
          setIsAuthenticated(false);
          window.location.href = '/login';
        }
      } catch {
        AuthClient.removeToken();
        setIsAuthenticated(false);
        window.location.href = '/login';
      }
    };

    checkAuth();
  }, [requiredRole]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}