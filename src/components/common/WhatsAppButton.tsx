import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  // Normalize Pakistani WhatsApp phone number into international 92XXXXXXXXXX format
  let cleanNumber = (settings?.whatsappNumber || '+923028472911').replace(/[^0-9]/g, '');
  if (cleanNumber.startsWith('0')) {
    cleanNumber = '92' + cleanNumber.slice(1);
  } else if (!cleanNumber.startsWith('92')) {
    cleanNumber = '92' + cleanNumber;
  }

  const defaultMsg = 'Hello Veltrix! I need assistance with product availability and orders.';
  const encodedMessage = encodeURIComponent(settings?.whatsappMessage || defaultMsg);
  // Universal wa.me link directly opens mobile WhatsApp app or WhatsApp Web
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center">
      {/* Small floating hover tooltip */}
      {isHovered && (
        <div className="absolute right-13 sm:right-14 whitespace-nowrap bg-slate-900/95 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg shadow-md border border-slate-700 pointer-events-none animate-in fade-in slide-in-from-right-1 duration-150">
          Chat on WhatsApp
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-slate-900/95" />
        </div>
      )}

      {/* Floating Small Circular WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Chat on WhatsApp"
        className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-108 active:scale-95 transition-all duration-200 cursor-pointer"
      >
        {/* Official WhatsApp SVG Icon */}
        <svg
          className="w-5.5 h-5.5 sm:w-6 sm:h-6 fill-white drop-shadow-xs"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.21 8.21 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.188 8.188 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.23.9 2.43 1.03 2.6.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z" />
        </svg>

        {/* Online Indicator Green Dot */}
        <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white shadow-xs" />
        </span>
      </a>
    </div>
  );
};
