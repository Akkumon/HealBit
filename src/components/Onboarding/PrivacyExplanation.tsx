import React from 'react';
import { Lock } from 'lucide-react';

interface PrivacyExplanationProps {
  onUnderstand: () => void;
}

const PrivacyExplanation: React.FC<PrivacyExplanationProps> = ({ onUnderstand }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background">
      <Lock className="w-24 h-24 text-primary mb-8" />
      <h1 className="text-3xl font-bold text-primary mb-4">Your Privacy, Your Control</h1>
      <ul className="text-foreground text-lg mb-8 list-none p-0">
        <li className="mb-2">• All data stays on your device</li>
        <li className="mb-2">• Recordings never leave your browser</li>
        <li className="mb-2">• Delete anytime in Settings</li>
      </ul>
      <button
        onClick={onUnderstand}
        className="bg-primary text-primary-foreground px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-primary/90 transition-colors"
      >
        I Understand
      </button>
    </div>
  );
};

export default PrivacyExplanation;
