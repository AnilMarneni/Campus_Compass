import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/utils';
import { z } from 'zod';

const ReviewCreateSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Comment must be at least 10 characters long'),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return apiError('Unauthorized. Please log in to post a review.', 401);
    }

    const { id: collegeId } = await params;
    if (!collegeId) {
      return apiError('College ID is required', 400);
    }

    const body = await request.json().catch(() => ({}));
    
    // Validate inputs
    const parsed = ReviewCreateSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || 'Invalid input details');
    }

    const { rating, comment } = parsed.data;

    // Check if college exists
    const collegeExists = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!collegeExists) {
      return apiError('College not found', 404);
    }

    // Determine user display name
    const userName = session.user.name || session.user.email?.split('@')[0] || 'Anonymous';

    // Create review
    const review = await prisma.review.create({
      data: {
        userName,
        rating,
        comment,
        collegeId,
      },
    });

    return apiSuccess(review, 201);
  } catch (error: any) {
    console.error('Error in POST /api/colleges/[id]/reviews:', error);
    return apiError('Internal server error occurred', 500);
  }
}
