import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PredictorQuerySchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = PredictorQuerySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid predictor parameters', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { exam, stream, category, rank } = validated.data;

    // Cutoff rank >= user rank indicates the user's score matches or beats the historical threshold.
    const cutoffs = await prisma.cutoff.findMany({
      where: {
        exam,
        stream,
        category,
        cutoffRank: {
          gte: rank,
        },
      },
      include: {
        college: {
          include: {
            courses: true,
            areasOfStudy: true,
          }
        },
      },
      orderBy: {
        cutoffRank: 'asc', // Closest rank threshold (hardest to get in) first.
      },
    });

    // Map to colleges list preventing duplicates
    const collegesMap = new Map();
    cutoffs.forEach((c) => {
      if (!collegesMap.has(c.collegeId)) {
        collegesMap.set(c.collegeId, {
          ...c.college,
          predictedCutoff: c.cutoffRank,
        });
      }
    });

    const recommendedColleges = Array.from(collegesMap.values());

    return NextResponse.json({
      success: true,
      colleges: recommendedColleges,
    });
  } catch (error: any) {
    console.error('[Predictor API Error]:', error);
    return NextResponse.json(
      { error: 'Failed to predict colleges due to server error' },
      { status: 500 }
    );
  }
}
