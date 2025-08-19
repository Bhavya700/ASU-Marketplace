/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'asu-gold': '#FFC627',
        'asu-maroon': '#8C1D40',
        'asu-dark': '#191919'
      }
    },
  },
  plugins: [],
}
