import React from 'react';
import { Card } from '@/components/ui';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export type StatType = 'number' | 'percentage' | 'trend';
export type TrendDirection = 'up' | 'down' | 'neutral';

export interface StatsCardProps {
  title: string;
  value: string | number;
  type?: StatType;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: TrendDirection;
  trendValue?: string | number;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  type = 'number',
  subtitle, 
  icon,
  trend,
  trendValue
}) => {
  // Format value based on type
  const formatValue = () => {
    if (type === 'percentage') {
      return typeof value === 'number' ? `${value}%` : value;
    }
    return value;
  };

  // Get trend icon and color
  const getTrendDisplay = () => {
    if (!trend) return null;

    const trendConfig = {
      up: {
        icon: <TrendingUp className="w-4 h-4" />,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
      },
      down: {
        icon: <TrendingDown className="w-4 h-4" />,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
      },
      neutral: {
        icon: <Minus className="w-4 h-4" />,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
      },
    };

    const config = trendConfig[trend];

    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${config.bgColor} ${config.color} text-xs font-medium`}>
        {config.icon}
        {trendValue && <span>{trendValue}</span>}
      </div>
    );
  };

  return (
    <Card 
      size="md" 
      className="text-center transition-all duration-300 hover:shadow-2xl bg-white border-0 shadow-lg" 
      role="region" 
      aria-label={`${title} statistic`}
    >
      {icon && (
        <div className="flex justify-center mb-4 transition-transform duration-300 hover:scale-110" aria-hidden="true">
          <div className="p-3 bg-gradient-to-br from-blue-50 to-gray-100 rounded-2xl">
            {icon}
          </div>
        </div>
      )}
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2" id={`stat-${title.replace(/\s+/g, '-').toLowerCase()}`}>
        {title}
      </h3>
      <p className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-gray-800 mt-2" aria-labelledby={`stat-${title.replace(/\s+/g, '-').toLowerCase()}`}>
        {formatValue()}
      </p>
      {trend && (
        <div className="flex justify-center mt-3" aria-label={`Trend: ${trend} ${trendValue || ''}`}>
          {getTrendDisplay()}
        </div>
      )}
      {subtitle && (
        <p className="text-sm text-gray-600 mt-3 font-medium">
          {subtitle}
        </p>
      )}
    </Card>
  );
};

export default StatsCard;
