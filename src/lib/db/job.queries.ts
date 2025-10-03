import { Prisma } from "@/generated/prisma"
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

async function getAllJobs(page: number = 1, limit: number = 10, search?: string) {
  const skip = (page - 1) * limit

  const where = search ? {
    OR: [
      { fileName: { contains: search, mode: 'insensitive' as const } },
      { type: { contains: search, mode: 'insensitive' as const } },
      { status: { contains: search, mode: 'insensitive' as const } }
    ]
  } : {}

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.job.count({ where })
  ])

  return {
    jobs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}


async function getJobsByUser(page: number = 1, limit: number = 10, userID: string, search?: string) {
  const skip = (page - 1) * limit

  const where: Prisma.JobWhereInput = { userID };
  if (search) {
    where.OR = [
      { fileName: { contains: search, mode: 'insensitive' as const } },
      { type: { contains: search, mode: 'insensitive' as const } },
      { status: { contains: search, mode: 'insensitive' as const } }
    ]
  }
  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.job.count({ where })
  ])

  return {
    jobs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

async function deleteJob(jobId: string) {
  return prisma.job.delete({
    where: { id: jobId }
  })
}

async function markFileAsDeleted(jobId: string) {
  return prisma.job.update({
    where: { id: jobId },
    data: {
      fileDeleted: true
    }
  })
}

export const JobQueries = {
  createJob,
  getJobById,
  updateTotalRows,
  updateStatusWithError,
  getAllJobs,
  getJobsByUser,
  deleteJob,
  markFileAsDeleted
}
