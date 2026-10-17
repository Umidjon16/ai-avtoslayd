import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#ffffff] shadow-[0_-1px_6px_rgba(0,0,0,0.02)] border-t border-[#eaedff] py-6 mt-auto">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-center gap-2">
          <span className="font-title-md text-title-md text-[#131b2e] font-bold">
            AI Avto-Slayd
          </span>
          <span className="font-body-sm text-body-sm text-[#464555]">
            — O'zbekiston maktab o'qituvchilari uchun interaktiv metodik tizim
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-label-sm text-label-sm text-[#464555]">
            © 2025 AI Avto-Slayd. Barcha huquqlar himoyalangan.
          </span>
        </div>
      </div>
    </footer>
  );
};
