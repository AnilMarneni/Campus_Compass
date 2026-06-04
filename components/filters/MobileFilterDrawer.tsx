'use client';

import React, { useState, Suspense } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import FilterSidebar from './FilterSidebar';
import { Button } from '@/components/ui/button';

export default function MobileFilterDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden w-full flex items-center justify-between gap-3 bg-white p-4 border border-gray-150 rounded-xl shadow-xs">
      <div className="text-sm font-semibold text-gray-700">Find your ideal college</div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-1 text-xs cursor-pointer"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <span>Filters</span>
      </Button>

      {/* Backdrop Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          {/* Main Overlay Content */}
          <div className="relative w-full max-w-sm h-full bg-white flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-250">
            {/* Close Trigger */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
              aria-label="Close filters"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Filter sidebar content */}
            <div className="mt-8 flex-grow">
              <Suspense fallback={<div className="animate-pulse bg-gray-150 rounded-xl h-[400px] w-full" />}>
                <FilterSidebar />
              </Suspense>
            </div>

            {/* View results action */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <Button
                onClick={() => setIsOpen(false)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5"
              >
                Apply & View Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
