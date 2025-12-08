import React from 'react';
import { Card } from '@/components/ui';
import type { Group } from '@/lib/types';

export interface GroupCardProps {
  group: Group;
  onClick?: () => void;
  showMembers?: boolean;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onClick, showMembers = false }) => {
  const colorMap: Record<string, 'orange' | 'blue' | 'green' | 'black'> = {
    orange: 'orange',
    blue: 'blue',
    green: 'green',
    purple: 'black',
  };

  const colorAccent = colorMap[group.color.toLowerCase()] || 'blue';

  return (
    <Card
      colorAccent={colorAccent}
      className={`transition-all duration-300 min-h-[140px] bg-white border-0 shadow-lg ${
        onClick ? 'cursor-pointer hover:scale-105 hover:shadow-2xl hover:-translate-y-1' : ''
      }`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      aria-label={onClick ? `View ${group.name} group details` : undefined}
    >
      <div className="flex flex-col items-center text-center gap-4 p-2">
        {/* Color swatch with gradient */}
        <div
          className="w-20 h-20 rounded-2xl flex-shrink-0 shadow-lg transform transition-transform duration-300 hover:rotate-6"
          style={{ 
            background: `linear-gradient(135deg, ${group.colorCode} 0%, ${group.colorCode}dd 100%)`,
            boxShadow: `0 10px 25px -5px ${group.colorCode}40`
          }}
          aria-hidden="true"
        />
        
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{group.name}</h3>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full">
            <div 
              className="w-2 h-2 rounded-full animate-pulse" 
              style={{ backgroundColor: group.colorCode }}
            />
            <p className="text-sm font-semibold text-gray-700">
              {group.currentCount} {group.currentCount === 1 ? 'member' : 'members'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GroupCard;
