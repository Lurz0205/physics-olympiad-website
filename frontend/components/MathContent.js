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
    // Đảm bảo window và renderMathInElement có sẵn trước khi sử dụng
    if (containerRef.current && typeof window !== 'undefined' && window.renderMathInElement) {
      // Xóa nội dung cũ để tránh việc KaTeX render đè lên các biểu thức đã có nếu nội dung thay đổi
      // Dù innerHTML = content đã làm điều này, việc này giúp đảm bảo sạch sẽ nếu có các trạng thái trung gian khác
      containerRef.current.innerHTML = '';
      
      // Đặt nội dung HTML thuần túy vào div trước khi KaTeX render
      // Điều này quan trọng để hiển thị các thẻ HTML khác (như h3, ul, li)
      containerRef.current.innerHTML = content;
      
      // Kích hoạt KaTeX auto-render trên phần tử này
      window.renderMathInElement(containerRef.current, {
        delimiters: [
          { left: '$$', right: '$$', display: true }, // Block math, ví dụ: $$I = \frac{U}{R}$$
          { left: '$', right: '$', display: false },  // Inline math, ví dụ: $R$
          { left: '\\(', right: '\\)', display: false }, // Inline math (alternative), ví dụ: \(E=mc^2\)
          { left: '\\[', right: '\\]', display: true }  // Block math (alternative), ví dụ: \[x^2+y^2=z^2\]
        ],
        throwOnError: false // Không ném lỗi nếu cú pháp LaTeX sai, thay vào đó hiển thị văn bản gốc
      });
    } else if (containerRef.current) {
        // Fallback: nếu KaTeX auto-render không sẵn sàng, hiển thị nội dung gốc
        // Điều này giúp nội dung vẫn hiển thị dù LaTeX không được định dạng
        console.warn("KaTeX's auto-render function (window.renderMathInElement) is not available.");
        containerRef.current.innerHTML = content;
    }
  }, [content]); // Re-run effect if content changes

  // Trả về một div với ref và class 'prose' cho định dạng văn bản
  // 'prose' giúp định dạng các phần tử HTML bên trong (h1, p, ul, li, etc.) đẹp hơn
  return <div ref={containerRef} className="prose max-w-none text-gray-800 leading-relaxed" />;
};

export default MathContent;
