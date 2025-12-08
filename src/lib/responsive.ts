/**
 * Responsive Design Utilities
 * 
 * This file documents and provides utilities for responsive breakpoints
 * used throughout the application.
 * 
 * Breakpoints (matching TailwindCSS defaults):
 * - Mobile: < 640px (default, no prefix)
 * - Tablet: >= 640px (sm:)
 * - Desktop: >= 1024px (lg:)
 * - Large Desktop: >= 1280px (xl:)
 */

export const BREAKPOINTS = {
  mobile: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Get current breakpoint based on window width
 */
export function getCurrentBreakpoint(): keyof typeof BREAKPOINTS {
  if (typeof window === 'undefined') return 'mobile';
  
  const width = window.innerWidth;
  
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'mobile';
}

/**
 * Check if current viewport is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < BREAKPOINTS.sm;
}

/**
 * Check if current viewport is tablet
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS.sm && window.innerWidth < BREAKPOINTS.lg;
}

/**
 * Check if current viewport is desktop
 */
export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS.lg;
}

/**
 * Minimum touch target size for mobile (WCAG 2.1 Level AAA)
 */
export const MIN_TOUCH_TARGET_SIZE = 44; // pixels

/**
 * Check if an element meets minimum touch target size
 */
export function meetsTouchTargetSize(width: number, height: number): boolean {
  return width >= MIN_TOUCH_TARGET_SIZE && height >= MIN_TOUCH_TARGET_SIZE;
}
