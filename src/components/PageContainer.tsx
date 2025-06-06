
import React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  showNavigation?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className,
  showNavigation = true 
}) => {
  return (
    <div className={cn(
      'min-h-screen bg-gradient-to-br from-background via-blue-50 to-orange-50',
      className
    )}>
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className={cn(showNavigation && 'pb-20')}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageContainer;
