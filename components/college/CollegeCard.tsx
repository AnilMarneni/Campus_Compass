'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useCompare } from '@/features/compare/CompareContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Heart, GitCompare } from 'lucide-react';
import { toast } from 'sonner';

interface CourseShort {
  id: string;
  name: string;
}

interface AreaOfStudyShort {
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
    averagePackage?: number | null;
    highestPackage?: number | null;
    courses?: CourseShort[];
    areasOfStudy?: AreaOfStudyShort[];
    nirfRank?: number | null;
    nirfCategory?: string | null;
    logo?: string | null;
    campusLifeRating?: number | null;
    institutionType?: string | null;
  };
  initialIsSaved?: boolean;
  onUnsave?: (collegeId: string) => void;
}

const getAbbreviation = (name: string) => {
  const clean = name.toLowerCase().trim();
  if (clean === 'computer science' || clean === 'computer science & engineering') return 'CSE';
  if (clean === 'artificial intelligence') return 'AI';
  if (clean === 'data science') return 'DS';
  if (clean.includes('mechanical')) return 'Mechanical';
  if (clean.includes('electrical')) return 'Electrical';
  if (clean.includes('civil')) return 'Civil';
  if (clean.includes('chemical')) return 'Chemical';
  if (clean.includes('aerospace')) return 'Aerospace';
  if (clean === 'business management' || clean === 'business administration') return 'MBA';
  if (clean === 'human resources') return 'HR';
  if (clean === 'finance & economics' || clean === 'finance & accounting' || clean === 'finance') return 'Finance';
  if (clean === 'commerce') return 'Commerce';
  if (clean === 'economics' || clean === 'economics & policy') return 'Economics';
  if (clean === 'english literature') return 'English';
  if (clean === 'mass media' || clean === 'visual communication') return 'Media';
  if (clean === 'physics & chemistry') return 'Sciences';
  
  return name.split(' ')[0] || name;
};

export default function CollegeCard({ college, initialIsSaved = false, onUnsave }: CollegeCardProps) {
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
        if (onUnsave) {
          onUnsave(college.id);
        }
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
    <Card className="flex flex-col h-full hover:shadow-md hover:border-indigo-150 transition-all duration-300 border border-gray-150 rounded-2xl overflow-hidden group bg-white">
      {/* College Image Container */}
      <Link href={`/colleges/${college.id}`} className="relative h-44 w-full overflow-hidden block">
        <img
          src={imgSrc}
          alt={college.name}
          onError={() => setImgSrc('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80')}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-bold text-gray-800 flex items-center shadow-xs">
          <Star className="h-3 w-3 text-amber-500 fill-amber-500 mr-0.5" />
          {college.rating.toFixed(1)}
        </div>

        {/* Heart Bookmark Button */}
        <button
          onClick={handleSaveClick}
          disabled={isSaving}
          className={`absolute top-3 right-3 p-1.5 rounded-full shadow-xs transition-all cursor-pointer ${
            isSaved
              ? 'bg-red-50 text-red-500 hover:bg-red-100'
              : 'bg-white/90 text-gray-400 hover:bg-white hover:text-gray-600'
          }`}
          aria-label={isSaved ? 'Remove from saved' : 'Save college'}
        >
          <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </Link>

      <CardContent className="flex flex-col flex-grow p-5 space-y-4">
        {/* Name/Location Header */}
        <div className="space-y-1 min-w-0 flex-1">
          <Link href={`/colleges/${college.id}`}>
            <h3 className="font-bold text-sm text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
              {college.name}
            </h3>
          </Link>
          <div className="flex items-center space-x-1.5 text-xs text-gray-500">
            <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{college.location.split(',')[0]}</span>
            {college.institutionType && (
              <>
                <span className="text-gray-300">•</span>
                <span className="font-semibold bg-slate-100 text-slate-700 px-1 rounded text-[9px] uppercase tracking-wider shrink-0">{college.institutionType}</span>
              </>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-1 py-3 border-y border-gray-100 text-[10px] text-gray-500">
          <div className="space-y-0.5">
            <div className="text-gray-400 font-medium">Campus Life</div>
            <div className="font-bold text-gray-800 flex items-center text-xs">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500 mr-0.5 shrink-0" />
              {college.campusLifeRating ? college.campusLifeRating.toFixed(1) : (college.rating - 0.1).toFixed(1)}
            </div>
          </div>
          <div className="space-y-0.5 border-l border-gray-100 pl-2">
            <div className="text-gray-400 font-medium">Placements</div>
            <div className="font-bold text-emerald-600 text-xs">
              {college.placementRate > 0 ? `${college.placementRate.toFixed(1)}%` : 'N/A'}
            </div>
          </div>
          <div className="space-y-0.5 border-l border-gray-100 pl-2">
            <div className="text-gray-400 font-medium">Avg Package</div>
            <div className="font-bold text-indigo-600 text-xs">
              {college.averagePackage ? `₹${college.averagePackage.toFixed(1)} LPA` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Top Areas of Study */}
        {college.areasOfStudy && college.areasOfStudy.length > 0 && (
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Top Areas of Study</div>
            <div className="text-xs text-indigo-650 font-semibold truncate leading-relaxed">
              {college.areasOfStudy.slice(0, 3).map(area => getAbbreviation(area.name)).join(' • ')}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center gap-2 pt-2 mt-auto">
          <Link href={`/colleges/${college.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-xs cursor-pointer font-semibold py-1.5 h-8">
              View Details
            </Button>
          </Link>
          <Button
            variant={selectedForCompare ? 'primary' : 'outline'}
            size="sm"
            onClick={handleCompareClick}
            className={`px-3 h-8 cursor-pointer ${selectedForCompare ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700' : 'text-gray-500'}`}
            title="Compare College"
          >
            <GitCompare className={`h-4 w-4 ${selectedForCompare ? 'stroke-indigo-700' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
