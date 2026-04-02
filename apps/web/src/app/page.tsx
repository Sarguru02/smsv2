"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { AuthClient } from '@/lib/auth-client';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  BarChart3,
  LogIn,
  LogOut,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = AuthClient.getToken();
        if (token) {
          const response = await AuthClient.authenticatedFetch('/api/auth/me');
          if (response.ok) {
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await AuthClient.logout();
    setIsAuthenticated(false);
  };

  const features = [
    {
      icon: Users,
      title: "Student Management",
      description: "Efficiently manage student records, enrollment, and academic information"
    },
    {
      icon: BookOpen,
      title: "Class Organization",
      description: "Organize classes, sections, and subjects for streamlined academic planning"
    },
    {
      icon: BarChart3,
      title: "Performance Tracking",
      description: "Track student performance with comprehensive analytics and reports"
    },
    {
      icon: GraduationCap,
      title: "Academic Records",
      description: "Maintain detailed academic records and historical performance data"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              Student Management System
            </Link>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {loading ? (
                <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ) : isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Button asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button asChild>
                  <Link href="/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Complete
              <span className="text-blue-600 dark:text-blue-400"> Student Management </span>
              Solution
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Streamline your educational institution with our comprehensive student management system. 
              Manage students, track performance, and organize academic records all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!loading && !isAuthenticated && (
                <Button size="lg" asChild>
                  <Link href="/login">
                    Get Started
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              )}
              {!loading && isAuthenticated && (
                <Button size="lg" asChild>
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              )}
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage your educational institution efficiently and effectively.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 dark:bg-blue-700">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of educational institutions already using our platform to manage their students effectively.
            </p>
            {!loading && !isAuthenticated && (
              <Button size="lg" variant="secondary" asChild>
                <Link href="/login">
                  Start Managing Students
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 md:mb-0">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              Student Management System
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              © Student Management System. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
