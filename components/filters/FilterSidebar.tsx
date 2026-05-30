'use client';

import React, { useState, useEffect, useTransition, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, MapPin, IndianRupee, Star, BookOpen, RotateCcw, SlidersHorizontal } from 'lucide-react';

const LOCATIONS = [
  'Mumbai',
  'New Delhi',
  'Chennai',
  'Bengaluru',
  'Pune',
  'Pilani',
  'Vellore',
  'Tiruchirappalli',
  'Ahmedabad',
];

const COURSE_TYPES = [
  { label: 'Engineering (B.Tech/B.E)', value: 'B.Tech' },
  { label: 'Management (MBA/BBA)', value: 'MBA' },
  { label: 'Science (B.Sc)', value: 'B.Sc' },
  { label: 'Commerce (B.Com)', value: 'B.Com' },
];

const INSTITUTION_TYPES = [
  { label: 'IIT', value: 'IIT' },
  { label: 'NIT', value: 'NIT' },
  { label: 'IIIT', value: 'IIIT' },
  { label: 'IIM', value: 'IIM' },
  { label: 'Private Univ', value: 'Private University' },
  { label: 'Govt Univ', value: 'Government University' },
  { label: 'College', value: 'College' },
];


export default function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state for debounced search and slider inputs
  const [searchText, setSearchText] = useState(searchParams.get('search') || '');
  const [maxFees, setMaxFees] = useState(searchParams.get('maxFees') || '3000000');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '0');
  const [courseType, setCourseType] = useState(searchParams.get('courseType') || '');
  const [institutionType, setInstitutionType] = useState(searchParams.get('institutionType') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'rating');

  // Sync state with URL params on navigation (e.g. back button)
  useEffect(() => {
    setSearchText(searchParams.get('search') || '');
    setMaxFees(searchParams.get('maxFees') || '3000000');
    setLocation(searchParams.get('location') || '');
    setMinRating(searchParams.get('minRating') || '0');
    setCourseType(searchParams.get('courseType') || '');
    setInstitutionType(searchParams.get('institutionType') || '');
    setSortBy(searchParams.get('sortBy') || 'rating');
  }, [searchParams]);

  const updateFilters = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset to page 1 on filter modification
    params.set('page', '1');

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === '0') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }, [searchParams, pathname, router]);

  // Debounced search input trigger
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const urlSearch = searchParams.get('search') || '';
      if (searchText !== urlSearch) {
        updateFilters({ search: searchText });
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchText, searchParams, updateFilters]);

  const handleReset = () => {
    setSearchText('');
    setMaxFees('3000000');
    setLocation('');
    setMinRating('0');
    setCourseType('');
    setInstitutionType('');
    setSortBy('rating');
    
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <aside className="w-full bg-white border border-gray-150 rounded-xl p-5 space-y-6 shrink-0 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-2 font-bold text-gray-900 text-sm tracking-tight uppercase">
          <SlidersHorizontal className="h-4 w-4 text-gray-500" />
          <span>Filters</span>
        </div>
        {(searchText || location || maxFees !== '3000000' || minRating !== '0' || courseType) && (
          <button
            onClick={handleReset}
            className="flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset All
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="College name, course, location..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 focus:border-indigo-500 rounded-lg text-sm bg-gray-50/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>
      </div>
      {/* Sort By Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            updateFilters({
              sortBy: e.target.value,
              // If sorting by fees, default to lowest first (asc)
              sortOrder: e.target.value === 'fees' ? 'asc' : 'desc',
            });
          }}
          className="w-full border border-gray-200 bg-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer"
        >
          <option value="rating">Highest Rated</option>
          <option value="fees">Lowest Fees</option>
          <option value="name">Alphabetical</option>
        </select>
      </div>

      {/* Location Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center">
          <MapPin className="h-3.5 w-3.5 text-gray-400 mr-1" />
          Location
        </label>
        <select
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            updateFilters({ location: e.target.value });
          }}
          className="w-full border border-gray-200 bg-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer"
        >
          <option value="">All Locations</option>
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Institution Classification Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center">
          <BookOpen className="h-3.5 w-3.5 text-gray-400 mr-1" />
          Classification
        </label>
        <div className="flex flex-wrap gap-1.5">
          {INSTITUTION_TYPES.map((type) => {
            const isSelected = institutionType === type.value;
            return (
              <button
                key={type.value}
                onClick={() => {
                  const val = isSelected ? '' : type.value;
                  setInstitutionType(val);
                  updateFilters({ institutionType: val });
                }}
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                    : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-650'
                }`}
              >
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Course Type Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center">
          <BookOpen className="h-3.5 w-3.5 text-gray-400 mr-1" />
          Stream / Discipline
        </label>
        <div className="flex flex-col space-y-1.5">
          {COURSE_TYPES.map((type) => {
            const isSelected = courseType === type.value;
            return (
              <button
                key={type.value}
                onClick={() => {
                  const val = isSelected ? '' : type.value;
                  setCourseType(val);
                  updateFilters({ courseType: val });
                }}
                className={`text-left text-xs px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                    : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
              >
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Max Fees Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <label className="font-semibold text-gray-700 uppercase tracking-wider flex items-center">
            <IndianRupee className="h-3.5 w-3.5 text-gray-400 mr-0.5" />
            Max Annual Fees
          </label>
          <span className="font-bold text-indigo-600">
            {maxFees === '3000000' ? 'Any' : `${(parseInt(maxFees) / 100000).toFixed(1)}L`}
          </span>
        </div>
        <input
          type="range"
          min="20000"
          max="3000000"
          step="10000"
          value={maxFees}
          onChange={(e) => setMaxFees(e.target.value)}
          onMouseUp={() => updateFilters({ maxFees })}
          onTouchEnd={() => updateFilters({ maxFees })}
          className="w-full accent-indigo-600 cursor-ew-resize h-1.5 bg-gray-200 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[10px] text-gray-400">
          <span>₹20K</span>
          <span>₹15L</span>
          <span>₹30L+</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center">
          <Star className="h-3.5 w-3.5 text-gray-400 mr-1" />
          Minimum Rating
        </label>
        <div className="flex flex-col space-y-1.5">
          {['0', '4.0', '4.5', '4.8'].map((ratingVal) => {
            const isSelected = minRating === ratingVal;
            const label = ratingVal === '0' ? 'All Ratings' : `${ratingVal} ★ & above`;
            return (
              <button
                key={ratingVal}
                onClick={() => {
                  setMinRating(ratingVal);
                  updateFilters({ minRating: ratingVal });
                }}
                className={`text-left text-xs px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                    : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
      
      {isPending && (
        <div className="text-[10px] text-center text-indigo-500 font-medium animate-pulse">
          Refreshing results...
        </div>
      )}
    </aside>
  );
}
