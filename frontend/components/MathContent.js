// physics-olympiad-website/frontend/components/MathContent.js
import React, { useEffect, useRef } from 'react';

/**
 * Component để hiển thị nội dung có chứa công thức toán học LaTeX.
 * Sử dụng KaTeX để render.
 * @param {object} props
 * @param {string} props.content - Chuỗi nội dung có thể chứa LaTeX (ví dụ: "$E=mc^2$" hoặc "$$x^2+y^2=z^2$$").
 */
const MathContent = ({ content }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Đảm bảo ref, window và hàm renderMathInElement đã sẵn sàng
    if (containerRef.current && typeof window !== 'undefined' && window.renderMathInElement) {
      // Đặt nội dung HTML thuần túy vào div trước khi KaTeX render
      // Điều này quan trọng để hiển thị các thẻ HTML khác (như h3, ul, li)
      containerRef.current.innerHTML = content;
      
      // Kích hoạt KaTeX auto-render trên phần tử này
      // Cấu hình delimiters (dấu phân cách) để KaTeX biết đâu là công thức
      window.renderMathInElement(containerRef.current, {
        delimiters: [
          { left: '$$', right: '$$', display: true }, // Công thức block (trên dòng riêng, căn giữa)
          { left: '$', right: '$', display: false },  // Công thức inline (trong dòng văn bản)
          { left: '\\(', right: '\\)', display: false }, // Công thức inline thay thế (MathJax style)
          { left: '\\[', right: '\\]', display: true }  // Công thức block thay thế (MathJax style)
        ],
        throwOnError: false // Không ném lỗi nếu cú pháp LaTeX sai, thay vào đó hiển thị văn bản gốc
      });
    } else if (containerRef.current) {
        // Fallback: nếu KaTeX auto-render không sẵn sàng, hiển thị nội dung gốc
        // Giúp nội dung vẫn hiển thị dù LaTeX không được định dạng
        console.warn("KaTeX's auto-render function (window.renderMathInElement) is not available. Math expressions may not render correctly.");
        containerRef.current.innerHTML = content;
    }
  }, [content]); // Chạy lại hiệu ứng khi nội dung `content` thay đổi

  // Trả về một div với ref và class 'prose' của TailwindCSS
  // 'prose' giúp định dạng các phần tử HTML bên trong (headings, paragraphs, lists, v.v.)
  return <div ref={containerRef} className="prose max-w-none text-gray-800 leading-relaxed" />;
};

export default MathContent;
