// physics-olympiad-website/frontend/pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="vi">
      <Head>
        {/* Favicon - Đảm bảo bạn có file favicon.ico trong thư mục public */}
        <link rel="icon" href="/favicon.ico" />

        {/* Google Fonts - Inter (Tải stylesheet chính) */}
        {/* Vẫn dùng font-display=block để loại bỏ CLS do font, đồng thời đảm bảo subset tiếng Việt */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=block&subset=vietnamese"
          rel="stylesheet"
        />
        {/* THAY ĐỔI QUAN TRỌNG: Cập nhật URL preload font WOFF2 chính xác cho subset tiếng Việt */}
        {/* Preload giúp trình duyệt tải font sớm hơn với ưu tiên cao nhất */}
        <link rel="preload" href="https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iL-Wn7cSWVA2u4B-vH0FzY.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /> {/* wght 300 */}
        <link rel="preload" href="https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iL-Wn7cSWVA2u_B-vH0FzY.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /> {/* wght 400 - default latin, but common */}
        <link rel="preload" href="https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iL-Wn7cSWVA2u8B-vH0FzY.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /> {/* wght 500 */}
        <link rel="preload" href="https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iL-Wn7cSWVA2u_D-vH0FzY.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /> {/* wght 600 */}
        <link rel="preload" href="https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iL-Wn7cSWVA2u5D-vH0FzY.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /> {/* wght 700 */}
        

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
