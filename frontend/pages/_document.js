// physics-olympiad-website/frontend/pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="vi">
      <Head>
        {/* Favicon - Đảm bảo bạn có file favicon.ico trong thư mục public */}
        <link rel="icon" href="/favicon.ico" />

        {/* Google Fonts - Inter (hoặc font khác bạn muốn dùng chung) */}
        {/* Đảm bảo tải subset tiếng Việt để hiển thị tốt hơn */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap&subset=vietnamese"
          rel="stylesheet"
        />

        {/* KaTeX CSS - RẤT QUAN TRỌNG: StyleSheet cho KaTeX */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          crossOrigin="anonymous"
        />

        {/* KaTeX JS Core - Thư viện lõi KaTeX */}
        <script
          defer // Defer để script không chặn render HTML
          src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"
          crossOrigin="anonymous"
        ></script>
        
        {/* KaTeX Auto-render Extension - Mở rộng để tự động render LaTeX */}
        {/* Tải nhưng KHÔNG kích hoạt ngay trên document.body ở đây. */}
        {/* Việc kích hoạt sẽ do MathContent component xử lý từng phần tử riêng biệt */}
        <script
          defer // Defer để script không chặn render HTML
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
