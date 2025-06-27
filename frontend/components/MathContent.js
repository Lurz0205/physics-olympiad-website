// frontend/components/MathContent.js
import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import MarkdownIt from 'markdown-it'; // Import MarkdownIt trực tiếp
import katex from 'katex'; // Import katex trực tiếp

// Khởi tạo MarkdownIt chỉ một lần
let mdInstance = null;
if (typeof window !== 'undefined' && !mdInstance) {
  mdInstance = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true // Giữ breaks là true để Markdown thuần túy có thể ngắt dòng đúng
  });
}

// KatexRenderer đơn giản hóa để chỉ render một biểu thức KaTeX
const SimpleKatexRenderer = ({ latex, displayMode = false }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && latex) {
      try {
        katex.render(latex, ref.current, {
          displayMode: displayMode,
          throwOnError: false,
          errorColor: '#cc0000',
          strict: false
        });
      } catch (error) {
        console.error("SimpleKatexRenderer: KaTeX rendering error:", error);
        ref.current.innerHTML = `<span style="color:red;">Lỗi công thức: ${latex}</span>`;
      }
    }
  }, [latex, displayMode]);

  return <span ref={ref} className={displayMode ? 'katex-display' : 'katex'} />;
};


const MathContent = ({ content }) => {
  if (!content) return null;

  // Pattern để tìm cả inline ($...$) và display ($$...$$) math
  // Ưu tiên display math để tránh nhầm lẫn với inline
  const mathRegex = /(\$\$[^$]+\$\$|\$[^$]+\$)/g;
  const parts = content.split(mathRegex);

  return (
    <div className="math-content-container"> {/* Thêm container cho styling nếu cần */}
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          // Display math (block)
          const latex = part.substring(2, part.length - 2).trim();
          return <SimpleKatexRenderer key={index} latex={latex} displayMode={true} />;
        } else if (part.startsWith('$') && part.endsWith('$')) {
          // Inline math
          const latex = part.substring(1, part.length - 1).trim();
          return <SimpleKatexRenderer key={index} latex={latex} displayMode={false} />;
        } else {
          // Regular Markdown text
          // Dùng mdInstance.render() cho các phần Markdown để xử lý cả block level syntax
          return mdInstance ? (
            // Bọc mỗi phần trong một div tạm thời để render block-level Markdown
            // Sau đó sử dụng dangerouslySetInnerHTML.
            // Điều này đảm bảo tiêu đề, danh sách, v.v. được render đúng.
            <div key={index} dangerouslySetInnerHTML={{ __html: mdInstance.render(part) }} />
          ) : (
            <span key={index}>{part}</span> // Fallback nếu mdInstance chưa sẵn sàng
          );
        }
      })}
    </div>
  );
};

export default MathContent;
