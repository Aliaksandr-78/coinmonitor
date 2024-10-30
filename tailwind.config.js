/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
   extend: {},
   fontFamily: {
    display: ['IBM Plex Mono', 'Menlo', 'monospace'],
    body: ['IBM Plex Mono', 'Menlo', 'monospace'],
   },
   colors: {
    primary: {
     50: '#f0f5ff',
     100: '#e0ebff',
     200: '#b3ccff',
     300: '#80aaff',
     400: '#4d88ff',
     500: '#3366cc',
     600: '#254d99',
     700: '#193366',
     800: '#0d1a33',
     900: '#050d1a',
    },
    accent: {
     DEFAULT: '#4CAF50',
     50: '#e8f5e9',
     100: '#c8e6c9',
     200: '#a5d6a7',
     300: '#81c784',
     400: '#66bb6a',
     600: '#43a047',
     700: '#388e3c',
     800: '#2e7d32',
     900: '#1b5e20',
    },
    gray: {
     100: '#f7fafc',
     200: '#edf2f7',
     300: '#e2e8f0',
     400: '#cbd5e0',
     500: '#a0aec0',
     600: '#718096',
     700: '#4a5568',
     800: '#2d3748',
     900: '#1a202c',
    },
    black: {
     DEFAULT: '#000000',
     50: '#f8fafc',
     100: '#f1f5f8',
     200: '#e2e8f0',
     300: '#cbd5e0',
     400: '#a0aec0',
     500: '#718096',
     600: '#4a5568',
     700: '#2d3748',
     800: '#1a202c',
     900: '#171923',
    },
    white: {
     DEFAULT: '#ffffff',
    },
   },
  },
  plugins: [],
 }
 

