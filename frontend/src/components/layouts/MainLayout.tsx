import React from 'react';
import Header from './Header';

export interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>
      
      <Header />
      
      <main id="main-content" className="flex-1 w-full" role="main">
        {children}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} Team Grouping. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
