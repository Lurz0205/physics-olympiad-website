// frontend/components/MathContent.js
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math'; // Plugin để nhận diện cú pháp toán học trong Markdown
import rehypeKatex from 'rehype-katex'; // Plugin để render toán học thành HTML với KaTeX

const MathContent = ({ content }) => {
  if (!content) return null;

  return (
    <div className="math-content-container">
      {/* ReactMarkdown sẽ tự động xử lý toàn bộ nội dung Markdown.
        - remarkPlugins: Xử lý các node (phần tử) của Markdown. remark-math sẽ tìm kiếm $$...$$ và $...$
        - rehypePlugins: Xử lý các node HTML. rehype-katex sẽ lấy các node toán học từ remark-math và chuyển thành HTML của KaTeX.
        - children: Nội dung Markdown bạn muốn render.
      */}
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        // children là nội dung Markdown bạn muốn render.
        children={content}
      />
    </div>
  );
};

export default MathContent;
