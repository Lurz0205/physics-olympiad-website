// frontend/components/MathContent.js
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math'; // Plugin để nhận diện cú pháp toán học trong Markdown
import rehypeKatex from 'rehype-katex'; // Plugin để render toán học thành HTML với KaTeX

// QUAN TRỌNG: Đảm bảo CSS của KaTeX được import toàn cục.
// VUI LÒNG KIỂM TRA VÀ THÊM DÒNG SAU VÀO frontend/pages/_app.js của bạn:
// import 'katex/dist/katex.min.css';

const MathContent = ({ content }) => {
  if (!content) return null;

  return (
    // Sử dụng 'inline-block' để container bọc chặt nội dung hơn
    // và để Markdown xử lý hiển thị block/inline math đúng cách.
    <div className="math-content-container inline-block">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        children={content}
      />
    </div>
  );
};

export default MathContent;
