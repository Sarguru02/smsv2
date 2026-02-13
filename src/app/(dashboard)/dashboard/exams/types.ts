import { DataItem } from "@/components/list-view-pagination";
import { z } from "zod";

const ExamSchema = z.object({
  id: z.string(),
  examName: z.string(),
  studentId: z.string(),
  marks: z.record(z.string(), z.string().transform(val => parseInt(val, 10))),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const ExamResponseSchema = z.object({
  data: z.array(ExamSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number()
  })
});

export const MarksResponseSchema = z.array(ExamSchema)


// 👇 inferred type from Zod schema
type ExamWODataItem = z.infer<typeof ExamSchema>;
export type ExamResponse = z.infer<typeof ExamResponseSchema>;
export type Exam = ExamWODataItem & DataItem;
export type Marks = z.infer<typeof MarksResponseSchema>;
