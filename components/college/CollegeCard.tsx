'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useCompare } from '@/features/compare/CompareContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatINR } from '@/lib/utils';
import { Star, MapPin, Heart, IndianRupee, GitCompare, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

interface CourseShort {
  id: string;
  name: string;
}

interface CollegeCardProps {
  college: {
    id: string;
    name: string;
    location: string;
    image: string;
    fees: number;
    rating: number;
    placementRate: number;
    courses?: CourseShort[];
    nirfRank?: number | null;
    nirfCategory?: string | null;
  };
  initialIsSaved?: boolean;
}

export default function CollegeCard({ college, initialIsSaved = false }: CollegeCardProps) {
  const { data: session } = useSession();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isSaving, setIsSaving] = useState(false);
  const [imgSrc, setImgSrc] = useState(college.image);

  const selectedForCompare = isInCompare(college.id);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedForCompare) {
      removeFromCompare(college.id);
    } else {
      addToCompare({
        id: college.id,
        name: college.name,
        image: college.image,
        location: college.location,
      });
    }
  };

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error('Authentication Required', {
        description: 'Please log in to save colleges to your dashboard.',
        action: {
          label: 'Log In',
          onClick: () => window.location.href = '/login',
        },
      });
      return;
    }

    if (isSaving) return;

    // Optimistic UI update
    const previousState = isSaved;
    setIsSaved(!previousState);
    setIsSaving(true);

    try {
      if (previousState) {
        // Unsave request
        const res = await fetch(`/api/saved/${college.id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to remove saved college');
        }
        toast.success(`Removed ${college.name} from saved list`);
      } else {
        // Save request
        const res = await fetch('/api/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ collegeId: college.id }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to save college');
        }
        toast.success(`Saved ${college.name} to favorites`);
      }
    } catch (err) {
      // Rollback on failure
      setIsSaved(previousState);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="flex flex-col h-full hover:border-indigo-100 transition-all border border-gray-150 rounded-xl overflow-hidden group">
      {/* College Image Container */}
      <Link href={`/colleges/${college.id}`} className="relative h-48 w-full overflow-hidden block">
        <img
          src={imgSrc}
          alt={college.name}
          onError={() => setImgSrc('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80')}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs font-semibold text-gray-800 flex items-center shadow-xs">
          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 mr-1" />
          {college.rating.toFixed(1)}
        </div>

        {/* Heart Bookmark Button */}
        <button
          onClick={handleSaveClick}
          disabled={isSaving}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-xs transition-all cursor-pointer ${
            isSaved
              ? 'bg-red-50 text-red-500 hover:bg-red-100'
              : 'bg-white/90 text-gray-400 hover:bg-white hover:text-gray-600'
          }`}
          aria-label={isSaved ? 'Remove from saved' : 'Save college'}
        >
          <Heart className={`h-4.5 w-4.5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </Link>

      <CardContent className="flex flex-col flex-grow p-5 space-y-4">
        {/* Name and Location */}
        <div className="space-y-1">
          <Link href={`/colleges/${college.id}`}>
            <h3 className="font-bold text-base text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1 leading-snug">
              {college.name}
            </h3>
          </Link>
          <div className="flex items-center text-xs text-gray-500">
            <MapPin className="h-3.5 w-3.5 text-gray-400 mr-1 flex-shrink-0" />
            <span className="truncate">{college.location}</span>
          </div>
        </div>

        {/* Primary Stats (Fees, Placements) */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-50/50 text-xs">
          <div className="space-y-0.5">
            <div className="text-gray-400 flex items-center">
              <IndianRupee className="h-3 w-3 mr-0.5" />
              Avg Course Fee
            </div>
            <div className="font-semibold text-gray-800">
              {formatINR(college.fees)} <span className="text-[10px] text-gray-500 font-normal">/year</span>
            </div>
          </div>
          <div className="space-y-0.5 border-l border-gray-100 pl-3">
            <div className="text-gray-400 flex items-center">
              <GraduationCap className="h-3.5 w-3.5 mr-0.5 text-gray-400" />
              Placement Rate
            </div>
            <div className="font-semibold text-emerald-600">
              {college.placementRate > 0 ? `${college.placementRate.toFixed(1)}%` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Courses Offered Preview */}
        {college.courses && college.courses.length > 0 && (
          <div className="space-y-1">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Courses Offered</div>
            <div className="flex flex-wrap gap-1">
              {college.courses.slice(0, 2).map((course) => (
                <span
                  key={course.id}
                  className="inline-flex items-center px-2 py-0.5 rounded bg-gray-50 text-[10px] text-gray-600 border border-gray-100 font-medium"
                >
                  {course.name.split(' ').slice(0, 3).join(' ')}
                  {course.name.split(' ').length > 3 ? '...' : ''}
                </span>
              ))}
              {college.courses.length > 2 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-50 text-[10px] text-indigo-600 border border-indigo-100 font-medium">
                  +{college.courses.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center gap-2 pt-2 mt-auto">
          <Link href={`/colleges/${college.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-xs">
              View Details
            </Button>
          </Link>
          <Button
            variant={selectedForCompare ? 'primary' : 'outline'}
            size="sm"
            onClick={handleCompareClick}
            className={`px-3 ${selectedForCompare ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700' : 'text-gray-500'}`}
            title="Compare College"
          >
            <GitCompare className={`h-4 w-4 ${selectedForCompare ? 'stroke-indigo-700' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
