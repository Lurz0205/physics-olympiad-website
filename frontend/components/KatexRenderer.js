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
        breaks: false // Đặt breaks thành false để không tự động thêm <br>
      }).use(mdKatex, {
        throwOnError: false, // Không ném lỗi mà chỉ hiển thị lỗi KaTeX
        errorColor: '#cc0000', // Màu cho lỗi KaTeX
        strict: false // Cho phép KaTeX hoạt động linh hoạt hơn với các cú pháp
      });

      // =====================================================================
      // THAY ĐỔI MỚI QUAN TRỌNG: Ghi đè trình render cho math_display
      // Điều này đảm bảo $$...$$ luôn được bọc trong <div class="katex-display">...</div>
      // thay vì <p><span class="katex-display">...</span></p>
      // =====================================================================
      const defaultRender = mdInstance.renderer.rules.math_display.bind(mdInstance.renderer.rules);
      mdInstance.renderer.rules.math_display = (tokens, idx, options, env, self) => {
        const rendered = defaultRender(tokens, idx, options, env, self);
        // Kiểm tra xem output có phải là một thẻ <p> chứa span.katex-display không
        // Nếu có, loại bỏ thẻ <p> và chỉ giữ lại phần nội dung KaTeX.
        // Đây là một cách tiếp cận đơn giản; phức tạp hơn có thể dùng DOMParser
        // hoặc regex mạnh mẽ hơn nếu cấu trúc HTML thay đổi.
        if (rendered.startsWith('<p>') && rendered.endsWith('</p>\n')) {
          const innerHtml = rendered.substring(3, rendered.length - 5); // Cắt bỏ <p> và </p>\n
          return `<div class="katex-display">${innerHtml}</div>\n`; // Bọc lại bằng <div>
        }
        return rendered; // Trả về như mặc định nếu không phải cấu trúc mong muốn
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
