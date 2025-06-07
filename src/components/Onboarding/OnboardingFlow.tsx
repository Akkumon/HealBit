
import React from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import WelcomeScreen from './WelcomeScreen';
import AvatarSetup from './AvatarSetup';
import PrivacyExplanation from './PrivacyExplanation';
import MicrophonePermission from './MicrophonePermission';
import ProgressIndicator from './ProgressIndicator';

const OnboardingFlow: React.FC = () => {
  const onboarding = useOnboarding();

  const screens = [
    <WelcomeScreen key="welcome" onboarding={onboarding} />,
    <AvatarSetup key="avatar" onboarding={onboarding} />,
    <PrivacyExplanation key="privacy" onboarding={onboarding} />,
    <MicrophonePermission key="microphone" onboarding={onboarding} />
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <ProgressIndicator 
        currentStep={onboarding.currentStep} 
        totalSteps={onboarding.totalSteps} 
      />
      <div className="flex-1 animate-fade-in">
        {screens[onboarding.currentStep]}
      </div>
    </div>
  );
};

export default OnboardingFlow;
