import { useRouter } from 'next/router';
import { MainLayout } from '@/components/layouts';
import { GroupCard, StatsCard, GroupCardSkeleton, StatsCardSkeleton } from '@/components/shared';
import { useGroups, useStats } from '@/hooks/useApi';
import { Users, UserPlus, TrendingUp, Calendar } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { useEffect } from 'react';

export default function Dashboard() {
  const router = useRouter();
  const { showError } = useToast();
  const { data: groups, isLoading: groupsLoading, error: groupsError, refetch: refetchGroups } = useGroups();
  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useStats();

  // Show toast notification when errors occur
  useEffect(() => {
    if (groupsError) {
      showError('Failed to load groups. Please try again.');
    }
    if (statsError) {
      showError('Failed to load statistics. Please try again.');
    }
  }, [groupsError, statsError, showError]);

  const handleGroupClick = (groupId: string) => {
    router.push(`/group/${groupId}`);
  };

  const handleRetry = () => {
    if (groupsError) refetchGroups();
    if (statsError) refetchStats();
  };

  // Show loading state
  if (groupsLoading || statsLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>
          
          {/* Statistics Loading Skeleton */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <StatsCardSkeleton key={i} />
              ))}
            </div>
          </div>

          {/* Groups Loading Skeleton */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Groups</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <GroupCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show error state
  if (groupsError || statsError) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-900 mb-2">
              Failed to Load Dashboard Data
            </h2>
            <p className="text-red-700 mb-4">
              {groupsError?.message || statsError?.message || 'An error occurred while fetching data.'}
            </p>
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        {/* Statistics Panel */}
        {stats && (
          <section className="mb-12" aria-labelledby="dashboard-stats-heading">
            <h2 id="dashboard-stats-heading" className="text-2xl font-semibold text-gray-900 mb-6">Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Members"
                value={stats.totalUsers}
                icon={<Users className="w-8 h-8 text-blue-600" />}
                subtitle="All registered members"
              />
              <StatsCard
                title="Today's Registrations"
                value={stats.todayRegistrations}
                icon={<UserPlus className="w-8 h-8 text-green-600" />}
                subtitle="New members today"
              />
              <StatsCard
                title="Weekly Registrations"
                value={stats.weeklyRegistrations}
                icon={<Calendar className="w-8 h-8 text-purple-600" />}
                subtitle="Last 7 days"
              />
              <StatsCard
                title="Average Per Day"
                value={stats.averagePerDay}
                icon={<TrendingUp className="w-8 h-8 text-orange-600" />}
                subtitle="Weekly average"
              />
            </div>
          </section>
        )}

        {/* Groups Grid */}
        <section aria-labelledby="dashboard-groups-heading">
          <h2 id="dashboard-groups-heading" className="text-2xl font-semibold text-gray-900 mb-6">Groups</h2>
          {groups && groups.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {groups.map((group) => (
                <GroupCard
                  key={group._id}
                  group={group}
                  onClick={() => handleGroupClick(group._id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-600">No groups available.</p>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
