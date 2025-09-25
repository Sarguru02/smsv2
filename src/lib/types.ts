import { z } from "zod";

export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

export const TokenPayloadSchema = z.object({
  userId: z.string(),
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
  rollNo: z.string().min(1),
  examName: z.string().min(1),
  marks: z.record(z.string(), z.coerce.number())
})

export type MarkInput = z.infer<typeof MarkInputSchema>

export type Row = Record<string, string>;

export const csvProcessSchema = z.object({
  fileUrl: z.string().min(1),
  jobId: z.string().min(1)
})
