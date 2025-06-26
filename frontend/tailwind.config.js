// physics-olympiad-website/frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Rất quan trọng: Đảm bảo các đường dẫn này chính xác để Tailwind quét tìm các class
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",    // Quét tất cả các file trong thư mục pages
    "./components/**/*.{js,ts,jsx,tsx}", // Quét tất cả các file trong thư mục components
    // Nếu bạn có file gốc là .js hoặc .tsx (không phải .jsx hay .mdx) thì hãy thêm các đuôi file đó vào wildcard
    // Ví dụ: "./pages/**/*.{js,ts,jsx,tsx,mdx}"
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
