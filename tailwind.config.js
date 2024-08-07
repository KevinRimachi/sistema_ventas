/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      animation: {
        shake: 'shake 0.6s ease-in-out',
      },
      keyframes: {
        shake: {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(20deg)' },
          '50%': { transform: 'rotate(0deg)' },
          '75%': { transform: 'rotate(-20deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
      },
    },
  },
  plugins: [],
}

