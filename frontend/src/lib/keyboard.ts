/**
 * Keyboard Navigation Utilities
 * 
 * This file provides utilities and constants for keyboard navigation
 * to ensure full accessibility compliance.
 */

/**
 * Common keyboard keys
 */
export const KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
} as const;

/**
 * Check if an event is an activation key (Enter or Space)
 * Used for making non-button elements keyboard accessible
 */
export function isActivationKey(event: React.KeyboardEvent): boolean {
  return event.key === KEYS.ENTER || event.key === KEYS.SPACE;
}

/**
 * Handle keyboard activation for clickable elements
 * Prevents default for Space to avoid page scroll
 */
export function handleKeyboardActivation(
  event: React.KeyboardEvent,
  callback: () => void
): void {
  if (isActivationKey(event)) {
    event.preventDefault();
    callback();
  }
}

/**
 * Create keyboard event handler for clickable elements
 * Returns a function that can be used as onKeyDown handler
 */
export function createKeyboardHandler(onClick: () => void) {
  return (event: React.KeyboardEvent) => {
    handleKeyboardActivation(event, onClick);
  };
}

/**
 * Focus management utilities
 */
export const focusManagement = {
  /**
   * Focus the first focusable element within a container
   */
  focusFirst(container: HTMLElement): void {
    const focusable = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  },

  /**
   * Focus the last focusable element within a container
   */
  focusLast(container: HTMLElement): void {
    const focusable = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) {
      focusable[focusable.length - 1].focus();
    }
  },

  /**
   * Trap focus within a container (useful for modals)
   */
  trapFocus(container: HTMLElement, event: KeyboardEvent): void {
    if (event.key !== KEYS.TAB) return;

    const focusable = Array.from(
      container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );

    if (focusable.length === 0) return;

    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  },
};

/**
 * Keyboard navigation patterns for common UI components
 */
export const navigationPatterns = {
  /**
   * Handle arrow key navigation in a list
   */
  handleListNavigation(
    event: React.KeyboardEvent,
    currentIndex: number,
    itemCount: number,
    onIndexChange: (newIndex: number) => void
  ): void {
    let newIndex = currentIndex;

    switch (event.key) {
      case KEYS.ARROW_UP:
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : itemCount - 1;
        break;
      case KEYS.ARROW_DOWN:
        event.preventDefault();
        newIndex = currentIndex < itemCount - 1 ? currentIndex + 1 : 0;
        break;
      case KEYS.HOME:
        event.preventDefault();
        newIndex = 0;
        break;
      case KEYS.END:
        event.preventDefault();
        newIndex = itemCount - 1;
        break;
      default:
        return;
    }

    onIndexChange(newIndex);
  },

  /**
   * Handle arrow key navigation in a grid
   */
  handleGridNavigation(
    event: React.KeyboardEvent,
    currentRow: number,
    currentCol: number,
    rowCount: number,
    colCount: number,
    onPositionChange: (row: number, col: number) => void
  ): void {
    let newRow = currentRow;
    let newCol = currentCol;

    switch (event.key) {
      case KEYS.ARROW_UP:
        event.preventDefault();
        newRow = currentRow > 0 ? currentRow - 1 : rowCount - 1;
        break;
      case KEYS.ARROW_DOWN:
        event.preventDefault();
        newRow = currentRow < rowCount - 1 ? currentRow + 1 : 0;
        break;
      case KEYS.ARROW_LEFT:
        event.preventDefault();
        newCol = currentCol > 0 ? currentCol - 1 : colCount - 1;
        break;
      case KEYS.ARROW_RIGHT:
        event.preventDefault();
        newCol = currentCol < colCount - 1 ? currentCol + 1 : 0;
        break;
      default:
        return;
    }

    onPositionChange(newRow, newCol);
  },
};

/**
 * Keyboard shortcuts documentation
 */
export const KEYBOARD_SHORTCUTS = {
  GLOBAL: {
    'Tab': 'Navigate to next interactive element',
    'Shift + Tab': 'Navigate to previous interactive element',
    'Enter': 'Activate focused element',
    'Space': 'Activate focused button or toggle',
    'Escape': 'Close modal or cancel action',
  },
  FORMS: {
    'Tab': 'Move to next form field',
    'Shift + Tab': 'Move to previous form field',
    'Enter': 'Submit form (when on submit button)',
    'Space': 'Toggle checkbox or radio button',
  },
  NAVIGATION: {
    'Tab': 'Navigate through menu items',
    'Enter': 'Follow link or activate menu item',
    'Escape': 'Close mobile menu',
  },
} as const;

/**
 * Check if an element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];

  return focusableSelectors.some(selector => element.matches(selector));
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll<HTMLElement>(selector));
}
