import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatINR } from '@/lib/utils';
import { Calendar, IndianRupee, BookOpen } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  duration: string;
  fees: number;
}

interface CourseListProps {
  courses: Course[];
}

export default function CourseList({ courses }: CourseListProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
        <p className="text-sm text-gray-500">No course structures listed for this college yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop view: Structured list table */}
      <div className="hidden sm:block overflow-hidden border border-gray-150 rounded-xl bg-white shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <th className="py-4 px-6">Course Name</th>
              <th className="py-4 px-6">Duration</th>
              <th className="py-4 px-6 text-right">Annual Fees</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="py-4.5 px-6 font-semibold text-gray-800 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-indigo-500" />
                  {course.name}
                </td>
                <td className="py-4.5 px-6 text-gray-500 font-medium">
                  {course.duration}
                </td>
                <td className="py-4.5 px-6 text-right font-bold text-gray-900">
                  {formatINR(course.fees)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view: Stacked card layout */}
      <div className="sm:hidden space-y-3">
        {courses.map((course) => (
          <Card key={course.id} className="border border-gray-150 hover:border-gray-200">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-bold text-sm text-gray-800 flex items-start">
                <BookOpen className="h-4 w-4 mr-2 text-indigo-500 mt-0.5 shrink-0" />
                {course.name}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 pt-2 border-t border-gray-50">
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center justify-end font-bold text-gray-900">
                  <IndianRupee className="h-3 w-3 mr-0.5" />
                  <span>{formatINR(course.fees)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
