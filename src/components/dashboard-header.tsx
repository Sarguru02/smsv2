"use client"

import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface DashboardHeaderProps {
  setIsMobileOpen: (open: boolean) => void;
}

export function DashboardHeader({ setIsMobileOpen }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="flex h-14 items-center px-4 lg:px-6">
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu className="w-5 h-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        
        <div className="flex-1" />
        
        {/* Additional header content can go here */}
      </div>
    </header>
  );
}