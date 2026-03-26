"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthClient } from "@/lib/auth-client";
import { Student, StudentView } from "../student-view";
import { Marks, MarksResponseSchema } from "@/app/(dashboard)/dashboard/exams/types";

export default function StudentPageClient({ rollNo }: { rollNo: string }) {
  const [student, setStudent] = useState<Student>();
  const [marks, setMarks] = useState<Marks>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentMarks = async () => {
      if (!rollNo) return;

      try {
        setLoading(true);

        // Fetch student data
        const studentRes = await AuthClient.authenticatedFetch(`/api/student/rollNo/${rollNo}`);
        if (!studentRes.ok) throw new Error("Failed to fetch student data");
        const st = await studentRes.json();
        setStudent(st);

        // Fetch marks
        const marksRes = await AuthClient.authenticatedFetch(`/api/student/rollNo/${rollNo}/marks`);
        if (!marksRes.ok) throw new Error("Failed to fetch marks data");
        const m = MarksResponseSchema.parse(await marksRes.json());
        setMarks(m);
      } catch (error) {
        console.error("Error fetching student data:", error);
        toast.error("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentMarks();
  }, [rollNo]);

  if (loading) {
    return <div>Loading student data...</div>;
  }

  if (!student) {
    return <div>Student not found</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <StudentView student={student} marks={marks} />
    </div>
  );
}
