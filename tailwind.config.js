/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        surface: {
          DEFAULT: '#F9F8F6',
          secondary: '#F2F1EE',
          tertiary: '#ECEAE5',
        },
        border: {
          DEFAULT: '#E0DDD7',
          strong: '#C5C1B9',
        },
        ink: {
          DEFAULT: '#1A1916',
          secondary: '#6B6860',
          tertiary: '#9C9A94',
        },
        accent: {
          DEFAULT: '#1A1916',
          muted: '#3D3B35',
        },
        confidence: {
          high: '#2D6A4F',
          medium: '#B45309',
          low: '#C0392B',
        },
        severity: {
          low: '#2D6A4F',
          medium: '#B45309',
          high: '#C0392B',
        },
      },
    },
  },
  plugins: [],
}
