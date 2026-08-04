/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coralGreen: {
          light: '#9FE66F',
          DEFAULT: '#4BD896',
          dark: '#32CEC6',
          brand: '#85E868',
        }
      },
      fontFamily: {
        sans: ['var(--font-bricolage)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
