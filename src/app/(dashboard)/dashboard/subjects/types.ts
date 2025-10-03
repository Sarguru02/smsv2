import { FieldConfig, SubjectInput } from "@/lib/types"

export const subjectDialogFields: FieldConfig<SubjectInput>[] = [
  { key: "name", label: "Subject Name" }, // fixed label too
  { key: "className", label: "Class", placeholder: "e.g. 10", inputType: "text" },
  { key: "section", label: "Section", placeholder: "e.g. A", inputType: "text" },
  { key: "maxMarks", label: "Maximum Marks", placeholder: "e.g. 100", inputType: "number" }
]


export type Subject = {
  id: string
  name: string
  class: string
  section: string
  maxMarks: string
  createdAt: string
  updatedAt: string
}

export type SubjectsResponse = {
  subjects: Subject[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
