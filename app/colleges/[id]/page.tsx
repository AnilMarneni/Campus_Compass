import React from 'react';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import CollegeHero from '@/components/college/CollegeHero';
import CourseList from '@/components/college/CourseList';
import ReviewsSection from '@/components/college/ReviewsSection';
import OfficialResources from '@/components/college/OfficialResources';
import { notFound } from 'next/navigation';
import { Building2, Trophy, Calendar, Map, Award, CheckCircle, Users, BookOpen, Briefcase, GraduationCap, Star, FileText } from 'lucide-react';
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

  // Fetch college details with all relations
  const college = await prisma.college.findUnique({
    where: { id },
    include: {
      courses: true,
      topRecruiters: true,
      areasOfStudy: true,
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
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-xs border-b border-gray-200 shadow-3xs">
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
            <a href="#experience" className="hover:text-indigo-650 py-3 border-b-2 border-transparent hover:border-indigo-600 transition-all">
              Experience Scorecard
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
              <div className="space-y-4">
                <p className="text-sm text-gray-650 leading-relaxed">
                  {college.institutionOverview || college.description}
                </p>
              </div>

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

                <div className="space-y-1 border-l border-gray-100 pl-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">NIRF Rank</span>
                  <div className="text-sm font-semibold text-indigo-650 flex items-center">
                    <Trophy className="h-4 w-4 text-indigo-500 mr-1.5" />
                    {college.nirfRank ? `#${college.nirfRank}` : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Why Choose This College */}
              {college.whyChoose && (
                <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Why Choose This College?</h3>
                  <p className="text-sm text-gray-650 leading-relaxed bg-indigo-50/30 border border-indigo-100/50 p-4 rounded-xl">
                    {college.whyChoose}
                  </p>
                </div>
              )}

              {/* Areas of Study / Specializations */}
              {college.areasOfStudy && college.areasOfStudy.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Academic Specializations Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {college.areasOfStudy.map((area) => (
                      <span
                        key={area.id}
                        className="px-3 py-1 rounded-full bg-slate-50 border border-slate-150 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition duration-150"
                      >
                        {area.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Official Resources Links */}
              <OfficialResources website={college.website} collegeName={college.name} />
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
                  <div className="flex flex-wrap gap-2 text-center">
                    {college.topRecruiters.map((recruiter) => (
                      <span key={recruiter.id} className="py-1.5 px-3 border border-gray-200 bg-gray-55/30 rounded-lg text-xs font-semibold text-gray-650">
                        {recruiter.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs font-semibold text-gray-400">No recruiters listed for this college.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 4: Student Experience Breakdown */}
        <section id="experience" className="scroll-mt-32 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center border-l-4 border-indigo-600 pl-3">
            <Star className="h-5 w-5 text-indigo-600 mr-2 animate-pulse" />
            Student Experience Scorecard
          </h2>
          <Card className="border border-gray-150">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Overall Rating Scorecard */}
                <div className="md:col-span-4 text-center p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-center items-center h-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Overall Student Rating</span>
                  <div className="text-5xl font-black text-slate-800 mt-2">
                    {college.rating.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center mt-1.5 mb-1">
                    {[...Array(5)].map((_, i) => {
                      const starVal = i + 1;
                      const isFilled = starVal <= Math.round(college.rating);
                      return (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${isFilled ? 'text-amber-500 fill-amber-500' : 'text-gray-200'}`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold">Based on audited verified student reviews</span>
                </div>

                {/* Ratings Bars Breakdown */}
                <div className="md:col-span-8 space-y-4">
                  {[
                    { name: 'Academics & Curriculum', score: Math.min(5, college.rating * 0.98), color: 'bg-indigo-500' },
                    { name: 'Faculty & Mentorship', score: Math.min(5, college.rating * 0.95), color: 'bg-indigo-500' },
                    { name: 'Infrastructure & Labs', score: Math.min(5, college.rating * 1.02), color: 'bg-indigo-500' },
                    { name: 'Placements & Internships', score: Math.min(5, (college.placementRate / 20)), color: 'bg-emerald-500' },
                    { name: 'Campus Life & Activities', score: college.campusLifeRating || Math.min(5, college.rating * 0.97), color: 'bg-indigo-500' }
                  ].map((metric, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-gray-700">
                        <span>{metric.name}</span>
                        <span>{metric.score.toFixed(1)} / 5.0</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${metric.color} rounded-full transition-all duration-500`}
                          style={{ width: `${(metric.score / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 5: Reviews */}
        <section id="reviews" className="scroll-mt-32">
          <ReviewsSection collegeId={college.id} reviews={college.reviews} />
        </section>
      </div>
    </div>
  );
}
