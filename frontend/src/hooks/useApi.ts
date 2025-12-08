import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  registerUser,
  checkNameExists,
  getAllGroups,
  getGroupMembers,
  getUserStats,
} from '@/lib/api';
import type {
  RegistrationResponse,
  CheckNameResponse,
  Group,
  GroupMembersResponse,
  Stats,
  RegistrationFormData,
  ApiError,
} from '@/lib/types';
import { handleApiError } from '@/lib/api';

/**
 * Hook for user registration
 * Uses mutation since this is a POST operation that modifies data
 */
export const useRegistration = () => {
  return useMutation<RegistrationResponse, ApiError, RegistrationFormData>({
    mutationFn: registerUser,
    onError: (error) => {
      return handleApiError(error);
    },
  });
};

/**
 * Hook for checking if a name combination exists
 * Uses mutation since we want to trigger this manually on form submission
 */
export const useCheckName = () => {
  return useMutation<
    CheckNameResponse,
    ApiError,
    { surname: string; firstName: string; middleName: string }
  >({
    mutationFn: ({ surname, firstName, middleName }) =>
      checkNameExists(surname, firstName, middleName),
    onError: (error) => {
      return handleApiError(error);
    },
  });
};

/**
 * Hook for fetching all groups
 * Uses query for automatic caching and background refetching
 */
export const useGroups = (options?: Omit<UseQueryOptions<Group[], ApiError>, 'queryKey' | 'queryFn'>) => {
  return useQuery<Group[], ApiError>({
    queryKey: ['groups'],
    queryFn: getAllGroups,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    ...options,
  });
};

/**
 * Hook for fetching group members with pagination
 * Uses query with dynamic query key based on groupId and page
 */
export const useGroupMembers = (
  groupId: string,
  page: number = 1,
  limit: number = 20,
  options?: Omit<UseQueryOptions<GroupMembersResponse, ApiError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<GroupMembersResponse, ApiError>({
    queryKey: ['groupMembers', groupId, page, limit],
    queryFn: () => getGroupMembers(groupId, page, limit),
    enabled: !!groupId, // Only run query if groupId is provided
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
    ...options,
  });
};

/**
 * Hook for fetching user statistics
 * Uses query for automatic caching and background refetching
 */
export const useStats = (options?: Omit<UseQueryOptions<Stats, ApiError>, 'queryKey' | 'queryFn'>) => {
  return useQuery<Stats, ApiError>({
    queryKey: ['stats'],
    queryFn: getUserStats,
    staleTime: 1 * 60 * 1000, // Consider data fresh for 1 minute (stats change frequently)
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes in background
    ...options,
  });
};
