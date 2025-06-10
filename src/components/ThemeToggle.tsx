import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, Theme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  variant?: 'card' | 'button';
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'card', className }) => {
  const { theme, setTheme } = useTheme();

  const themes: { value: Theme; label: string; icon: React.ReactNode; description: string }[] = [
    {
      value: 'light',
      label: 'Light',
      icon: <Sun className="w-4 h-4" />,
      description: 'Bright and clear'
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: <Moon className="w-4 h-4" />,
      description: 'Easy on the eyes'
    },
    {
      value: 'system',
      label: 'System',
      icon: <Monitor className="w-4 h-4" />,
      description: 'Follows your device'
    }
  ];

  if (variant === 'button') {
    const currentThemeData = themes.find(t => t.value === theme) || themes[2];
    
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const nextIndex = (themes.findIndex(t => t.value === theme) + 1) % themes.length;
          setTheme(themes[nextIndex].value);
        }}
        className={cn('flex items-center space-x-2', className)}
      >
        {currentThemeData.icon}
        <span>{currentThemeData.label}</span>
      </Button>
    );
  }

  return (
    <Card className={cn('bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm', className)}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Sun className="w-5 h-5 mr-2 text-primary" />
          Appearance
        </CardTitle>
        <CardDescription>
          Choose how HealBit looks to you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {themes.map((themeOption) => (
          <button
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className={cn(
              'w-full p-3 rounded-lg border-2 transition-all flex items-center space-x-3 text-left',
              theme === themeOption.value
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-primary/50 hover:bg-accent/50'
            )}
          >
            <div className="flex-shrink-0">
              {themeOption.icon}
            </div>
            <div className="flex-1">
              <p className="font-medium">{themeOption.label}</p>
              <p className="text-sm text-muted-foreground">{themeOption.description}</p>
            </div>
            {theme === themeOption.value && (
              <div className="w-2 h-2 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </CardContent>
    </Card>
  );
};

export default ThemeToggle;