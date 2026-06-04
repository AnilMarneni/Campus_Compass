import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
    }

    const { id } = await params;

    // Assert resource existence
    const existing = await prisma.savedComparison.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Comparison set not found' }, { status: 404 });
    }

    // Check ownership boundary
    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized operation' }, { status: 403 });
    }

    // Perform deletion
    await prisma.savedComparison.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Comparison set successfully deleted',
    });
  } catch (error: any) {
    console.error('[Delete Comparison API Error]:', error);
    return NextResponse.json(
      { error: 'Failed to delete comparison set due to server error' },
      { status: 500 }
    );
  }
}
