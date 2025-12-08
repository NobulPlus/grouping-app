import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Users } from 'lucide-react';
import { useGroupMembers } from '@/hooks/useApi';
import { Button, Skeleton } from '@/components/ui';
import { MemberCard, MemberCardSkeleton } from '@/components/shared';
import { useToast } from '@/contexts/ToastContext';
import { MainLayout } from '@/components/layouts';

const GroupDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { showError } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 20;

  // Fetch group members with pagination
  const { data, isLoading, isError, error } = useGroupMembers(
    id as string,
    currentPage,
    membersPerPage
  );

  // Show toast notification when error occurs
  useEffect(() => {
    if (isError && error) {
      showError(error.message || 'Failed to load group members.');
    }
  }, [isError, error, showError]);

  // Handle back to dashboard
  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  // Handle page navigation
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (data?.data.pagination && currentPage < data.data.pagination.pages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="bg-gray-300 py-16 px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="max-w-7xl mx-auto">
            <Skeleton width="w-32" height="h-6" className="mb-6 bg-gray-400" />
            <Skeleton width="w-64" height="h-12" className="mb-4 bg-gray-400" />
            <Skeleton width="w-40" height="h-6" className="bg-gray-400" />
          </div>
        </div>

        {/* Members List Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <MemberCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (isError || !data) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Group</h2>
            <p className="text-gray-600 mb-6">
              {error?.message || 'Unable to load group information'}
            </p>
            <Button onClick={handleBackToDashboard}>
              <ArrowLeft size={20} />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const { group, members, pagination } = data.data;

  return (
    <MainLayout>
      {/* Group Header with Color Banner */}
      <header
        className="relative py-16 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: group.colorCode,
          backgroundImage: `linear-gradient(135deg, ${group.colorCode} 0%, ${group.colorCode}dd 100%)`,
        }}
        role="banner"
        aria-label={`${group.name} group header`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={handleBackToDashboard}
            className="mb-6 inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded-lg px-2 py-1"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={20} aria-hidden="true" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          {/* Group Name and Member Count */}
          <div className="text-white">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">{group.name}</h1>
            <div className="flex items-center gap-2 text-xl" role="status" aria-live="polite">
              <Users size={24} aria-hidden="true" />
              <span className="font-semibold">
                {pagination.total} {pagination.total === 1 ? 'Member' : 'Members'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Members List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {members.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Members Yet</h3>
            <p className="text-gray-600">This group doesn't have any members yet.</p>
          </div>
        ) : (
          <>
            {/* Member Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <nav className="flex items-center justify-center gap-4 mt-8" aria-label="Pagination navigation">
                <Button
                  variant="outline"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  aria-label="Go to previous page"
                >
                  <ArrowLeft size={20} aria-hidden="true" />
                  Previous
                </Button>

                <div className="text-gray-700 font-medium" role="status" aria-live="polite" aria-atomic="true">
                  Page {currentPage} of {pagination.pages}
                </div>

                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={currentPage === pagination.pages}
                  aria-label="Go to next page"
                >
                  Next
                  <ArrowLeft size={20} className="rotate-180" aria-hidden="true" />
                </Button>
              </nav>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default GroupDetailPage;
