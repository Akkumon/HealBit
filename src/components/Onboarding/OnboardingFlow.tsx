import React, { useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import AvatarSetup from './AvatarSetup';
import PrivacyExplanation from './PrivacyExplanation';
import MicrophonePermission from './MicrophonePermission';
import ProgressIndicator from './ProgressIndicator';

const OnboardingFlow: React.FC = () => {
  const [step, setStep] = useState(1);

  const totalSteps = 4; // Total number of onboarding steps

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const completeOnboarding = () => {
    localStorage.setItem('onboardingComplete', 'true');
    window.location.href = '/'; // Redirect to home page
  };

  const skipToEnd = () => {
    completeOnboarding();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ProgressIndicator currentStep={step} totalSteps={totalSteps} />
      <div className="flex-1 animate-fade-in">
        {(() => {
          switch (step) {
            case 1:
              return <WelcomeScreen onBeginHealing={nextStep} />;
            case 2:
              return <AvatarSetup onContinue={nextStep} onSkip={skipToEnd} />;
            case 3:
              return <PrivacyExplanation onUnderstand={nextStep} />;
            case 4:
              return (
                <MicrophonePermission
                  onAllowMicrophone={completeOnboarding}
                  onContinueWithout={completeOnboarding}
                />
              );
            default:
              return <div>Onboarding Complete!</div>;
          }
        })()}
      </div>
    </div>
  );
};

export default OnboardingFlow;
