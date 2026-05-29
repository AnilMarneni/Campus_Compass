import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function CollegeDetailLoading() {
  return (
    <div className="flex flex-col min-h-screen pb-12 space-y-8">
      {/* Banner Hero Skeleton */}
      <div className="h-64 sm:h-80 w-full bg-slate-900/5 relative animate-pulse flex items-end">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-4">
          <Skeleton className="h-4 w-24 bg-gray-250" />
          <Skeleton className="h-8 w-1/2 bg-gray-250" />
          <div className="flex space-x-4">
            <Skeleton className="h-4 w-32 bg-gray-250" />
            <Skeleton className="h-4 w-20 bg-gray-250" />
          </div>
        </div>
      </div>

      {/* Tab bar skeleton */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center space-x-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <Card className="border border-gray-150">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-4/5" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-gray-100">
                {[1, 2, 3, 4].map((idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-lg space-y-2 text-center flex flex-col items-center">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                ))}
              </div>

              {/* Quick Facts */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 pt-4 border-t border-gray-100">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <div key={idx} className="space-y-2 pl-4 border-l border-gray-100 first:border-0 first:pl-0">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
