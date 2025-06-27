// physics-olympiad-website/frontend/components/MathContent.js
import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic'; // Import dynamic từ next/dynamic

// Dùng dynamic import với ssr: false để KaTeX chỉ chạy trên client
const KatexRenderer = dynamic(() => import('./KatexRenderer'), { ssr: false });

// Component này sẽ bọc nội dung và render KaTeX ở phía client
// Đảm bảo KaTeXRenderer được định nghĩa trong file KatexRenderer.js
// Nếu bạn muốn dùng trực tiếp KaTeX trong file này, hãy đảm bảo tất cả các
// thao tác liên quan đến document/window đều nằm trong useEffect.

const MathContent = ({ content }) => {
  if (!content) return null;

  // Nếu content chứa LaTeX, dùng KatexRenderer
  if (content.includes('$') || content.includes('\\(') || content.includes('\\[') || content.includes('\\begin{')) {
    return <KatexRenderer content={content} />;
  }

  // Ngược lại, chỉ render text
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
};

export default MathContent;

// Bạn cần đảm bảo có file frontend/components/KatexRenderer.js
// Ví dụ nội dung cho frontend/components/KatexRenderer.js:
// import React, { useEffect, useRef } from 'react';
// import 'katex/dist/katex.min.css'; // Import CSS của KaTeX
// import katex from 'katex';

// const KatexRenderer = ({ content }) => {
//   const mathRef = useRef(null);

//   useEffect(() => {
//     if (mathRef.current && content) {
//       try {
//         // Sử dụng displayMode cho khối công thức (ví dụ: $$...$$)
//         // và inline mode cho công thức trong dòng ($...$)
//         // Đây là một ví dụ đơn giản, bạn có thể cần thư viện parse Markdown-LaTeX phức tạp hơn
//         // Ví dụ: https://github.com/KaTeX/KaTeX/tree/main/contrib/auto-render
//         
//         // Simple auto-render logic:
//         let renderedHtml = content;
//         // Replace $$...$$ with display mode
//         renderedHtml = renderedHtml.replace(/\$\$([^$]+?)\$\$/g, (match, expr) => {
//           try {
//             return katex.renderToString(expr, { throwOnError: false, displayMode: true });
//           } catch (e) {
//             console.error("KaTeX rendering error (display mode):", e);
//             return `<span style="color:red;">KaTeX Error: ${e.message}</span>`;
//           }
//         });
//         // Replace $...$ with inline mode
//         renderedHtml = renderedHtml.replace(/\$([^$]+?)\$/g, (match, expr) => {
//           try {
//             return katex.renderToString(expr, { throwOnError: false, displayMode: false });
//           } catch (e) {
//             console.error("KaTeX rendering error (inline mode):", e);
//             return `<span style="color:red;">KaTeX Error: ${e.message}</span>`;
//           }
//         });

//         mathRef.current.innerHTML = renderedHtml;

//       } catch (error) {
//         console.error('KaTeX rendering error:', error);
//         mathRef.current.innerHTML = `<span style="color:red;">Error rendering math content: ${error.message}</span>`;
//       }
//     }
//   }, [content]); // Re-render when content changes

//   return <div ref={mathRef} />;
// };

// export default KatexRenderer;

// HOẶC nếu bạn muốn dùng markdown-it-katex để parse Markdown và LaTeX một cách tốt hơn:
// Bạn cần cài đặt các thư viện sau:
// npm install markdown-it markdown-it-katex katex
//
// const MarkdownIt = require('markdown-it');
// const mdKatex = require('markdown-it-katex');
// const md = new MarkdownIt().use(mdKatex);
//
// const KatexRenderer = ({ content }) => {
//   const mathRef = useRef(null);
//   useEffect(() => {
//     if (mathRef.current && content) {
//       mathRef.current.innerHTML = md.render(content);
//     }
//   }, [content]);
//   return <div ref={mathRef} />;
// };
// export default KatexRenderer;
