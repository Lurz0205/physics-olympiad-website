// physics-olympiad-website/frontend/pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="vi">
      <Head>
        {/* Tải font Inter từ Google Fonts với các weights và subset tiếng Việt */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap&subset=vietnamese"
          rel="stylesheet"
        />

        {/* KaTeX CSS - RẤT QUAN TRỌNG: Đảm bảo link này đúng và có sẵn */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          // Xóa thuộc tính integrity nếu nó gây lỗi hoặc không cần thiết.
          // Để đơn giản, chúng ta sẽ không dùng nó ở đây.
          crossOrigin="anonymous"
        />

        {/* KaTeX JS Core - Tải core KaTeX */}
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"
          // Xóa thuộc tính integrity
          crossOrigin="anonymous"
        ></script>
        
        {/* KaTeX Auto-render Extension - RẤT QUAN TRỌNG CHO VIỆC TỰ ĐỘNG RENDER */}
        {/* Script này sẽ tìm các công thức LaTeX trong văn bản và render chúng */}
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"
          // Xóa thuộc tính integrity
          crossOrigin="anonymous"
          // Kích hoạt auto-render sau khi toàn bộ trang được tải
          onLoad="renderMathInElement(document.body, {
            // Cấu hình để KaTeX nhận diện dấu $ và $$
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ],
            throwOnError : false // Không ném lỗi nếu cú pháp LaTeX sai
          });"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
