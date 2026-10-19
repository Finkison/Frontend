/**
 * Finkison Design System Tokens
 * Single source of truth for all design values
 * WCAG AA compliant colors, consistent typography scale
 */

export const tokens = {
  // Colors - Semantic naming with WCAG AA contrast
  colors: {
    // Brand Primary (Academic Crimson & Antique Gold)
    brand: {
      crimson: {
        50: '#FFF1F2',
        100: '#FFE4E6',
        200: '#FECDD3',
        300: '#FDA4AF',
        400: '#FB7185',
        500: '#F43F5E',
        600: '#E11D48',
        700: '#BE123C',
        800: '#9F1239',
        900: '#881337', // Brand Primary Header
        950: '#4C0519'  // Deep Institutional Claret Anchor
      },
      amber: {
        50: '#FFFBEB',
        100: '#FEF3C7',
        200: '#FDE68A',
        300: '#FCD34D',
        400: '#FBBF24',  // Luminous Gold Accent
        500: '#F59E0B',
        600: '#D97706',
        700: '#B45309',
        800: '#92400E',
        900: '#78350F',
        950: '#451A03'
      },
      emerald: {
        50: '#F0FDF4',
        100: '#DCFCE7',
        200: '#BBF7D0',
        300: '#86EFAC',
        400: '#4ADE80',
        500: '#22C55E',
        600: '#16A34A',
        700: '#15803D',
        800: '#166534',
        900: '#14532D',
        950: '#052E16'
      }
    },

    // Neutrals - Warm Stone and Slate scales
    neutral: {
      stone: {
        50: '#FAF8F5',  // Warm Parchment Paper
        100: '#F4EFEA', // Linen Card Inset
        200: '#E7E0D6', // Parchment Rim Border
        300: '#D5CBC0', // Input Stroke
        400: '#A89C90', // Placeholder
        500: '#7D6F63', // Meta Captions
        600: '#5C5046', // Secondary Text
        700: '#443932', // Body Text
        800: '#312722', // Headings
        900: '#261E1A', // Rich Cocoa Slate
        950: '#1C1512'  // Deep Espresso Anchor
      },
      slate: {
        50: '#F8FAFC',
        100: '#F1F5F9',
        200: '#E2E8F0',
        300: '#CBD5E1',
        400: '#94A3B8',
        500: '#64748B',
        600: '#475569',
        700: '#334155',
        800: '#1E293B',
        900: '#0F172A',
        950: '#020617'
      },
      50: '#FAF8F5',
      100: '#F4EFEA',
      200: '#E7E0D6',
      300: '#D5CBC0',
      400: '#A89C90',
      500: '#7D6F63',
      600: '#5C5046',
      700: '#443932',
      800: '#312722',
      900: '#261E1A',
      950: '#1C1512'
    },

    // Semantic colors
    semantic: {
      success: {
        light: '#DCFCE7',
        DEFAULT: '#16A34A',
        dark: '#15803D',
        contrast: '#052E16'
      },
      error: {
        light: '#FEE2E2',
        DEFAULT: '#DC2626',
        dark: '#B91C1C',
        contrast: '#7F1D1D'
      },
      warning: {
        light: '#FEF3C7',
        DEFAULT: '#F59E0B',
        dark: '#D97706',
        contrast: '#78350F'
      },
      info: {
        light: '#FFF1F2',
        DEFAULT: '#881337',
        dark: '#4C0519',
        contrast: '#FFFFFF'
      }
    },

    // Background tokens
    background: {
      app: '#FAF8F5',        // Warm Parchment Paper
      card: '#FFFFFF',
      elevated: '#FFFFFF',
      overlay: 'rgba(28, 21, 18, 0.6)',  // Deep Espresso @ 60%
      muted: '#F4EFEA',      // Linen Inset
      dark: '#1C1512'        // Deep Espresso
    },

    // Border tokens
    border: {
      light: '#E7E0D6',      // Parchment Rim
      DEFAULT: '#D5CBC0',    // Input Stroke
      strong: '#A89C90',     // Control Border
      focus: '#881337'       // Brand Crimson Focus
    },

    // Text tokens (WCAG AA compliant)
    text: {
      primary: '#261E1A',    // Cocoa Slate, 17.2:1 contrast on parchment
      secondary: '#5C5046',  // Warm Muted, 7.2:1 contrast
      tertiary: '#7D6F63',   // Warm Subtle, 4.6:1 contrast
      inverse: '#FFFFFF',
      disabled: '#A89C90',   // Placeholder / disabled text
      link: '#881337',       // Brand Crimson link
      linkHover: '#9F1239'   // Brand Crimson hover
    }
  },

  // Typography - 6-level scale
  typography: {
    fontSize: {
      xs: '0.75rem',      // 12px - captions, labels
      sm: '0.875rem',     // 14px - body small, secondary text
      base: '1rem',       // 16px - body, primary text
      lg: '1.125rem',     // 18px - lead text, large body
      xl: '1.25rem',      // 20px - h3, card titles
      '2xl': '1.5rem',    // 24px - h2, page headers
      '3xl': '1.875rem',  // 30px - h1, hero text
      '4xl': '2.25rem'    // 36px - display, marketing
    },

    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800'
    },

    lineHeight: {
      tight: '1.25',      // Headings
      snug: '1.375',      // Subheadings
      normal: '1.5',      // Body text
      relaxed: '1.625',   // Reading content
      loose: '2'          // Short display text
    },

    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'     // Uppercase labels
    },

    fontFamily: {
      sans: '"Inter", system-ui, -apple-system, sans-serif',
      serif: '"Merriweather", Georgia, serif',
      mono: '"Roboto Mono", "Courier New", monospace'
    }
  },

  // Spacing - 4px base unit
  spacing: {
    0: '0',
    0.5: '0.125rem',   // 2px
    1: '0.25rem',      // 4px
    1.5: '0.375rem',   // 6px
    2: '0.5rem',       // 8px
    2.5: '0.625rem',   // 10px
    3: '0.75rem',      // 12px
    3.5: '0.875rem',   // 14px
    4: '1rem',         // 16px
    5: '1.25rem',      // 20px
    6: '1.5rem',       // 24px
    7: '1.75rem',      // 28px
    8: '2rem',         // 32px
    9: '2.25rem',      // 36px
    10: '2.5rem',      // 40px
    11: '2.75rem',     // 44px
    12: '3rem',        // 48px
    14: '3.5rem',      // 56px
    16: '4rem',        // 64px
    20: '5rem',        // 80px
    24: '6rem',        // 96px
    32: '8rem'         // 128px
  },

  // Border radius - single value for consistency
  borderRadius: {
    none: '0',
    sm: '0.375rem',    // 6px - inputs, small cards
    DEFAULT: '0.75rem', // 12px - buttons, cards (PRIMARY)
    lg: '1rem',        // 16px - large cards, modals
    xl: '1.5rem',      // 24px - hero cards
    '2xl': '2rem',     // 32px - feature sections
    full: '9999px'     // Pills, avatars
  },

  // Shadows - elevation system
  shadows: {
    none: 'none',
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',                           // Subtle borders
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',  // Cards
    DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)', // Elevated cards
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)', // Dropdowns
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', // Modals
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',                    // Popovers
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)'                  // Wells
  },

  // Animation & Transitions
  animation: {
    duration: {
      fast: '150ms',
      DEFAULT: '200ms',
      slow: '300ms',
      slower: '500ms'
    },
    easing: {
      DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',  // ease-in-out
      in: 'cubic-bezier(0.4, 0, 1, 1)',         // ease-in
      out: 'cubic-bezier(0, 0, 0.2, 1)',        // ease-out
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  },

  // Z-index scale
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
    notification: 1700
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
} as const;

// Type exports for TypeScript
export type TokenColors = typeof tokens.colors;
export type TokenTypography = typeof tokens.typography;
export type TokenSpacing = typeof tokens.spacing;

// Utility functions
export const getColor = (path: string): string => {
  const keys = path.split('.');
  let value: any = tokens.colors;
  for (const key of keys) {
    value = value[key];
    if (!value) return '';
  }
  return value;
};

export const getFontSize = (size: keyof typeof tokens.typography.fontSize) => ({
  fontSize: tokens.typography.fontSize[size],
  lineHeight: tokens.typography.lineHeight.normal
});

export default tokens;
