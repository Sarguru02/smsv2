"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, GraduationCap } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Student Management System</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Choose your role to continue</p>
        </div>
        
        <div className="grid gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/login/student">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-2">
                  <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl">Student Login</CardTitle>
                <CardDescription>Access your academic records and courses</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Badge variant="secondary">Roll Number Required</Badge>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/login/teacher">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl">Teacher Login</CardTitle>
                <CardDescription>Manage students and academic activities</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Badge variant="secondary">Employee ID Required</Badge>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}