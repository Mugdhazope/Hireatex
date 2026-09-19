// HiretaX Design System Tokens
// Single source of truth for all design values

export const colors = {
  // Brand
  primary: {
    DEFAULT: 'hsl(209, 73%, 58%)', // HiretaX blue (#4A90E2)
    hover: 'hsl(209, 73%, 52%)',
    active: 'hsl(209, 73%, 46%)',
    subtle: 'hsl(209, 73%, 96%)',
    muted: 'hsl(209, 40%, 85%)',
  },
  
  // Warm neutrals
  background: {
    DEFAULT: 'hsl(40, 30%, 97%)', // Warm beige-gray
    elevated: 'hsl(0, 0%, 100%)', // White for cards/elevated surfaces
    muted: 'hsl(40, 20%, 95%)',
  },
  
  // Surface
  surface: {
    DEFAULT: 'hsl(0, 0%, 100%)',
    elevated: 'hsl(0, 0%, 100%)',
    muted: 'hsl(40, 20%, 98%)',
  },
  
  // Text
  foreground: {
    DEFAULT: 'hsl(0, 0%, 10%)', // Near black
    muted: 'hsl(0, 0%, 45%)',
    subtle: 'hsl(0, 0%, 60%)',
  },
  
  // Border
  border: {
    DEFAULT: 'hsl(0, 0%, 89%)',
    muted: 'hsl(0, 0%, 94%)',
    strong: 'hsl(0, 0%, 80%)',
  },
  
  // Semantic
  success: {
    DEFAULT: 'hsl(142, 76%, 36%)',
    bg: 'hsl(142, 76%, 96%)',
    border: 'hsl(142, 76%, 85%)',
  },
  warning: {
    DEFAULT: 'hsl(38, 92%, 50%)',
    bg: 'hsl(38, 92%, 96%)',
    border: 'hsl(38, 92%, 85%)',
  },
  error: {
    DEFAULT: 'hsl(0, 84%, 60%)',
    bg: 'hsl(0, 84%, 96%)',
    border: 'hsl(0, 84%, 85%)',
  },
  info: {
    DEFAULT: 'hsl(199, 89%, 48%)',
    bg: 'hsl(199, 89%, 96%)',
    border: 'hsl(199, 89%, 85%)',
  },
} as const

export const typography = {
  // Font families
  fontFamily: {
    sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
    mono: ['var(--font-geist-mono)', 'monospace'],
  },
  
  // Font sizes (with line heights)
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
    '5xl': ['3rem', { lineHeight: '1' }],         // 48px
    '6xl': ['3.75rem', { lineHeight: '1' }],      // 60px
  },
  
  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Letter spacing
  letterSpacing: {
    tight: '-0.02em',
    normal: '0em',
    wide: '0.02em',
  },
} as const

export const spacing = {
  0: '0px',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
  40: '10rem',    // 160px
  48: '12rem',    // 192px
  64: '16rem',    // 256px
  80: '20rem',    // 320px
  96: '24rem',    // 384px
} as const

export const radius = {
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',  // pill
} as const

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const

export const container = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

export const animation = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const
