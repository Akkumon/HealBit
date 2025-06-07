
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import HealingAvatar from '@/components/HealingAvatar';
import { MoodType } from '@/types';

interface AvatarSetupProps {
  onboarding: ReturnType<typeof import('@/hooks/useOnboarding').useOnboarding>;
}

const avatarOptions: { id: string; mood: MoodType; label: string }[] = [
  { id: 'calm', mood: 'calm', label: 'Calm' },
  { id: 'hope', mood: 'hope', label: 'Hopeful' },
  { id: 'joy', mood: 'joy', label: 'Joyful' }
];

const AvatarSetup: React.FC<AvatarSetupProps> = ({ onboarding }) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');

  const handleAvatarSelect = (avatarId: string) => {
    setSelectedAvatar(avatarId);
    onboarding.updateData({ selectedAvatar: avatarId });
  };

  const handleContinue = () => {
    onboarding.nextStep();
  };

  const handleSkip = () => {
    onboarding.nextStep();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 py-8">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Create Your Companion
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Choose an avatar that resonates with you
        </p>

        {/* Avatar Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {avatarOptions.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => handleAvatarSelect(avatar.id)}
              className={`p-4 rounded-lg transition-all duration-200 ${
                selectedAvatar === avatar.id
                  ? 'bg-primary/10 ring-2 ring-primary scale-105'
                  : 'hover:bg-gray-50 hover:scale-105'
              }`}
            >
              <HealingAvatar mood={avatar.mood} size="md" />
              <p className="text-sm font-medium text-foreground mt-2">
                {avatar.label}
              </p>
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleContinue}
            disabled={!selectedAvatar}
            size="lg"
            className="w-full"
          >
            Continue
          </Button>
          <button 
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarSetup;
