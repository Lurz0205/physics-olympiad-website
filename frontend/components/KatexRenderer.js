// frontend/components/KatexRenderer.js
import React, { useEffect, useRef } from 'react';
// Không cần import 'katex/dist/katex.min.css'; ở đây vì đã import trong _app.js

import MarkdownIt from 'markdown-it';
import mdKatex from 'markdown-it-katex';
import katex from 'katex'; // THAY ĐỔI MỚI: Import katex trực tiếp

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
        breaks: false // Đặt breaks thành false để không tự động thêm <br>
      }).use(mdKatex, {
        throwOnError: false, // Không ném lỗi mà chỉ hiển thị lỗi KaTeX
        errorColor: '#cc0000', // Màu cho lỗi KaTeX
        strict: false // Cho phép KaTeX hoạt động linh hoạt hơn với các cú pháp
      });

      // =====================================================================
      // THAY ĐỔI MỚI VÀ QUAN TRỌNG: Ghi đè trình render cho math_display
      // Điều này đảm bảo $$...$$ luôn được bọc trong <div class="katex-display">...</div>
      // =====================================================================
      mdInstance.renderer.rules.math_display = (tokens, idx) => {
        const token = tokens[idx];
        try {
          // Trực tiếp render LaTeX bằng KaTeX với displayMode: true
          const html = katex.renderToString(token.content, {
            displayMode: true, // Đây là block math
            throwOnError: false,
            errorColor: '#cc0000',
            strict: false
          });
          // Bọc HTML KaTeX trong một div với class katex-display
          // mdKatex sẽ tự thêm class này nếu nó được cấu hình đúng.
          // Nhưng ở đây ta đảm bảo nó được bọc là <div>
          return `<div class="katex-display">${html}</div>\n`;
        } catch (error) {
          console.error("KaTeX rendering error during math_display override:", error);
          return `<div class="katex-display" style="color:red;">Lỗi công thức: ${token.content}</div>\n`;
        }
      };
      // =====================================================================

      console.log('KatexRenderer: MarkdownIt with KaTeX plugin initialized and math_display rule overridden.');
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
