import React from 'react';
import { Card } from '@/components/ui';
import Skeleton from '@/components/ui/Skeleton';

export interface MemberCardSkeletonProps {
  compact?: boolean;
}

const MemberCardSkeleton: React.FC<MemberCardSkeletonProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <Card size="sm" className="flex items-center gap-3">
        {/* Avatar skeleton */}
        <Skeleton width="w-10" height="h-10" rounded="full" />
        
        <div className="flex-1 space-y-2">
          {/* Name skeleton */}
          <Skeleton width="w-32" height="h-4" />
          {/* Date skeleton */}
          <Skeleton width="w-20" height="h-3" />
        </div>
      </Card>
    );
  }

  return (
    <Card size="md">
      <div className="flex items-center gap-4">
        {/* Avatar skeleton */}
        <Skeleton width="w-16" height="h-16" rounded="full" />
        
        <div className="flex-1 space-y-2">
          {/* Name skeleton */}
          <Skeleton width="w-48" height="h-5" />
          {/* Date skeleton */}
          <Skeleton width="w-32" height="h-4" />
        </div>
      </div>
    </Card>
  );
};

export default MemberCardSkeleton;
