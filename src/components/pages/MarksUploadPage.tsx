import { useEffect, useState } from "react";
import BatchUploadDialog from "../dialogs/batch-upload-dialog";
import { Env } from "@/lib/EnvVars";
import { Input } from "../ui/input";
import { AuthClient } from "@/lib/auth-client";

export default function MarksUploadPage() {
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);

  // fetch subjects when class + section are chosen
  useEffect(() => {
    if (!className || !section) return;

    const fetchSubjects = async () => {
      const res = await AuthClient.authenticatedFetch(`/api/subject?class=${className}&section=${section}`);
      const subjects = await res.json();

      // Base headers
      setHeaders(["ROLL NO", "EXAM", ...subjects.subjects]);
    };

    fetchSubjects();
  }, [className, section]);

  return (
    <div>
      {/* Step 1: select class + section */}
      <div className="mb-4">
        <label>Class</label>
        <Input value={className} onChange={(e) => setClassName(e.target.value)} />
        <label>Section</label>
        <Input value={section} onChange={(e) => setSection(e.target.value)} />
      </div>

      {/* Step 2: enable dialog only when headers ready */}
      {headers.length > 0 && (
        <BatchUploadDialog
          title="Batch Upload Marks"
          description="Upload a CSV file to add multiple marks at once"
          type="MARKS"
          processEndpoint={Env.apiHost + "/api/batch/mark/process-csv"}
          sampleCSV={{
            headers,
            sampleData: [
              ["2023001", "Midterm", "78", "85", "90"], // matches headers
              ["2023002", "Midterm", "80", "89", "92"],
            ],
            filename: "mark_upload_sample.csv"
          }}
          formatRequirements={{
            title: "CSV Format Requirements",
            requirements: [
              "Headers: " + headers.join(", "),
              "Each row should contain roll number, exam, and marks for subjects",
              "No empty rows or columns",
              "Save as CSV format"
            ]
          }}
          onUploadComplete={() => console.log("Upload complete")}
        />
      )}
    </div>
  );
}
