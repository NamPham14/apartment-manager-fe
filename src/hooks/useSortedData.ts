import { useMemo } from 'react';

export const useSortedData = <T,>(data: T[], sortConfig: { key: keyof T | null; direction: 'asc' | 'desc' }) => {
  return useMemo(() => {
    const sorted = [...data];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const valA = a[sortConfig.key!];
        const valB = b[sortConfig.key!];
        
        if (valA < valB) 
          return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) 
          return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [data, sortConfig]);
};
