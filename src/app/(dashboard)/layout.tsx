"use client"

import { useState } from 'react';
import { AuthGuard } from '@/components/auth-guard';
import { AuthProvider } from '@/components/auth-provider';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard-header';
import BatchUploadDialog from '@/components/dialogs/batch-upload-dialog';
import { UploadIcon } from 'lucide-react';
import { type NavigationItem } from '@/lib/navigation';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [studentsDialogOpen, setStudentsDialogOpen] = useState(false);
  const [marksDialogOpen, setMarksDialogOpen] = useState(false);
  const router = useRouter();

  const handleBatchUploadComplete = (jobId: string) => {
    router.push(`/dashboard/jobs/${jobId}`);
  };

  const actionItems: NavigationItem[] = [
    {
      label: 'Batch Student Upload',
      icon: UploadIcon,
      roles: ['TEACHER', 'ADMIN'],
      description: 'Batch upload student details',
      type: 'action',
      action: () => setStudentsDialogOpen(true)
    },
    {
      label: 'Batch Marks Upload',
      icon: UploadIcon,
      roles: ['TEACHER', 'ADMIN'],
      description: 'Batch upload student marks',
      type: 'action',
      action: () => setMarksDialogOpen(true)
    }
  ];

  return (
    <AuthProvider>
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <DashboardSidebar 
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
            actionItems={actionItems}
          />
          
          <div className="lg:pl-64">
            <DashboardHeader setIsMobileOpen={setIsMobileOpen} />
            <main className="p-4 lg:p-6">
              {children}
            </main>
          </div>
          
          {/* Batch Upload Dialogs */}
          <BatchUploadDialog
            title="Batch Upload Students"
            description="Upload a CSV file to add multiple students at once"
            type="STUDENT_UPLOAD"
            processEndpoint="/api/batch/student/process-csv"
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
            open={studentsDialogOpen}
            onOpenChange={setStudentsDialogOpen}
            onUploadComplete={handleBatchUploadComplete}
          />
          
          <BatchUploadDialog
            title="Batch Upload Marks"
            description="Upload a CSV file to add multiple student marks at once"
            type="MARKS_UPLOAD"
            processEndpoint="/api/batch/marks/process-csv"
            sampleCSV={{
              headers: ["ROLL NO", "SUBJECT", "MARKS", "MAX_MARKS"],
              sampleData: [
                ["2023001", "Mathematics", "85", "100"],
                ["2023002", "Physics", "92", "100"],
                ["2023003", "Chemistry", "78", "100"]
              ],
              filename: "marks_upload_sample.csv"
            }}
            formatRequirements={{
              title: "CSV Format Requirements",
              requirements: [
                "Headers: ROLL NO, SUBJECT, MARKS, MAX_MARKS",
                "Each row should contain mark data",
                "Marks should be numeric values",
                "No empty rows or columns",
                "Save as CSV format"
              ]
            }}
            open={marksDialogOpen}
            onOpenChange={setMarksDialogOpen}
            onUploadComplete={handleBatchUploadComplete}
          />
        </div>
      </AuthGuard>
    </AuthProvider>
  );
}