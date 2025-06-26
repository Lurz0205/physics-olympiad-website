// physics-olympiad-website/frontend/components/MathContent.js
import React, { useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS

/**
 * Component để hiển thị nội dung có chứa công thức toán học LaTeX.
 * Sử dụng KaTeX để render.
 * @param {object} props
 * @param {string} props.content - Chuỗi nội dung có thể chứa LaTeX (ví dụ: "$E=mc^2$" hoặc "$$x^2+y^2=z^2$$").
 */
const MathContent = ({ content }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && typeof window !== 'undefined' && window.renderMathInElement) {
      // Clear previous content to prevent re-rendering issues
      containerRef.current.innerHTML = content; 
      
      // Kích hoạt KaTeX auto-render trên phần tử này sau khi nội dung được đặt
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
        // Fallback if auto-render is not available (e.g., during initial load or if script fails)
        // This will display raw LaTeX, but at least the content is visible.
        containerRef.current.innerHTML = content;
    }
  }, [content]); // Re-run effect if content changes

  // Sử dụng ref để KaTeX có thể thao tác trực tiếp trên DOM của div này
  // Đồng thời, sử dụng dangerouslySetInnerHTML để hiển thị nội dung ban đầu
  // Điều này cần thiết nếu có các thẻ HTML khác trong `content`
  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: content }} />;
};

export default MathContent;
