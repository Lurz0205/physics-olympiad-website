// physics-olympiad-website/frontend/components/MathRenderer.js
import { useRef, useEffect } from 'react';

// KaTeX được tải qua CDN trong _document.js, nên nó sẽ có sẵn trong window.katex
// Chúng ta sẽ cần khai báo để ESLint không báo lỗi 'katex is not defined'
declare global {
  interface Window {
    katex: any;
  }
}

const MathRenderer = ({ htmlContent }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && window.katex) {
      // Hàm này sẽ tìm tất cả các phần tử chứa công thức LaTeX (bên trong $...$ hoặc $$...$$)
      // và render chúng bằng KaTeX.
      // Dùng `renderToString` để render từng công thức tìm được.
      // Hoặc có thể dùng `renderElement` của KaTeX nếu muốn quét cả một DOM node.

      // Next.js có thể render HTML trên server (SSR) trước, sau đó hydrate trên client.
      // Chúng ta cần đảm bảo KaTeX được chạy sau khi HTML đã được đưa vào DOM.
      // Duyệt qua các phần tử HTML và tìm các biểu thức toán học.
      const renderMath = () => {
        const elements = containerRef.current.querySelectorAll('*'); // Hoặc chọn cụ thể các thẻ có thể chứa math
        elements.forEach(element => {
          // Xử lý công thức hiển thị riêng biệt (display math): $$...$$
          // Tìm các block $$...$$ và thay thế bằng KaTeX
          // Điều này yêu cầu nội dung được format chính xác.
          // Đối với nội dung từ backend, ta giả định nó đã là chuỗi HTML.
          // KaTeX có phương thức renderAuto, nhưng nó yêu cầu một thư viện khác (auto-render)
          // Hiện tại, để đơn giản, chúng ta sẽ dựa vào KaTeX để render các chuỗi riêng lẻ
          // nếu chúng được đánh dấu rõ ràng.
          // Tuy nhiên, cách phổ biến nhất là chạy renderAll.

          // Để render các biểu thức toán học trong một phần tử cụ thể, KaTeX cung cấp
          // katex.renderToString() cho từng chuỗi LaTeX riêng lẻ.
          // Hoặc dùng auto-render extension nếu muốn tự động quét toàn bộ DOM.
          // Với cách này, chúng ta sẽ làm thủ công hơn một chút nếu không dùng auto-render,
          // hoặc đảm bảo nội dung được xử lý trước khi đặt vào DOM.
          // Tuy nhiên, lỗi hiện tại cho thấy KaTeX không chạy bất kỳ đâu.

          // Cách đơn giản nhất là render lại toàn bộ nội dung sau khi HTML được chèn vào DOM.
          // Điều này đòi hỏi nội dung được bọc trong các thẻ KaTeX cụ thể hoặc phải tự phân tích.
          // Với chuỗi `$x = x_0 + vt$`, chúng ta cần tìm các cặp $...$ hoặc $$...$$
          // và thay thế chúng bằng kết quả render của KaTeX.

          // Một phương pháp mạnh mẽ hơn là sử dụng katex/contrib/auto-render.
          // Chúng ta sẽ tải thư viện auto-render qua CDN trong _document.js

          // Với việc đã tải auto-render qua CDN, chúng ta chỉ cần gọi renderMathInElement
          // trên containerRef.current.
          if (window.renderMathInElement) {
            window.renderMathInElement(containerRef.current, {
              delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                // Add more delimiters if needed, e.g., for inline code that might conflict
              ],
              throwOnError: false // Don't throw errors for invalid math
            });
          }
        });
      };
      renderMath();
    }
  }, [htmlContent]); // Chạy lại khi nội dung HTML thay đổi

  // Sử dụng dangerouslySetInnerHTML để đặt nội dung HTML vào DOM
  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default MathRenderer;
