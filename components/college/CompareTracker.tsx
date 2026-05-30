'use client';

import { useEffect } from 'react';
import { trackComparison } from '@/lib/analytics';

interface CompareTrackerProps {
  ids: string[];
}

export default function CompareTracker({ ids }: CompareTrackerProps) {
  useEffect(() => {
    if (ids && ids.length > 0) {
      trackComparison(ids);
    }
  }, [ids]);

  return null;
}
