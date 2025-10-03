import { UserRole } from './types';
import {
  Home,
  Users,
  GraduationCap,
  User,
  type LucideIcon,
  Book,
  Library
} from 'lucide-react';

export interface NavigationItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  roles: UserRole[];
  description?: string;
  action?: () => void;
  type?: 'navigation' | 'action';
}

// Base navigation items without actions (to be used statically)
export const baseNavigationConfig: NavigationItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: ['STUDENT', 'TEACHER', 'ADMIN'],
    description: 'Overview and statistics',
    type: 'navigation'
  },
  {
    label: 'Students',
    href: '/dashboard/students',
    icon: GraduationCap,
    roles: ['TEACHER', 'ADMIN'],
    description: 'Manage student records',
    type: 'navigation'
  },
  {
    label: 'Subjects',
    href: '/dashboard/subjects',
    icon: Library,
    roles: ['TEACHER', 'ADMIN'],
    description: 'Manage student records',
    type: 'navigation'
  },
  {
    label: 'Exams',
    href: '/dashboard/exams',
    icon: Book,
    roles: ['STUDENT', 'TEACHER', 'ADMIN'],
    description: 'See Exams',
    type: 'navigation'
  },
  {
    label: 'Teachers',
    href: '/dashboard/teachers',
    icon: Users,
    roles: ['ADMIN'],
    description: 'Manage teaching staff',
    type: 'navigation'
  },
  {
    label: 'My Profile',
    href: '/dashboard/profile',
    icon: User,
    roles: ['STUDENT'],
    description: 'View academic progress',
    type: 'navigation'
  },
];

// For backward compatibility
export const navigationConfig = baseNavigationConfig;

export function getNavigationItems(userRole: UserRole, actionItems: NavigationItem[] = []): NavigationItem[] {
  const baseItems = baseNavigationConfig.filter(item => item.roles.includes(userRole));
  const filteredActionItems = actionItems.filter(item => item.roles.includes(userRole));
  return [...baseItems, ...filteredActionItems];
}
