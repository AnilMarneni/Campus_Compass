import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Grid structure matching SavedDashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main section: 3 columns */}
        <div className="lg:col-span-3 space-y-8">
          {/* Analytics Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="bg-white border border-gray-150 rounded-xl p-5 space-y-3 shadow-2xs">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-7 w-12" />
                <Skeleton className="h-3 w-28" />
              </div>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2].map((idx) => (
                <div key={idx} className="bg-white border border-gray-150 rounded-xl p-5 space-y-4 shadow-2xs h-64">
                  <Skeleton className="h-32 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar section: 1 column */}
        <div className="lg:col-span-1 space-y-6">
          {/* User profile details card */}
          <div className="bg-white border border-gray-150 rounded-xl p-5 space-y-4 shadow-2xs text-center flex flex-col items-center">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-1.5 w-full flex flex-col items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3.5 w-36" />
            </div>
          </div>

          {/* Recently Saved sidebar skeleton */}
          <div className="bg-white border border-gray-150 rounded-xl p-5 space-y-4 shadow-2xs">
            <Skeleton className="h-4 w-36" />
            <div className="space-y-3">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="flex items-center space-x-3 py-2 border-b border-gray-50 last:border-0">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <div className="space-y-1 flex-grow">
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
