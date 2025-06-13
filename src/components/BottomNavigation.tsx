import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Mic, TrendingUp, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/journal', icon: Mic, label: 'Record' },
    { path: '/tracker', icon: TrendingUp, label: 'Progress' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50 transition-all duration-300",
      isDark ? "bg-gray-900/40 border-t-gray-700" : "bg-white/40 border-t-gray-200",
      "backdrop-blur-xl border-t"
    )}>
      <div className="container mx-auto px-4 max-w-md">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors min-h-[60px] justify-center',
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
