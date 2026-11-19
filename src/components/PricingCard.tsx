import React from 'react';
import { type CarModel, formatINR } from '../data/vehicles';
import { useBooking } from '../context/BookingContext';
import { ResilientImage } from './ResilientImage';

interface PricingCardProps {
  car: CarModel;
}

export function PricingCard({ car }: PricingCardProps) {
  const { openBooking } = useBooking();

  return (
    <article className="bg-white rounded-2xl border border-[#E5EAF0] overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-md">
      <div>
        <div className="aspect-4/3 bg-[#F5F7FA] overflow-hidden">
          <ResilientImage
            src={car.image}
            alt={car.alt}
            fallbackLabel={car.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xl font-bold text-[#071D3A]">{car.name}</h3>
            <span className="text-xs font-semibold text-[#F36B16] whitespace-nowrap">
              Negotiable
            </span>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-[#F5F7FA]">
              <span className="text-sm font-medium text-[#172337]">12 Hours Package</span>
              <span className="text-lg font-bold text-[#071D3A] tabular-nums">
                {formatINR(car.price12h)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-[#F5F7FA]">
              <span className="text-sm font-medium text-[#172337]">24 Hours Package</span>
              <span className="text-lg font-bold text-[#071D3A] tabular-nums">
                {formatINR(car.price24h)}
              </span>
            </div>
          </div>

          <p className="mt-3 text-xs text-[#697586]">
            Final rental price is negotiable on direct enquiry.
          </p>
        </div>
      </div>

      <div className="px-6 pb-6">
        <button
          type="button"
          onClick={() =>
            openBooking({
              vehicleType: 'Car',
              vehicleId: car.id,
              duration: '12 Hours',
            })
          }
          className="w-full py-3 px-5 rounded-xl bg-[#F36B16] hover:bg-[#d95b0e] text-white text-sm font-semibold transition-colors cursor-pointer"
        >
          Book {car.name}
        </button>
      </div>
    </article>
  );
}
