import React from 'react';
import { Info, Calendar, Database, CheckCircle, TrendingUp } from 'lucide-react';

export default function DataTransparency() {
  return (
    <div className="bg-white border border-gray-150 rounded-2xl p-6 md:p-8 shadow-2xs space-y-6 max-w-7xl mx-auto mt-16">
      <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
        <Info className="h-5 w-5 text-indigo-650" />
        <h3 className="font-bold text-gray-900 text-base flex items-center">
          About This Data
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-650">
        <div className="space-y-2">
          <div className="flex items-center space-x-1.5 text-gray-900 font-semibold">
            <Database className="h-4 w-4 text-indigo-600 shrink-0" />
            <span>Data Sources</span>
          </div>
          <p className="text-xs text-gray-500 leading-normal">
            Verified directly from NIRF Rankings, official university websites, placement cell reports, institutional disclosures, and audited student reviews.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-1.5 text-gray-900 font-semibold">
            <Calendar className="h-4 w-4 text-indigo-600 shrink-0" />
            <span>Last Updated</span>
          </div>
          <p className="text-xs text-gray-500 leading-normal">
            May 2026. Information audit updates are performed at the close of every major national admissions cycle.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-1.5 text-gray-900 font-semibold">
            <CheckCircle className="h-4 w-4 text-indigo-600 shrink-0" />
            <span>Coverage</span>
          </div>
          <p className="text-xs text-gray-500 leading-normal">
            Covers 40 premier Indian institutions offering degree programs in Technology (TECH), Management (MGMT), Commerce (COMM), and Humanities & Sciences (ARTS).
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-1.5 text-gray-900 font-semibold">
            <TrendingUp className="h-4 w-4 text-indigo-600 shrink-0" />
            <span>Placement & Salaries</span>
          </div>
          <p className="text-xs text-gray-500 leading-normal">
            Average and highest packages are representative of official placement cell records. Actual packages vary by student achievements.
          </p>
        </div>
      </div>
    </div>
  );
}
