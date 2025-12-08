import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  width = 'w-full', 
  height = 'h-4', 
  rounded = 'md',
  className = '',
  ...props 
}) => {
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <div
      className={`animate-pulse bg-gray-200 ${width} ${height} ${roundedStyles[rounded]} ${className}`}
      role="status"
      aria-label="Loading..."
      {...props}
    />
  );
};

export default Skeleton;
