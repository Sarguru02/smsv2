import { z } from "zod";

export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

export const TokenPayloadSchema = z.object({
  userId: z.string().trim(),
  role: z.custom<UserRole>()
});

export type TokenPayload = z.infer<typeof TokenPayloadSchema>;

export const StudentInputSchema = z.object({
  rollNo: z.string().trim().min(1),
  name: z.string().trim().min(1),
  className: z.string().trim().min(1),
  section: z.string().trim().min(1)
})

export type StudentInput = z.infer<typeof StudentInputSchema>

export const MarkInputSchema = z.object({
  rollNo: z.string().trim().min(1),
  examName: z.string().trim().min(1),
  marks: z.record(z.string().trim().min(1), z.string().trim())
})

export type MarkInput = z.infer<typeof MarkInputSchema>

export type Row = Record<string, string>;

export const csvProcessSchema = z.object({
  fileUrl: z.string().trim().min(1),
  jobId: z.string().trim().min(1)
})

export const SubjectInputSchema = z.object({
  className: z.string().trim().min(1, "Class is required"),
  section: z.string().trim().min(1, "Section is required").transform(val => val.toUpperCase()),
  name: z.string().trim().min(1, "Name is required").transform(val => val.toUpperCase()),
  maxMarks: z.string()
    .trim()
    .regex(/^\d+$/, "Max Marks must be a number")
})

export type SubjectInput = z.infer<typeof SubjectInputSchema>

export const studentCsvRequiredHeaders = ["ROLL NO", "NAME", "CLASS", "SECTION"] as const

export const subjectCsvRequiredHeaders = ["NAME", "CLASS", "SECTION", "MAXIMUM MARKS"] as const

export type BatchUploadType = "STUDENT_DETAILS" | "MARKS" | "SUBJECTS"

export type FieldConfig<T> = {
  key: keyof T
  label: string
  placeholder?: string
  inputType?: string
}
