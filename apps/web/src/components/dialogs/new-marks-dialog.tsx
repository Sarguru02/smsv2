"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { AuthClient } from "@/lib/auth-client"
import { Subject, SubjectResponseSchema } from "@/app/(dashboard)/dashboard/subjects/types"


export default function NewMarksDialog() {
  const [open, setOpen] = useState(false)
  const [className, setClassName] = useState("")
  const [section, setSection] = useState("")
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loadingSubjects, setLoadingSubjects] = useState(false)

  // student info
  const [rollNo, setRollNo] = useState("")
  const [exam, setExam] = useState("")
  const [marks, setMarks] = useState<Record<string, string>>({})

  // Fetch subjects once class+section are filled
  useEffect(() => {
    const timeout = setTimeout(() => {
      const getSubjects = async () => {
        try {
          if (className && section) {
            setLoadingSubjects(true)
            const response = await AuthClient.authenticatedFetch(
              `/api/subject?class=${className}&section=${section}`
            )
            if (!response.ok) throw new Error("Failed to fetch subjects")

            const result  = SubjectResponseSchema.parse(await response.json());
            setSubjects(result.subjects)
            setMarks(result.subjects.reduce((acc, s) => ({ ...acc, [s.name]: "" }), {}))
          } else {
            setSubjects([])
            setMarks({})
          }
        } catch (e) {
          console.error("Error fetching subjects:", e)
          toast.error("Failed to load subjects")
        } finally {
          setLoadingSubjects(false)
        }
      }
      getSubjects()
    }, 300) // <-- debounce delay (ms)

    return () => clearTimeout(timeout)
  }, [className, section])

  const handleSubmit = async () => {
    if (!rollNo || !exam) {
      toast.error("Please fill all fields")
      return
    }

    if (subjects.length === 0) {
      toast.error("No subjects for class and section! Configure subjects first");
      return
    }

    try {
      const res = await AuthClient.authenticatedFetch("/api/marks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rollNo,
          examName: exam,
          marks,
        }),
      })

      if (!res.ok) throw new Error("Upload failed")
      toast.success("Marks uploaded successfully")
      setOpen(false)
      setRollNo("")
      setExam("")
      setClassName("")
      setSection("")
      setSubjects([])
      setMarks({})
    } catch (err) {
      console.error("Error occured: ", err )
      toast.error("Failed to upload marks")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="sm">Add Marks</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Marks for a Student</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Step 1: Class + Section */}
          <div className="grid gap-2">
            <Label>Class</Label>
            <Input
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g., 10"
            />
          </div>
          <div className="grid gap-2">
            <Label>Section</Label>
            <Input
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="e.g., A"
            />
          </div>

          {/* Step 2: Roll No + Exam */}
          <div className="grid gap-2">
            <Label>Roll No</Label>
            <Input
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              placeholder="e.g., 2023001"
            />
          </div>
          <div className="grid gap-2">
            <Label>Exam</Label>
            <Input
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              placeholder="e.g., Midterm"
            />
          </div>

          {/* Step 3: Subjects */}
          {loadingSubjects ? (
            <p className="text-sm text-gray-500">Loading subjects...</p>
          ) : subjects.length > 0 ? (
            <div className="space-y-3">
              <p className="font-medium text-sm">Enter Marks:</p>
              {subjects.map((subject) => (
                <div key={subject.name} className="grid gap-2">
                  <Label>{subject.name}</Label>
                  <Input
                    type="number"
                    value={marks[subject.name] || ""}
                    onChange={(e) =>
                      setMarks((prev) => ({
                        ...prev,
                        [subject.name]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            className &&
            section && <p className="text-sm text-gray-500">No subjects found for this class/section</p>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Submit Marks</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
