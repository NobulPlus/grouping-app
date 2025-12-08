import axios, { AxiosError } from 'axios';
import type {
  RegistrationResponse,
  CheckNameResponse,
  Group,
  GroupMembersResponse,
  Stats,
  RegistrationFormData,
  ApiError,
} from './types';

// API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Error handler utility
export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    
    if (axiosError.response) {
      // Server responded with error
      return {
        message: axiosError.response.data?.message || 'An error occurred',
        status: axiosError.response.status,
      };
    } else if (axiosError.request) {
      // Network error
      return {
        message: 'Unable to connect to server. Please check your connection.',
        status: 0,
      };
    }
  }
  
  // Other errors
  return {
    message: 'An unexpected error occurred',
    status: -1,
  };
};

// API functions

/**
 * Register a new user
 */
export const registerUser = async (
  data: RegistrationFormData
): Promise<RegistrationResponse> => {
  const response = await apiClient.post<RegistrationResponse>('/api/users/register', data);
  return response.data;
};

/**
 * Check if a name combination already exists
 */
export const checkNameExists = async (
  surname: string,
  firstName: string,
  middleName: string
): Promise<CheckNameResponse> => {
  const response = await apiClient.get<CheckNameResponse>('/api/users/check', {
    params: { surname, firstName, middleName },
  });
  return response.data;
};

/**
 * Get all groups
 */
export const getAllGroups = async (): Promise<Group[]> => {
  const response = await apiClient.get<{ success: boolean; groups: Group[] }>('/api/groups');
  return response.data.groups;
};

/**
 * Get a specific group by ID
 */
export const getGroupById = async (id: string): Promise<Group> => {
  const response = await apiClient.get<{ success: boolean; group: Group }>(`/api/groups/${id}`);
  return response.data.group;
};

/**
 * Get members of a specific group with pagination
 */
export const getGroupMembers = async (
  groupId: string,
  page: number = 1,
  limit: number = 20
): Promise<GroupMembersResponse> => {
  const response = await apiClient.get<GroupMembersResponse>(
    `/api/users/group/${groupId}/members`,
    {
      params: { page, limit },
    }
  );
  return response.data;
};

/**
 * Get user statistics
 */
export const getUserStats = async (): Promise<Stats> => {
  const response = await apiClient.get<{ success: boolean; data: Stats }>('/api/users/stats');
  return response.data.data;
};

/**
 * Get a specific user by ID
 */
export const getUserById = async (id: string) => {
  const response = await apiClient.get(`/api/users/${id}`);
  return response.data;
};
