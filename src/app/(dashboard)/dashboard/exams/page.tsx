"use client"

import { useState, useEffect } from "react";
import { ListViewPagination, Column, Action } from "@/components/list-view-pagination";
import { AuthClient } from "@/lib/auth-client";
import { useAuth } from "@/components/auth-provider";
import { toast } from "sonner";
import { Eye, Edit, Trash2, Book, BookPlus, Upload } from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MarksUploadPage from "@/components/pages/MarksUploadPage";
import NewMarksDialog from "@/components/dialogs/new-marks-dialog";
import { Exam, ExamResponseSchema } from "./types";
import ClassSectionDialog from "@/components/dialogs/class-section-dialog";
import { useSearchParams } from "next/navigation";
import { Student } from "../students/types";


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
  const [student, setStudent] = useState<Student | null>(null);

  const searchParams = useSearchParams();
  const className = searchParams.get('class');
  const section = searchParams.get('section');

  const updateQueryParams = () => {
    const params = new URLSearchParams(searchParams);

    if(student && student.class){
      params.set("class", student.class);
    } else{
      params.delete("class");
    }

    if(student && student.section) {
      params.set("section", student.section);
    } else {
      params.delete("section");
    }
  }

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

      const result = ExamResponseSchema.parse(await response.json());
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
    if (!className || !section) return;
    fetchExams();
  }, [className, section]);

  useEffect(() => {
    if (user?.role!=="STUDENT") return;
    fetchStudent();
  }, [])

  async function fetchStudent(){
    try{
      setLoading(true);
      const response = await AuthClient.authenticatedFetch(`/api/student/rollNo/${user?.username}`);
      if(!response.ok){
        throw new Error("Failed to fetch students");
      }
      const result: Student = await response.json();
      setStudent(result);
    } catch(error){
      console.error("Error fetching the student:", error);
      toast.error("Failed to load student");
    } finally{
      setLoading(false);
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchExams(1, term);
  };

  const handlePageChange = (page: number) => {
    fetchExams(page, searchTerm);
  };

  const handleViewExam = (exam: Exam) => {
    // Navigate to exam details or show modal
    toast.info(`Viewing details for ${exam.examName}`);
  }

  const handleEditMarks = (exam: Exam) => {
    toast.info(`Editing marks for ${exam.examName}`);
  }

  const handleDeleteMarks = (exam: Exam) => {
    toast.info(`Delete ${exam.examName}`);
  }

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
      onClick: handleViewExam,
      variant: "ghost"
    },
    ...(user?.role === 'TEACHER' || user?.role === 'ADMIN' ? [
      {
        icon: <Edit className="w-4 h-4" />,
        label: "Edit Marks",
        onClick: handleEditMarks,
        variant: "ghost" as const,
        showForRoles: ['TEACHER', 'ADMIN']
      },
      {
        icon: <Trash2 className="w-4 h-4" />,
        label: "Delete Exam",
        onClick: handleDeleteMarks,
        variant: "ghost" as const,
        showForRoles: ['TEACHER', 'ADMIN']
      }
    ] : [])
  ];

  const title = user?.role === 'STUDENT' ? "My Exams" : "All Exams";
  const description = user?.role === 'STUDENT'
    ? "View your examination results and performance"
    : "Manage and view all student examinations";
  if (user?.role !== "STUDENT") {
    return (
      <AuthGuard allowedRoles={['TEACHER', 'ADMIN']} >
        <ClassSectionDialog />
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
                <NewMarksDialog />
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
                <MarksUploadPage />
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
  } else {
    updateQueryParams();
    return (
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
    )
  }
}
