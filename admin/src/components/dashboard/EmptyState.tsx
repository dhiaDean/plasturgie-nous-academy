// src/components/dashboard/EmptyState.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react'; // Example Icon

interface EmptyStateProps {
  message?: string;
  showCreateButton?: boolean;
  onCreate?: () => void;
  createButtonText?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No items found.",
  showCreateButton = false,
  onCreate,
  createButtonText = "Create New"
}) => (
  <div className="text-center py-10 bg-gray-50 rounded-md border">
    <Package size={48} className="mx-auto text-gray-400 mb-4" />
    <h3 className="text-lg font-semibold text-gray-500">{message}</h3>
    {showCreateButton && onCreate && (
      <Button onClick={onCreate} size="sm" className="mt-4 bg-brand-purple hover:bg-brand-dark-purple">
        {createButtonText}
      </Button>
    )}
  </div>
);