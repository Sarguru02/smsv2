"use client"

import { useEffect, useState } from "react"
import { ListViewPagination, Column, Action } from "@/components/list-view-pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthClient } from "@/lib/auth-client"
import { Edit, Eye, Trash2, UserPlus, Upload } from "lucide-react"

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

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

  const fetchStudents = async (page: number = 1, search: string = "") => {
    try {
      setLoading(true)
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : ""
      const response = await AuthClient.authenticatedFetch(`/api/student?page=${page}&limit=10${searchParam}`)
      
      if (response.ok) {
        const data: StudentsResponse = await response.json()
        setStudents(data.students)
        setPagination(data.pagination)
      } else {
        console.error('Failed to fetch students:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500) // 500ms delay

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch students when debounced search term changes
  useEffect(() => {
    fetchStudents(1, debouncedSearchTerm)
  }, [debouncedSearchTerm])

  // Initial load
  useEffect(() => {
    fetchStudents(1, "")
  }, [])

  const handlePageChange = (newPage: number) => {
    fetchStudents(newPage, debouncedSearchTerm)
  }

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    // Reset to first page when searching
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleViewStudent = (student: Student) => {
    window.location.href = `/dashboard/students/${student.id}`
  }

  const handleEditStudent = (student: Student) => {
    // TODO: Open edit modal or navigate to edit page
    console.log('Edit student:', student)
  }

  const handleDeleteStudent = async (student: Student) => {
    if (confirm(`Are you sure you want to delete ${student.name}?`)) {
      try {
        const response = await AuthClient.authenticatedFetch(`/api/student/${student.id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          // Refresh the list
          fetchStudents(pagination.page, searchTerm)
        } else {
          console.error('Failed to delete student:', response.statusText)
          if (response.status === 401) {
            window.location.href = '/login'
          } else if (response.status === 403) {
            alert('You do not have permission to delete students')
          } else {
            alert('Failed to delete student')
          }
        }
      } catch (error) {
        console.error('Error deleting student:', error)
        alert('An error occurred while deleting the student')
      }
    }
  }

  const handleAddStudent = () => {
    // TODO: Open add student modal or navigate to add page
    console.log('Add new student')
  }

  const handleBatchUpload = () => {
    window.location.href = '/dashboard/students/upload'
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
      showForRoles: ["TEACHER", "ADMIN"]
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      label: "Delete Student",
      onClick: handleDeleteStudent,
      variant: "ghost",
      showForRoles: ["ADMIN"]
    }
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Students</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage student records and information</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.total}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Registered students</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleAddStudent}>
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

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleBatchUpload}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="w-5 h-5 text-purple-600" />
              Batch Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" size="sm">
              Upload CSV
            </Button>
          </CardContent>
        </Card>

      </div>

      {/* Students List */}
      <ListViewPagination<Student>
        title="Students List"
        description="Manage all students in the system"
        columns={columns}
        data={students}
        pagination={pagination}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onPageChange={handlePageChange}
        actions={actions}
        searchPlaceholder="Search students by name, roll number, class..."
        emptyMessage="No students found. Add some students to get started."
      />
    </div>
  )
}
