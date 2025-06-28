// frontend/components/MathContent.js
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math'; // Plugin để nhận diện cú pháp toán học trong Markdown
import rehypeKatex from 'rehype-katex'; // Plugin để render toán học thành HTML với KaTeX
import remarkGfm from 'remark-gfm'; // Plugin để hỗ trợ GitHub Flavored Markdown (bao gồm xuống dòng cứng)

// QUAN TRỌNG: Đảm bảo CSS của KaTeX được import toàn cục.
// VUI LÒNG KIỂM TRA VÀ THÊM DÒNG SAU VÀO frontend/pages/_app.js của bạn:
// import 'katex/dist/katex.min.css';

const MathContent = ({ content }) => {
  if (!content) return null;

  return (
    // THAY ĐỔI TẠI ĐÂY: Đã bỏ 'inline-block' khỏi className
    // Việc này giúp các biểu thức toán học dạng khối ($$...$$) được render đúng là block element và căn giữa
    <div className="math-content-container"> 
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        children={content}
      />
    </div>
  );
};

export default MathContent;
