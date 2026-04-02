import { FieldConfig, SubjectInput } from "@/lib/types"
import { z } from "zod";

export const subjectDialogFields: FieldConfig<SubjectInput>[] = [
  { key: "name", label: "Subject Name" }, // fixed label too
  { key: "className", label: "Class", placeholder: "e.g. 10", inputType: "text" },
  { key: "section", label: "Section", placeholder: "e.g. A", inputType: "text" },
  { key: "maxMarks", label: "Maximum Marks", placeholder: "e.g. 100", inputType: "number" }
]


export const SubjectSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  name: z.string(),
  section: z.string(),
  class: z.string(),
  maxMarks: z.string().transform(val => parseInt(val, 10)),
})

export type Subject = z.infer<typeof SubjectSchema>

export const SubjectResponseSchema = z.object({
  subjects: z.array(SubjectSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number()
  })
});

export type SubjectsResponse = z.infer<typeof SubjectResponseSchema>
