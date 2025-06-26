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

        {/* KaTeX CSS - RẤT QUAN TRỌNG */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          crossOrigin="anonymous"
        />

        {/* KaTeX JS Core */}
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"
          crossOrigin="anonymous"
        ></script>
        
        {/* KaTeX Auto-render Extension - Tải nhưng KHÔNG kích hoạt ngay trên document.body */}
        {/* Việc kích hoạt sẽ do MathContent component xử lý từng phần tử riêng biệt */}
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
