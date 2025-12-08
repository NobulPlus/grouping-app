import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Format a full name from parts
 */
export function formatFullName(
  firstName: string,
  middleName: string,
  surname: string
): string {
  return `${capitalize(firstName)} ${capitalize(middleName)} ${capitalize(surname)}`;
}

/**
 * Get initials from a name
 */
export function getInitials(firstName: string, surname: string): string {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = surname.charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  } catch {
    return dateString;
  }
}

/**
 * Format a date string to show relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return dateString;
  }
}

/**
 * Validate if a string contains only letters and spaces
 */
export function isValidName(name: string): boolean {
  return /^[a-zA-Z\s]+$/.test(name);
}

/**
 * Get color class for a group color name
 */
export function getGroupColorClass(color: string): string {
  const colorMap: Record<string, string> = {
    orange: 'bg-group-orange',
    blue: 'bg-group-blue',
    green: 'bg-group-green',
    purple: 'bg-group-purple',
  };
  return colorMap[color.toLowerCase()] || 'bg-gray-500';
}

/**
 * Get text color class for a group color name
 */
export function getGroupTextColorClass(color: string): string {
  const colorMap: Record<string, string> = {
    orange: 'text-group-orange',
    blue: 'text-group-blue',
    green: 'text-group-green',
    purple: 'text-group-purple',
  };
  return colorMap[color.toLowerCase()] || 'text-gray-500';
}

/**
 * Get border color class for a group color name
 */
export function getGroupBorderColorClass(color: string): string {
  const colorMap: Record<string, string> = {
    orange: 'border-group-orange',
    blue: 'border-group-blue',
    green: 'border-group-green',
    purple: 'border-group-purple',
  };
  return colorMap[color.toLowerCase()] || 'border-gray-500';
}

/**
 * Calculate color contrast ratio (for accessibility)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string): number => {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    // Calculate relative luminance
    const [rs, gs, bs] = [r, g, b].map((c) => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if color contrast meets WCAG AA standards (4.5:1 for normal text)
 */
export function meetsContrastStandards(foreground: string, background: string): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= 4.5;
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Generate a random ID (for temporary use)
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
