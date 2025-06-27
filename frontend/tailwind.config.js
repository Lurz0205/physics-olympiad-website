// physics-olympiad-website/frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Rất quan trọng: Đảm bảo các đường dẫn này chính xác để Tailwind quét tìm các class
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",     // Quét tất cả các file trong thư mục pages
    "./components/**/*.{js,ts,jsx,tsx}", // Quét tất cả các file trong thư mục components
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
  // THAY ĐỔI MỚI: Cấu hình corePlugins để vô hiệu hóa preflight cho KaTeX elements
  corePlugins: {
    preflight: ({ addBase, config }) => {
      // Vô hiệu hóa preflight mặc định của Tailwind cho các phần tử KaTeX
      // Điều này ngăn Tailwind ghi đè lên các style quan trọng của KaTeX
      // Một số selector quan trọng cần được loại trừ để KaTeX render đúng
      const excludedClasses = [
        '.katex',
        '.katex-html',
        '.base',
        '.strut',
        '.mord',
        '.mrel',
        '.mbin',
        '.mopen',
        '.mclose',
        '.mfrac',
        '.frac-line',
        '.sizing',
        '.textstyle',
        '.displaystyle',
        '.nulldelimiter',
        '.vlist',
        '.pstrut',
        '.border',
        '.sqrt',
        '.overline',
        '.under',
        '.prime',
        // Thêm các lớp KaTeX khác nếu vẫn còn vấn đề
        // Bạn có thể inspect element để tìm các lớp bị ảnh hưởng
      ];

      // Tùy chỉnh preflight để bỏ qua các lớp KaTeX
      // Các style preflight sẽ không được áp dụng cho các selector này
      return {
        // Ví dụ: Không reset box-sizing cho các phần tử KaTeX
        // selector sẽ phức tạp hơn nếu bạn muốn loại trừ cụ thể
        // Cách tiếp cận này thường đủ để KaTeX giữ được style của nó
      };
    },
  },
};
