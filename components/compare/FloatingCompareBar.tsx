'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCompare } from '@/features/compare/CompareContext';
import { GitCompare, X, Bookmark, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export default function FloatingCompareBar() {
  const { compareColleges, removeFromCompare, clearCompare } = useCompare();
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);

  if (compareColleges.length === 0) return null;

  const compareUrl = `/compare?ids=${compareColleges.map((c) => c.id).join(',')}`;

  const handleSaveSet = async () => {
    if (!session) {
      toast.error('Authentication Required', {
        description: 'Please log in to save your comparison sets.',
      });
      return;
    }

    const defaultName = `Compare: ${compareColleges.map((c) => c.name.split(',')[0]).join(' vs ')}`;
    const setName = prompt('Enter a name for this comparison set:', defaultName);
    
    if (setName === null) return; // User cancelled
    if (!setName.trim()) {
      toast.error('Please enter a valid name for the set');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/compare/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: setName.trim(),
          collegeIds: compareColleges.map((c) => c.id),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Saved "${setName}" to your dashboard!`);
      } else {
        toast.error(data.error || 'Failed to save comparison');
      }
    } catch (e) {
      console.error(e);
      toast.error('Error occurred while saving set');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-3xl px-4 animate-in slide-in-from-bottom duration-300">
      <div className="bg-slate-950/95 backdrop-blur-md border border-slate-800/80 text-white rounded-2xl shadow-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Count and Header */}
        <div className="flex items-center space-x-3.5 w-full md:w-auto">
          <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-900/30 shrink-0">
            <GitCompare className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base tracking-tight text-slate-100">Compare Colleges</h4>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
              {compareColleges.length} of 3 selected
            </p>
          </div>
        </div>

        {/* Selected Colleges Row */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-start md:justify-center overflow-x-auto py-1 scrollbar-none">
          {compareColleges.map((college) => (
            <div
              key={college.id}
              className="flex items-center bg-slate-900/80 border border-slate-800/80 pl-3.5 pr-2 py-2 rounded-xl text-xs sm:text-sm space-x-3 shrink-0 group transition-all duration-200 hover:border-indigo-500/30 hover:bg-slate-900"
            >
              <span className="max-w-[130px] sm:max-w-[170px] truncate text-slate-200 group-hover:text-white font-semibold transition-colors">
                {college.name.split(',')[0]}
              </span>
              <button
                onClick={() => removeFromCompare(college.id)}
                className="text-slate-400 hover:text-red-400 hover:bg-slate-800 p-1 rounded-lg transition-colors cursor-pointer"
                title="Remove"
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end shrink-0">
          <button
            onClick={handleSaveSet}
            disabled={isSaving}
            className="text-indigo-400 hover:text-indigo-300 disabled:opacity-50 text-xs sm:text-sm font-semibold px-3 py-2 transition-colors cursor-pointer flex items-center gap-1"
          >
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Bookmark className="h-3.5 w-3.5" />
            )}
            <span>Save Set</span>
          </button>

          <button
            onClick={clearCompare}
            className="text-slate-400 hover:text-slate-200 text-xs sm:text-sm font-semibold px-3 py-2 transition-colors cursor-pointer"
          >
            Clear
          </button>
          
          <Link href={compareUrl} className="w-full md:w-auto">
            <Button size="md" className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold px-5 shadow-lg shadow-indigo-900/20 active:scale-98 transition-all">
              Compare Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
