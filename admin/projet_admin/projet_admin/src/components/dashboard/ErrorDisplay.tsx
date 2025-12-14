// src/components/dashboard/ErrorDisplay.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react'; // Example icon

interface ErrorDisplayProps {
  error: string | null;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => (
  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
    <div className="flex items-center">
      <AlertTriangle className="h-6 w-6 mr-3" />
      <div>
        <p className="font-bold">An Error Occurred</p>
        <p>{error || "An unknown error occurred. Please try again."}</p>
      </div>
    </div>
    {onRetry && (
      <Button variant="outline" className="mt-3 text-xs border-red-300 text-red-700 hover:bg-red-50" size="sm" onClick={onRetry}>
        Retry
      </Button>
    )}
  </div>
);