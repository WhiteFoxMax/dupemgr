/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark mode colors
        dark: {
          bg: '#1e1e1e',
          secondary: '#2d2d2d',
          tertiary: '#3d3d3d',
          text: '#e0e0e0',
          'text-secondary': '#a0a0a0',
        },
        accent: {
          blue: '#0078d4',
          cyan: '#50e6e6',
        },
        status: {
          success: '#4ec9b0',
          warning: '#ce9178',
          error: '#f48771',
        },
      },
    },
  },
  plugins: [],
}
