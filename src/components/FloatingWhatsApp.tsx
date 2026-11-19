import React from 'react';
import { MessageCircle } from 'lucide-react';
import { BRAND_CONFIG } from '../data/vehicles';

export function FloatingWhatsApp() {
  return (
    <a
      href={BRAND_CONFIG.whatsappBaseUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp with Satapathy Tour and Travels"
      className="hidden md:inline-flex fixed bottom-6 right-6 z-30 items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm shadow-lg transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#071D3A]"
    >
      <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
      <span className="whitespace-nowrap">WhatsApp Us</span>
    </a>
  );
}
