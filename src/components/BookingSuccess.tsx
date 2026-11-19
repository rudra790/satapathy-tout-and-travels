import React, { useState } from 'react';
import { Check, CheckCircle2, Copy, Mail, MessageCircle } from 'lucide-react';
import { BRAND_CONFIG } from '../data/vehicles';

interface BookingSuccessProps {
  whatsappUrl: string;
  emailUrl: string;
  summaryText: string;
  channelLabel?: 'WhatsApp' | 'Email' | 'Both';
  onEdit: () => void;
  onClose: () => void;
}

export function BookingSuccess({
  whatsappUrl,
  emailUrl,
  summaryText,
  channelLabel = 'Both',
  onEdit,
  onClose,
}: BookingSuccessProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <div className="py-6 px-2 text-center max-w-lg mx-auto">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFF3E9] text-[#F36B16] flex items-center justify-center mb-5">
        <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
      </div>

      <h3 className="text-2xl font-bold text-[#071D3A]">
        Your booking request is ready!
      </h3>

      <p className="mt-3 text-sm sm:text-base text-[#697586] leading-relaxed">
        {channelLabel === 'Email'
          ? `Please send the prepared email to ${BRAND_CONFIG.email} (or use WhatsApp below) to complete your enquiry. Our team will confirm availability and pricing.`
          : channelLabel === 'Both'
            ? `Please send the prepared message in WhatsApp and/or Email (${BRAND_CONFIG.email}) to complete your enquiry. Our team will confirm availability and pricing.`
            : `Please send the prepared message in WhatsApp (or email ${BRAND_CONFIG.email}) to complete your enquiry. Our team will confirm availability and pricing.`}
      </p>

      <div className="mt-6 text-left bg-[#F5F7FA] border border-[#E5EAF0] rounded-xl p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#697586]">
            Prepared Enquiry Summary
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#071D3A] hover:text-[#F36B16] cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copy Text</span>
              </>
            )}
          </button>
        </div>
        <pre className="text-xs text-[#172337] whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto">
          {summaryText}
        </pre>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm transition-colors"
        >
          <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Open WhatsApp</span>
        </a>

        <a
          href={emailUrl}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#F36B16] hover:bg-[#d95b0e] text-white font-semibold text-sm transition-colors"
        >
          <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Send via Email</span>
        </a>

        <button
          type="button"
          onClick={onEdit}
          className="px-4 py-3 rounded-xl border border-[#E5EAF0] text-[#071D3A] hover:bg-[#F5F7FA] font-semibold text-sm transition-colors cursor-pointer"
        >
          Edit Details
        </button>

        <button
          type="button"
          onClick={onClose}
          className="px-4 py-3 rounded-xl bg-[#071D3A] hover:bg-[#0B2345] text-white font-semibold text-sm transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
}
