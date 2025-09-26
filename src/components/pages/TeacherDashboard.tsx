"use client"

import { useEffect, useState } from "react"
import { Action, Column, ListViewPagination } from "@/components/list-view-pagination"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye, FileDown, Trash2, Upload, UserPlus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Student = {
  id: string
  rollNo: string
  name: string
  class: string | null
  section: string | null
  createdAt: string
  updatedAt: string
}

type StudentsResponse = {
  students: Student[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
export default function TeacherDashboard() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchStudents = async (page: number = 1) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/student?page=${page}&limit=10`)
      if (response.ok) {
        const data: StudentsResponse = await response.json()
        setStudents(data.students)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.class && student.class.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.section && student.section.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredStudents(filtered)
  }, [students, searchTerm])

  const handlePageChange = (newPage: number) => {
    fetchStudents(newPage)
  }

  const handleViewStudent = (student: Student) => {
    window.location.href = `/dashboard/teacher/student/${student.id}`
  }

  const handleEditStudent = (student: Student) => {
    console.log('Edit student:', student)
  }

  const handleDeleteStudent = (student: Student) => {
    console.log('Delete student:', student)
  }

  const columns: Column<Student>[] = [
    {
      key: 'rollNo',
      header: 'Roll No'
    },
    {
      key: 'name',
      header: 'Name'
    },
    {
      key: 'class',
      header: 'Class',
      render: (value) => value ? <Badge variant="outline">{String(value)}</Badge> : <span className="text-gray-400">-</span>
    },
    {
      key: 'section',
      header: 'Section',
      render: (value) => value ? <Badge variant="outline">{String(value)}</Badge> : <span className="text-gray-400">-</span>
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (value) => new Date(String(value)).toLocaleDateString()
    }
  ]

  const actions: Action<Student>[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      label: "View Student",
      onClick: handleViewStudent,
      variant: "ghost"
    },
    {
      icon: <Edit className="w-4 h-4" />,
      label: "Edit Student",
      onClick: handleEditStudent,
      variant: "ghost",
      showForRoles: ["TEACHER"]
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      label: "Delete Student",
      onClick: handleDeleteStudent,
      variant: "ghost",
      showForRoles: ["TEACHER"]
    }
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Students Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage students and their academic records</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.total}</div>
            <p className="text-xs text-gray-600">Active students</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-green-600" />
              Add Student
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full" size="sm">
              New Student
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="w-5 h-5 text-purple-600" />
              Upload Marks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" size="sm">
              Upload CSV
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileDown className="w-5 h-5 text-orange-600" />
              Batch Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" size="sm">
              Upload Students
            </Button>
          </CardContent>
        </Card>
      </div>

      <ListViewPagination
        title="Students List"
        description="Manage all students in your classes"
        columns={columns}
        data={filteredStudents}
        pagination={pagination}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onPageChange={handlePageChange}
        actions={actions}
        searchPlaceholder="Search students..."
        emptyMessage="No students found"
      />
    </div>
  )
}

