import type { Config } from 'tailwindcss';

const preset: Partial<Config> = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'serif'],
      },
      colors: {
        brand: {
          50: '#f4f7fb',
          100: '#e7eef6',
          200: '#cadcec',
          300: '#9cbed9',
          400: '#679bc1',
          500: '#447ea8',
          600: '#33658c',
          700: '#2b5272',
          800: '#28455f',
          900: '#243b51',
          950: '#162636',
        },
      },
      borderRadius: {
        '2xl': '1rem',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '70ch',
          },
        },
      },
    },
  },
};

export default preset;
