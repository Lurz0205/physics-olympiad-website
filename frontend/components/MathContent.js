// frontend/components/MathContent.js
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math'; // Plugin để nhận diện cú pháp toán học trong Markdown
import rehypeKatex from 'rehype-katex'; // Plugin để render toán học thành HTML với KaTeX

// Đảm bảo CSS của KaTeX được import.
// Trong Next.js, bạn có thể import CSS trực tiếp vào component hoặc layout gốc.
// Nếu bạn chưa có, hãy đảm bảo rằng 'katex/dist/katex.min.css' được import ở đâu đó trong ứng dụng của bạn.
// Ví dụ: import 'katex/dist/katex.min.css'; ở _app.js hoặc layout.js

const MathContent = ({ content }) => {
  if (!content) return null;

  return (
    // Thêm các lớp Tailwind CSS:
    // w-full: Đảm bảo container chiếm 100% chiều rộng của phần tử cha.
    // px-4: Thêm padding ngang (trái/phải) để nội dung không bị dính vào mép.
    // py-2: Thêm padding dọc (trên/dưới) để nội dung có không gian thở.
    <div className="math-content-container w-full px-4 py-2">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        children={content}
      />
    </div>
  );
};

export default MathContent;
