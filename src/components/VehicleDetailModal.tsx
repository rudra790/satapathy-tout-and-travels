import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { BRAND_CONFIG, type CarModel, formatINR } from '../data/vehicles';
import { useBooking } from '../context/BookingContext';
import { ResilientImage } from './ResilientImage';

interface VehicleDetailModalProps {
  car: CarModel | null;
  onClose: () => void;
}

export function VehicleDetailModal({ car, onClose }: VehicleDetailModalProps) {
  const { openBooking } = useBooking();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!car) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    closeBtnRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [car, onClose]);

  if (!car) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vehicle-detail-title"
    >
      <div
        className="fixed inset-0 bg-[#071D3A]/70 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="aspect-4/3 bg-[#F5F7FA] relative">
          <ResilientImage
            src={car.image}
            alt={car.alt}
            fallbackLabel={car.name}
            lazy={false}
            className="w-full h-full object-cover"
          />
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close vehicle details"
            className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-white/95 text-[#071D3A] shadow-md inline-flex items-center justify-center hover:bg-white cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h3 id="vehicle-detail-title" className="text-2xl font-bold text-[#071D3A]">
              {car.name}
            </h3>
            <span className="text-xs font-semibold text-[#F36B16] whitespace-nowrap">
              Negotiable Price
            </span>
          </div>

          <p className="mt-2 text-sm text-[#697586] leading-relaxed">
            {car.shortNote}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#F5F7FA] border border-[#E5EAF0]">
              <span className="block text-xs font-medium text-[#697586]">12 Hours Package</span>
              <span className="mt-1 block text-xl font-bold text-[#071D3A] tabular-nums">
                {formatINR(car.price12h)}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F5F7FA] border border-[#E5EAF0]">
              <span className="block text-xs font-medium text-[#697586]">24 Hours Package</span>
              <span className="mt-1 block text-xl font-bold text-[#071D3A] tabular-nums">
                {formatINR(car.price24h)}
              </span>
            </div>
          </div>

          <p className="mt-4 text-xs text-[#697586] leading-relaxed">
            {BRAND_CONFIG.negotiableNotice}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                openBooking({ vehicleType: 'Car', vehicleId: car.id, duration: '12 Hours' });
              }}
              className="flex-1 py-3 px-5 rounded-xl bg-[#F36B16] hover:bg-[#d95b0e] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Book This Car
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-xl border border-[#E5EAF0] text-[#071D3A] hover:bg-[#F5F7FA] text-sm font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
