import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import SavedDashboard from '@/features/saved/SavedDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Saved Colleges & Dashboard | CampusCompass',
  description: 'Manage your bookmarked colleges, view comparison matrices, read and edit your reviews, and track analytics on your personal dashboard.',
};

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  // Fetch saved colleges for the authenticated user
  const savedColleges = await prisma.savedCollege.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      college: {
        include: {
          courses: true,
        },
      },
    },
    orderBy: {
      id: 'desc',
    },
  });

  // Fetch saved comparison sets for the authenticated user
  const savedComparisons = await prisma.savedComparison.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      colleges: {
        include: {
          courses: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          User Dashboard
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Manage saved colleges, launch quick comparisons, and update settings.
        </p>
      </div>

      <SavedDashboard
        initialSaved={savedColleges}
        initialComparisons={savedComparisons}
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }}
      />
    </div>
  );
}
