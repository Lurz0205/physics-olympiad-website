// frontend/components/KatexRenderer.js
import React, { useEffect, useRef } from 'react';
// Không cần import 'katex/dist/katex.min.css'; ở đây vì đã import trong _app.js

import MarkdownIt from 'markdown-it';
import mdKatex from 'markdown-it-katex';

// mdInstance cần được khởi tạo duy nhất một lần và chỉ ở phía client
let mdInstance = null;

const KatexRenderer = ({ content }) => {
  const markdownRef = useRef(null);

  // Khởi tạo mdInstance bên trong useEffect hoặc một hook riêng
  // để đảm bảo nó chỉ chạy trên client và chỉ một lần
  useEffect(() => {
    if (typeof window !== 'undefined' && !mdInstance) {
      console.log('KatexRenderer: Initializing MarkdownIt with KaTeX plugin...');
      mdInstance = new MarkdownIt({
        html: true, // Cho phép HTML trong Markdown
        linkify: true, // Tự động nhận diện link
        typographer: true, // Bật các thay thế kiểu chữ
        breaks: false // THAY ĐỔI QUAN TRỌNG: Đặt breaks thành false để không tự động thêm <br>
      }).use(mdKatex, {
        throwOnError: false, // Không ném lỗi mà chỉ hiển thị lỗi KaTeX
        errorColor: '#cc0000', // Màu cho lỗi KaTeX
        strict: false // Cho phép KaTeX hoạt động linh hoạt hơn với các cú pháp
      });
      console.log('KatexRenderer: MarkdownIt with KaTeX plugin initialized.');
    }
  }, []); // Chạy một lần khi component mount

  useEffect(() => {
    if (markdownRef.current && mdInstance && content) {
      try {
        const renderedHtml = mdInstance.render(content);
        console.log('KatexRenderer: HTML output by MarkdownIt-KaTeX:', renderedHtml); 
        markdownRef.current.innerHTML = renderedHtml;
      } catch (error) {
        console.error("KatexRenderer: MarkdownIt-KaTeX rendering error caught:", error);
        markdownRef.current.innerHTML = `<span style="color:red;">Lỗi render công thức: ${error.message}</span>`;
      }
    } else if (markdownRef.current && !mdInstance) {
        console.warn('KatexRenderer: mdInstance is not initialized, cannot render math. Displaying plain text.');
        markdownRef.current.innerHTML = content; // Fallback to plain text if mdInstance is not ready
    } else {
        // console.log('KatexRenderer: Missing ref, mdInstance, or content.');
    }
  }, [content]); // Re-render khi content thay đổi

  return <div ref={markdownRef} />;
};

export default KatexRenderer;
