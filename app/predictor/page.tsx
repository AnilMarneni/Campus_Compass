'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, GraduationCap, ChevronRight, MapPin, Star, Sparkles, Loader2, ArrowLeft, GitCompare, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatINR } from '@/lib/utils';
import { useCompare } from '@/features/compare/CompareContext';
import { toast } from 'sonner';

const EXAMS = [
  { label: 'JEE Main (Engineering)', value: 'JEE Main' },
  { label: 'CAT (Management)', value: 'CAT' },
  { label: 'CUET (Arts & Commerce)', value: 'CUET' },
];

const STREAMS_BY_EXAM: Record<string, string[]> = {
  'JEE Main': ['Computer Science', 'Mechanical Engineering', 'Electronics & Communication', 'Electrical Engineering'],
  'CAT': ['Business Management', 'Finance', 'Marketing', 'Human Resources'],
  'CUET': ['Economics', 'Commerce', 'English Literature', 'Physics'],
};

const CATEGORIES = ['General', 'OBC', 'SC', 'ST'];

export default function CollegePredictorPage() {
  const { addToCompare, isInCompare } = useCompare();

  // Form states
  const [exam, setExam] = useState('JEE Main');
  const [stream, setStream] = useState('Computer Science');
  const [category, setCategory] = useState('General');
  const [rank, setRank] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  // Sync stream selection when exam changes
  useEffect(() => {
    const streams = STREAMS_BY_EXAM[exam] || [];
    if (streams.length > 0) {
      setStream(streams[0]);
    }
  }, [exam]);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rank || parseInt(rank) <= 0) {
      toast.error('Please enter a valid rank score');
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam,
          stream,
          category,
          rank: parseInt(rank),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data.colleges || []);
        toast.success(`Found ${data.colleges?.length || 0} matches for your rank!`);
      } else {
        toast.error(data.error || 'Failed to fetch recommendations');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('An error occurred during prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title Header */}
      <div className="space-y-1 pb-2 border-b border-gray-100">
        <Link href="/colleges" className="flex items-center text-xs font-semibold text-gray-500 hover:text-indigo-650 transition-colors mb-2">
          <ArrowLeft className="h-3 w-3 mr-1" />
          Back to explore list
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 flex items-center">
          <Sparkles className="mr-2 h-7 w-7 text-indigo-600 animate-pulse" />
          College Predictor Tool
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Input your entrance exam rank score to discover target campuses based on historical cutoff data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Predictor Form Card */}
        <div className="lg:col-span-4 bg-white border border-gray-150 rounded-2xl p-6 shadow-xs space-y-5">
          <h3 className="font-bold text-lg text-gray-900 border-b border-gray-50 pb-3 flex items-center">
            <GraduationCap className="h-5 w-5 mr-2 text-indigo-650" />
            Predictor Input
          </h3>

          <form onSubmit={handlePredict} className="space-y-4">
            {/* Entrance Exam */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Entrance Exam</label>
              <select
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="w-full border border-gray-200 bg-white px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer"
              >
                {EXAMS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Stream Preference */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Stream Preference</label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="w-full border border-gray-200 bg-white px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer"
              >
                {(STREAMS_BY_EXAM[exam] || []).map((str) => (
                  <option key={str} value={str}>
                    {str}
                  </option>
                ))}
              </select>
            </div>

            {/* Social Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Social Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-200 bg-white px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Rank Score */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Entrance Rank</label>
              <input
                type="number"
                placeholder="Enter rank score (e.g. 2400)"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                min="1"
                required
                className="w-full border border-gray-250 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all focus:bg-white"
              />
            </div>

            {/* Predict Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 rounded-xl shadow-lg shadow-indigo-900/10 active:scale-98 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />
                  Finding Cutoffs...
                </>
              ) : (
                'Predict Recommended Colleges'
              )}
            </Button>
          </form>
        </div>

        {/* Right Side: Predicted Recommendations List */}
        <div className="lg:col-span-8 space-y-6">
          {!searched ? (
            /* Initial State */
            <div className="flex flex-col items-center justify-center border border-dashed border-gray-250 rounded-2xl bg-white p-12 text-center min-h-[420px] shadow-2xs">
              <div className="bg-indigo-50 p-4 rounded-full text-indigo-650 mb-4 animate-bounce">
                <Compass className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Discover Target Institutions</h3>
              <p className="text-sm text-gray-500 max-w-sm mt-1">
                Enter your exam categories and rank scores on the left to query matching colleges instantly.
              </p>
            </div>
          ) : loading ? (
            /* Loading State */
            <div className="space-y-4 animate-pulse">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="bg-white border border-gray-150 rounded-2xl p-5 flex flex-col md:flex-row gap-5 h-44 shadow-2xs">
                  <div className="w-full md:w-44 bg-slate-200 rounded-xl" />
                  <div className="flex-grow space-y-3">
                    <div className="h-5 w-2/3 bg-slate-250 rounded" />
                    <div className="h-4 w-1/3 bg-slate-200 rounded" />
                    <div className="h-10 w-full bg-slate-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center border border-dashed border-gray-250 rounded-2xl bg-white p-12 text-center min-h-[420px] shadow-2xs">
              <div className="bg-red-50 p-4 rounded-full text-red-500 mb-4">
                <Bookmark className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">No matching cutoffs found</h3>
              <p className="text-sm text-gray-500 max-w-sm mt-1">
                Your rank score exceeds the cutoff standards for the preferred stream. Try selecting another stream or exam category.
              </p>
            </div>
          ) : (
            /* Results Grid */
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <span className="text-sm font-bold text-gray-650 bg-indigo-50 border border-indigo-100/50 px-3 py-1 rounded-xl">
                  Recommendations matching rank: {results.length} colleges
                </span>
              </div>

              {results.map((college) => {
                const alreadySelected = isInCompare(college.id);
                return (
                  <div
                    key={college.id}
                    className="bg-white border border-gray-150 hover:border-indigo-200/80 rounded-2xl p-5 flex flex-col md:flex-row gap-5 shadow-2xs transition-all hover:shadow-xs group"
                  >
                    {/* Image Thumbnail */}
                    <div className="w-full md:w-48 h-36 rounded-xl overflow-hidden relative border border-gray-50 shrink-0 bg-slate-50">
                      <img
                        src={college.image}
                        alt={college.name}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-white/95 px-2 py-0.5 rounded-md text-[10px] font-bold text-gray-800 flex items-center shadow-xs">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500 mr-1" />
                        {college.rating.toFixed(1)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-bold text-base text-gray-900 group-hover:text-indigo-650 transition-colors leading-tight">
                            {college.name}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 text-xs font-bold text-emerald-700 border border-emerald-100 shrink-0">
                            Cutoff: {college.predictedCutoff.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 font-medium flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-0.5" />
                          {college.location}
                        </p>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-3 gap-4 py-2 border-y border-gray-50 text-[11px]">
                        <div className="space-y-0.5">
                          <span className="text-gray-400 font-medium">Avg Fees</span>
                          <div className="font-bold text-gray-800">{formatINR(college.fees)}/yr</div>
                        </div>
                        <div className="space-y-0.5 border-l border-gray-100 pl-3">
                          <span className="text-gray-400 font-medium">Placements</span>
                          <div className="font-bold text-emerald-600">{college.placementRate.toFixed(1)}%</div>
                        </div>
                        <div className="space-y-0.5 border-l border-gray-100 pl-3">
                          <span className="text-gray-400 font-medium">Avg Package</span>
                          <div className="font-bold text-gray-800">
                            {college.averagePackage ? `₹${college.averagePackage.toFixed(1)} LPA` : 'N/A'}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex justify-end items-center space-x-2 pt-1 mt-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            addToCompare({
                              id: college.id,
                              name: college.name,
                              image: college.image,
                              location: college.location,
                            });
                          }}
                          className={`text-xs font-semibold gap-1.5 h-8.5 px-3.5 ${
                            alreadySelected
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold'
                              : 'text-slate-650 hover:bg-slate-50 cursor-pointer'
                          }`}
                        >
                          <GitCompare className="h-3.5 w-3.5" />
                          {alreadySelected ? 'Added' : 'Compare'}
                        </Button>

                        <Link href={`/colleges/${college.id}`}>
                          <Button size="sm" className="h-8.5 px-3.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs">
                            View Details
                            <ChevronRight className="ml-1 h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
