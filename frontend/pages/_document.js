// physics-olympiad-website/frontend/pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="vi"> {/* Đặt ngôn ngữ là tiếng Việt */}
      <Head>
        {/* Tải font Inter từ Google Fonts với các weights và subset tiếng Việt */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap&subset=vietnamese"
          rel="stylesheet"
        />
        {/*
          Thêm các font khác hỗ trợ tốt tiếng Việt nếu cần, ví dụ: Roboto, Open Sans
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap&subset=vietnamese"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;700&display=swap&subset=vietnamese"
            rel="stylesheet"
          />
        */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
