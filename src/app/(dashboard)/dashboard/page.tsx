"use client"

import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getNavigationItems } from '@/lib/navigation';
import Link from 'next/link';
import { Star } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-lg">Please log in to continue</div>
      </div>
    );
  }

  const navigationItems = getNavigationItems(user.role);
  const roleDisplay = user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, {user.username}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            <Badge variant="secondary" className="mr-2">
              {roleDisplay}
            </Badge>
            Here&apos;s what&apos;s happening in your dashboard today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Frequently used features for your role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {navigationItems
              .filter(item => item.href && item.href !== '/dashboard' && item.type !== 'action')
              .slice(0, 6)
              .map((item) => {
                const Icon = item.icon;
                const href = item.href as string; // Safe because we filtered above
                return (
                  <Button
                    key={href}
                    variant="outline"
                    className="h-auto p-4 flex-col gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                    asChild
                  >
                    <Link href={href}>
                      <Icon className="w-6 h-6" />
                      <div className="text-center">
                        <div className="font-medium">{item.label}</div>
                        {item.description && (
                          <div className="text-xs text-gray-500 mt-1">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </Link>
                  </Button>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
