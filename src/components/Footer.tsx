import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-orange-100 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        <div className="text-center">
          <p className="text-gray-600">
            © {currentYear}{' '}
            <a
              href="https://www.radiologynetworkservices.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Radiology Network Services
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};