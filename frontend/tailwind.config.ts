import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sidebar: '#f0f5ee',
        'brand-green-light': '#4A9D44',
        'brand-green-dark':  '#0D5F07',
        accent: {
          DEFAULT: '#16a34a',
          hover: '#15803d',
          light: '#dcfce7',
        },
      },
      fontFamily: {
        raleway: ['Raleway', 'sans-serif'],
      },
      animation: {
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
