import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return apiError('College ID is required', 400);
    }

    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: true,
        reviews: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!college) {
      return apiError('College not found', 404);
    }

    return apiSuccess(college);
  } catch (error: any) {
    console.error('Error in GET /api/colleges/[id]:', error);
    return apiError('Internal server error occurred', 500);
  }
}
