"use client"

import { useEffect, useState } from "react"
import { ListViewPagination, Column, Action, BulkAction } from "@/components/list-view-pagination"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthClient } from "@/lib/auth-client"
import { Edit, Eye, Trash2, UserPlus, Upload } from "lucide-react"
import NewStudentDialog from "@/components/dialogs/new-student-dialog"
import EditStudentDialog from "@/components/dialogs/edit-student-dialog"
import BatchUploadDialog from "@/components/dialogs/batch-upload-dialog"
import { Env } from "@/lib/EnvVars"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"

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
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedStudents, setSelectedStudents] = useState<Set<Student>>(new Set());

  const fetchStudents = async (page: number = 1, search: string = "") => {
    try {
      setLoading(true)
      const searchParam = search ? `&searchTerm=${encodeURIComponent(search)}` : ""
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
    window.location.href = `/dashboard/students/${student.rollNo}`
  }

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student)
    setEditDialogOpen(true)
  }

  const handleDeleteStudent = async (student: Student) => {
    if (confirm(`Are you sure you want to delete ${student.name}?`)) {
      try {
        const response = await AuthClient.authenticatedFetch(`/api/student/`, {
          method: 'DELETE',
          body: JSON.stringify({
            rollNos: [student.rollNo],
          }),
        })

        if (response.ok) {
          // Refresh the list
          fetchStudents(pagination.page, searchTerm)
        } else {
          console.error('Failed to delete student:', response.statusText)
          if (response.status === 401) {
            window.location.href = '/login'
          } else if (response.status === 403) {
            toast.error('You do not have permission to delete students')
          } else {
            toast.error('Failed to delete student')
          }
        }
      } catch (error) {
        console.error('Error deleting student:', error)
        toast.error('An error occurred while deleting the student')
      }
    }
  }

  const handleBulkDeleteStudents = async (students: Student[]) => {
    const studentCount = students.length
    const studentNames = students.slice(0, 3).map(s => s.name).join(', ')
    const displayNames = studentCount > 3 ? `${studentNames} and ${studentCount - 3} others` : studentNames
    
    if (confirm(`Are you sure you want to delete ${studentCount} student${studentCount > 1 ? 's' : ''}? (${displayNames})`)) {
      try {
        const rollNos = students.map(student => student.rollNo)
        const response = await AuthClient.authenticatedFetch(`/api/student/`, {
          method: 'DELETE',
          body: JSON.stringify({
            rollNos,
          }),
        })

        if (response.ok) {
          toast.success(`Successfully deleted ${studentCount} student${studentCount > 1 ? 's' : ''}`)
          // Refresh the list
          fetchStudents(pagination.page, searchTerm)
        } else {
          console.error('Failed to delete students:', response.statusText)
          if (response.status === 401) {
            window.location.href = '/login'
          } else if (response.status === 403) {
            toast.error('You do not have permission to delete students')
          } else {
            toast.error('Failed to delete students')
          }
        }
      } catch (error) {
        console.error('Error deleting students:', error)
        toast.error('An error occurred while deleting the students')
      }
    }
  }

  const handleUpdateStudent = async ({ id, rollNo, name, className, section }: { id: string, rollNo: string, name: string, className: string, section: string }) => {
    try {
      console.log(id, rollNo, className, name, section);
      const response = await AuthClient.authenticatedFetch(`/api/student`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          rollNo,
          name,
          className,
          section,
        }),
      })

      if (response.ok) {
        // Refresh the list to show the updated student
        fetchStudents(pagination.page, searchTerm)
        toast.success('Student updated successfully!')
      } else {
        console.error('Failed to update student:', response.statusText)
        if (response.status === 401) {
          window.location.href = '/login'
        } else if (response.status === 403) {
          toast.error('You do not have permission to update students')
        } else if (response.status === 409) {
          toast.error('A student with this roll number already exists')
        } else {
          toast.error('Failed to update student. Please try again.')
        }
      }
    } catch (error) {
      console.error('Error updating student:', error)
      toast.error('An error occurred while updating the student')
    }
  }

  const handleAddStudent = async ({ rollNo, name, className, section }: { rollNo: string, name: string, className: string, section: string }) => {
    try {
      const response = await AuthClient.authenticatedFetch('/api/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rollNo,
          name,
          className,
          section,
        }),
      })

      if (response.ok) {
        // Refresh the list to show the new student
        fetchStudents(pagination.page, searchTerm)
        toast.success('Student added successfully!')
      } else {
        console.error('Failed to add student:', response.statusText)
        if (response.status === 401) {
          window.location.href = '/login'
        } else if (response.status === 403) {
          toast.error('You do not have permission to add students')
        } else if (response.status === 409) {
          toast.error('A student with this roll number already exists')
        } else {
          toast.error('Failed to add student. Please try again.')
        }
      }
    } catch (error) {
      console.error('Error adding student:', error)
      toast.error('An error occurred while adding the student')
    }
  }

  const handleBatchUploadComplete = () => {
    window.location.href = `/dashboard/jobs/`
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
      showForRoles: ["TEACHER", "ADMIN"]
    }
  ]

  const bulkActions: BulkAction<Student>[] = [
    {
      icon: <Trash2 className="w-4 h-4" />,
      label: "Delete Selected",
      onClick: handleBulkDeleteStudents,
      variant: "destructive",
      showForRoles: ["TEACHER", "ADMIN"]
    }
  ]

  return (
    <AuthGuard allowedRoles={['TEACHER', 'ADMIN']} >
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Students</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage student records and information</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-green-600" />
                Add Student
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NewStudentDialog handleAddStudent={handleAddStudent} />
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-600" />
                Batch Student Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BatchUploadDialog
                title="Batch Upload Students"
                description="Upload a CSV file to add multiple students at once"
                type="STUDENT_UPLOAD"
                processEndpoint={Env.apiHost + "/api/batch/student/process-csv"}
                sampleCSV={{
                  headers: ["ROLL NO", "NAME", "CLASS", "SECTION"],
                  sampleData: [
                    ["2023001", "John Doe", "10", "A"],
                    ["2023002", "Jane Smith", "10", "B"],
                    ["2023003", "Bob Johnson", "11", "A"]
                  ],
                  filename: "student_upload_sample.csv"
                }}
                formatRequirements={{
                  title: "CSV Format Requirements",
                  requirements: [
                    "Headers: ROLL NO, NAME, CLASS, SECTION",
                    "Each row should contain student data",
                    "No empty rows or columns",
                    "Save as CSV format"
                  ]
                }}
                onUploadComplete={handleBatchUploadComplete}
              />
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
          bulkActions={bulkActions}
          selectedItems={selectedStudents}
          setSelectedItems={setSelectedStudents}
          enableBulkSelect={true}
          searchPlaceholder="Search students by name, roll number, class..."
          emptyMessage="No students found. Add some students to get started."
        />

        {/* Edit Student Dialog */}
        <EditStudentDialog
          student={selectedStudent}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          handleEditStudent={handleUpdateStudent}
        />
      </div>
    </AuthGuard>
  )
}
