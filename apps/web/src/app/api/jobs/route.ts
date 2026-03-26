import { withAuth } from "@/lib/auth";
import { JobQueries } from "@/lib/db/job.queries";
import { NextResponse } from "next/server";
import { del } from "@vercel/blob";

export const GET = withAuth(['TEACHER'], async (req, user) => {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || undefined;

    const result = await JobQueries.getJobsByUser(page, limit, user?.id as string, search);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
});

export const DELETE = withAuth(['TEACHER', 'ADMIN'], async (req) => {
  try {
    const { jobIds } = await req.json();

    if (!Array.isArray(jobIds) || jobIds.length === 0) {
      return NextResponse.json({ error: 'Job IDs are required' }, { status: 400 });
    }

    // Get job details before deletion to access file URLs
    const jobs = await Promise.all(
      jobIds.map(id => JobQueries.getJobById(id))
    );

    // Only delete files that haven't been deleted already
    const filesToDelete = jobs.filter(job => job !== null && !job!.fileDeleted);
    
    // Delete files from Vercel blob storage
    if (filesToDelete.length > 0) {
      const deletionPromises = filesToDelete.map(job => del(job!.fileUrl));
      await Promise.all(deletionPromises);
    }

    // Mark files as deleted in database (don't delete the job records)
    await Promise.all(
      jobIds.map(id => JobQueries.markFileAsDeleted(id))
    );

    return NextResponse.json({ 
      success: true, 
      filesDeleted: filesToDelete.length,
      jobsUpdated: jobIds.length 
    });
  } catch (error) {
    console.error('Error deleting jobs:', error);
    return NextResponse.json({ error: 'Failed to delete jobs' }, { status: 500 });
  }
});
