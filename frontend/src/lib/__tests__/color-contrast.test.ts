/**
 * Color Contrast Verification Tests
 * 
 * These tests verify that all group colors meet WCAG AA standards
 * for accessibility (4.5:1 contrast ratio for normal text)
 */

import {
  getContrastRatio,
  meetsWCAG_AA,
  GROUP_COLORS,
  BACKGROUND_COLORS,
  verifyGroupColorContrast,
  getAccessibleTextColor,
} from '../accessibility';

describe('Color Contrast Accessibility', () => {
  describe('Group Colors on White Background', () => {
    it('Orange primary should meet WCAG AA on white', () => {
      const ratio = getContrastRatio(GROUP_COLORS.orange.primary, BACKGROUND_COLORS.white);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(meetsWCAG_AA(GROUP_COLORS.orange.primary, BACKGROUND_COLORS.white)).toBe(true);
    });

    it('Blue primary should meet WCAG AA on white', () => {
      const ratio = getContrastRatio(GROUP_COLORS.blue.primary, BACKGROUND_COLORS.white);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(meetsWCAG_AA(GROUP_COLORS.blue.primary, BACKGROUND_COLORS.white)).toBe(true);
    });

    it('Green primary should meet WCAG AA on white', () => {
      const ratio = getContrastRatio(GROUP_COLORS.green.primary, BACKGROUND_COLORS.white);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(meetsWCAG_AA(GROUP_COLORS.green.primary, BACKGROUND_COLORS.white)).toBe(true);
    });

    it('Purple primary should meet WCAG AA on white', () => {
      const ratio = getContrastRatio(GROUP_COLORS.purple.primary, BACKGROUND_COLORS.white);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(meetsWCAG_AA(GROUP_COLORS.purple.primary, BACKGROUND_COLORS.white)).toBe(true);
    });
  });

  describe('Group Colors on Gray Backgrounds', () => {
    it('All group colors should meet WCAG AA on gray-50', () => {
      Object.entries(GROUP_COLORS).forEach(([name, shades]) => {
        const ratio = getContrastRatio(shades.primary, BACKGROUND_COLORS.gray50);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });
    });

    it('All group colors should meet WCAG AA on gray-100', () => {
      Object.entries(GROUP_COLORS).forEach(([name, shades]) => {
        const ratio = getContrastRatio(shades.primary, BACKGROUND_COLORS.gray100);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });
    });
  });

  describe('White Text on Group Colors', () => {
    it('White text should be readable on all group color backgrounds', () => {
      Object.entries(GROUP_COLORS).forEach(([name, shades]) => {
        const ratio = getContrastRatio('#FFFFFF', shades.primary);
        // For white text on colored backgrounds, we expect at least 3:1 for large text
        expect(ratio).toBeGreaterThanOrEqual(3.0);
      });
    });
  });

  describe('Contrast Ratio Calculations', () => {
    it('should calculate correct contrast ratio for black on white', () => {
      const ratio = getContrastRatio('#000000', '#FFFFFF');
      expect(ratio).toBeCloseTo(21, 0); // Maximum contrast
    });

    it('should calculate correct contrast ratio for white on black', () => {
      const ratio = getContrastRatio('#FFFFFF', '#000000');
      expect(ratio).toBeCloseTo(21, 0); // Maximum contrast
    });

    it('should calculate same ratio regardless of color order', () => {
      const ratio1 = getContrastRatio('#FF6B35', '#FFFFFF');
      const ratio2 = getContrastRatio('#FFFFFF', '#FF6B35');
      expect(ratio1).toBe(ratio2);
    });
  });

  describe('Accessible Text Color Selection', () => {
    it('should return white for dark backgrounds', () => {
      const textColor = getAccessibleTextColor(GROUP_COLORS.blue.primary);
      expect(textColor).toBe('#FFFFFF');
    });

    it('should return black for light backgrounds', () => {
      const textColor = getAccessibleTextColor('#FFFFFF');
      expect(textColor).toBe('#000000');
    });
  });

  describe('Comprehensive Color Verification', () => {
    it('should verify all group colors and document results', () => {
      const results = verifyGroupColorContrast();
      
      // Ensure all groups are tested
      expect(Object.keys(results)).toEqual(['orange', 'blue', 'green', 'purple']);
      
      // Check that each group has results for all shades
      Object.values(results).forEach((groupResults) => {
        expect(groupResults).toHaveProperty('primary');
        expect(groupResults).toHaveProperty('light');
        expect(groupResults).toHaveProperty('dark');
      });
      
      // Log results for documentation
      console.log('Color Contrast Verification Results:');
      console.log(JSON.stringify(results, null, 2));
    });
  });
});
