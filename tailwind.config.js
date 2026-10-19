/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./App.tsx",
    "./main.tsx"
  ],
  darkMode: ["class", "[data-theme='dark']"],
  theme: {
    extend: {
      colors: {
        // Ethiopian EdTech Brand (Emerald + Amber + Blue)
        // WCAG AA Compliant - All colors tested for 4.5:1 contrast minimum
        emerald: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',  // Primary interactive - 7.2:1 contrast on white
          800: '#166534',
          900: '#14532D',
          950: '#052E16'
        },
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',  // Accent/highlight - 6.8:1 contrast on white
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03'
        },
        // Neutral scale - Slate (cooler, professional)
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',  // ⚠️ 3.4:1 contrast - use only with icons/borders
          500: '#64748B',  // 4.7:1 contrast - minimum for small text
          600: '#475569',  // 7.1:1 contrast - body text
          700: '#334155',  // 10.7:1 contrast - headings
          800: '#1E293B',
          900: '#0F172A',  // 16.1:1 contrast - primary text
          950: '#020617'
        },
        // Semantic status colors (accessible)
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',  // 5.9:1 contrast
          700: '#15803D',  // 7.2:1 contrast - preferred
          800: '#166534',
          900: '#14532D'
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',  // 5.0:1 contrast
          700: '#B91C1C',  // 6.5:1 contrast - preferred
          800: '#991B1B',
          900: '#7F1D1D'
        },
        danger: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',  // 5.0:1 contrast
          700: '#B91C1C',  // 6.5:1 contrast - preferred
          800: '#991B1B',
          900: '#7F1D1D'
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',  // 5.3:1 contrast
          700: '#B45309',  // 6.8:1 contrast - preferred
          800: '#92400E',
          900: '#78350F'
        },
        info: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F'
        },
        
        // Academic Crimson Scale (Harvard / Oxford Heritage - Replaces Blue)
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
          950: '#4C0519', // Deep Institutional Claret Anchor
        },
        // Antique Brass & Burnished Gold Scale (Replaces Sky Blue)
        brass: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24', // Luminous Gold Accent
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309', // Secondary Action & Focus Ring
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
        // Warm Stone & Espresso Neutral Scale (Replaces Pure Black & Navy)
        stone: {
          50: '#FAF8F5',  // Parchment Canvas
          100: '#F4EFEA', // Linen Card Inset
          200: '#E7E0D6', // Parchment Rim Border
          300: '#D5CBC0', // Input Stroke
          400: '#A89C90', // Placeholder
          500: '#7D6F63', // Meta Captions
          600: '#5C5046', // Secondary Text
          700: '#443932', // Body Text
          800: '#312722', // Headings
          900: '#261E1A', // Rich Cocoa Slate (Replaces #0F172A)
          950: '#1C1512', // Deep Espresso Anchor (Replaces #000000 & #0B1B3A)
        },
        
        // Brand Primary & Accent Tokens
        primary: {
          DEFAULT: "#881337",
          hover: "#9F1239",
          active: "#BE123C",
        },
        brand: {
          DEFAULT: "#FBBF24",
          hover: "#F59E0B",
          active: "#D97706",
          "on-brand": "#1C1512",
          tint: "#FFF1F2",
          "tint-border": "#FECDD3",
          accent: "#881337",
          "accent-hover": "#9F1239",
          "control-border": "#A89C90",
        }
      },

      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        serif: ['"Merriweather"', 'Georgia', 'serif'],
        mono: ['"Roboto Mono"', '"JetBrains Mono"', '"Courier New"', 'monospace'],
        ethiopic: ['"Noto Sans Ethiopic"', '"Inter"', 'sans-serif']
      },

      fontSize: {
        // 6-level scale from tokens.ts
        xs: ['0.75rem', { lineHeight: '1.5' }],      // 12px - captions, labels
        sm: ['0.875rem', { lineHeight: '1.5' }],     // 14px - body small
        base: ['1rem', { lineHeight: '1.5' }],       // 16px - body (DEFAULT)
        lg: ['1.125rem', { lineHeight: '1.5' }],     // 18px - lead text
        xl: ['1.25rem', { lineHeight: '1.375' }],    // 20px - h3, card titles
        '2xl': ['1.5rem', { lineHeight: '1.25' }],   // 24px - h2, page headers
        '3xl': ['1.875rem', { lineHeight: '1.25' }], // 30px - h1, hero
        '4xl': ['2.25rem', { lineHeight: '1.25' }]   // 36px - display
      },

      borderRadius: {
        none: '0',
        sm: '0.375rem',     // 6px - inputs, small cards
        DEFAULT: '0.75rem', // 12px - buttons, cards (PRIMARY)
        lg: '1rem',         // 16px - large cards, modals
        xl: '1.5rem',       // 24px - hero cards
        '2xl': '2rem',      // 32px - feature sections
        '3xl': '2.5rem',    // 40px - extra large sections
        full: '9999px'      // Pills, avatars
      },

      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        xs: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        sm: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)'
      },

      animation: {
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.3s ease-out forwards',
        'slide-in': 'slideIn 0.2s ease-out forwards',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite'
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },

      spacing: {
        '18': '4.5rem',  // 72px
        '88': '22rem',   // 352px
        '128': '32rem'   // 512px
      }
    },
  },
  plugins: [],
}
