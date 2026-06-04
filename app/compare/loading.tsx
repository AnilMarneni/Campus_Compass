import React from 'react';

export default function CompareLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      {/* Tracker placeholder */}
      <div className="h-6 w-64 bg-slate-200 rounded-lg" />
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 bg-slate-200 rounded-lg" />
            <div className="h-8 w-56 bg-slate-250 rounded-lg" />
          </div>
          <div className="h-4 w-96 bg-slate-200 rounded" />
        </div>
        <div className="h-10 w-44 bg-slate-200 rounded-lg" />
      </div>

      {/* Comparison Matrix Table Skeleton */}
      <div className="bg-white border border-gray-150 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100">
                <th className="py-5 px-6 w-1/4 border-r border-gray-100">
                  <div className="h-4 w-24 bg-slate-250 rounded" />
                </th>
                {Array.from({ length: 3 }).map((_, idx) => (
                  <th key={idx} className="py-5 px-6 w-1/4 border-r border-gray-100 last:border-r-0">
                    <div className="space-y-4">
                      <div className="h-28 w-full bg-slate-200 rounded-lg" />
                      <div className="space-y-2">
                        <div className="h-4 w-5/6 bg-slate-250 rounded" />
                        <div className="h-3 w-1/3 bg-slate-200 rounded" />
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Array.from({ length: 8 }).map((_, rIdx) => (
                <tr key={rIdx}>
                  <td className="py-4 px-6 border-r border-gray-100">
                    <div className="h-4 w-32 bg-slate-200 rounded" />
                  </td>
                  {Array.from({ length: 3 }).map((_, cIdx) => (
                    <td key={cIdx} className="py-4 px-6 border-r border-gray-100 last:border-r-0">
                      <div className="h-4 w-28 bg-slate-150 rounded" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
