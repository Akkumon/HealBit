import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-center p-4">
      {[...Array(totalSteps)].map((_, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-full mx-1 ${index + 1 <= currentStep ? 'bg-primary' : 'bg-muted'}`}
        />
      ))}
    </div>
  );
};

export default ProgressIndicator;
