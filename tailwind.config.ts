/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Cute Girl Aesthetic Palette
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#F8BBD0',
          300: '#f472b6',
          400: '#ec4899',
          500: '#db2777',
          600: '#be185d',
        },
        lavender: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#E1BEE7',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
        },
        peach: {
          50: '#fff7ed',
          100: '#FFE0B2',
          200: '#FFCC80',
          300: '#FFB74D',
        },
        cream: {
          50: '#FFFDF9',
          100: '#FFF8F0',
          200: '#FFF3E0',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        sans: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'pink-gradient': 'linear-gradient(135deg, #F8BBD0 0%, #E1BEE7 50%, #FFE0B2 100%)',
        'lavender-gradient': 'linear-gradient(135deg, #E1BEE7 0%, #F8BBD0 100%)',
        'peach-gradient': 'linear-gradient(135deg, #FFE0B2 0%, #F8BBD0 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)',
        'hero-gradient': 'linear-gradient(135deg, #fdf2f8 0%, #faf5ff 50%, #fff7ed 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(248, 187, 208, 0.3)',
        'glass-lg': '0 16px 48px rgba(248, 187, 208, 0.4)',
        pink: '0 4px 20px rgba(248, 187, 208, 0.5)',
        lavender: '0 4px 20px rgba(225, 190, 231, 0.5)',
        soft: '0 2px 15px rgba(0, 0, 0, 0.08)',
        card: '0 4px 24px rgba(248, 187, 208, 0.25)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-pink': 'pulse-pink 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-pink': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(248, 187, 208, 0.4)' },
          '50%': { boxShadow: '0 0 0 15px rgba(248, 187, 208, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
