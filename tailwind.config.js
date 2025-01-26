const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'], // Specify your file paths
  theme: {
    extend: {
      colors: {
        primary: '#3B82F7', // Matches --primary-color
        secondary: '#1D4ED8', // Matches --secondary-color
        // primary: '#EF4444', // Matches --primary-color
        // secondary: '#B91C1C', // Matches --secondary-color
        text: '#333333', // Matches --text-color
        background: '#F9FAFB', // Matches --background-color
        lightgray: '#D3D3D3', // Add custom color
        gray: '#6B7280'
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      appearance: {
        none: "none",
        textfield: "textfield",
      },
    },
  },
  plugins: [],
};
