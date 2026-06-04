import React from 'react';

export default function CollegesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-pulse">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 bg-slate-200 rounded-lg" />
            <div className="h-8 w-48 bg-slate-250 rounded-lg" />
          </div>
          <div className="h-4 w-80 bg-slate-200 rounded-lg" />
        </div>
        <div className="h-8 w-28 bg-slate-200 rounded-lg" />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side Filters Sidebar (Desktop Skeleton) */}
        <div className="hidden md:block w-72 shrink-0 bg-white border border-gray-150 rounded-xl p-6 space-y-6">
          <div className="h-5 w-24 bg-slate-250 rounded-lg" />
          <div className="space-y-4">
            <div className="h-4 w-32 bg-slate-200 rounded-lg" />
            <div className="h-10 w-full bg-slate-100 rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="h-4 w-28 bg-slate-200 rounded-lg" />
            <div className="h-10 w-full bg-slate-100 rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="h-4 w-36 bg-slate-200 rounded-lg" />
            <div className="h-6 w-full bg-slate-100 rounded-lg" />
          </div>
        </div>

        {/* Right Side College Grid */}
        <div className="flex-grow space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-white border border-gray-150 rounded-xl overflow-hidden flex flex-col h-[420px]">
                <div className="h-48 bg-slate-200 w-full" />
                <div className="p-5 flex-grow flex flex-col space-y-4">
                  <div className="space-y-2">
                    <div className="h-5 w-3/4 bg-slate-250 rounded-lg" />
                    <div className="h-3 w-1/2 bg-slate-200 rounded-lg" />
                  </div>
                  <div className="h-12 w-full bg-slate-100 rounded-lg" />
                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-50">
                    <div className="space-y-1">
                      <div className="h-3 w-16 bg-slate-150 rounded" />
                      <div className="h-4 w-24 bg-slate-200 rounded" />
                    </div>
                    <div className="space-y-1">
                      <div className="h-3 w-16 bg-slate-150 rounded" />
                      <div className="h-4 w-20 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <div className="h-9 w-full bg-slate-100 rounded-lg mt-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
