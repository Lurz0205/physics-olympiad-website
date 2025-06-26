// physics-olympiad-website/frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Đảm bảo các đường dẫn này chính xác và bao phủ tất cả các file chứa class Tailwind của bạn
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Nếu bạn có thư mục 'app' (cho App Router trong Next.js 13+), hãy giữ dòng này.
    // Nếu không, bạn có thể xóa nó. Với cấu trúc hiện tại của chúng ta (Page Router),
    // hai dòng trên (pages và components) thường là đủ.
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
