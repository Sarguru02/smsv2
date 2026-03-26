import { FieldConfig, StudentInput } from "@/lib/types"

export const studentDialogFields: FieldConfig<StudentInput>[] = [
  { key: "rollNo", label: "Roll Number", placeholder: "e.g. 101" },
  { key: "name", label: "Student Name" },
  { key: "className", label: "Class", placeholder: "e.g. 10" },
  { key: "section", label: "Section", placeholder: "e.g. A" },
]


export type Student = {
  id: string
  rollNo: string
  name: string
  class: string | null
  section: string | null
  createdAt: string
  updatedAt: string
}

export type StudentsResponse = {
  students: Student[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
