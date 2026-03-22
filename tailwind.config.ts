import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './client/index.html',
    './client/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bocra: {
          // BOCRA Service Area Colors
          'postal': '#AF2F54',           // Postal (Pink/Magenta)
          'internet': '#EFC812',         // Internet (Golden Yellow)
          'telecom': '#30B6CF',          // Telecommunication (Cyan/Blue)
          'broadcast': '#2D6A2D',        // Broadcasting (Green)
          
          // Legacy colors (kept for backward compatibility)
          teal: '#1B7F79',
          'forest-green': '#2D6A2D',
          'golden-yellow': '#F0B429',
          'dark-maroon': '#8B1A1A',
          grey: '#808080',
          'bg-white': '#FFFFFF',
          'bg-light-grey': '#F7F8FA',
          'bg-deep-teal': '#0F4F4B',
          'text-primary': '#1A1A2E',
          'text-secondary': '#4A5568',
          'text-muted': '#718096',
          border: '#E2E8F0',
          'light-grey': '#F7F8FA',
        },
      },
    },
  },
  plugins: [],
}

export default config
