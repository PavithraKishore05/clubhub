/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  corePlugins: {
    preflight: false, // Disable CSS reset so existing custom styles are preserved
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
