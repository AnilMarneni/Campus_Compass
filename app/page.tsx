import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Compass, GitCompare, Bookmark, Search, Star, MapPin, ChevronRight, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatINR } from '@/lib/utils';
import { Metadata } from 'next';
import DataTransparency from '@/components/layout/DataTransparency';

export const metadata: Metadata = {
  title: 'CampusCompass — Discover & Compare Top Indian Universities',
  description: 'Search, filter, and compare top engineering, business, and humanities colleges in India side-by-side. Make informed decisions based on ratings, fees, and placements.',
  openGraph: {
    title: 'CampusCompass — Discover & Compare Top Indian Universities',
    description: 'Search, filter, and compare top engineering, business, and humanities colleges in India side-by-side. Make informed decisions based on ratings, fees, and placements.',
  }
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Query 3 highly rated colleges for the landing page featured section
  const featuredColleges = await prisma.college.findMany({
    take: 3,
    orderBy: {
      rating: 'desc',
    },
    include: {
      courses: true,
    },
  });

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 sm:py-28">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-xs font-semibold text-indigo-400">
            <Compass className="h-4 w-4 animate-spin-slow" />
            <span>SaaS College Discovery Platform</span>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-white">
              Discover and Compare <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-205">Your Future Campus</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
              Skip the information overload. Search, filter, and compare 20+ top engineering, business, and humanities colleges in India side-by-side.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto pt-2">
            <Link href="/colleges" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-650/20">
                Explore Colleges
                <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/compare" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-750 bg-slate-850 hover:bg-slate-800 text-slate-200">
                Compare Side-by-Side
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Platform Value Props / Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 max-w-lg mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Decision-Oriented Workflow
          </h2>
          <p className="text-sm text-gray-500 leading-normal">
            Everything you need to research and choose the right campus in three steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-150 rounded-xl p-6 shadow-2xs space-y-4 hover:border-indigo-100 transition-all">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-gray-900">1. Instant Search</h3>
            <p className="text-sm text-gray-550 leading-relaxed">
              Find colleges by names, courses, or location using debounced queries and dynamically synchronized URL parameter links.
            </p>
          </div>

          <div className="bg-white border border-gray-150 rounded-xl p-6 shadow-2xs space-y-4 hover:border-indigo-100 transition-all">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GitCompare className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-gray-900">2. Side-by-Side Comparison</h3>
            <p className="text-sm text-gray-550 leading-relaxed">
              Pin up to 3 colleges. Compare annual course fees, user ratings, and audited placement rates in a clear structured matrix.
            </p>
          </div>

          <div className="bg-white border border-gray-150 rounded-xl p-6 shadow-2xs space-y-4 hover:border-indigo-100 transition-all">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bookmark className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-gray-900">3. Saved List Dashboard</h3>
            <p className="text-sm text-gray-550 leading-relaxed">
              Register securely to save colleges, write personal reviews, and launch comparisons directly from your dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Featured Colleges Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
              <Building2 className="mr-2 h-6 w-6 text-indigo-600" />
              Featured Institutions
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Explore some of the highest-rated campuses based on student feedback and outcomes.
            </p>
          </div>
          <Link href="/colleges">
            <Button variant="outline" size="sm" className="font-semibold text-xs text-indigo-600 hover:text-indigo-850 cursor-pointer">
              Explore All Colleges ({featuredColleges.length > 0 ? '20+' : '0'})
              <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredColleges.map((college) => (
            <div key={college.id} className="bg-white border border-gray-150 rounded-xl shadow-2xs overflow-hidden flex flex-col group hover:border-indigo-100 transition-all">
              <div className="h-44 relative w-full overflow-hidden">
                <img
                  src={college.image}
                  alt={college.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-103 duration-300"
                />
                <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-md text-xs font-semibold text-gray-800 flex items-center shadow-xs">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 mr-1" />
                  {college.rating.toFixed(1)}
                </div>
              </div>
              
              <div className="p-5 flex-grow flex flex-col space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-indigo-650 transition-colors leading-snug">
                    {college.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-0.5" />
                    {college.location}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 py-2.5 border-y border-gray-50 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-gray-400">Course Fees</span>
                    <div className="font-bold text-gray-850">{formatINR(college.fees)}/yr</div>
                  </div>
                  <div className="space-y-0.5 border-l border-gray-100 pl-3">
                    <span className="text-gray-400">Placements</span>
                    <div className="font-bold text-emerald-600">{college.placementRate.toFixed(1)}%</div>
                  </div>
                </div>

                <div className="pt-2 mt-auto">
                  <Link href={`/colleges/${college.id}`}>
                    <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Data Transparency Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-100 pt-6">
        <DataTransparency />
      </section>
    </div>
  );
}
