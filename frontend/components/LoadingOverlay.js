// physics-olympiad-website/frontend/components/LoadingOverlay.js
import React from 'react';

const LoadingOverlay = () => {
  return (
    // Fixed inset-0 để phủ toàn bộ màn hình
    // bg-white opacity-100 để có nền trắng và hoàn toàn trong suốt
    // z-50 để đảm bảo nó nằm trên tất cả các phần tử khác
    // flex items-center justify-center để căn giữa nội dung loading
    <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999] transition-opacity duration-300">
      <div className="flex flex-col items-center">
        {/* Simple CSS Spinner */}
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-200 h-12 w-12 mb-4"></div>
        <p className="text-blue-600 text-lg font-semibold">Đang tải...</p>
      </div>

      {/* Inline CSS cho spinner, bạn có thể chuyển ra globals.css nếu muốn */}
      <style jsx>{`
        .loader {
          border-top-color: #3B82F6; /* blue-500 */
          -webkit-animation: spinner 1.5s linear infinite;
          animation: spinner 1.5s linear infinite;
        }
        @-webkit-keyframes spinner {
          0% { -webkit-transform: rotate(0deg); }
          100% { -webkit-transform: rotate(360deg); }
        }
        @keyframes spinner {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;
