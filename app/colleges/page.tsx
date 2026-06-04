import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CollegesQuerySchema } from '@/lib/validations';
import { Prisma } from '@prisma/client';
import CollegeCard from '@/components/college/CollegeCard';
import FilterSidebar from '@/components/filters/FilterSidebar';
import MobileFilterDrawer from '@/components/filters/MobileFilterDrawer';
import { Button } from '@/components/ui/button';
import { Compass, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import DataTransparency from '@/components/layout/DataTransparency';

export const metadata: Metadata = {
  title: 'Explore Colleges — Search & Filter Courses, Fees, Placements | CampusCompass',
  description: 'Find and compare top Indian universities. Search by course, stream, location, fees, placement rates, ratings, and recruiters to make the best academic choice.',
  openGraph: {
    title: 'Explore Colleges — Search & Filter Courses, Fees, Placements | CampusCompass',
    description: 'Find and compare top Indian universities. Search by course, stream, location, fees, placement rates, ratings, and recruiters to make the best academic choice.',
  }
};

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function CollegesPage({ searchParams }: PageProps) {
  // Await searchParams as required by Next.js 15
  const resolvedSearchParams = await searchParams;

  // Validate queries with Zod
  const parsed = CollegesQuerySchema.safeParse(resolvedSearchParams);
  const query = parsed.success ? parsed.data : CollegesQuerySchema.parse({});

  const session = await getServerSession(authOptions);

  // Fetch saved college IDs if logged in
  let savedCollegeIdsSet = new Set<string>();
  if (session?.user?.id) {
    const saved = await prisma.savedCollege.findMany({
      where: { userId: session.user.id },
      select: { collegeId: true },
    });
    savedCollegeIdsSet = new Set(saved.map((s) => s.collegeId));
  }

  // Construct filters where clauses
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
  } = query;

  const where: Prisma.CollegeWhereInput = {
    rating: { gte: minRating },
    fees: { gte: minFees, lte: maxFees },
  };

  const andConditions: Prisma.CollegeWhereInput[] = [];

  if (search) {
    const keywords = search.split(/\s+/).filter(Boolean);
    keywords.forEach((keyword) => {
      andConditions.push({
          OR: [
            { name: { contains: keyword, mode: 'insensitive' } },
            { location: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
            { institutionType: { contains: keyword, mode: 'insensitive' } },
            { courses: { some: { name: { contains: keyword, mode: 'insensitive' } } } },
            { topRecruiters: { some: { name: { contains: keyword, mode: 'insensitive' } } } },
            { areasOfStudy: { some: { name: { contains: keyword, mode: 'insensitive' } } } },
          ],
      });
    });
  }

  if (location) {
    andConditions.push({
      location: { contains: location, mode: 'insensitive' },
    });
  }

  if (courseType) {
    andConditions.push({
      courses: {
        some: {
          name: { contains: courseType, mode: 'insensitive' },
        },
      },
    });
  }

  if (institutionType) {
    andConditions.push({
      institutionType: { equals: institutionType, mode: 'insensitive' },
    });
  }

  if (nirfCategory) {
    andConditions.push({
      nirfCategory: { equals: nirfCategory, mode: 'insensitive' },
    });
  }

  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

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

  // Database queries
  const [colleges, totalCount] = await Promise.all([
    prisma.college.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        courses: true,
        areasOfStudy: true,
      },
    }),
    prisma.college.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  // Helper to build page link url
  const buildPageUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    Object.entries(resolvedSearchParams).forEach(([key, val]) => {
      if (val && key !== 'page') {
        params.set(key, val);
      }
    });
    params.set('page', targetPage.toString());
    return `/colleges?${params.toString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 flex items-center">
            <GraduationCap className="mr-2 h-7 w-7 text-indigo-600" />
            Discover Colleges
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Compare courses, fees, placements and reviews of top universities.
          </p>
        </div>
        <div className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg w-fit">
          Found {totalCount} college{totalCount === 1 ? '' : 's'}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side Filters (Desktop Sidebar) */}
        <div className="hidden md:block w-72 shrink-0">
          <Suspense fallback={<div className="animate-pulse bg-gray-100 rounded-xl h-[500px] w-full" />}>
            <FilterSidebar />
          </Suspense>
        </div>

        {/* Mobile Filters Drawer trigger */}
        <div className="md:hidden">
          <MobileFilterDrawer />
        </div>

        {/* Right Side College Grid */}
        <div className="flex-grow space-y-6">
          {colleges.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-2xl bg-white p-12 text-center h-[400px]">
              <div className="bg-indigo-50 p-4 rounded-full text-indigo-600 mb-4">
                <Compass className="h-8 w-8 animate-spin-slow" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">No colleges match your filters</h3>
              <p className="text-sm text-gray-500 max-w-sm mt-1 mb-6">
                Try adjusting fees, location, or institution type.
              </p>
              <Link href="/colleges">
                <Button variant="primary" size="sm">
                  Reset All Filters
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* College Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {colleges.map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    initialIsSaved={savedCollegeIdsSet.has(college.id)}
                  />
                ))}
              </div>

              {/* Server-side Offset Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                  <div className="text-xs font-semibold text-gray-500">
                    Page {page} of {totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    {page > 1 ? (
                      <Link href={buildPageUrl(page - 1)}>
                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs flex items-center cursor-pointer">
                          <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                          Previous
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" size="sm" disabled className="h-8 px-3 text-xs flex items-center">
                        <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                        Previous
                      </Button>
                    )}

                    {page < totalPages ? (
                      <Link href={buildPageUrl(page + 1)}>
                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs flex items-center cursor-pointer">
                          Next
                          <ChevronRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" size="sm" disabled className="h-8 px-3 text-xs flex items-center">
                        Next
                        <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Footnote Data Transparency Disclosure */}
      <div className="border-t border-gray-100 pt-6">
        <DataTransparency />
      </div>
    </div>
  );
}
