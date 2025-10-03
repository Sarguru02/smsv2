"use client"

import { useEffect, useState } from "react"
import { ListViewPagination, Column, Action, BulkAction } from "@/components/list-view-pagination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthClient } from "@/lib/auth-client"
import { Edit, Trash2, BookOpen, Upload } from "lucide-react"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"
import BatchUploadDialog from "@/components/dialogs/batch-upload-dialog"
import { Env } from "@/lib/EnvVars"
import NewEntityDialog from "@/components/dialogs/new-entity-dialog"
import { subjectCsvRequiredHeaders, SubjectInput, SubjectInputSchema } from "@/lib/types"
import { Subject, subjectDialogFields, SubjectsResponse } from "./types"
import EditEntityDialog from "@/components/dialogs/edit-entity-dialog"


export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
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
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set())

  const fetchSubjects = async (page: number = 1, search: string = "") => {
    try {
      setLoading(true)
      const searchParam = search ? `&searchTerm=${encodeURIComponent(search)}` : ""
      const response = await AuthClient.authenticatedFetch(`/api/subject?page=${page}&limit=10${searchParam}`)

      if (response.ok) {
        const data: SubjectsResponse = await response.json()
        setSubjects(data.subjects)
        setPagination(data.pagination)
      } else {
        console.error('Failed to fetch subjects:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching subjects:', error)
    } finally {
      setLoading(false)
    }
  }

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    fetchSubjects(1, debouncedSearchTerm)
  }, [debouncedSearchTerm])

  useEffect(() => {
    fetchSubjects(1, "")
  }, [])

  const handlePageChange = (newPage: number) => {
    fetchSubjects(newPage, debouncedSearchTerm)
  }

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleEditSubject = (subject: Subject) => {
    setSelectedSubject(subject)
    setEditDialogOpen(true)
  }

  const handleDeleteSubject = async (subject: Subject) => {
    if (confirm(`Are you sure you want to delete subject "${subject.name}"?`)) {
      try {
        const response = await AuthClient.authenticatedFetch(`/api/subject`, {
          method: 'DELETE',
          body: JSON.stringify({ ids: [subject.id] }),
        })

        if (response.ok) {
          toast.success(`Deleted subject "${subject.name}"`)
          fetchSubjects(pagination.page, searchTerm)
        } else {
          console.error('Failed to delete subject:', response.statusText)
          toast.error('Failed to delete subject')
        }
      } catch (error) {
        console.error('Error deleting subject:', error)
        toast.error('An error occurred while deleting the subject')
      }
    }
  }

  const handleBulkDeleteSubjects = async (subjects: Subject[]) => {
    const subjectCount = subjects.length
    const subjectNames = subjects.slice(0, 3).map(s => s.name).join(', ')
    const displayNames = subjectCount > 3 ? `${subjectNames} and ${subjectCount - 3} others` : subjectNames

    if (confirm(`Are you sure you want to delete ${subjectCount} subject(s)? (${displayNames})`)) {
      try {
        const ids = subjects.map(subject => subject.id)
        const response = await AuthClient.authenticatedFetch(`/api/subject`, {
          method: 'DELETE',
          body: JSON.stringify({ ids }),
        })

        if (response.ok) {
          toast.success(`Deleted ${subjectCount} subject(s)`)
          fetchSubjects(pagination.page, searchTerm)
        } else {
          console.error('Failed to delete subjects:', response.statusText)
          toast.error('Failed to delete subjects')
        }
      } catch (error) {
        console.error('Error deleting subjects:', error)
        toast.error('An error occurred while deleting the subjects')
      }
    }
  }

  const handleAddSubject = async (subject: SubjectInput) => {
    try {
      const response = await AuthClient.authenticatedFetch('/api/subject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subject),
      })

      if (response.ok) {
        fetchSubjects(pagination.page, searchTerm)
        toast.success('Subject added successfully!')
      } else {
        console.error('Failed to add subject:', response.statusText)
        toast.error('Failed to add subject')
      }
    } catch (error) {
      console.error('Error adding subject:', error)
      toast.error('An error occurred while adding the subject')
    }
  }

  const handleUpdateSubject = async (subject: { id: string, name: string, maxMarks: string, className: string, section: string }) => {
    try {
      const response = await AuthClient.authenticatedFetch(`/api/subject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subject),
      })

      if (response.ok) {
        fetchSubjects(pagination.page, searchTerm)
        toast.success('Subject updated successfully!')
      } else {
        console.error('Failed to update subject:', response.statusText)
        toast.error('Failed to update subject')
      }
    } catch (error) {
      console.error('Error updating subject:', error)
      toast.error('An error occurred while updating the subject')
    }
  }

  const handleBatchUploadComplete = () => {
    setTimeout(() => {
      window.location.href = `/dashboard/jobs/`
    }, 1500)
  }

  const columns: Column<Subject>[] = [
    { key: 'name', header: 'Subject Name' },
    { key: 'maxMarks', header: 'Max Marks' },
    { key: 'createdAt', header: 'Created', render: (value) => new Date(String(value)).toLocaleDateString() }
  ]

  const actions: Action<Subject>[] = [
    { icon: <Edit className="w-4 h-4" />, label: "Edit", onClick: handleEditSubject, variant: "ghost", showForRoles: ["TEACHER", "ADMIN"] },
    { icon: <Trash2 className="w-4 h-4" />, label: "Delete", onClick: handleDeleteSubject, variant: "ghost", showForRoles: ["TEACHER", "ADMIN"] }
  ]

  const bulkActions: BulkAction<Subject>[] = [
    { icon: <Trash2 className="w-4 h-4" />, label: "Delete Selected", onClick: handleBulkDeleteSubjects, variant: "destructive", showForRoles: ["TEACHER", "ADMIN"] }
  ]

  return (
    <AuthGuard allowedRoles={['TEACHER', 'ADMIN']} >
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Subjects</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage subjects and related information</p>
          </div>
        </div>

        {/* Stats / Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Total Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pagination.total}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">All registered subjects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                Create Subject
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NewEntityDialog
                title="Add Subject"
                description="Fill in the subject details"
                schema={SubjectInputSchema}
                fields={subjectDialogFields}
                onSubmit={handleAddSubject}
                buttonLabel="New Subject"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-600" />
                Batch Subject Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BatchUploadDialog
                title="Batch Upload Subjects"
                description="Upload a CSV file to add multiple subjects at once"
                type="SUBJECTS"
                processEndpoint={Env.apiHost + "/api/batch/subject/process-csv"}
                sampleCSV={{
                  headers: [...subjectCsvRequiredHeaders],
                  sampleData: [
                    ["Mathematics", "12", "A", "100"],
                    ["Science", "11", "B", "100"],
                    ["History", "10", "C", "50"]
                  ],
                  filename: "subject_upload_sample.csv"
                }}
                formatRequirements={{
                  title: "CSV Format Requirements",
                  requirements: [
                    "Headers: " + [...subjectCsvRequiredHeaders].join(", "),
                    "Each row should contain subject data",
                    "No empty rows or columns",
                    "Save as CSV format",
                    "NOTE: All the subject names will be converted to upper case"
                  ]
                }}
                onUploadComplete={handleBatchUploadComplete}
              />
            </CardContent>
          </Card>
        </div>

        {/* Subject List */}
        <ListViewPagination<Subject>
          title="Subjects List"
          description="Manage all subjects in the system"
          columns={columns}
          data={subjects}
          pagination={pagination}
          loading={loading}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onPageChange={handlePageChange}
          actions={actions}
          bulkActions={bulkActions}
          selectedItems={selectedSubjects}
          setSelectedItems={setSelectedSubjects}
          enableBulkSelect={true}
          searchPlaceholder="Search subjects by name..."
          emptyMessage="No subjects found. Add some subjects to get started."
        />

        {/* Edit Subject Dialog */}
        <EditEntityDialog
          title="Edit Subject"
          description="Update subject details"
          schema={SubjectInputSchema}
          fields={subjectDialogFields}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          initialValues={
            selectedSubject
              ? {
                name: selectedSubject.name,
                className: selectedSubject.class ?? "",
                section: selectedSubject.section ?? "",
                maxMarks: selectedSubject.maxMarks?.toString() ?? "0"
              }
              : null
          }
          onSubmit={(values) =>
            handleUpdateSubject({ id: selectedSubject?.id ?? "", ...values })
          }
        />
      </div>
    </AuthGuard>
  )
}
