import React from 'react';
import Link from 'next/link';
import { HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center px-4 py-16 text-center space-y-6">
      {/* 404 Icon Illustration */}
      <div className="mx-auto w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center border-4 border-white shadow-md">
        <HelpCircle className="h-10 w-10 animate-bounce" />
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">404 - Page Not Found</h1>
        <p className="text-sm text-gray-500 leading-normal">
          The college profile or resource page you are looking for does not exist or has been moved to another index.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
        <Link href="/colleges">
          <Button variant="primary" size="md" className="gap-2">
            Explore Colleges
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" size="md">
            Go to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
