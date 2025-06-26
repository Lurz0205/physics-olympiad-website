// physics-olympiad-website/frontend/pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="vi">
      <Head>
        {/* Favicon - Đảm bảo bạn có file favicon.ico trong thư mục public */}
        <link rel="icon" href="/favicon.ico" />

        {/* Google Fonts - Inter */}
        {/* THAY ĐỔI QUAN TRỌNG: font-display=block để loại bỏ CLS do font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=block&subset=vietnamese" // Đã thay đổi 'swap' thành 'block'
          rel="stylesheet"
        />
        {/* Preload các trọng số (weights) của font Inter mà bạn đang sử dụng */}
        <link rel="preload" href="https://fonts.gstatic.com/s/inter/v13/UcCOyFect0rcMhC-CcI.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="https://fonts.gstatic.com/s/inter/v13/UcCOyFect0rcMhC-Boc.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="https://fonts.gstatic.com/s/inter/v13/UcCOyFect0rcMhC-BLc.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="https://fonts.gstatic.com/s/inter/v13/UcCOyFect0rcMhC-BHc.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="https://fonts.gstatic.com/s/inter/v13/UcCOyFect0rcMhC-BGc.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        

        {/* KaTeX CSS - StyleSheet cho KaTeX */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          crossOrigin="anonymous"
        />

        {/* KaTeX JS Core - Thư viện lõi KaTeX */}
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"
          crossOrigin="anonymous"
        ></script>
        
        {/* KaTeX Auto-render Extension - Mở rộng để tự động render LaTeX */}
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
