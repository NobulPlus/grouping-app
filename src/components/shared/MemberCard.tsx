import React from 'react';
import { Card } from '@/components/ui';
import type { User } from '@/lib/types';

export interface MemberCardProps {
  member: User;
  compact?: boolean;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, compact = false }) => {
  // Generate initials from the member's name
  const getInitials = () => {
    const firstInitial = member.firstName.charAt(0).toUpperCase();
    const lastInitial = member.surname.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  // Format the registration date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Map color name to accent
  const colorMap: Record<string, 'orange' | 'blue' | 'green' | 'purple'> = {
    orange: 'orange',
    blue: 'blue',
    green: 'green',
    black: 'purple',
    purple: 'purple',
  };

  const colorAccent = member.groupColor ? colorMap[member.groupColor.toLowerCase()] || 'blue' : 'blue';
  const backgroundColor = member.groupColorCode || '#2563EB'; // Default to blue

  const fullName = `${member.firstName} ${member.middleName} ${member.surname}`;

  if (compact) {
    return (
      <Card colorAccent={colorAccent} size="sm" className="flex items-center gap-3 transition-transform duration-200 hover:scale-102">
        {/* Avatar with initials */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 transition-transform duration-200 hover:scale-110"
          style={{ backgroundColor }}
          aria-label={`${fullName} avatar`}
        >
          {getInitials()}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{fullName}</p>
          <p className="text-xs text-gray-500">{formatDate(member.registrationDate)}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card colorAccent={colorAccent} size="md" className="transition-transform duration-200 hover:scale-102">
      <div className="flex items-center gap-4">
        {/* Avatar with initials */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0 transition-transform duration-200 hover:scale-110"
          style={{ backgroundColor }}
          aria-label={`${fullName} avatar`}
        >
          {getInitials()}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{fullName}</h3>
          <p className="text-sm text-gray-600 mt-1">
            Registered: {formatDate(member.registrationDate)}
          </p>
          {member.email && (
            <p className="text-sm text-gray-500 mt-1">{member.email}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MemberCard;
