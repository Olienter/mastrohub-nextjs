/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'body': ['Inter', 'sans-serif'],
        'display': ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        // Semantic color tokens
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        // Existing custom colors
        'mint': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        'neutral': {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        mastroCyan: {
          50:  '#e0fcfa',
          100: '#b9f5ef',
          200: '#7deee2',
          300: '#36e0d0',
          400: '#14b8a6',
          500: '#0d9488',
          600: '#0e8074',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        mastroNavy: {
          900: '#0a192f',
          800: '#112240',
          700: '#233554',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      backgroundImage: {
        'mastro-radial': 'radial-gradient(ellipse at 50% 40%, #0a192f 0%, #112240 60%, #14b8a6 100%)',
        'noise': 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        'noise-pattern': 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(34, 211, 238, 0.1) 2px, rgba(34, 211, 238, 0.1) 4px)',
      },
      animation: {
        'ken-burns': 'ken-burns 20s ease-in-out infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bokeh-float': 'bokeh-float 8s ease-in-out infinite',
        'parallax': 'parallax 20s ease-in-out infinite',
        'noise': 'noise 0.5s steps(2) infinite',
        'scroll-timeline': 'scroll-timeline 1s linear',
      },
      keyframes: {
        'ken-burns': {
          '0%, 100%': {
            transform: 'scale(1) rotate(0deg)',
          },
          '50%': {
            transform: 'scale(1.1) rotate(1deg)',
          },
        },
        'bokeh-float': {
          '0%, 100%': { transform: 'translateY(0px) scale(1)', opacity: '0.3' },
          '50%': { transform: 'translateY(-20px) scale(1.1)', opacity: '1' },
        },
        'parallax': {
          '0%, 100%': { transform: 'translateX(0px) translateY(0px)' },
          '50%': { transform: 'translateX(-10px) translateY(-5px)' },
        },
        'noise': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -5%)' },
          '20%': { transform: 'translate(-10%, 5%)' },
          '30%': { transform: 'translate(5%, -10%)' },
          '40%': { transform: 'translate(-5%, 15%)' },
          '50%': { transform: 'translate(-10%, 5%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 10%)' },
          '80%': { transform: 'translate(3%, 15%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
        },
        'scroll-timeline': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
}