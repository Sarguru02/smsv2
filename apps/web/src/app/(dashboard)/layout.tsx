"use client"

import { useState } from 'react';
import { AuthGuard } from '@/components/auth-guard';
import { AuthProvider } from '@/components/auth-provider';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard-header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);


  return (
    <AuthProvider>
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <DashboardSidebar
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
          />

          <div className="lg:pl-64">
            <DashboardHeader setIsMobileOpen={setIsMobileOpen} />
            <main className="p-4 lg:p-6">
              {children}
            </main>
          </div>
        </div>
      </AuthGuard>
    </AuthProvider>
  );
}
