import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import DailyPrompt from "./pages/DailyPrompt";
import VoiceJournal from "./pages/VoiceJournal";
import AffirmationScreen from "./pages/AffirmationScreen";
import HealingTracker from "./pages/HealingTracker";
import ProfilePage from "./pages/ProfilePage";
import Settings from "./pages/Settings";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    // Initialize theme on app start
    const initializeTheme = () => {
      const savedTheme = localStorage.getItem('healbit-theme') || 'system';
      
      if (savedTheme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
      } else {
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
    };

    initializeTheme();

    // Check onboarding status
    const onboardingStatus = localStorage.getItem('onboardingComplete');
    setIsOnboardingComplete(onboardingStatus === 'true');

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      const currentTheme = localStorage.getItem('healbit-theme');
      if (currentTheme === 'system' || !currentTheme) {
        initializeTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  if (isOnboardingComplete === null) {
    // Loading state while checking onboarding status
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-blue-50 to-orange-50 dark:from-background dark:via-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {!isOnboardingComplete ? (
              <>
                <Route path="/onboarding\" element={<Onboarding />} />
                <Route path="*" element={<Navigate to="/onboarding\" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Index />} />
                <Route path="/prompt" element={<DailyPrompt />} />
                <Route path="/journal" element={<VoiceJournal />} />
                <Route path="/affirmation" element={<AffirmationScreen />} />
                <Route path="/tracker" element={<HealingTracker />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/onboarding" element={<Navigate to="/\" replace />} />
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;