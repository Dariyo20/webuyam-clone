import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Sidebar cream/green tint — matches #f0f5ee from BRIEF.md
        sidebar: '#f0f5ee',
        // Primary green accent (maps to Tailwind green-600 for easy overrides)
        accent: {
          DEFAULT: '#16a34a', // green-600
          hover: '#15803d',   // green-700
          light: '#dcfce7',   // green-100
        },
      },
    },
  },
  plugins: [],
};

export default config;
