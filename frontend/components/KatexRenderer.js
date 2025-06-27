// physics-olympiad-website/frontend/components/KatexRenderer.js
import React, { useEffect, useRef } from 'react';
// KHÔNG CẦN import 'katex/dist/katex.min.css'; ở đây vì đã import trong _app.js

// Import các thư viện Markdown-it và KaTeX.
import MarkdownIt from 'markdown-it';
import mdKatex from 'markdown-it-katex';

// Khởi tạo Markdown-it với plugin KaTeX.
// Đây là một instance toàn cục, chỉ khởi tạo một lần duy nhất khi ở môi trường client.
let mdInstance = null;
if (typeof window !== 'undefined' && !mdInstance) { // Kiểm tra mdInstance để tránh khởi tạo lại
  console.log('Initializing MarkdownIt with KaTeX plugin on client-side...');
  mdInstance = new MarkdownIt({
    html: true, // Cho phép HTML trong Markdown
    linkify: true, // Tự động nhận diện link
    typographer: true, // Bật các thay thế kiểu chữ
  }).use(mdKatex, {
    throwOnError: false, // Không ném lỗi mà chỉ hiển thị lỗi KaTeX
    errorColor: '#cc0000' // Màu cho lỗi KaTeX
  });
  console.log('MarkdownIt with KaTeX plugin initialized:', mdInstance);
}

const KatexRenderer = ({ content }) => {
  const markdownRef = useRef(null);

  useEffect(() => {
    console.log('KatexRenderer useEffect running. content:', content);
    console.log('Is mdInstance initialized?', !!mdInstance);

    // Đảm bảo markdownRef, mdInstance đã được khởi tạo và content tồn tại
    if (markdownRef.current && mdInstance && content) {
      try {
        console.log('Attempting to render content with MarkdownIt-KaTeX:', content);
        markdownRef.current.innerHTML = mdInstance.render(content);
        console.log('MarkdownIt-KaTeX rendering successful.');
      } catch (error) {
        console.error("MarkdownIt-KaTeX rendering error caught in useEffect:", error);
        markdownRef.current.innerHTML = `<span style="color:red;">Error rendering math content: ${error.message}</span>`;
      }
    } else if (!mdInstance) {
        console.warn('KatexRenderer: mdInstance is not initialized. Rendering plain text.');
        if (markdownRef.current) {
            markdownRef.current.innerHTML = content; // Fallback to plain text
        }
    } else {
        console.log('KatexRenderer: Missing ref or content.');
    }
  }, [content]); // Re-render khi content thay đổi

  return <div ref={markdownRef} />;
};

export default KatexRenderer;
