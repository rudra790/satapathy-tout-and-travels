import React from 'react';
import { CalendarCheck, MessageCircle, Phone } from 'lucide-react';
import { BRAND_CONFIG } from '../data/vehicles';
import { useBooking } from '../context/BookingContext';

export function MobileContactBar() {
  const { openBooking } = useBooking();

  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-[#E5EAF0] shadow-[0_-4px_16px_rgba(7,29,58,0.08)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-3 h-14 divide-x divide-[#E5EAF0]">
        <a
          href={BRAND_CONFIG.phoneHref}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#071D3A] active:bg-[#F5F7FA] whitespace-nowrap"
        >
          <Phone className="w-4 h-4 text-[#071D3A] shrink-0" aria-hidden="true" />
          <span>Call Now</span>
        </a>

        <a
          href={BRAND_CONFIG.whatsappBaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#071D3A] active:bg-[#F5F7FA] whitespace-nowrap"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" aria-hidden="true" />
          <span>WhatsApp</span>
        </a>

        <button
          type="button"
          onClick={() => openBooking()}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-[#F36B16] text-white active:bg-[#d95b0e] whitespace-nowrap cursor-pointer"
        >
          <CalendarCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Book Now</span>
        </button>
      </div>
    </div>
  );
}
