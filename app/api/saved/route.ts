import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/utils';
import { SavedActionSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return apiError('Unauthorized. Please log in first.', 401);
    }

    // Verify user exists in database (in case of database reset/stale session)
    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!userExists) {
      return apiError('Session invalid. Please log out and log in again.', 401);
    }

    const body = await request.json().catch(() => ({}));
    
    // Validate input payload
    const parsed = SavedActionSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || 'Invalid input payload');
    }

    const { collegeId } = parsed.data;

    // Check if the college exists
    const collegeExists = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!collegeExists) {
      return apiError('Target college does not exist', 404);
    }

    // Check if already saved
    const existingSave = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId,
        },
      },
    });

    if (existingSave) {
      return apiSuccess(existingSave);
    }

    // Create saved relationship
    const savedCollege = await prisma.savedCollege.create({
      data: {
        userId: session.user.id,
        collegeId,
      },
    });

    return apiSuccess(savedCollege, 210);
  } catch (error) {
    console.error('Error in POST /api/saved:', error);
    return apiError('Internal server error occurred', 500);
  }
}
