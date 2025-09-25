import { prisma } from "./prisma"

async function createJob(jobId: string, fileUrl: string) {
  return prisma.job.create({
    data: {
      id: jobId,
      fileUrl: fileUrl
    }
  })
}

async function getJobById(jobId: string){
  return prisma.job.findUnique({
    where: { id : jobId }
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

async function updateProcessedRows(jobId: string, incProcessedRows: number) {
  return prisma.job.update({
    where: { id: jobId },
    data: {
      processedRows: {
        increment: incProcessedRows
      }
    }
  })
}

async function updateStatus(jobId: string, status: string) {
  return prisma.job.update({
    where: { id: jobId },
    data: {
      status
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
  updateProcessedRows,
  updateStatus,
  updateStatusWithError
}
