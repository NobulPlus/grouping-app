import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  colorAccent?: 'orange' | 'blue' | 'green' | 'purple' | 'none';
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ size = 'md', colorAccent = 'none', children, className = '', ...props }, ref) => {
    const baseStyles = 'bg-white rounded-lg shadow-md transition-shadow duration-200 hover:shadow-lg';
    
    const sizeStyles = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const accentStyles = {
      orange: 'border-l-4 border-group-orange',
      blue: 'border-l-4 border-group-blue',
      green: 'border-l-4 border-group-green',
      purple: 'border-l-4 border-group-purple',
      none: '',
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${sizeStyles[size]} ${accentStyles[colorAccent]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
