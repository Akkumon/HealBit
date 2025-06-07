
import { useState, useCallback } from 'react';

export interface OnboardingData {
  selectedAvatar?: string;
  microphonePermission?: boolean;
}

export const useOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({});

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const skipToEnd = useCallback(() => {
    setCurrentStep(3);
  }, []);

  const updateData = useCallback((newData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  }, []);

  const completeOnboarding = useCallback(() => {
    localStorage.setItem('onboardingComplete', 'true');
    if (data.selectedAvatar) {
      localStorage.setItem('userAvatar', data.selectedAvatar);
    }
    if (data.microphonePermission !== undefined) {
      localStorage.setItem('microphonePermission', data.microphonePermission.toString());
    }
  }, [data]);

  return {
    currentStep,
    data,
    nextStep,
    prevStep,
    skipToEnd,
    updateData,
    completeOnboarding,
    totalSteps: 4
  };
};
