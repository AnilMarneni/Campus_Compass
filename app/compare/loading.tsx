import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CompareLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-3 pb-4 border-b border-gray-100">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-white border border-gray-150 rounded-xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-gray-100 bg-slate-50 flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <div className="flex space-x-6 w-3/4 justify-end">
            <Skeleton className="h-32 w-1/4 rounded-lg" />
            <Skeleton className="h-32 w-1/4 rounded-lg" />
            <Skeleton className="h-32 w-1/4 rounded-lg" />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {[1, 2, 3, 4, 5, 6].map((rowIdx) => (
            <div key={rowIdx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <Skeleton className="h-4 w-32" />
              <div className="flex space-x-6 w-3/4 justify-end">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
