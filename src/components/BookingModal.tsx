import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { BookingForm } from './BookingForm';

export function BookingModal() {
  const { isOpen, isAutoPopup, prefill, closeBooking } = useBooking();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeBooking();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeBooking]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#071D3A]/70 backdrop-blur-xs"
        onClick={closeBooking}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full sm:max-w-3xl h-[94dvh] sm:h-auto sm:max-h-[90vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-[#E5EAF0] flex items-start justify-between gap-4 bg-white shrink-0">
          <div>
            <h2
              id="booking-modal-title"
              className="text-xl sm:text-2xl font-bold text-[#071D3A] tracking-tight"
            >
              Book Your Ride
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#697586]">
              Share your travel details and send your booking request.
            </p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeBooking}
            aria-label="Close booking dialog"
            className="w-10 h-10 inline-flex items-center justify-center rounded-xl border border-[#E5EAF0] text-[#172337] hover:bg-[#F5F7FA] shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F36B16]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 sm:py-6">
          <BookingForm
            prefill={prefill}
            onClose={closeBooking}
            showMaybeLater={isAutoPopup}
            onMaybeLater={closeBooking}
          />
        </div>
      </div>
    </div>
  );
}
