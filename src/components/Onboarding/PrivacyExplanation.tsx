
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

interface PrivacyExplanationProps {
  onboarding: ReturnType<typeof import('@/hooks/useOnboarding').useOnboarding>;
}

const PrivacyExplanation: React.FC<PrivacyExplanationProps> = ({ onboarding }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 px-6 py-8">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <Lock className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-foreground mb-6">
            Your Privacy, Your Control
          </h1>
        </div>

        {/* Privacy points */}
        <div className="space-y-4 mb-8 text-left">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <p className="text-foreground">All data stays on your device</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <p className="text-foreground">Recordings never leave your browser</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <p className="text-foreground">Delete anytime in Settings</p>
          </div>
        </div>

        <Button 
          onClick={onboarding.nextStep}
          size="lg"
          className="w-full"
        >
          I Understand
        </Button>
      </div>
    </div>
  );
};

export default PrivacyExplanation;
