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
