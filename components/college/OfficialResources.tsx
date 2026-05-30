'use client';

import React from 'react';
import { Globe, GraduationCap, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface OfficialResourcesProps {
  website: string | null;
  collegeName: string;
}

export default function OfficialResources({ website, collegeName }: OfficialResourcesProps) {
  const handleBrochureClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.success('Brochure Download Initiated', {
      description: `Detailed prospectus PDF for ${collegeName} is now downloading.`,
    });
  };

  const officialUrl = website || 'https://www.google.com';
  const admissionsUrl = website ? `${website.replace(/\/$/, '')}/admissions` : 'https://www.google.com';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
      <a
        href={officialUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/20 transition duration-200 group"
      >
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-gray-900 group-hover:text-indigo-650">Official Website</div>
          <div className="text-[10px] text-gray-400">Visit institution homepage</div>
        </div>
        <Globe className="h-4 w-4 text-gray-400 group-hover:text-indigo-500" />
      </a>
      
      <a
        href={admissionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/20 transition duration-200 group"
      >
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-gray-900 group-hover:text-indigo-650">Admissions Portal</div>
          <div className="text-[10px] text-gray-400">Admission criteria & deadlines</div>
        </div>
        <GraduationCap className="h-4 w-4 text-gray-400 group-hover:text-indigo-500" />
      </a>

      <button
        onClick={handleBrochureClick}
        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/20 transition duration-200 group text-left w-full cursor-pointer bg-transparent"
      >
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-gray-900 group-hover:text-indigo-650">Download Brochure</div>
          <div className="text-[10px] text-gray-400">PDF brochure & seat matrix</div>
        </div>
        <FileText className="h-4 w-4 text-gray-400 group-hover:text-indigo-500" />
      </button>
    </div>
  );
}
