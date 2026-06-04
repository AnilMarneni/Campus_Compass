import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SaveComparisonSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
    }

    const body = await req.json();
    const validated = SaveComparisonSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid comparison parameters', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { name, collegeIds } = validated.data;

    // Create SavedComparison record and link colleges using implicit relationship
    const saved = await prisma.savedComparison.create({
      data: {
        name,
        userId: session.user.id,
        colleges: {
          connect: collegeIds.map((id) => ({ id })),
        },
      },
      include: {
        colleges: true,
      },
    });

    return NextResponse.json({
      success: true,
      comparison: saved,
    }, { status: 201 });
  } catch (error: any) {
    console.error('[Save Comparison API Error]:', error);
    return NextResponse.json(
      { error: 'Failed to save comparison set' },
      { status: 500 }
    );
  }
}
