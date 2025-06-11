import React from 'react';

interface AvatarSetupProps {
  onContinue: () => void;
  onSkip: () => void;
}

const AvatarSetup: React.FC<AvatarSetupProps> = ({ onContinue, onSkip }) => {
  const avatars = [
    { id: 'avatar1', svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="var(--accent)" /><path d="M30 65 Q50 85 70 65" stroke="var(--primary)" strokeWidth="3" fill="none" /></svg>' },
    { id: 'avatar2', svg: '<svg viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" rx="10" ry="10" fill="var(--primary)" /><circle cx="50" cy="50" r="20" fill="var(--accent)" /></svg>' },
    { id: 'avatar3', svg: '<svg viewBox="0 0 100 100"><path d="M50 10 L80 40 L70 90 L30 90 L20 40 Z" fill="var(--accent)" /><circle cx="50" cy="50" r="15" fill="var(--primary)" /></svg>' },
  ];

  const handleAvatarSelect = (avatarId: string) => {
    localStorage.setItem('userAvatar', avatarId);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background">
      <h1 className="text-3xl font-bold text-primary mb-4">Create Your Companion</h1>
      <p className="text-muted-foreground text-lg mb-8">Choose an avatar that resonates</p>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {avatars.map((avatar) => (
          <div
            key={avatar.id}
            className="w-24 h-24 flex items-center justify-center border-2 border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
            onClick={() => handleAvatarSelect(avatar.id)}
            dangerouslySetInnerHTML={{ __html: avatar.svg }}
          />
        ))}
      </div>
      <button
        onClick={onContinue}
        className="bg-primary text-primary-foreground px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-primary/90 transition-colors mb-4"
      >
        Continue
      </button>
      <button
        onClick={onSkip}
        className="text-muted-foreground hover:text-foreground transition-colors text-base"
      >
        Skip
      </button>
    </div>
  );
};

export default AvatarSetup;
