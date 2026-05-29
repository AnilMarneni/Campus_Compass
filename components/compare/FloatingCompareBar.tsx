'use client';

import React from 'react';
import Link from 'next/link';
import { useCompare } from '@/features/compare/CompareContext';
import { GitCompare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FloatingCompareBar() {
  const { compareColleges, removeFromCompare, clearCompare } = useCompare();

  if (compareColleges.length === 0) return null;

  const compareUrl = `/compare?ids=${compareColleges.map((c) => c.id).join(',')}`;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in slide-in-from-bottom duration-300">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-xl shadow-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Count and Header */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <GitCompare className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">Compare Colleges</h4>
            <p className="text-xs text-slate-400 font-medium">
              {compareColleges.length} of 3 selected
            </p>
          </div>
        </div>

        {/* Selected Colleges Row */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-start sm:justify-center overflow-x-auto py-1">
          {compareColleges.map((college) => (
            <div
              key={college.id}
              className="flex items-center bg-slate-800 border border-slate-700 pl-2 pr-1.5 py-1 rounded-lg text-xs space-x-2 shrink-0 group"
            >
              <span className="max-w-[100px] truncate text-slate-200 font-medium">
                {college.name.split(',')[0]}
              </span>
              <button
                onClick={() => removeFromCompare(college.id)}
                className="text-slate-400 hover:text-red-400 transition-colors p-0.5 rounded cursor-pointer"
                title="Remove"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            onClick={clearCompare}
            className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 transition-colors cursor-pointer"
          >
            Clear
          </button>
          
          <Link href={compareUrl} className="w-full sm:w-auto">
            <Button size="sm" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4">
              Compare Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
