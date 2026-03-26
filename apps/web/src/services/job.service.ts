import { prisma } from "@/lib/db/prisma";

export async function updateProcessedRowsWithIds(jobId: string, increment: number, rowIds: string[]) {
  return prisma.$transaction(async (tx) => {
    const current = await tx.job.findUnique({
      where: { id: jobId },
      select: { processedRowIds: true, processedRows: true, totalRows: true }
    });

    if (!current) throw new Error("Job not found");

    const updated = await tx.job.update({
      where: { id: jobId },
      data: {
        processedRows: { increment },
        processedRowIds: {
          set: [...(current.processedRowIds as string[] ?? []), ...rowIds]
        },
        updatedAt: new Date()
      }
    });

    if (updated.processedRows === updated.totalRows) {
      await tx.job.update({
        where: { id: jobId },
        data: {
          status: "completed",
          updatedAt: new Date()
        }
      });
    }
  })
}
