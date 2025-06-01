/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 'primary-coral': '#FF6B6B', // Removed as it's an old color
        'surface-light': 'rgba(255, 255, 255, 0.15)', // Updated to 15% opacity
        // New palette colors can be added here if needed for more granular control
        'gradient-stop-0': '#3F1A6C',
        'gradient-stop-25': '#5C1F99',
        'gradient-stop-50': '#8623CB',
        'gradient-stop-75': '#C1289C',
        'gradient-stop-100': '#E9297E',
      },
      backgroundImage: {
        'gradient-game': 'linear-gradient(180deg, #3F1A6C 0%, #5C1F99 25%, #8623CB 50%, #C1289C 75%, #E9297E 100%)',
      },
    },
  },
  plugins: [],
}
