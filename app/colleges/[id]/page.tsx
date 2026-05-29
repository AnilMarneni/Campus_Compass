import React from 'react';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import CollegeHero from '@/components/college/CollegeHero';
import CourseList from '@/components/college/CourseList';
import ReviewsSection from '@/components/college/ReviewsSection';
import { notFound } from 'next/navigation';
import { Building2, Landmark, Trophy, FileText, Calendar, Map, Award, CheckCircle, Users, BookOpen, Briefcase, GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate dynamic SEO Metadata for each college details page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const college = await prisma.college.findUnique({
    where: { id },
    select: { name: true, location: true }
  });

  if (!college) {
    return { title: 'College Not Found | CampusCompass' };
  }

  return {
    title: `${college.name} - Fees, Placements, Reviews | CampusCompass`,
    description: `Explore ${college.name} located in ${college.location}. Find average fee structure, placement rate, salary package statistics, recruiters list, and student reviews.`,
    openGraph: {
      title: `${college.name} - Fees, Placements, Reviews | CampusCompass`,
      description: `Explore ${college.name} located in ${college.location}. Find average fee structure, placement rate, salary package statistics, recruiters list, and student reviews.`
    }
  };
}

export default async function CollegeDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch college details
  const college = await prisma.college.findUnique({
    where: { id },
    include: {
      courses: true,
      topRecruiters: true,
      reviews: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!college) {
    notFound();
  }

  const session = await getServerSession(authOptions);

  // Check if saved
  let isSaved = false;
  if (session?.user?.id) {
    const saved = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId: id,
        },
      },
    });
    isSaved = !!saved;
  }

  // Format dynamic last updated date
  const formattedDate = college.updatedAt
    ? new Date(college.updatedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : 'May 2026';

  return (
    <div className="flex flex-col min-h-screen pb-12">
      {/* College Hero Section */}
      <CollegeHero college={college} initialIsSaved={isSaved} />

      {/* Sticky Tab Navigation bar */}
      <div className="sticky top-16 z-25 bg-white/95 backdrop-blur-xs border-b border-gray-200 shadow-3xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 h-12 items-center text-xs font-semibold text-gray-500 uppercase tracking-wider overflow-x-auto whitespace-nowrap">
            <a href="#overview" className="hover:text-indigo-650 py-3 border-b-2 border-transparent hover:border-indigo-600 transition-all">
              Overview
            </a>
            <a href="#courses" className="hover:text-indigo-650 py-3 border-b-2 border-transparent hover:border-indigo-600 transition-all">
              Courses ({college.courses.length})
            </a>
            <a href="#placements" className="hover:text-indigo-650 py-3 border-b-2 border-transparent hover:border-indigo-600 transition-all">
              Placements
            </a>
            <a href="#reviews" className="hover:text-indigo-650 py-3 border-b-2 border-transparent hover:border-indigo-600 transition-all">
              Reviews ({college.reviews.length})
            </a>
          </nav>
        </div>
      </div>

      {/* Main sections container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Section 1: Overview */}
        <section id="overview" className="scroll-mt-32 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-l-4 border-indigo-600 pl-3">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Building2 className="h-5 w-5 text-indigo-600 mr-2" />
              About the Institution
            </h2>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-md w-fit">
              Last Updated: {formattedDate}
            </div>
          </div>
          <Card className="border border-gray-150">
            <CardContent className="p-6 space-y-6">
              <p className="text-sm text-gray-600 leading-relaxed">
                {college.description}
              </p>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-gray-100">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg space-y-0.5 text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-center">
                    <Users className="h-3.5 w-3.5 mr-1 text-indigo-500" /> Students
                  </span>
                  <div className="text-lg font-bold text-gray-800">
                    {college.studentCount ? college.studentCount.toLocaleString() : 'N/A'}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg space-y-0.5 text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-center">
                    <GraduationCap className="h-3.5 w-3.5 mr-1 text-indigo-500" /> Faculty
                  </span>
                  <div className="text-lg font-bold text-gray-800">
                    {college.facultyCount ? college.facultyCount.toLocaleString() : 'N/A'}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg space-y-0.5 text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-center">
                    <Briefcase className="h-3.5 w-3.5 mr-1 text-emerald-500" /> Placement Rate
                  </span>
                  <div className="text-lg font-bold text-emerald-600">
                    {college.placementRate > 0 ? `${college.placementRate.toFixed(1)}%` : 'N/A'}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg space-y-0.5 text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-center">
                    <BookOpen className="h-3.5 w-3.5 mr-1 text-indigo-500" /> Course Count
                  </span>
                  <div className="text-lg font-bold text-gray-800">
                    {college.courses.length} Offered
                  </div>
                </div>
              </div>
              
              {/* Quick Facts Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 pt-4 border-t border-gray-100">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Established</span>
                  <div className="text-sm font-semibold text-gray-700 flex items-center">
                    <Calendar className="h-4 w-4 text-indigo-500 mr-1.5" />
                    {college.establishedYear || 'N/A'}
                  </div>
                </div>

                <div className="space-y-1 border-l border-gray-100 pl-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ownership</span>
                  <div className="text-sm font-semibold text-gray-700 flex items-center">
                    <Building2 className="h-4 w-4 text-indigo-500 mr-1.5" />
                    {college.ownershipType || 'N/A'}
                  </div>
                </div>

                <div className="space-y-1 border-l border-gray-100 pl-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Campus Size</span>
                  <div className="text-sm font-semibold text-gray-700 flex items-center">
                    <Map className="h-4 w-4 text-indigo-500 mr-1.5" />
                    {college.campusSize || 'N/A'}
                  </div>
                </div>

                <div className="space-y-1 border-l border-gray-100 pl-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Accreditation</span>
                  <div className="text-sm font-semibold text-gray-700 flex items-center">
                    <Award className="h-4 w-4 text-indigo-500 mr-1.5" />
                    {college.accreditation || 'N/A'}
                  </div>
                </div>

                <div className="space-y-1 border-l border-gray-100 pl-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">NAAC Grade</span>
                  <div className="text-sm font-semibold text-gray-700 flex items-center">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-1.5" />
                    {college.naacGrade ? `Grade ${college.naacGrade}` : 'N/A'}
                  </div>
                </div>


              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 2: Courses */}
        <section id="courses" className="scroll-mt-32 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center border-l-4 border-indigo-600 pl-3">
            <FileText className="h-5 w-5 text-indigo-600 mr-2" />
            Courses & Fee Structure
          </h2>
          <CourseList courses={college.courses} />
        </section>

        {/* Section 3: Placements */}
        <section id="placements" className="scroll-mt-32 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center border-l-4 border-indigo-600 pl-3">
            <Trophy className="h-5 w-5 text-indigo-600 mr-2" />
            Placement Statistics
          </h2>
          <Card className="border border-gray-150">
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Placement Rate</span>
                  <div className="text-3xl font-extrabold text-emerald-600">
                    {college.placementRate > 0 ? `${college.placementRate.toFixed(1)}%` : 'N/A'}
                  </div>
                  <p className="text-[10px] text-gray-500">Percentage of registered students placed</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Avg Salary Package</span>
                  <div className="text-3xl font-extrabold text-gray-800">
                    {college.averagePackage ? `₹${college.averagePackage.toFixed(1)} LPA` : 'N/A'}
                  </div>
                  <p className="text-[10px] text-gray-500">Average package offered in recent drive</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Highest Package</span>
                  <div className="text-3xl font-extrabold text-indigo-600">
                    {college.highestPackage ? `₹${college.highestPackage.toFixed(1)} LPA` : 'N/A'}
                  </div>
                  <p className="text-[10px] text-gray-500">Peak package secured by graduates</p>
                </div>
              </div>

              {college.placementYear && (
                <div className="bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-lg text-xs text-gray-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                  <span><strong>Placement Drive Year:</strong> {college.placementYear}</span>
                  <span><strong>Audit Data Reference:</strong> {college.placementSource || 'Official Placement Cell Report'}</span>
                </div>
              )}

              {/* Recruiters Grid */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Top Recruiters & Partners</h4>
                {college.topRecruiters && college.topRecruiters.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    {college.topRecruiters.map((recruiter) => (
                      <div key={recruiter.id} className="py-3 px-4 border border-gray-100 bg-gray-50/30 rounded-lg text-sm font-semibold text-gray-600">
                        {recruiter.name}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs font-semibold text-gray-400">No recruiters listed for this college.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 4: Reviews */}
        <section id="reviews" className="scroll-mt-32">
          <ReviewsSection collegeId={college.id} reviews={college.reviews} />
        </section>
      </div>
    </div>
  );
}
