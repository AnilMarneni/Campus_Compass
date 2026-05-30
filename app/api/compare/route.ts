import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/utils';
import { CompareQuerySchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const idsString = searchParams.get('ids');

    if (!idsString) {
      return apiError('College IDs are required. Use format: ?ids=id1,id2,id3');
    }

    // Validate query parameter layout using Zod
    const parsed = CompareQuerySchema.safeParse({ ids: idsString });
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || 'Invalid comparison query');
    }

    const idsArray = idsString.split(',').filter(Boolean);

    const colleges = await prisma.college.findMany({
      where: {
        id: {
          in: idsArray,
        },
      },
      include: {
        courses: true,
        reviews: true,
      },
    });

    // Rearrange colleges in the order of request IDs to preserve compare table alignment
    const orderedColleges = idsArray
      .map((id) => colleges.find((col) => col.id === id))
      .filter((col): col is NonNullable<typeof col> => !!col);

    return apiSuccess(orderedColleges);
  } catch (error) {
    console.error('Error in GET /api/compare:', error);
    return apiError('Internal server error occurred', 500);
  }
}
