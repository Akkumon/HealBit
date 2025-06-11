import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

interface WelcomeScreenProps {
  onBeginHealing: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onBeginHealing }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6 py-8">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
      
      <div className="relative z-10 text-center max-w-md mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Welcome to HealBit
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A gentle space for reflection
          </p>
        </div>

        {/* Main CTA */}
        <Button 
          onClick={onBeginHealing}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg h-14 w-full mb-4"
        >
          Begin Your Healing
        </Button>

        {/* Skip option */}
        <button 
          onClick={onBeginHealing}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip setup
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
