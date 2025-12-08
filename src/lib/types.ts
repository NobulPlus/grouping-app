// Core data types for the application

export interface User {
  id: string;
  surname: string;
  firstName: string;
  middleName: string;
  email?: string;
  phone?: string;
  group: string;
  groupName: string;
  groupColor: string;
  groupColorCode: string;
  registrationDate: string;
  lastActive?: string;
}

export interface Group {
  _id: string;
  name: string;
  color: string;
  colorCode: string;
  currentCount: number;
  maxCapacity?: number;
  isActive: boolean;
  order: number;
  createdAt?: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      fullName: string;
      group: string;
      groupColor: string;
      groupColorCode: string;
      positionInGroup: number;
      totalInGroup: number;
      registrationDate: string;
    };
    assignment: {
      groupId: string;
      groupName: string;
      groupColor: string;
      groupColorCode: string;
    };
  };
}

export interface Stats {
  totalUsers: number;
  todayRegistrations: number;
  weeklyRegistrations: number;
  averagePerDay: string;
}

export interface CheckNameResponse {
  success: boolean;
  exists: boolean;
  user?: {
    group: string;
    registeredDate: string;
  };
}

export interface GroupMembersResponse {
  success: boolean;
  data: {
    group: {
      id: string;
      name: string;
      color: string;
      colorCode: string;
    };
    members: User[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface ApiError {
  message: string;
  status: number;
}

export interface RegistrationFormData {
  surname: string;
  firstName: string;
  middleName: string;
  email?: string;
  phone?: string;
}

// Group color definitions
export const GROUP_COLORS = {
  orange: {
    primary: '#FF6B35',
    light: '#FFB399',
    dark: '#CC5529',
  },
  blue: {
    primary: '#004E89',
    light: '#3D7EA6',
    dark: '#003D6B',
  },
  green: {
    primary: '#00A8E8',
    light: '#4DC4F0',
    dark: '#0086BA',
  },
  purple: {
    primary: '#9D4EDD',
    light: '#C18EF0',
    dark: '#7D3EB0',
  },
} as const;

export type GroupColorName = keyof typeof GROUP_COLORS;
