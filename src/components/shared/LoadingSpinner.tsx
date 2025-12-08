import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'orange' | 'blue' | 'green' | 'purple' | 'default';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'default',
  className = '' 
}) => {
  const sizeMap = {
    sm: 20,
    md: 32,
    lg: 48,
  };

  const colorStyles = {
    orange: 'text-group-orange',
    blue: 'text-group-blue',
    green: 'text-group-green',
    purple: 'text-group-purple',
    default: 'text-blue-600',
  };

  return (
    <div className={`flex items-center justify-center ${className}`} role="status" aria-live="polite">
      <Loader2 
        className={`animate-spin ${colorStyles[color]}`}
        size={sizeMap[size]}
        aria-hidden="true"
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
