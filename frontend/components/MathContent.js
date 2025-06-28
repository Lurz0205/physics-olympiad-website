// frontend/components/MathContent.js
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math'; // Plugin để nhận diện cú pháp toán học trong Markdown
import rehypeKatex from 'rehype-katex'; // Plugin để render toán học thành HTML với KaTeX
import remarkGfm from 'remark-gfm'; // Plugin để hỗ trợ GitHub Flavored Markdown (bao gồm xuống dòng cứng)

// QUAN TRỌNG: Đảm bảo CSS của KaTeX được import toàn cục.
// VUI LÒNG KIỂM TRA VÀ THÊM DÒNG SAU VÀO frontend/pages/_app.js của bạn:
// import 'katex/dist/katex.min.css';

// Hàm xử lý lỗi KaTeX
const handleKatexError = (error) => {
  console.error("KaTeX rendering error:", error);
  // Bạn có thể hiển thị một thông báo lỗi thân thiện hơn cho người dùng ở đây
  // Ví dụ: return `<span style="color: red;">[Lỗi biểu thức toán học: ${error.message}]</span>`;
  // Hiện tại, chúng ta chỉ log ra console để debug.
};

const MathContent = ({ content }) => {
  if (!content) return null;

  return (
    <div className="math-content-container"> 
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[[rehypeKatex, { errorCallback: handleKatexError }]]} // THAY ĐỔI: Thêm errorCallback
        children={content}
      />
    </div>
  );
};

export default MathContent;
