"use client"

import { useEffect, useState } from 'react';
import { AuthClient } from '@/lib/auth-client';
import { UserRole } from '@/lib/types';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredRole?: UserRole;
}

export function AuthGuard({ children, allowedRoles, requiredRole }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

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
          const fetchedUserRole = data.user.role;
          setIsAuthenticated(true);
          setUserRole(fetchedUserRole);
          
          // Check if user has required permissions
          const rolesToCheck = allowedRoles || (requiredRole ? [requiredRole] : []);
          
          if (rolesToCheck.length > 0 && !rolesToCheck.includes(fetchedUserRole)) {
            // Redirect to appropriate dashboard if user doesn't have access to this specific route
            window.location.href = '/dashboard';
            return;
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
  }, [allowedRoles, requiredRole]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Check role-based access after authentication is confirmed
  if (userRole) {
    const rolesToCheck = allowedRoles || (requiredRole ? [requiredRole] : []);
    
    if (rolesToCheck.length > 0 && !rolesToCheck.includes(userRole)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="text-lg text-red-600 dark:text-red-400 mb-2">Access Denied</div>
            <div className="text-gray-600 dark:text-gray-400">
              You don&apos;t have permission to access this page.
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
