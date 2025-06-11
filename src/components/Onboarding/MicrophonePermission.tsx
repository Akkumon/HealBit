import React from 'react';
import { Mic } from 'lucide-react';

interface MicrophonePermissionProps {
  onAllowMicrophone: () => void;
  onContinueWithout: () => void;
}

const MicrophonePermission: React.FC<MicrophonePermissionProps> = ({
  onAllowMicrophone,
  onContinueWithout,
}) => {
  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Permission granted, do something with the stream or just close it if not needed yet
      stream.getTracks().forEach(track => track.stop());
      onAllowMicrophone();
    } catch (error) {
      console.error('Microphone permission denied:', error);
      // Handle denial gracefully, e.g., show a message to the user
      onContinueWithout(); // Optionally move to the next step even if denied
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background">
      <Mic className="w-24 h-24 text-primary mb-8 animate-pulse" />
      <h1 className="text-3xl font-bold text-primary mb-4">Your Voice Matters</h1>
      <p className="text-muted-foreground text-lg mb-8">Enable microphone for journaling</p>
      <button
        onClick={requestMicrophonePermission}
        className="bg-primary text-primary-foreground px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-primary/90 transition-colors mb-4"
      >
        Allow Microphone
      </button>
      <button
        onClick={onContinueWithout}
        className="text-muted-foreground hover:text-foreground transition-colors text-base"
      >
        Continue Without
      </button>
    </div>
  );
};

export default MicrophonePermission;
