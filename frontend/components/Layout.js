// physics-olympiad-website/frontend/components/Layout.js
import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8"> {/* Padding responsive */}
        {children}
      </main>
    </div>
  );
};

export default Layout;
