"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"

type Student = {
  id: string
  rollNo: string
  name: string
  class: string | null
  section: string | null
}

type HandleEditStudent = (args: {
  id: string
  rollNo: string
  name: string
  className: string
  section: string
}) => void

type Props = {
  student: Student | null
  open: boolean
  onOpenChange: (open: boolean) => void
  handleEditStudent: HandleEditStudent
}

export default function EditStudentDialog({ 
  student, 
  open, 
  onOpenChange, 
  handleEditStudent 
}: Props) {
  const [rollNo, setRollNo] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [className, setClassName] = useState<string>("")
  const [section, setSection] = useState<string>("")

  useEffect(() => {
    if (student) {
      setRollNo(student.rollNo)
      setName(student.name)
      setClassName(student.class || "")
      setSection(student.section || "")
    }
  }, [student])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!student || !rollNo || !name || !className || !section) return
    
    handleEditStudent({
      id: student.id,
      rollNo,
      name,
      className,
      section
    })
    onOpenChange(false)
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update student information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rollNo">Roll Number</Label>
              <Input
                id="rollNo"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="Enter roll number"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Student Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter student name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="className">Class</Label>
              <Input
                id="className"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Enter class name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="section">Section</Label>
              <Input
                id="section"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder="Enter section"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Update Student</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}