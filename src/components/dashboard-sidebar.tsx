"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/components/auth-provider';
import { getNavigationItems } from '@/lib/navigation';
import {
  GraduationCap,
  X,
  LogOut,
  User
} from 'lucide-react';

interface DashboardSidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export function DashboardSidebar({ isMobileOpen, setIsMobileOpen }: DashboardSidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navigationItems = user ? getNavigationItems(user.role) : [];

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100">
          <GraduationCap className="w-6 h-6 text-blue-600" />
          SMS
        </Link>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{user.username}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href && (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)));

          if (item.href) {
            // Navigation item - render as link
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className="w-full justify-start gap-3 h-12"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    {item.description && (
                      <div className="text-xs opacity-70">{item.description}</div>
                    )}
                  </div>
                </Button>
              </Link>
            );
          }
          return null;
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Theme</span>
          <ThemeToggle />
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50">
        <Card className="flex-1 rounded-none border-r bg-white dark:bg-gray-900">
          <CardContent className="p-0 h-full">
            {sidebarContent}
          </CardContent>
        </Card>
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
          <div className="fixed top-0 left-0 w-64 h-full">
            <Card className="h-full rounded-none bg-white dark:bg-gray-900">
              <CardContent className="p-0 h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                    SMS
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => setIsMobileOpen(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {sidebarContent}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
