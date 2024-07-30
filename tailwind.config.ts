import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      colors: {
        primary: {
          50: '#E9ECFC',
          100: '#BBC3F7',
          200: '#9BA5F3',
          300: '#6D7CEE',
          400: '#5163EA',
          500: '#253CE5',
          600: '#2237D0',
          700: '#1A2BA3',
          800: '#14217E',
          900: '#101960'
        },
        grey: {
          50: '#F5F6F7',
          100: '#D7DBDF',
          200: '#BBC2C9',
          300: '#9FA8B2',
          400: '#828F9B',
          500: '#687582',
          600: '#525C66',
          700: '#3B424A',
          800: '#24292D',
          900: '#0E0F11'
        },
        sub: '#667BC6',
        error: '#E54B4B',
        warning: '#EE8434',
        info: '#D7DBDF',
        success: '#00A878'
      }
    }
  },
  plugins: []
};
export default config;
