import { useRouter } from 'next/router';
import { MainLayout } from '@/components/layouts';
import { Button } from '@/components/ui';
import { GroupCard, StatsCard, LoadingSpinner } from '@/components/shared';
import { useGroups, useStats } from '@/hooks/useApi';
import { Users, TrendingUp } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { data: groups, isLoading: groupsLoading, error: groupsError } = useGroups();
  const { data: stats, isLoading: statsLoading, error: statsError } = useStats();

  const handleGetStarted = () => {
    router.push('/register');
  };

  const handleGroupClick = (groupId: string) => {
    router.push(`/group/${groupId}`);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-pink-50">
        {/* Hero Section with Gradient Background */}
        <section className="relative overflow-hidden" aria-labelledby="hero-heading">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
            <div className="text-center">
              <h1 id="hero-heading" className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 sm:mb-8">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-gray-800 to-pink-600">
                  Welcome to
                </span>
                <br />
                <span className="text-gray-900">Team Grouping</span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-700 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
                Join your team and discover your group. Connect with fellow members and be part of something <span className="font-semibold text-gray-900">extraordinary</span>.
              </p>
              <Button
                variant="primary"
                onClick={handleGetStarted}
                className="text-lg px-10 py-5 shadow-2xl hover:shadow-gray-500/50 transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-blue-600 to-gray-800 hover:from-blue-700 hover:to-gray-900"
                aria-label="Get started with registration"
              >
                Get Started →
              </Button>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Quick Stats Section */}
          <section className="mb-16 sm:mb-20" aria-labelledby="stats-heading">
            <div className="text-center mb-10">
              <h2 id="stats-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Team Statistics
              </h2>
              <p className="text-gray-600 text-lg">Real-time insights into our growing teams</p>
            </div>
          
          {statsLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : statsError ? (
            <div className="text-center text-red-600 py-8">
              <p>Unable to load statistics. Please try again later.</p>
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="transform hover:scale-105 transition-all duration-300">
                <StatsCard
                  title="Total Members"
                  value={stats.totalUsers}
                  icon={<Users size={36} className="text-blue-600" />}
                />
              </div>
              <div className="transform hover:scale-105 transition-all duration-300">
                <StatsCard
                  title="Groups"
                  value={groups?.length || 4}
                  subtitle="Active teams"
                />
              </div>
              <div className="transform hover:scale-105 transition-all duration-300">
                <StatsCard
                  title="Today's Registrations"
                  value={stats.todayRegistrations}
                  icon={<TrendingUp size={36} className="text-green-600" />}
                />
              </div>
              <div className="transform hover:scale-105 transition-all duration-300">
                <StatsCard
                  title="Weekly Average"
                  value={stats.averagePerDay}
                  subtitle="per day"
                />
              </div>
            </div>
          ) : null}
          </section>

          {/* Group Preview Cards Section */}
          <section className="mb-16" aria-labelledby="groups-heading">
            <div className="text-center mb-10">
              <h2 id="groups-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Our Groups
              </h2>
              <p className="text-gray-600 text-lg">Discover the vibrant teams that make us unique</p>
            </div>
          
          {groupsLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : groupsError ? (
            <div className="text-center text-red-600 py-8">
              <p>Unable to load groups. Please try again later.</p>
            </div>
          ) : groups && groups.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {groups
                .sort((a, b) => a.order - b.order)
                .map((group, index) => (
                  <div 
                    key={group._id}
                    className="transform hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <GroupCard
                      group={group}
                      onClick={() => handleGroupClick(group._id)}
                    />
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 py-8">
              <p>No groups available at the moment.</p>
            </div>
          )}
          </section>

          {/* Call to Action */}
          <section className="mt-16 sm:mt-20 text-center" aria-labelledby="cta-heading">
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-gray-800 to-pink-600 rounded-3xl p-12 sm:p-16 shadow-2xl">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white rounded-full opacity-10"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white rounded-full opacity-10"></div>
              
              <div className="relative z-10">
                <h2 id="cta-heading" className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Ready to Join?
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Register now to be assigned to your group and start connecting with your teammates.
                </p>
                <Button
                  variant="primary"
                  onClick={handleGetStarted}
                  className="text-lg px-10 py-5 bg-white text-gray-900 hover:bg-gray-100 shadow-xl transform hover:scale-105 transition-all duration-300 font-bold"
                >
                  Register Now →
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
