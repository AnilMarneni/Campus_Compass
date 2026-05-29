'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to console
    console.error('Captured App Crash:', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 text-center space-y-6 max-w-xl mx-auto">
      <div className="mx-auto w-16 h-16 bg-red-50 text-red-650 rounded-full flex items-center justify-center border border-red-100 shadow-sm animate-bounce">
        <AlertTriangle className="h-8 w-8 text-red-500 fill-red-50" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          Something went wrong
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          An unexpected runtime error occurred while trying to render this section. Please try reloading.
        </p>
        {error.message && (
          <div className="bg-gray-50 border border-gray-150 rounded-lg p-3 text-left font-mono text-[10px] text-gray-600 max-w-full overflow-x-auto whitespace-pre-wrap mt-4">
            Error message: {error.message}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 w-full sm:w-auto">
        <Button onClick={reset} variant="primary" size="md" className="gap-2 w-full sm:w-auto cursor-pointer">
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
        <Link href="/" className="w-full sm:w-auto">
          <Button variant="outline" size="md" className="gap-2 w-full sm:w-auto">
            <Home className="h-4 w-4 text-gray-400" />
            Go to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
