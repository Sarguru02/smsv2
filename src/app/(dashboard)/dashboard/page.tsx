"use client"

import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getNavigationItems } from '@/lib/navigation';
import Link from 'next/link';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  BarChart3,
  Clock,
  Star,
  TrendingUp,
  Calendar
} from 'lucide-react';

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

  const getRoleStats = () => {
    if (user.role === 'TEACHER') {
      return [
        { label: 'My Classes', value: '4', icon: BookOpen, color: 'blue' },
        { label: 'Total Students', value: '120', icon: Users, color: 'green' },
        { label: 'Pending Reviews', value: '8', icon: Clock, color: 'orange' },
        { label: 'This Month', value: '15', icon: Calendar, color: 'purple' },
      ];
    } else if (user.role === 'STUDENT') {
      return [
        { label: 'Enrolled Courses', value: '6', icon: BookOpen, color: 'blue' },
        { label: 'Completed Tests', value: '12', icon: Star, color: 'green' },
        { label: 'Current GPA', value: '3.8', icon: TrendingUp, color: 'orange' },
        { label: 'Attendance', value: '92%', icon: Calendar, color: 'purple' },
      ];
    } else {
      return [
        { label: 'Total Teachers', value: '25', icon: Users, color: 'blue' },
        { label: 'Total Students', value: '450', icon: GraduationCap, color: 'green' },
        { label: 'Active Classes', value: '18', icon: BookOpen, color: 'orange' },
        { label: 'System Reports', value: '7', icon: BarChart3, color: 'purple' },
      ];
    }
  };

  const stats = getRoleStats();

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      blue: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-300', icon: 'text-blue-600 dark:text-blue-400' },
      green: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-300', icon: 'text-green-600 dark:text-green-400' },
      orange: { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-800 dark:text-orange-300', icon: 'text-orange-600 dark:text-orange-400' },
      purple: { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-800 dark:text-purple-300', icon: 'text-purple-600 dark:text-purple-400' },
    };
    return colors[color] || colors.blue;
  };

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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = getColorClasses(stat.color);
          
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${colorClasses.bg}`}>
                    <Icon className={`w-4 h-4 ${colorClasses.icon}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${colorClasses.text}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {navigationItems
              .filter(item => item.href !== '/dashboard')
              .slice(0, 6)
              .map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.href}
                    variant="outline"
                    className="h-auto p-4 flex-col gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                    asChild
                  >
                    <Link href={item.href}>
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

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Your latest actions and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {user.role === 'TEACHER' && (
              <>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Uploaded marks for Mathematics Class XII</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Reviewed student profile updates</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </>
            )}
            
            {user.role === 'STUDENT' && (
              <>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Completed Physics assignment</p>
                    <p className="text-xs text-gray-500">3 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Received marks for Chemistry test</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </>
            )}
            
            {user.role === 'ADMIN' && (
              <>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Generated monthly attendance report</p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Added new teacher to system</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
