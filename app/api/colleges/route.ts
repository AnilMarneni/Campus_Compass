import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/utils';
import { CollegesQuerySchema } from '@/lib/validations';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    
    // Parse and validate query parameters
    const parsed = CollegesQuerySchema.safeParse(searchParams);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || 'Invalid query parameters');
    }

    const {
      search,
      location,
      minFees,
      maxFees,
      minRating,
      courseType,
      institutionType,
      nirfCategory,
      sortBy,
      sortOrder,
      page,
      limit,
    } = parsed.data;

    const where: Prisma.CollegeWhereInput = {
      rating: { gte: minRating },
      fees: { gte: minFees, lte: maxFees },
    };

    const andConditions: Prisma.CollegeWhereInput[] = [];

    // Search query: split by spaces and match keywords across multiple fields
    if (search) {
      const keywords = search.split(/\s+/).filter(Boolean);
      keywords.forEach((keyword) => {
        andConditions.push({
          OR: [
            { name: { contains: keyword, mode: 'insensitive' } },
            { location: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
            { courses: { some: { name: { contains: keyword, mode: 'insensitive' } } } },
            { topRecruiters: { some: { name: { contains: keyword, mode: 'insensitive' } } } },
          ],
        });
      });
    }

    // Location filter (case-insensitive)
    if (location) {
      andConditions.push({
        location: { contains: location, mode: 'insensitive' },
      });
    }

    // Course type filter (e.g. B.Tech, MBA, B.Sc) (case-insensitive)
    if (courseType) {
      andConditions.push({
        courses: {
          some: {
            name: { contains: courseType, mode: 'insensitive' },
          },
        },
      });
    }

    // Institution classification filter
    if (institutionType) {
      andConditions.push({
        institutionType: { equals: institutionType, mode: 'insensitive' },
      });
    }

    // NIRF stream category filter
    if (nirfCategory) {
      andConditions.push({
        nirfCategory: { equals: nirfCategory, mode: 'insensitive' },
      });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    // Dynamic ordering
    const orderBy: Prisma.CollegeOrderByWithRelationInput = {};
    if (sortBy === 'rating') {
      orderBy.rating = sortOrder;
    } else if (sortBy === 'fees') {
      orderBy.fees = sortOrder;
    } else if (sortBy === 'name') {
      orderBy.name = sortOrder;
    } else if (sortBy === 'nirfRank') {
      orderBy.nirfRank = sortOrder;
    } else if (sortBy === 'nirfScore') {
      orderBy.nirfScore = sortOrder;
    }

    const skip = (page - 1) * limit;

    // Fetch colleges and total count in parallel
    const [colleges, totalCount] = await Promise.all([
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          courses: true,
          reviews: true,
        },
      }),
      prisma.college.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return apiSuccess({
      colleges,
      pagination: {
        totalCount,
        page,
        totalPages,
        limit,
      },
    });
  } catch (error: any) {
    console.error('Error in GET /api/colleges:', error);
    return apiError('Internal server error occurred', 500);
  }
}
