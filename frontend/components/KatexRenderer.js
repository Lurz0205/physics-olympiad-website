// physics-olympiad-website/frontend/components/KatexRenderer.js
import React, { useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css'; // Đảm bảo đã cài KaTeX và CSS của nó

// Import các thư viện Markdown-it và KaTeX.
// Đây là cách bạn sẽ cần làm nếu bạn cài đặt chúng bằng npm/yarn
// Tuy nhiên, vì bạn đang trong môi trường sandbox, tôi sẽ giả định chúng có sẵn
// Nếu bạn cài đặt chúng qua CDN trong HTML, thì cần xử lý khác
// Đối với Next.js, cách tốt nhất là cài đặt qua npm/yarn
// npm install markdown-it markdown-it-katex katex

// Dynamic imports are recommended for client-side only libraries in Next.js
// However, since we're wrapping it in a parent dynamic import, we can import normally here.
import MarkdownIt from 'markdown-it';
import mdKatex from 'markdown-it-katex';

// Khởi tạo Markdown-it với plugin KaTeX
// Đây phải là một instance cố định, không tạo lại mỗi lần render
let md = null;
if (typeof window !== 'undefined') { // Khởi tạo chỉ khi ở phía client
  md = new MarkdownIt({
    html: true, // Cho phép HTML trong Markdown
    linkify: true, // Tự động nhận diện link
    typographer: true, // Bật các thay thế kiểu chữ
  }).use(mdKatex, {
    throwOnError: false, // Không ném lỗi mà chỉ hiển thị lỗi KaTeX
    errorColor: '#cc0000'
  });
}

const KatexRenderer = ({ content }) => {
  const markdownRef = useRef(null);

  useEffect(() => {
    // Đảm bảo markdownRef và md đã được khởi tạo và content tồn tại
    if (markdownRef.current && md && content) {
      try {
        markdownRef.current.innerHTML = md.render(content);
      } catch (error) {
        console.error("MarkdownIt-KaTeX rendering error:", error);
        markdownRef.current.innerHTML = `<span style="color:red;">Error rendering math content: ${error.message}</span>`;
      }
    }
  }, [content]); // Re-render khi content thay đổi

  return <div ref={markdownRef} />;
};

export default KatexRenderer;
