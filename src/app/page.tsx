import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { GraduationCap, Users, LogIn } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Student Management System</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage students, courses, and academic records efficiently</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="outline" className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Login
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <CardTitle>Students</CardTitle>
            </div>
            <CardDescription>Manage student records and information</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login/student">
              <Button className="w-full">Student Portal</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
              <CardTitle>Teachers</CardTitle>
            </div>
            <CardDescription>Manage courses and student activities</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login/teacher">
              <Button className="w-full">Teacher Portal</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>Learn more about our system</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Learn More</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
