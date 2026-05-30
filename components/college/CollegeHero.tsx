'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCompare } from '@/features/compare/CompareContext';
import { Button } from '@/components/ui/button';
import { formatINR } from '@/lib/utils';
import { Star, MapPin, Heart, GitCompare, GraduationCap, IndianRupee, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface CollegeHeroProps {
  college: {
    id: string;
    name: string;
    location: string;
    description: string;
    image: string;
    fees: number;
    rating: number;
    placementRate: number;
    nirfRank?: number | null;
    nirfScore?: number | null;
    nirfCategory?: string | null;
    nirfYear?: number | null;
    institutionType?: string | null;
  };
  initialIsSaved?: boolean;
}

export default function CollegeHero({ college, initialIsSaved = false }: CollegeHeroProps) {
  const { data: session } = useSession();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isSaving, setIsSaving] = useState(false);
  const [imgSrc, setImgSrc] = useState(college.image);

  const selectedForCompare = isInCompare(college.id);

  const handleCompareClick = () => {
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

  const handleSaveClick = async () => {
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

    const previousState = isSaved;
    setIsSaved(!previousState);
    setIsSaving(true);

    try {
      if (previousState) {
        const res = await fetch(`/api/saved/${college.id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to remove saved college');
        }
        toast.success(`Removed ${college.name} from saved list`);
      } else {
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
      setIsSaved(previousState);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main college image */}
          <div className="w-full lg:w-96 h-60 rounded-xl overflow-hidden shadow-xs relative shrink-0 border border-gray-100">
            <img
              src={imgSrc}
              alt={college.name}
              onError={() => setImgSrc('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80')}
              className="w-full h-full object-cover"
              loading="eager"
            />
            {/* Rating overlay */}
            <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-md text-xs font-bold text-gray-800 flex items-center shadow-xs">
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 mr-1" />
              {college.rating.toFixed(1)}
            </div>
          </div>

          {/* Details & Info */}
          <div className="flex-grow space-y-4">
            <div className="flex flex-wrap gap-2 items-center">

              {college.institutionType && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200">
                  {college.institutionType}
                </span>
              )}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700">
                Verified Placements
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 leading-tight">
                {college.name}
              </h1>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4.5 w-4.5 text-gray-400 mr-1 flex-shrink-0" />
                <span>{college.location}</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">
              {college.description}
            </p>

            {/* Quick Stat Blocks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 max-w-xl">
              <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-lg space-y-0.5">
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                  <IndianRupee className="h-3 w-3 mr-0.5" />
                  Average Course Fee
                </div>
                <div className="text-base font-bold text-gray-800">
                  {formatINR(college.fees)} <span className="text-[10px] text-gray-500 font-normal">/year</span>
                </div>
              </div>

              <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-lg space-y-0.5">
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                  <GraduationCap className="h-3.5 w-3.5 mr-0.5 text-gray-400" />
                  Placement Rate
                </div>
                <div className="text-base font-bold text-emerald-600">
                  {college.placementRate > 0 ? `${college.placementRate.toFixed(1)}%` : 'N/A'}
                </div>
              </div>

              <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-lg col-span-2 sm:col-span-1 space-y-0.5">
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                  <Star className="h-3.5 w-3.5 mr-0.5 text-amber-500" />
                  User Rating
                </div>
                <div className="text-base font-bold text-gray-800">
                  {college.rating.toFixed(1)} <span className="text-[10px] text-gray-500 font-normal">/ 5.0</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
              <Button
                variant={selectedForCompare ? 'primary' : 'outline'}
                onClick={handleCompareClick}
                className={`text-xs gap-1.5 h-9 ${selectedForCompare ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100' : ''}`}
              >
                <GitCompare className="h-4 w-4" />
                {selectedForCompare ? 'Selected for Compare' : 'Add to Compare'}
              </Button>

              <Button
                variant="outline"
                onClick={handleSaveClick}
                disabled={isSaving}
                className={`text-xs gap-1.5 h-9 ${isSaved ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' : 'text-gray-600'}`}
              >
                <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-600' : ''}`} />
                {isSaved ? 'Saved in List' : 'Save to Favorites'}
              </Button>

              <Button
                variant="ghost"
                onClick={handleShareClick}
                className="text-xs gap-1.5 text-gray-500 h-9"
                title="Copy share link"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
