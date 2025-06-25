module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#1a73e8', // A shade of blue
        secondary: '#f3f4f6', // Light gray
        accent: '#ea4335', // Red
        dark: '#202124', // Dark gray
      },
    },
  },
  plugins: [],
};
