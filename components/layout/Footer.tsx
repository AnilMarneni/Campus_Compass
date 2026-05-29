import React from 'react';
import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2">
              <Compass className="h-6 w-6 text-indigo-600" />
              <span className="font-bold text-lg tracking-tight text-gray-900">
                Campus<span className="text-indigo-600">Compass</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 max-w-sm">
              Discover, evaluate, and compare top higher education institutions in India. CampusCompass helps students make data-driven decisions about their academic future.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Platform</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/colleges" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                  Explore Colleges
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                  Compare Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology stack */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Built with</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li>Next.js 15 (App Router)</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>Prisma & SQLite/Postgres</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} CampusCompass. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-gray-400">
            <span className="hover:text-indigo-600 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-indigo-600 transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
