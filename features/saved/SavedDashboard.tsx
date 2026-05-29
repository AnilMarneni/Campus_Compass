'use client';

import React, { useState, useEffect } from 'react';
import CollegeCard from '@/components/college/CollegeCard';
import { Button } from '@/components/ui/button';
import { GitCompare, Bookmark, Compass, HeartOff, Star, BarChart3, Clock, ArrowRight, Award } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Course {
  id: string;
  name: string;
}

interface College {
  id: string;
  name: string;
  location: string;
  image: string;
  fees: number;
  rating: number;
  placementRate: number;
  averagePackage?: number | null;
  highestPackage?: number | null;
  courses?: Course[];
}

interface SavedCollegeItem {
  id: string;
  college: College;
}

interface SavedDashboardProps {
  initialSaved: SavedCollegeItem[];
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function SavedDashboard({ initialSaved, user }: SavedDashboardProps) {
  const [savedItems, setSavedItems] = useState<SavedCollegeItem[]>(initialSaved);
  const [compareSelection, setCompareSelection] = useState<string[]>([]);
  const [totalComparisons, setTotalComparisons] = useState(4);

  // Sync with client-side comparisons count
  useEffect(() => {
    const count = localStorage.getItem('campus_compass_total_comparisons');
    if (count) {
      setTotalComparisons(parseInt(count, 10));
    } else {
      localStorage.setItem('campus_compass_total_comparisons', '4');
    }
  }, []);

  const handleUnsave = async (collegeId: string, name: string) => {
    try {
      const res = await fetch(`/api/saved/${collegeId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to unsave');
      }

      setSavedItems((prev) => prev.filter((item) => item.college.id !== collegeId));
      setCompareSelection((prev) => prev.filter((id) => id !== collegeId));
      toast.success(`Removed ${name} from saved list`);
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while removing');
    }
  };

  const handleToggleSelectCompare = (id: string) => {
    if (compareSelection.includes(id)) {
      setCompareSelection((prev) => prev.filter((item) => item !== id));
    } else {
      if (compareSelection.length >= 3) {
        toast.warning('You can compare a maximum of 3 colleges side-by-side.');
        return;
      }
      setCompareSelection((prev) => [...prev, id]);
    }
  };

  // Increment total comparisons counter in localStorage when launching compare
  const handleLaunchCompare = () => {
    const nextCount = totalComparisons + 1;
    setTotalComparisons(nextCount);
    localStorage.setItem('campus_compass_total_comparisons', nextCount.toString());
  };

  const compareUrl = `/compare?ids=${compareSelection.join(',')}`;

  // Computations for Analytics Cards
  const savedCount = savedItems.length;
  
  const highestRated = savedItems.length > 0 
    ? savedItems.reduce((max, item) => item.college.rating > max.college.rating ? item : max, savedItems[0])
    : null;

  const avgRating = savedItems.length > 0
    ? savedItems.reduce((sum, item) => sum + item.college.rating, 0) / savedItems.length
    : 0;

  const recentlySaved = savedItems.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Profile info block */}
      <div className="bg-white border border-gray-150 rounded-xl p-6 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || 'User'}
              className="h-16 w-16 rounded-full border border-indigo-150 object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650 font-bold text-2xl">
              {user.name ? user.name[0]?.toUpperCase() : 'U'}
            </div>
          )}
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-xs text-gray-400 font-medium">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-center text-xs">
          <div className="space-y-1 border-r border-gray-100 pr-6">
            <span className="text-gray-400 uppercase font-semibold tracking-wider">Account Status</span>
            <div className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Active</div>
          </div>
          <div className="space-y-1 pl-1">
            <span className="text-gray-400 uppercase font-semibold tracking-wider">Account Role</span>
            <div className="text-sm font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">Student</div>
          </div>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Saved */}
        <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-3xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Saved Colleges</span>
            <Bookmark className="h-4.5 w-4.5 text-indigo-500" />
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-extrabold text-gray-950">{savedCount}</div>
            <p className="text-[10px] text-gray-450 font-medium">Bookmarked universities</p>
          </div>
        </div>

        {/* Card 2: Comparisons */}
        <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-3xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Comparisons</span>
            <GitCompare className="h-4.5 w-4.5 text-indigo-500" />
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-extrabold text-gray-950">{totalComparisons}</div>
            <p className="text-[10px] text-gray-450 font-medium">Comparison sessions launched</p>
          </div>
        </div>

        {/* Card 3: Highest Rated Saved */}
        <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-3xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Highest Rated</span>
            <Star className="h-4.5 w-4.5 text-amber-500 fill-amber-500" />
          </div>
          <div className="space-y-0.5">
            <div className="text-lg font-extrabold text-gray-950 truncate max-w-[180px]">
              {highestRated ? highestRated.college.name.split(',')[0] : 'N/A'}
            </div>
            <p className="text-[10px] text-gray-450 font-medium flex items-center">
              {highestRated ? (
                <>
                  Score: <span className="font-bold text-amber-600 ml-1">{highestRated.college.rating.toFixed(1)} ★</span>
                </>
              ) : (
                'No colleges saved'
              )}
            </p>
          </div>
        </div>

        {/* Card 4: Avg Saved Rating */}
        <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-3xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Average Rating</span>
            <BarChart3 className="h-4.5 w-4.5 text-indigo-550" />
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-extrabold text-gray-950">
              {avgRating > 0 ? `${avgRating.toFixed(2)}` : 'N/A'}
            </div>
            <p className="text-[10px] text-gray-450 font-medium">Average score of saved list</p>
          </div>
        </div>
      </div>

      {/* 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: All Saved Colleges (Col Span 3) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-900 flex items-center">
              <Bookmark className="h-5 w-5 text-indigo-600 mr-2" />
              My Saved Colleges
            </h3>

            {savedItems.length > 1 && (
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-gray-500">
                  {compareSelection.length > 0
                    ? `${compareSelection.length} selected for comparison`
                    : 'Select colleges to compare'}
                </span>
                {compareSelection.length >= 2 && (
                  <Link href={compareUrl} onClick={handleLaunchCompare}>
                    <Button size="sm" className="bg-indigo-600 text-white font-semibold text-xs py-1.5 h-8">
                      Compare Selected ({compareSelection.length})
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>

          {savedItems.length === 0 ? (
            /* Empty Dashboard State */
            <div className="flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-2xl bg-white p-12 text-center h-[350px] space-y-4">
              <div className="bg-slate-50 p-4 rounded-full text-slate-400">
                <HeartOff className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-base text-gray-900">Your dashboard is empty</h4>
                <p className="text-xs text-gray-450 max-w-xs mx-auto leading-normal">
                  You haven't bookmarked any colleges yet. Explore the listings to start building your favorites list.
                </p>
              </div>
              <Link href="/colleges" className="pt-2">
                <Button variant="primary" size="sm" className="gap-1.5">
                  <Compass className="h-4 w-4" />
                  Browse Colleges
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {savedItems.map((item) => {
                const isSelectedForCompare = compareSelection.includes(item.college.id);
                return (
                  <div key={item.id} className="relative group">
                    <CollegeCard
                      college={item.college}
                      initialIsSaved={true}
                    />

                    {/* Checkbox bar for comparison selection */}
                    <div className="absolute bottom-16 left-5 right-18 bg-white/95 border-t border-gray-50 pt-2 flex items-center justify-between z-10">
                      <label className="flex items-center space-x-2 text-[10px] text-gray-500 font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelectedForCompare}
                          onChange={() => handleToggleSelectCompare(item.college.id)}
                          className="rounded text-indigo-650 accent-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 border-gray-300"
                        />
                        <span>Quick Select Compare</span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Sidebar Panels (Col Span 1) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Recently Saved Activity Panel */}
          <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-3xs space-y-4">
            <h4 className="font-bold text-xs text-gray-900 flex items-center uppercase tracking-wider border-b border-gray-50 pb-2">
              <Clock className="h-4 w-4 text-indigo-500 mr-2" />
              Recently Saved
            </h4>
            
            {recentlySaved.length === 0 ? (
              <p className="text-xs text-gray-400 font-medium">No recent bookmark activity.</p>
            ) : (
              <div className="space-y-3 divide-y divide-gray-50">
                {recentlySaved.map((item, index) => (
                  <div key={item.id} className={`pt-3 first:pt-0 flex flex-col space-y-1`}>
                    <Link href={`/colleges/${item.college.id}`} className="text-xs font-bold text-gray-800 hover:text-indigo-650 line-clamp-1 transition-colors">
                      {item.college.name}
                    </Link>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold">
                      <span>{item.college.location.split(',')[0]}</span>
                      <span className="text-amber-600 flex items-center">
                        <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500 mr-0.5" />
                        {item.college.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {savedItems.length > 0 && (
              <div className="pt-2 border-t border-gray-50">
                <Link href="/colleges" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5">
                  Discover more colleges
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
