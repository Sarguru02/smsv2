"use client"

import { useEffect, useState } from "react"
import { ListViewPagination, Column, Action, BulkAction } from "@/components/list-view-pagination"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthClient } from "@/lib/auth-client"
import { Download, Trash2, FileText, Clock, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"

type Job = {
  id: string
  userID: string
  fileUrl: string
  fileName: string
  type: string
  totalRows: number
  processedRows: number
  processedRowIds: string[]
  status: string
  errorStatus: object
  fileDeleted: boolean
  createdAt: string
  updatedAt: string
}

type JobsResponse = {
  jobs: Job[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set())

  const fetchJobs = async (page: number = 1, search: string = "") => {
    try {
      setLoading(true)
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : ""
      const response = await AuthClient.authenticatedFetch(`/api/jobs?page=${page}&limit=10${searchParam}`)

      if (response.ok) {
        const data: JobsResponse = await response.json()
        setJobs(data.jobs)
        setPagination(data.pagination)
      } else {
        console.error('Failed to fetch jobs:', response.statusText)
        toast.error('Failed to fetch jobs')
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
      toast.error('An error occurred while fetching jobs')
    } finally {
      setLoading(false)
    }
  }

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch jobs when debounced search term changes
  useEffect(() => {
    fetchJobs(1, debouncedSearchTerm)
  }, [debouncedSearchTerm])

  // Initial load
  useEffect(() => {
    fetchJobs(1, "")
  }, [])

  const handlePageChange = (newPage: number) => {
    fetchJobs(newPage, debouncedSearchTerm)
  }

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleDownloadFile = async (job: Job) => {
    if (job.fileDeleted) {
      toast.error('File has been deleted and is no longer available for download')
      return
    }
    
    try {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a')
      link.href = job.fileUrl
      link.download = getCleanFileName(job.fileName)
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success(`Downloaded ${getCleanFileName(job.fileName)}`)
    } catch (error) {
      console.error('Error downloading file:', error)
      toast.error('Failed to download file')
    }
  }

  const handleDeleteFile = async (job: Job) => {
    if (job.fileDeleted) {
      toast.info('File has already been deleted')
      return
    }
    
    if (confirm(`Are you sure you want to delete the file "${job.fileName}"? This will remove the file from storage but keep the job record.`)) {
      try {
        const response = await AuthClient.authenticatedFetch('/api/jobs', {
          method: 'DELETE',
          body: JSON.stringify({
            jobIds: [job.id],
          }),
        })

        if (response.ok) {
          toast.success('File deleted successfully!')
          fetchJobs(pagination.page, searchTerm)
        } else {
          console.error('Failed to delete file:', response.statusText)
          if (response.status === 401) {
            window.location.href = '/login'
          } else if (response.status === 403) {
            toast.error('You do not have permission to delete files')
          } else {
            toast.error('Failed to delete file')
          }
        }
      } catch (error) {
        console.error('Error deleting file:', error)
        toast.error('An error occurred while deleting the file')
      }
    }
  }

  const handleBulkDeleteFiles = async (jobs: Job[]) => {
    const jobsToDelete = jobs.filter(job => !job.fileDeleted)
    const jobCount = jobsToDelete.length
    
    if (jobCount === 0) {
      toast.info('All selected files have already been deleted')
      return
    }
    
    const jobNames = jobsToDelete.slice(0, 3).map(j => j.fileName).join(', ')
    const displayNames = jobCount > 3 ? `${jobNames} and ${jobCount - 3} others` : jobNames
    
    if (confirm(`Are you sure you want to delete ${jobCount} file${jobCount > 1 ? 's' : ''}? This will remove the files from storage but keep the job records. (${displayNames})`)) {
      try {
        const jobIds = jobs.map(job => job.id)
        const response = await AuthClient.authenticatedFetch('/api/jobs', {
          method: 'DELETE',
          body: JSON.stringify({
            jobIds,
          }),
        })

        if (response.ok) {
          const result = await response.json()
          toast.success(`Successfully deleted ${result.filesDeleted} file${result.filesDeleted > 1 ? 's' : ''}`)
          fetchJobs(pagination.page, searchTerm)
        } else {
          console.error('Failed to delete files:', response.statusText)
          if (response.status === 401) {
            window.location.href = '/login'
          } else if (response.status === 403) {
            toast.error('You do not have permission to delete files')
          } else {
            toast.error('Failed to delete files')
          }
        }
      } catch (error) {
        console.error('Error deleting files:', error)
        toast.error('An error occurred while deleting the files')
      }
    }
  }

  const getStatusBadge = (status: string, fileDeleted: boolean) => {
    if (fileDeleted) {
      return <Badge variant="outline" className="bg-gray-100 text-gray-600"><XCircle className="w-3 h-3 mr-1" />File Deleted</Badge>
    }
    
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>
      case 'processing':
        return <Badge variant="default" className="bg-blue-600"><Clock className="w-3 h-3 mr-1" />Processing</Badge>
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>
      case 'pending':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }
  
  const getCleanFileName = (fileName: string) => {
    // Remove type and job id prefix (e.g., "STUDENT_UPLOAD/jobid/filename.csv" -> "filename.csv")
    const parts = fileName.split('/')
    return parts[parts.length - 1] || fileName
  }
  
  const getTruncatedJobId = (jobId: string) => {
    return jobId.substring(0, 5)
  }

  const columns: Column<Job>[] = [
    {
      key: 'id',
      header: 'Job ID',
      render: (value) => (
        <span className="font-mono text-sm">{getTruncatedJobId(String(value))}</span>
      )
    },
    {
      key: 'fileName',
      header: 'File Name',
      render: (value) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{getCleanFileName(String(value))}</span>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      render: (value) => <Badge variant="outline">{String(value)}</Badge>
    },
    {
      key: 'status',
      header: 'Status',
      render: (value, job) => getStatusBadge(String(value), job.fileDeleted)
    },
    {
      key: 'processedRows',
      header: 'Processed',
      render: (value, job) => `${value}/${job.totalRows}`
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (value) => new Date(String(value)).toLocaleDateString()
    }
  ]

  const actions: Action<Job>[] = [
    {
      icon: <Download className="w-4 h-4" />,
      label: "Download File",
      onClick: handleDownloadFile,
      variant: "ghost"
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      label: "Delete File",
      onClick: handleDeleteFile,
      variant: "ghost",
      showForRoles: ["TEACHER", "ADMIN"]
    }
  ]

  const bulkActions: BulkAction<Job>[] = [
    {
      icon: <Trash2 className="w-4 h-4" />,
      label: "Delete Files",
      onClick: handleBulkDeleteFiles,
      variant: "destructive",
      showForRoles: ["TEACHER", "ADMIN"]
    }
  ]

  return (
    <AuthGuard allowedRoles={['TEACHER', 'ADMIN']}>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Jobs</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage batch upload jobs and file processing</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Total Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pagination.total}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">All jobs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobs.filter(job => job.status === 'completed').length}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Finished jobs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobs.filter(job => job.status === 'processing').length}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobs.filter(job => job.status === 'failed').length}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Failed jobs</p>
            </CardContent>
          </Card>
        </div>

        {/* Jobs List */}
        <ListViewPagination<Job>
          title="Jobs List"
          description="View and manage all batch upload jobs"
          columns={columns}
          data={jobs}
          pagination={pagination}
          loading={loading}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onPageChange={handlePageChange}
          actions={actions}
          bulkActions={bulkActions}
          selectedItems={selectedJobs}
          setSelectedItems={setSelectedJobs}
          enableBulkSelect={true}
          searchPlaceholder="Search jobs by filename, type, or status..."
          emptyMessage="No jobs found. Upload files to see batch processing jobs here."
        />
      </div>
    </AuthGuard>
  )
}
