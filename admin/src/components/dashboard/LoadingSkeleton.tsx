// src/components/dashboard/LoadingSkeleton.tsx
import React from 'react';
import { Card } from '@/components/ui/card';

export const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <Card key={`loading-skeleton-${i}`} className="p-6 animate-pulse">
        <div className="h-5 w-3/4 bg-gray-200 mb-4 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-200 mb-2 rounded"></div>
        <div className="h-4 w-full bg-gray-200 mb-4 rounded"></div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
            <div className="h-5 w-24 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
        </div>
      </Card>
    ))}
  </div>
);