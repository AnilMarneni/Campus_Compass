import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/utils';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    const { id: collegeId } = await params;
    if (!collegeId) {
      return apiError('College ID is required', 400);
    }

    // Check if relation exists
    const existingSave = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId,
        },
      },
    });

    if (!existingSave) {
      return apiError('Saved college record not found', 404);
    }

    // Delete relation
    await prisma.savedCollege.delete({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId,
        },
      },
    });

    return apiSuccess({ message: 'Removed from favorites list' });
  } catch (error) {
    console.error('Error in DELETE /api/saved/[id]:', error);
    return apiError('Internal server error occurred', 500);
  }
}
