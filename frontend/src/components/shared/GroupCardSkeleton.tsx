import React from 'react';
import { Card } from '@/components/ui';
import Skeleton from '@/components/ui/Skeleton';

const GroupCardSkeleton: React.FC = () => {
  return (
    <Card className="min-h-[88px]">
      <div className="flex items-center gap-4">
        {/* Color swatch skeleton */}
        <Skeleton width="w-16" height="h-16" rounded="lg" />
        
        <div className="flex-1 space-y-2">
          {/* Group name skeleton */}
          <Skeleton width="w-32" height="h-6" />
          {/* Member count skeleton */}
          <Skeleton width="w-24" height="h-4" />
        </div>
      </div>
    </Card>
  );
};

export default GroupCardSkeleton;
