'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface CompareCollege {
  id: string;
  name: string;
  image: string;
  location: string;
}

interface CompareContextType {
  compareColleges: CompareCollege[];
  addToCompare: (college: CompareCollege) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareColleges, setCompareColleges] = useState<CompareCollege[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('campus_compass_compare_v2');
    if (saved) {
      try {
        setCompareColleges(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse compare items', e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('campus_compass_compare_v2', JSON.stringify(compareColleges));
    }
  }, [compareColleges, isHydrated]);

  const addToCompare = (college: CompareCollege) => {
    if (compareColleges.some((item) => item.id === college.id)) {
      toast.warning(`${college.name} is already in the comparison list.`);
      return;
    }

    if (compareColleges.length >= 3) {
      toast.error('Maximum of 3 colleges reached', {
        description: 'Please remove a college before adding another.',
      });
      return;
    }

    setCompareColleges((prev) => [...prev, college]);
    toast.success(`Added ${college.name} to compare`, {
      description: `Colleges selected: ${compareColleges.length + 1}/3`,
    });
  };

  const removeFromCompare = (id: string) => {
    const target = compareColleges.find((item) => item.id === id);
    if (!target) return;

    setCompareColleges((prev) => prev.filter((item) => item.id !== id));
    toast.info(`Removed ${target.name} from compare`, {
      description: `Colleges selected: ${Math.max(0, compareColleges.length - 1)}/3`,
    });
  };

  const clearCompare = () => {
    setCompareColleges([]);
    toast.info('Cleared comparison list');
  };

  const isInCompare = (id: string) => {
    return compareColleges.some((item) => item.id === id);
  };

  return (
    <CompareContext.Provider
      value={{
        compareColleges,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
