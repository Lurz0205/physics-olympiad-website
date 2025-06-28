// frontend/components/MathContent.js
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math'; // Plugin để nhận diện cú pháp toán học trong Markdown
import remarkGfm from 'remark-gfm'; // Plugin để hỗ trợ GitHub Flavored Markdown (bao gồm xuống dòng cứng)
import katex from 'katex'; // THAY ĐỔI MỚI QUAN TRỌNG: Import thư viện KaTeX trực tiếp

// QUAN TRỌNG: Đảm bảo CSS của KaTeX được import toàn cục.
// Dòng sau phải có trong frontend/pages/_app.js của bạn:
// import 'katex/dist/katex.min.css';

const MathContent = ({ content }) => {
  if (!content) return null;

  return (
    <div className="math-content-container"> 
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        // THAY ĐỔI QUAN TRỌNG: Render toán học trực tiếp thông qua 'components'
        // Loại bỏ rehypePlugins vì chúng ta sẽ tự xử lý rendering KaTeX
        components={{
          // Custom renderer cho biểu thức toán học dạng khối ($$...$$)
          math: ({ value }) => {
            try {
              // Sử dụng katex.renderToString để chuyển đổi LaTeX sang HTML
              const html = katex.renderToString(value, {
                throwOnError: true, // Ném lỗi nếu có cú pháp sai
                displayMode: true,  // Bật chế độ hiển thị dạng khối
                output: 'html',
                // fleqn: true, // Bỏ comment nếu bạn muốn công thức căn trái thay vì căn giữa
              });
              // Sử dụng dangerouslySetInnerHTML để chèn HTML đã render
              // Thêm class để dễ dàng định kiểu CSS
              return <div dangerouslySetInnerHTML={{ __html: html }} className="katex-display-direct" />;
            } catch (error) {
              // HIỂN THỊ LỖI TRỰC TIẾP TRÊN TRANG VÀ VÀO CONSOLE
              console.error("KaTeX rendering error (display math):", error);
              return (
                <div className="text-red-600 p-2 border border-red-300 rounded-md my-2">
                  <p className="font-semibold">Lỗi biểu thức toán học dạng khối:</p>
                  <p className="text-sm">{error.message}</p>
                  <pre className="text-xs bg-gray-100 p-1 mt-1 rounded overflow-x-auto text-gray-800">{value}</pre>
                  <p className="text-xs mt-1">Vui lòng kiểm tra cú pháp LaTeX hoặc khoảng trắng xung quanh `$$.`</p>
                </div>
              );
            }
          },
          // Custom renderer cho biểu thức toán học nội tuyến ($...$)
          inlineMath: ({ value }) => {
            try {
              const html = katex.renderToString(value, {
                throwOnError: true,
                displayMode: false, // Tắt chế độ hiển thị dạng khối (nội tuyến)
                output: 'html',
              });
              return <span dangerouslySetInnerHTML={{ __html: html }} />;
            } catch (error) {
              console.error("KaTeX rendering error (inline math):", error);
              return (
                <span className="text-red-600 border border-red-300 px-1 py-0.5 rounded text-sm">
                  [Lỗi: {error.message}]
                </span>
              );
            }
          },
          // Đảm bảo ReactMarkdown vẫn xử lý các thẻ khác như p, h, ul, ol, v.v.
          // Nếu bạn muốn tùy chỉnh cách render các thẻ này, bạn có thể thêm vào đây
        }}
        children={content}
      />
    </div>
  );
};

export default MathContent;
