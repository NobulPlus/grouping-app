/**
 * Accessibility Utilities
 * 
 * This file provides utilities for checking and ensuring WCAG 2.1 AA compliance
 * for color contrast and other accessibility requirements.
 */

/**
 * Group colors used in the application
 */
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

/**
 * Common background colors
 */
export const BACKGROUND_COLORS = {
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray900: '#111827',
} as const;

/**
 * Calculate relative luminance of a color
 * @param hex - Hex color code (with or without #)
 * @returns Relative luminance value (0-1)
 */
function getLuminance(hex: string): number {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  // Calculate relative luminance using sRGB formula
  const [rs, gs, bs] = [r, g, b].map((c) => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * @param color1 - First color (hex)
 * @param color2 - Second color (hex)
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * WCAG 2.1 Contrast Requirements
 */
export const WCAG_STANDARDS = {
  AA_NORMAL: 4.5,      // Normal text (< 18pt or < 14pt bold)
  AA_LARGE: 3.0,       // Large text (>= 18pt or >= 14pt bold)
  AAA_NORMAL: 7.0,     // Enhanced normal text
  AAA_LARGE: 4.5,      // Enhanced large text
} as const;

/**
 * Check if color contrast meets WCAG AA standards for normal text
 * @param foreground - Foreground color (hex)
 * @param background - Background color (hex)
 * @returns true if contrast ratio >= 4.5:1
 */
export function meetsWCAG_AA(foreground: string, background: string): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= WCAG_STANDARDS.AA_NORMAL;
}

/**
 * Check if color contrast meets WCAG AA standards for large text
 * @param foreground - Foreground color (hex)
 * @param background - Background color (hex)
 * @returns true if contrast ratio >= 3:1
 */
export function meetsWCAG_AA_Large(foreground: string, background: string): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= WCAG_STANDARDS.AA_LARGE;
}

/**
 * Check if color contrast meets WCAG AAA standards
 * @param foreground - Foreground color (hex)
 * @param background - Background color (hex)
 * @returns true if contrast ratio >= 7:1
 */
export function meetsWCAG_AAA(foreground: string, background: string): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= WCAG_STANDARDS.AAA_NORMAL;
}

/**
 * Get contrast rating for a color pair
 */
export function getContrastRating(foreground: string, background: string): {
  ratio: number;
  AA_normal: boolean;
  AA_large: boolean;
  AAA_normal: boolean;
  AAA_large: boolean;
} {
  const ratio = getContrastRatio(foreground, background);
  
  return {
    ratio: Math.round(ratio * 100) / 100,
    AA_normal: ratio >= WCAG_STANDARDS.AA_NORMAL,
    AA_large: ratio >= WCAG_STANDARDS.AA_LARGE,
    AAA_normal: ratio >= WCAG_STANDARDS.AAA_NORMAL,
    AAA_large: ratio >= WCAG_STANDARDS.AAA_LARGE,
  };
}

/**
 * Verify all group colors meet WCAG AA standards against common backgrounds
 * This function documents the contrast ratios for all group colors
 */
export function verifyGroupColorContrast(): Record<string, Record<string, any>> {
  const results: Record<string, Record<string, any>> = {};
  
  // Test each group color against white background (most common use case)
  Object.entries(GROUP_COLORS).forEach(([groupName, shades]) => {
    results[groupName] = {};
    
    Object.entries(shades).forEach(([shade, color]) => {
      results[groupName][shade] = {
        onWhite: getContrastRating(color, BACKGROUND_COLORS.white),
        onGray50: getContrastRating(color, BACKGROUND_COLORS.gray50),
        onGray100: getContrastRating(color, BACKGROUND_COLORS.gray100),
      };
    });
  });
  
  return results;
}

/**
 * Get accessible text color (white or black) for a given background
 * @param backgroundColor - Background color (hex)
 * @returns '#FFFFFF' or '#000000' depending on which has better contrast
 */
export function getAccessibleTextColor(backgroundColor: string): string {
  const whiteContrast = getContrastRatio('#FFFFFF', backgroundColor);
  const blackContrast = getContrastRatio('#000000', backgroundColor);
  
  return whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
}

/**
 * Minimum touch target size for mobile accessibility (WCAG 2.1 Level AAA)
 */
export const MIN_TOUCH_TARGET_SIZE = 44; // pixels

/**
 * Check if dimensions meet minimum touch target size
 */
export function meetsTouchTargetSize(width: number, height: number): boolean {
  return width >= MIN_TOUCH_TARGET_SIZE && height >= MIN_TOUCH_TARGET_SIZE;
}

/**
 * ARIA live region politeness levels
 */
export const ARIA_LIVE = {
  OFF: 'off',
  POLITE: 'polite',
  ASSERTIVE: 'assertive',
} as const;

/**
 * Common ARIA roles for semantic HTML
 */
export const ARIA_ROLES = {
  ALERT: 'alert',
  BUTTON: 'button',
  NAVIGATION: 'navigation',
  MAIN: 'main',
  COMPLEMENTARY: 'complementary',
  BANNER: 'banner',
  CONTENTINFO: 'contentinfo',
  FORM: 'form',
  SEARCH: 'search',
  REGION: 'region',
  ARTICLE: 'article',
  LIST: 'list',
  LISTITEM: 'listitem',
  TAB: 'tab',
  TABPANEL: 'tabpanel',
  TABLIST: 'tablist',
} as const;
