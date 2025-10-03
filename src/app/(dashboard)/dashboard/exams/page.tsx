"use client"

import { useState, useEffect } from "react";
import { ListViewPagination, Column, Action, DataItem } from "@/components/list-view-pagination";
import { AuthClient } from "@/lib/auth-client";
import { useAuth } from "@/components/auth-provider";
import { toast } from "sonner";
import { Eye, Edit, Trash2, Book, BookPlus, Upload } from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BatchUploadDialog from "@/components/dialogs/batch-upload-dialog";
import { Env } from "@/lib/EnvVars";

interface Exam extends DataItem {
  id: string;
  examName: string;
  studentId: string;
  marks: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

interface ExamResponse {
  data: Exam[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function ExamsPage() {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const fetchExams = async (page: number = 1, search: string = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search })
      });

      const response = await AuthClient.authenticatedFetch(`/api/exams?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch exams");
      }

      const result: ExamResponse = await response.json();
      setExams(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Error fetching exams:", error);
      toast.error("Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchExams(1, term);
  };

  const handlePageChange = (page: number) => {
    fetchExams(page, searchTerm);
  };

  const calculateTotalMarks = (marks: Record<string, number>) => {
    return Object.values(marks).reduce((sum, mark) => sum + mark, 0);
  };

  const calculatePercentage = (marks: Record<string, number>) => {
    const total = calculateTotalMarks(marks);
    const maxMarks = Object.keys(marks).length * 100;
    return maxMarks > 0 ? ((total / maxMarks) * 100).toFixed(2) : "0";
  };

  const columns: Column<Exam>[] = [
    {
      key: "examName",
      header: "Exam Name",
    },
    ...(user?.role !== 'STUDENT' ? [{
      key: "studentId",
      header: "Student Roll No",
    }] : []),
    {
      key: "marks",
      header: "Total Marks",
      render: (_, item) => {
        const total = calculateTotalMarks(item.marks);
        const maxMarks = Object.keys(item.marks).length * 100;
        return `${total}/${maxMarks}`;
      }
    },
    {
      key: "percentage",
      header: "Percentage",
      render: (_, item) => `${calculatePercentage(item.marks)}%`
    },
    {
      key: "subjects",
      header: "Subjects",
      render: (_, item) => Object.keys(item.marks).join(", ")
    },
    {
      key: "createdAt",
      header: "Date",
      render: (value) => new Date(value as string).toLocaleDateString()
    }
  ];

  const actions: Action<Exam>[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      label: "View Details",
      onClick: (exam: Exam) => {
        // Navigate to exam details or show modal
        toast.info(`Viewing details for ${exam.examName}`);
      },
      variant: "ghost"
    },
    ...(user?.role === 'TEACHER' || user?.role === 'ADMIN' ? [
      {
        icon: <Edit className="w-4 h-4" />,
        label: "Edit Marks",
        onClick: (exam: Exam) => {
          toast.info(`Editing marks for ${exam.examName}`);
        },
        variant: "ghost" as const,
        showForRoles: ['TEACHER', 'ADMIN']
      },
      {
        icon: <Trash2 className="w-4 h-4" />,
        label: "Delete Exam",
        onClick: (exam: Exam) => {
          toast.info(`Delete ${exam.examName}`);
        },
        variant: "destructive" as const,
        showForRoles: ['TEACHER', 'ADMIN']
      }
    ] : [])
  ];

  const headers = ["ROLL NO", "SUB 1", "SUB 2", "SUB 3"];

  const handleBatchUploadComplete = () => {
    setTimeout(() => {
      window.location.href = `/dashboard/jobs/`
    }, 1500)
  }

  const title = user?.role === 'STUDENT' ? "My Exams" : "All Exams";
  const description = user?.role === 'STUDENT'
    ? "View your examination results and performance"
    : "Manage and view all student examinations";

  return (
    <AuthGuard allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']} >
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Exams</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage Exam Information</p>
          </div>
        </div>

        {/* Stats / Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Book className="w-5 h-5 text-blue-600" />
                Total Exams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pagination.total}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Exams</p>
            </CardContent>
          </Card>

          {user?.role === 'TEACHER' && <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookPlus className="w-5 h-5 text-green-600" />
                Add marks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/*<NewEntityDialog
              title="Add Student"
              description="Fill in the student details"
              schema={StudentInputSchema}
              fields={studentDialogFields}
              onSubmit={handleAddStudent}
              buttonLabel="New Student"
            />*/}
            </CardContent>
          </Card>}

          {user?.role === "TEACHER" && <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-600" />
                Batch Marks Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BatchUploadDialog
                title="Batch Upload Marks"
                description="Upload a CSV file to add multiple marks at once"
                type="MARKS"
                processEndpoint={Env.apiHost + "/api/batch/student/process-csv"}
                sampleCSV={{
                  headers, // to replace this with dynamic content from db.
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
                    "Headers: " + [...headers].join(", "),
                    "Each row should contain student data",
                    "No empty rows or columns",
                    "Save as CSV format"
                  ]
                }}
                onUploadComplete={handleBatchUploadComplete}
              />
            </CardContent>
          </Card>}
        </div>

        {/* Exam List */}
        <ListViewPagination
          title={title}
          description={description}
          columns={columns}
          data={exams}
          pagination={pagination}
          loading={loading}
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          onPageChange={handlePageChange}
          actions={actions}
          searchPlaceholder="Search exams..."
          emptyMessage="No exams found"
        />
        </div>
    </AuthGuard>
  );
}
