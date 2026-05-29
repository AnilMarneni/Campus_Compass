import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { SlidersHorizontal } from 'lucide-react';

export default function CollegesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Skeleton (Desktop only) */}
        <div className="hidden md:block w-72 shrink-0 space-y-6 bg-white border border-gray-150 rounded-xl p-5">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="h-4 w-4 text-gray-300" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
          {[1, 2, 3, 4, 5].map((idx) => (
            <div key={idx} className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>

        {/* Mobile Filters trigger Skeleton */}
        <div className="md:hidden w-full h-16 bg-white border border-gray-150 rounded-xl flex items-center justify-between p-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-20" />
        </div>

        {/* Grid List Cards Skeletons */}
        <div className="flex-grow space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-150 rounded-xl overflow-hidden shadow-xs h-[390px] flex flex-col p-5 space-y-4"
              >
                {/* Image Placeholder */}
                <Skeleton className="h-40 w-full rounded-lg" />
                {/* Title */}
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-100">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="space-y-1 pl-3">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                {/* Courses */}
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-16" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
                {/* Button actions */}
                <div className="flex gap-2 pt-2 mt-auto">
                  <Skeleton className="h-8 flex-grow" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
