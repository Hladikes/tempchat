const colors = require('tailwindcss/colors')

module.exports = {
  // purge: {
  //   enabled: true,
  //   content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}']
  // },
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        blue: colors.blue,
        gray: colors.gray
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
