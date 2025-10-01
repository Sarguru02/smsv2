"use client"

import { useAuth } from "@/components/auth-provider"
import { redirect } from "next/navigation";
import { toast } from "sonner";
import StudentPage from "../students/[rollNo]/page";

export default function StudentProfile() {
  const { user } = useAuth();
  if (!user || !user.username) {
    toast.error("User not found in auth, login again");
    setTimeout(() => {
      redirect('/login');
    }, 1500);
    return (<div>
      <p className="text-2xl"> User not found </p>
    </div>)
  }

  return <StudentPage params={{ rollNo: user.username }} />
}
