import { UserRole } from './types';
import { 
  Home, 
  Users, 
  GraduationCap, 
  BarChart3, 
  Settings,
  User,
  BookOpen,
  type LucideIcon
} from 'lucide-react';

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
  description?: string;
}

export const navigationConfig: NavigationItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: ['STUDENT', 'TEACHER', 'ADMIN'],
    description: 'Overview and statistics'
  },
  {
    label: 'Students',
    href: '/dashboard/students',
    icon: GraduationCap,
    roles: ['TEACHER', 'ADMIN'],
    description: 'Manage student records'
  },
  {
    label: 'Teachers',
    href: '/dashboard/teachers',
    icon: Users,
    roles: ['ADMIN'],
    description: 'Manage teaching staff'
  },
  {
    label: 'My Classes',
    href: '/dashboard/classes',
    icon: BookOpen,
    roles: ['TEACHER'],
    description: 'View assigned classes'
  },
  {
    label: 'My Profile',
    href: '/dashboard/profile',
    icon: User,
    roles: ['STUDENT'],
    description: 'View academic progress'
  },
  {
    label: 'Reports',
    href: '/dashboard/reports',
    icon: BarChart3,
    roles: ['TEACHER', 'ADMIN'],
    description: 'Academic reports and analytics'
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['ADMIN'],
    description: 'System configuration'
  }
];

export function getNavigationItems(userRole: UserRole): NavigationItem[] {
  return navigationConfig.filter(item => item.roles.includes(userRole));
}
