import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layouts';
import { Button } from '@/components/ui';
import { Users, LayoutDashboard, Sparkles } from 'lucide-react';
import type { RegistrationResponse } from '@/lib/types';

export default function Confirm() {
  const router = useRouter();
  const [registrationData, setRegistrationData] = useState<RegistrationResponse['data'] | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Get registration data from session storage or router state
    const storedData = sessionStorage.getItem('registrationData');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setRegistrationData(parsed);
        setShowConfetti(true);
        // Clear after reading
        sessionStorage.removeItem('registrationData');
      } catch (error) {
        console.error('Failed to parse registration data:', error);
      }
    } else if (router.query.data) {
      try {
        const parsed = JSON.parse(router.query.data as string);
        setRegistrationData(parsed);
        setShowConfetti(true);
      } catch (error) {
        console.error('Failed to parse query data:', error);
      }
    }
  }, [router.query]);

  // Redirect if no data
  useEffect(() => {
    if (!registrationData && router.isReady) {
      const timer = setTimeout(() => {
        router.push('/register');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [registrationData, router]);

  if (!registrationData) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </MainLayout>
    );
  }

  const { user, assignment } = registrationData;

  const handleViewGroup = () => {
    router.push(`/group/${assignment.groupId}`);
  };

  const handleViewDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Confetti Animation */}
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  rotate: 0,
                }}
                animate={{
                  y: window.innerHeight + 20,
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  delay: Math.random() * 0.5,
                  ease: 'linear',
                }}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#FF6B35', '#004E89', '#00A8E8', '#9D4EDD'][
                    Math.floor(Math.random() * 4)
                  ],
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="flex justify-center mb-8"
          role="img"
          aria-label="Success celebration icon"
        >
          <div className="bg-green-100 rounded-full p-6">
            <Sparkles className="w-16 h-16 text-green-600" aria-hidden="true" />
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to the Team!
          </h1>
          <p className="text-xl text-gray-600">
            You've been successfully registered
          </p>
        </motion.div>

        {/* Group Assignment Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          {/* Large Color Swatch */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
            className="h-32 relative"
            style={{ backgroundColor: assignment.groupColorCode }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          </motion.div>

          {/* Group Information */}
          <div className="p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {assignment.groupName}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Your assigned group
              </p>

              {/* Member Information */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Full Name</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {user.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Position in Group</p>
                    <p className="text-lg font-semibold text-gray-900">
                      Member {user.positionInGroup} of {user.totalInGroup}
                    </p>
                  </div>
                </div>
              </div>

              {/* Group Stats */}
              <div className="flex items-center justify-center gap-2 text-gray-600 mb-8">
                <Users className="w-5 h-5" />
                <span className="text-lg">
                  {user.totalInGroup} {user.totalInGroup === 1 ? 'member' : 'members'} in your group
                </span>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  onClick={handleViewGroup}
                  className="flex-1"
                >
                  <Users className="w-5 h-5" />
                  View My Group
                </Button>
                <Button
                  variant="outline"
                  onClick={handleViewDashboard}
                  className="flex-1"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  View All Groups
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="text-center text-gray-500 text-sm"
        >
          <p>
            Registration Date: {new Date(user.registrationDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </motion.div>
      </div>
    </MainLayout>
  );
}
