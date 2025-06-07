
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MicrophonePermissionProps {
  onboarding: ReturnType<typeof import('@/hooks/useOnboarding').useOnboarding>;
}

const MicrophonePermission: React.FC<MicrophonePermissionProps> = ({ onboarding }) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const navigate = useNavigate();

  const handleAllowMicrophone = async () => {
    setIsRequesting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      onboarding.updateData({ microphonePermission: true });
      onboarding.completeOnboarding();
      navigate('/');
    } catch (error) {
      console.log('Microphone permission denied:', error);
      onboarding.updateData({ microphonePermission: false });
    } finally {
      setIsRequesting(false);
    }
  };

  const handleContinueWithout = () => {
    onboarding.updateData({ microphonePermission: false });
    onboarding.completeOnboarding();
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 py-8">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          {/* Animated microphone */}
          <div className="relative mb-6">
            <Mic className="h-16 w-16 text-primary mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 border-2 border-primary/30 rounded-full animate-ping" />
              <div className="absolute w-24 h-24 border-2 border-primary/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Your Voice Matters
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Enable microphone for voice journaling
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={handleAllowMicrophone}
            disabled={isRequesting}
            size="lg"
            className="w-full"
          >
            {isRequesting ? 'Requesting...' : 'Allow Microphone'}
          </Button>
          
          <button 
            onClick={handleContinueWithout}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Continue Without
          </button>
        </div>
      </div>
    </div>
  );
};

export default MicrophonePermission;
