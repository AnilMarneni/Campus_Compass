import React from 'react';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { formatINR } from '@/lib/utils';
import { GitCompare, MapPin, Star, GraduationCap, IndianRupee, ArrowLeft, Plus, Briefcase, Calendar, Building2, Award, BookOpen, Globe } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import CompareTracker from '@/components/college/CompareTracker';
import CompareActions from '@/components/college/CompareActions';

export const metadata: Metadata = {
  title: 'Compare Colleges Side-by-Side | CampusCompass',
  description: 'Compare top Indian universities across fees, course types, ratings, established year, ownership types, NAAC grades, and career placement packages side-by-side.',
};

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ComparePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const idsString = resolvedSearchParams.ids;

  // Split and validate IDs
  const ids = idsString ? idsString.split(',').filter(Boolean) : [];

  // Query details if any IDs are present
  const colleges = ids.length > 0 
    ? await prisma.college.findMany({
        where: {
          id: { in: ids },
        },
        include: {
          courses: true,
          topRecruiters: true,
          areasOfStudy: true,
        },
      })
    : [];

  // Reorder to match the requested IDs parameter order
  const orderedColleges = ids
    .map((id) => colleges.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => !!c);

  // If no colleges are selected
  if (orderedColleges.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
          <GitCompare className="h-8 w-8 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Compare Colleges</h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            You haven&apos;t selected any colleges to compare. Add up to 3 colleges from our listings to compare them side-by-side.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/colleges">
            <Button variant="primary" size="md" className="gap-2">
              <Plus className="h-4 w-4" />
              Explore Colleges
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate better values across compared colleges to highlight
  const highestRating = Math.max(...orderedColleges.map((c) => c.rating));
  const lowestFees = Math.min(...orderedColleges.map((c) => c.fees));
  const highestPlacements = Math.max(...orderedColleges.map((c) => c.placementRate));
  const highestAveragePackage = Math.max(...orderedColleges.map((c) => c.averagePackage || 0));
  const highestHighestPackage = Math.max(...orderedColleges.map((c) => c.highestPackage || 0));



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <CompareTracker ids={ids} />
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div className="space-y-1">
          <Link href="/colleges" className="flex items-center text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors mb-2">
            <ArrowLeft className="h-3 w-3 mr-1" />
            Back to explore list
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 flex items-center">
            <GitCompare className="mr-2 h-7 w-7 text-indigo-600" />
            Compare Colleges
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Review side-by-side matrices to pick the best academic institution.
          </p>
        </div>
        <CompareActions collegeNames={orderedColleges.map((c) => c.name)} />
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white border border-gray-150 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100">
                {/* Metrics header column */}
                <th className="py-5 px-6 font-bold text-xs uppercase tracking-wider text-gray-400 w-1/4 sticky top-16 left-0 bg-slate-50 z-30 border-r border-gray-100">
                  Key Metrics
                </th>
                {/* College columns */}
                {orderedColleges.map((college) => (
                  <th key={college.id} className="py-5 px-6 w-1/4 align-top border-r border-gray-100 last:border-r-0 sticky top-16 bg-slate-50 z-20">
                    <div className="space-y-4">
                      {/* Image thumbnail */}
                      <div className="h-28 w-full rounded-lg overflow-hidden relative border border-gray-100">
                        <img
                          src={college.image}
                          alt={college.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug">
                          {college.name}
                        </h3>
                        <p className="text-xs text-gray-400 font-medium flex items-center">
                          <MapPin className="h-3 w-3 mr-0.5" />
                          {college.location.split(',')[0]}
                        </p>
                      </div>
                    </div>
                  </th>
                ))}
                {/* Fill empty comparison slots */}
                {Array.from({ length: Math.max(0, 3 - orderedColleges.length) }).map((_, idx) => (
                  <th key={`empty-${idx}`} className="py-5 px-6 w-1/4 align-middle text-center bg-gray-50/20 border-r border-gray-100 last:border-r-0">
                    <Link href="/colleges" className="inline-flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-250 hover:border-indigo-400 hover:bg-indigo-50/20 rounded-xl group transition-all">
                      <Plus className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                      <span className="text-xs font-semibold text-gray-500 mt-2 group-hover:text-indigo-600 transition-colors">
                        Add College
                      </span>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {/* Category Header: Overview */}
              <tr className="bg-slate-50/50 font-bold text-xs uppercase tracking-wider text-slate-500">
                <td className="py-3 px-6 sticky left-0 bg-slate-50/50 z-10 border-r border-gray-100" colSpan={4}>
                  Overview & Ratings
                </td>
              </tr>

              {/* Rating Row */}
              <tr>
                <td className="py-4 px-6 font-semibold text-gray-500 sticky left-0 bg-white z-10 border-r border-gray-100 flex items-center h-full">
                  <Star className="h-4 w-4 mr-2 text-amber-500 fill-amber-500" />
                  User Rating
                </td>
                {orderedColleges.map((college) => {
                  const isBest = college.rating === highestRating;
                  return (
                    <td key={college.id} className={`py-4 px-6 border-r border-gray-100 last:border-r-0 ${isBest ? 'bg-emerald-50/25' : ''}`}>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">{college.rating.toFixed(1)} / 5.0</span>
                        {isBest && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-100 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                            Highest
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
                {Array.from({ length: 3 - orderedColleges.length }).map((_, idx) => (
                  <td key={idx} className="py-4 px-6 text-gray-300 border-r border-gray-100 last:border-r-0 bg-gray-50/10">—</td>
                ))}
              </tr>

              {/* Campus Life Row */}
              <tr>
                <td className="py-4 px-6 font-semibold text-gray-500 sticky left-0 bg-white z-10 border-r border-gray-100 flex items-center h-full">
                  <Star className="h-4 w-4 mr-2 text-indigo-500" />
                  Campus Life Rating
                </td>
                {orderedColleges.map((college) => {
                  const rating = college.campusLifeRating || college.rating - 0.1;
                  const isBest = rating === Math.max(...orderedColleges.map(c => c.campusLifeRating || c.rating - 0.1));
                  return (
                    <td key={college.id} className={`py-4 px-6 border-r border-gray-100 last:border-r-0 ${isBest ? 'bg-emerald-50/25' : ''}`}>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">{rating.toFixed(1)} / 5.0</span>
                        {isBest && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-100 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                            Highest
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
                {Array.from({ length: 3 - orderedColleges.length }).map((_, idx) => (
                  <td key={idx} className="py-4 px-6 text-gray-300 border-r border-gray-100 last:border-r-0 bg-gray-50/10">—</td>
                ))}
              </tr>

              {/* Established Year Row */}
              <tr>
                <td className="py-4 px-6 font-semibold text-gray-500 sticky left-0 bg-white z-10 border-r border-gray-100 flex items-center h-full">
                  <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                  Established Year
                </td>
                {orderedColleges.map((college) => (
                  <td key={college.id} className="py-4 px-6 border-r border-gray-100 last:border-r-0">
                    <span className="font-semibold text-gray-900">{college.establishedYear || 'N/A'}</span>
                  </td>
                ))}
                {Array.from({ length: 3 - orderedColleges.length }).map((_, idx) => (
                  <td key={idx} className="py-4 px-6 text-gray-300 border-r border-gray-100 last:border-r-0 bg-gray-50/10">—</td>
                ))}
              </tr>

              {/* Ownership Type Row */}
              <tr>
                <td className="py-4 px-6 font-semibold text-gray-500 sticky left-0 bg-white z-10 border-r border-gray-100 flex items-center h-full">
                  <Building2 className="h-4 w-4 mr-2 text-indigo-500" />
                  Ownership Type
                </td>
                {orderedColleges.map((college) => (
                  <td key={college.id} className="py-4 px-6 border-r border-gray-100 last:border-r-0">
                    <span className="font-semibold text-gray-900">{college.ownershipType || 'N/A'}</span>
                  </td>
                ))}
                {Array.from({ length: 3 - orderedColleges.length }).map((_, idx) => (
                  <td key={idx} className="py-4 px-6 text-gray-300 border-r border-gray-100 last:border-r-0 bg-gray-50/10">—</td>
                ))}
              </tr>

              {/* Affiliation Row */}
              <tr>
                <td className="py-4 px-6 font-semibold text-gray-500 sticky left-0 bg-white z-10 border-r border-gray-100 flex items-center h-full">
                  <Building2 className="h-4 w-4 mr-2 text-indigo-500" />
                  Affiliation
                </td>
                {orderedColleges.map((college) => (
                  <td key={college.id} className="py-4 px-6 border-r border-gray-100 last:border-r-0">
                    <span className="font-semibold text-gray-900">{college.affiliatedUniversity || 'Institute of National Importance'}</span>
                  </td>
                ))}
                {Array.from({ length: 3 - orderedColleges.length }).map((_, idx) => (
                  <td key={idx} className="py-4 px-6 text-gray-300 border-r border-gray-100 last:border-r-0 bg-gray-50/10">—</td>
                ))}
              </tr>

              {/* NAAC Grade Row */}
              <tr>
                <td className="py-4 px-6 font-semibold text-gray-500 sticky left-0 bg-white z-10 border-r border-gray-100 flex items-center h-full">
                  <Award className="h-4 w-4 mr-2 text-indigo-500" />
                  NAAC Grade
                </td>
                {orderedColleges.map((college) => (
                  <td key={college.id} className="py-4 px-6 border-r border-gray-100 last:border-r-0">
                    <span className="font-semibold text-gray-900">{college.naacGrade ? `Grade ${college.naacGrade}` : 'N/A'}</span>
                  </td>
                ))}
                {Array.from({ length: 3 - orderedColleges.length }).map((_, idx) => (
                  <td key={idx} className="py-4 px-6 text-gray-300 border-r border-gray-100 last:border-r-0 bg-gray-50/10">—</td>
                ))}
              </tr>

              {/* Institution Type Row */}
              <tr>
                <td className="py-4 px-6 font-semibold text-gray-500 sticky left-0 bg-white z-10 border-r border-gray-100 flex items-center h-full">
                  <Building2 className="h-4 w-4 mr-2 text-indigo-500" />
                  Institution Type
                </td>
                {orderedColleges.map((college) => (
                  <td key={college.id} className="py-4 px-6 border-r border-gray-100 last:border-r-0">
                    <span className="font-semibold text-gray-900">{college.institutionType || 'N/A'}</span>
                  </td>
                ))}
                {Array.from({ length: 3 - orderedColleges.length }).map((_, idx) => (
                  <td key={idx} className="py-4 px-6 text-gray-300 border-r border-gray-100 last:border-r-0 bg-gray-50/10">—</td>
                ))}
              </tr>

              {/* Website Row */}
              <tr>
                <td className="py-4 px-6 font-semibold text-gray-500 sticky left-0 bg-white z-10 border-r border-gray-100 flex items-center h-full">
                  <Globe className="h-4 w-4 mr-2 text-indigo-500" />
                  Official Website
                </td>
                {orderedColleges.map((college) => (
                  <td key={college.id} className="py-4 px-6 border-r border-gray-100 last:border-r-0">
                    {college.website ? (
                      <a
                        href={college.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-indigo-650 hover:underline break-all"
                      >
                        {college.website.replace(/^https?:\/\//, '')}
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs">N/A</span>
                    )}
                  </td>
                ))}
                {Array.from({ length: 3 - orderedColleges.length }).map((_, idx) => (
                  <td key={idx} className="py-4 px-6 text-gray-300 border-r border-gray-100 last:border-r-0 bg-gray-50/10">—</td>
                ))}
              </tr>

              {/* Top Areas of Study Row */}
              <tr>
                <td className="py-4 px-6 font-semibold text-gray-500 sticky left-0 bg-white z-10 border-r border-gray-100 flex items-start">
                  Top Areas of Study
                </td>
                {orderedColleges.map((college) => (
                  <td key={college.id} className="py-4 px-6 border-r border-gray-100 last:border-r-0 align-top">
                    <div className="flex flex-wrap gap-1">
                      {college.areasOfStudy && college.areasOfStudy.length > 0 ? (
                        college.areasOfStudy.slice(0, 4).map((area) => (
                          <span
                            key={area.id}
                            className="inline-block px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-[10px] font-semibold text-indigo-700"
                          >
                            {area.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs">N/A</span>
                      )}
                    </div>
                  </td>
                ))}
                {Array.from({ length: 3 - orderedColleges.length }).map((_, idx) => (
                  <td key={idx} className="py-4 px-6 text-gray-300 border-r border-gray-100 last:border-r-0 bg-gray-50/10">—</td>
                ))}
              </tr>

              {/* Category Header: Financials */}
              <tr className="bg-slate-50/50 font-bold text-xs uppercase tracking-wider text-slate-500">
                <td className="py-3 px-6 sticky left-0 bg-slate-50/50 z-10 border-r border-gray-100" colSpan={4}>
                  Financials
                </td>
              </tr>

              {/* Fees Row */}
              <tr>
                <td className="py-4 px-6 font-semibold text-gray-500 sticky left-0 bg-white z-10 border-r border-gray-100 flex items-center">
                  <IndianRupee className="h-4 w-4 mr-2 text-indigo-500" />
                  Average Annual Fees
                </td>
                {orderedColleges.map((college) => {
                  const isBest = college.fees === lowestFees;
                  return (
                    <td key={college.id} className={`py-4 px-6 border-r border-gray-100 last:border-r-0 ${isBest ? 'bg-emerald-50/25' : ''}`}>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">{formatINR(college.fees)}</span>
                        {isBest && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-100 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                            Lowest Cost
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
                {Array.from({ length: 3 - orderedColleges.length }).map((_, idx) => (
                  <td key={idx} className="py-4 px-6 text-gray-300 border-r border-gray-100 last:border-r-0 bg-gray-50/10">—</td>
                ))}
              </tr>

              {/* Category Header: Outcomes */}
              <tr className="bg-slate-50/50 font-bold text-xs uppercase tracking-wider text-slate-500">
                <td className="py-3 px-6 sticky left-0 bg-slate-50/50 z-10 border-r border-gray-100" colSpan={4}>
                  Career Outcomes
                </td>
              </tr>

              {/* Placement Rate Row */}
              <tr>
                <td className="py-4 px-6 font-semibold text-gray-500 sticky left-0 bg-white z-10 border-r border-gray-100 flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2 text-indigo-550" />
                  Placement Rate
                </td>
                {orderedColleges.map((college) => {
                  const isBest = college.placementRate === highestPlacements;
                  return (
                    <td key={college.id} className={`py-4 px-6 border-r border-gray-100 last:border-r-0 ${isBest ? 'bg-emerald-50/25' : ''}`}>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">{college.placementRate.toFixed(1)}%</span>
                        {isBest && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-100 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                            Best Outcome
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
                {Array.from({ length: 3 - orderedColleges.length }).map((_, idx) => (
                  <td key={idx} className="py-4 px-6 text-gray-300 border-r border-gray-100 last:border-r-0 bg-gray-50/10">—</td>
                ))}
              </tr>

              {/* Average Package Row */}
              <tr>
                <td className="py-4 px-6 font-semibold text-gray-500 sticky left-0 bg-white z-10 border-r border-gray-100 flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-indigo-550" />
                  Average Package
                </td>
                {orderedColleges.map((college) => {
                  const isBest = college.averagePackage && college.averagePackage === highestAveragePackage;
                  return (
                    <td key={college.id} className={`py-4 px-6 border-r border-gray-100 last:border-r-0 ${isBest ? 'bg-emerald-50/25' : ''}`}>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">
                          {college.averagePackage ? `₹${college.averagePackage.toFixed(1)} LPA` : 'N/A'}
                        </span>
                        {isBest && college.averagePackage && college.averagePackage > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-100 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                            Highest
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
                {Array.from({ length: 3 - orderedColleges.length }).map((_, idx) => (
                  <td key={idx} className="py-4 px-6 text-gray-300 border-r border-gray-100 last:border-r-0 bg-gray-50/10">—</td>
                ))}
              </tr>

              {/* Highest Package Row */}
              <tr>
                <td className="py-4 px-6 font-semibold text-gray-500 sticky left-0 bg-white z-10 border-r border-gray-100 flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-indigo-550" />
                  Highest Package
                </td>
                {orderedColleges.map((college) => {
                  const isBest = college.highestPackage && college.highestPackage === highestHighestPackage;
                  return (
                    <td key={college.id} className={`py-4 px-6 border-r border-gray-100 last:border-r-0 ${isBest ? 'bg-emerald-50/25' : ''}`}>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">
                          {college.highestPackage ? `₹${college.highestPackage.toFixed(1)} LPA` : 'N/A'}
                        </span>
                        {isBest && college.highestPackage && college.highestPackage > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-100 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                            Highest
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
                {Array.from({ length: 3 - orderedColleges.length }).map((_, idx) => (
                  <td key={idx} className="py-4 px-6 text-gray-300 border-r border-gray-100 last:border-r-0 bg-gray-50/10">—</td>
                ))}
              </tr>

              {/* Top Recruiters Row */}
              <tr>
                <td className="py-4 px-6 font-semibold text-gray-500 sticky left-0 bg-white z-10 border-r border-gray-100 flex items-start">
                  Top Recruiters
                </td>
                {orderedColleges.map((college) => (
                  <td key={college.id} className="py-4 px-6 border-r border-gray-100 last:border-r-0 align-top">
                    <div className="flex flex-wrap gap-1">
                      {college.topRecruiters && college.topRecruiters.length > 0 ? (
                        college.topRecruiters.map((recruiter) => (
                          <span
                            key={recruiter.id}
                            className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-medium text-slate-650"
                          >
                            {recruiter.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs">N/A</span>
                      )}
                    </div>
                  </td>
                ))}
                {Array.from({ length: 3 - orderedColleges.length }).map((_, idx) => (
                  <td key={idx} className="py-4 px-6 text-gray-300 border-r border-gray-100 last:border-r-0 bg-gray-50/10">—</td>
                ))}
              </tr>

              {/* Category Header: Academics */}
              <tr className="bg-slate-50/50 font-bold text-xs uppercase tracking-wider text-slate-500">
                <td className="py-3 px-6 sticky left-0 bg-slate-50/50 z-10 border-r border-gray-100" colSpan={4}>
                  Academics & Courses
                </td>
              </tr>

              {/* Course Count Row */}
              <tr>
                <td className="py-4 px-6 font-semibold text-gray-500 sticky left-0 bg-white z-10 border-r border-gray-100 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-indigo-500" />
                  Courses Offered
                </td>
                {orderedColleges.map((college) => (
                  <td key={college.id} className="py-4 px-6 border-r border-gray-100 last:border-r-0">
                    <span className="font-bold text-gray-900">{college.courses.length} courses</span>
                  </td>
                ))}
                {Array.from({ length: 3 - orderedColleges.length }).map((_, idx) => (
                  <td key={idx} className="py-4 px-6 text-gray-300 border-r border-gray-100 last:border-r-0 bg-gray-50/10">—</td>
                ))}
              </tr>

              {/* Courses Preview Row */}
              <tr>
                <td className="py-4 px-6 font-semibold text-gray-500 sticky left-0 bg-white z-10 border-r border-gray-100 flex items-start">
                  Courses Preview
                </td>
                {orderedColleges.map((college) => (
                  <td key={college.id} className="py-4 px-6 border-r border-gray-100 last:border-r-0 align-top">
                    <div className="flex flex-wrap gap-1">
                      {college.courses.map((course) => (
                        <span
                          key={course.id}
                          className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-medium text-slate-650"
                        >
                          {course.name}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
                {Array.from({ length: 3 - orderedColleges.length }).map((_, idx) => (
                  <td key={idx} className="py-4 px-6 text-gray-300 border-r border-gray-100 last:border-r-0 bg-gray-50/10">—</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
