"use client"

import { useAuth } from "@/components/auth-provider"
import StudentPageClient from "@/components/pages/StudentPage";

export default function StudentProfile() {
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

  return <StudentPageClient rollNo={user.username} />
}
