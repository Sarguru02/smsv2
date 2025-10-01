"use client"
import { StudentView } from "@/components/student-view";
import { AuthClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Student = {
  id: string
  rollNo: string
  name: string
  class: string | null
  section: string | null
  createdAt: string
  updatedAt: string
}

interface Mark {
  id: string
  examName: string
  marks: Record<string, number>
  createdAt: string
  updatedAt: string
}

export default function StudentPage({ params }: { params: { rollNo: string } }) {
  const [rollNo, setRollNo] = useState<string>("");
  const [student, setStudent] = useState<Student>();
  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRollNo(params.rollNo);
  }, [params]);


  useEffect(() => {
    const fetchStudentMarks = async () => {
      if (!rollNo) return;

      try {
        setLoading(true);

        // Fetch student data
        const studentRes = await AuthClient.authenticatedFetch(`/api/student/rollNo/${rollNo}`);
        if (!studentRes.ok) {
          throw new Error("Failed to fetch student data");
        }
        const st = await studentRes.json();
        setStudent(st);

        // Fetch student marks
        const marksRes = await AuthClient.authenticatedFetch(`/api/student/rollNo/${rollNo}/marks`);
        if (!marksRes.ok) {
          throw new Error("Failed to fetch marks data");
        }
        const m = await marksRes.json();
        setMarks(m);
      } catch (error) {
        console.error("Error fetching student data:", error);
        toast.error("Failed to load student data");
      } finally {
        setLoading(false);
      }
    }
    fetchStudentMarks();
  }, [rollNo]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading student data...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          Student not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <StudentView student={student} marks={marks} />
    </div>
  );
}
