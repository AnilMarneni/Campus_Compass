'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface CompareActionsProps {
  collegeNames: string[];
}

export default function CompareActions({ collegeNames }: CompareActionsProps) {
  const handleExportPDF = () => {
    toast.success('PDF Export Started', {
      description: `Generating comparison report for ${collegeNames.join(', ')}.`,
    });
  };

  const handleShareComparison = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!', {
      description: 'Share this comparison link with students or advisors.',
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={handleShareComparison}
        className="text-xs gap-1.5 h-9 font-semibold border-gray-200 text-gray-700 hover:bg-slate-50"
      >
        <Share2 className="h-4 w-4" />
        Share Comparison
      </Button>
      <Button
        variant="primary"
        size="sm"
        onClick={handleExportPDF}
        className="text-xs gap-1.5 h-9 font-semibold"
      >
        <FileText className="h-4 w-4" />
        Export to PDF
      </Button>
    </div>
  );
}
