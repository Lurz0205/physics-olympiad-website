// physics-olympiad-website/frontend/components/MathContent.js
import React, { useEffect, useRef } from 'react';
// import 'katex/dist/katex.min.css'; // Dòng này đã bị xóa

/**
 * Component để hiển thị nội dung có chứa công thức toán học LaTeX.
 * Sử dụng KaTeX để render.
 * @param {object} props
 * @param {string} props.content - Chuỗi nội dung có thể chứa LaTeX (ví dụ: "$E=mc^2$" hoặc "$$x^2+y^2=z^2$$").
 */
const MathContent = ({ content }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Đảm bảo window và renderMathInElement có sẵn trước khi sử dụng
    if (containerRef.current && typeof window !== 'undefined' && window.renderMathInElement) {
      // Đặt nội dung HTML thuần túy vào div trước khi KaTeX render
      // Điều này quan trọng để hiển thị các thẻ HTML khác (như h3, ul, li)
      containerRef.current.innerHTML = content; 
      
      // Kích hoạt KaTeX auto-render trên phần tử này
      // Cấu hình tương tự như trong _document.js để đảm bảo tính nhất quán
      window.renderMathInElement(containerRef.current, {
        delimiters: [
          { left: '$$', right: '$$', display: true }, // Block math
          { left: '$', right: '$', display: false },  // Inline math
          { left: '\\(', right: '\\)', display: false }, // Inline math (alternative)
          { left: '\\[', right: '\\]', display: true }  // Block math (alternative)
        ],
        throwOnError: false // Không ném lỗi nếu cú pháp LaTeX sai
      });
    } else if (containerRef.current) {
        // Fallback: nếu KaTeX auto-render không sẵn sàng, hiển thị nội dung gốc
        // Điều này giúp nội dung vẫn hiển thị dù LaTeX không được định dạng
        containerRef.current.innerHTML = content;
    }
  }, [content]); // Re-run effect if content changes

  // Trả về một div rỗng ban đầu, nội dung sẽ được điền vào bởi useEffect
  return <div ref={containerRef} />;
};

export default MathContent;
