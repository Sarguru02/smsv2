import { UserRole } from './types';
import { 
  Home, 
  Users, 
  GraduationCap, 
  User,
  type LucideIcon,
  UploadIcon,
  Book
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
    label: 'Batch Student Upload',
    href: '/dashboard/students/upload',
    icon: UploadIcon,
    roles: ['TEACHER', 'ADMIN'],
    description: 'Batch upload student details'
  },
  {
    label: 'Batch Marks Upload',
    href: '/dashboard/exams/upload',
    icon: UploadIcon,
    roles: ['TEACHER', 'ADMIN'],
    description: 'Batch upload student details'
  },
  {
    label: 'Exams',
    href: '/dashboard/exams',
    icon: Book,
    roles: ['STUDENT','TEACHER', 'ADMIN'],
    description: 'See Exams'
  },
  {
    label: 'Teachers',
    href: '/dashboard/teachers',
    icon: Users,
    roles: ['ADMIN'],
    description: 'Manage teaching staff'
  },
  {
    label: 'My Profile',
    href: '/dashboard/profile',
    icon: User,
    roles: ['STUDENT'],
    description: 'View academic progress'
  },
];

export function getNavigationItems(userRole: UserRole): NavigationItem[] {
  return navigationConfig.filter(item => item.roles.includes(userRole));
}
