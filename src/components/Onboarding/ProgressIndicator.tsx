
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  currentStep, 
  totalSteps 
}) => {
  return (
    <div className="flex justify-center space-x-2 py-6 safe-area-inset">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'w-2 h-2 rounded-full transition-all duration-300',
            index <= currentStep 
              ? 'bg-primary scale-110' 
              : 'bg-gray-300'
          )}
        />
      ))}
    </div>
  );
};

export default ProgressIndicator;
