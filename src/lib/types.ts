import { z } from "zod";

export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

export const TokenPayloadSchema = z.object({
  userId: z.string(),
  role: z.custom<UserRole>()
});

export type TokenPayload = z.infer<typeof TokenPayloadSchema>;
