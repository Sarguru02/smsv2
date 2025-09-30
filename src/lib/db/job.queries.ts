import { BatchUploadType } from "../types"
import { prisma } from "./prisma"

async function createJob(jobId: string, fileUrl: string, userID: string, fileName: string, type: BatchUploadType) {
  return prisma.job.create({
    data: {
      id: jobId,
      fileUrl,
      fileName,
      userID,
      type,
    }
  })
}

async function getJobById(jobId: string) {
  return prisma.job.findUnique({
    where: { id: jobId }
  })
}

async function updateTotalRows(jobId: string, incTotalRows: number) {
  return prisma.job.update({
    where: { id: jobId },
    data: {
      totalRows: {
        increment: incTotalRows
      }
    }
  })
}

async function updateStatusWithError(jobId: string, status: string, errorStatus: object) {
  return prisma.job.update({
    where: { id: jobId },
    data: {
      status,
      errorStatus
    }
  })
}

export const JobQueries = {
  createJob,
  getJobById,
  updateTotalRows,
  updateStatusWithError
}
