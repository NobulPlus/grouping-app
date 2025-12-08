import React from 'react';
import { Card } from '@/components/ui';
import Skeleton from '@/components/ui/Skeleton';

const StatsCardSkeleton: React.FC = () => {
  return (
    <Card size="md" className="text-center">
      <div className="flex flex-col items-center space-y-3">
        {/* Icon skeleton */}
        <Skeleton width="w-12" height="h-12" rounded="full" />
        
        {/* Title skeleton */}
        <Skeleton width="w-24" height="h-4" />
        
        {/* Value skeleton */}
        <Skeleton width="w-20" height="h-10" />
        
        {/* Subtitle skeleton */}
        <Skeleton width="w-32" height="h-3" />
      </div>
    </Card>
  );
};

export default StatsCardSkeleton;
