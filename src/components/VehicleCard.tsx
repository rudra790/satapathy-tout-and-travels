import React from 'react';
import { Eye } from 'lucide-react';
import { type CarModel, formatINR } from '../data/vehicles';
import { useBooking } from '../context/BookingContext';
import { ResilientImage } from './ResilientImage';

interface VehicleCardProps {
  car: CarModel;
  ctaLabel?: string;
  onViewDetails?: (car: CarModel) => void;
}

export function VehicleCard({
  car,
  ctaLabel = 'Book Now',
  onViewDetails,
}: VehicleCardProps) {
  const { openBooking } = useBooking();

  return (
    <article className="bg-white rounded-2xl border border-[#E5EAF0] overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div>
        <div className="aspect-4/3 bg-[#F5F7FA] overflow-hidden">
          <ResilientImage
            src={car.image}
            alt={car.alt}
            fallbackLabel={car.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
          />
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-xl font-bold text-[#071D3A] tracking-tight">
              {car.name}
            </h3>
            <span className="text-xs font-semibold text-[#F36B16] whitespace-nowrap shrink-0">
              Negotiable Price
            </span>
          </div>

          <p className="mt-1.5 text-sm text-[#697586] leading-relaxed">
            {car.shortNote}
          </p>

          <div className="mt-5 pt-4 border-t border-[#E5EAF0] grid grid-cols-2 gap-4">
            <div>
              <span className="block text-xs font-medium text-[#697586]">12 Hours</span>
              <span className="mt-0.5 block text-lg font-bold text-[#071D3A] tabular-nums">
                {formatINR(car.price12h)}
              </span>
            </div>
            <div>
              <span className="block text-xs font-medium text-[#697586]">24 Hours</span>
              <span className="mt-0.5 block text-lg font-bold text-[#071D3A] tabular-nums">
                {formatINR(car.price24h)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-6 pb-5 sm:pb-6 flex items-center gap-2.5">
        {onViewDetails && (
          <button
            type="button"
            onClick={() => onViewDetails(car)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#E5EAF0] text-[#071D3A] hover:bg-[#F5F7FA] text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Eye className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Details</span>
          </button>
        )}
        <button
          type="button"
          onClick={() =>
            openBooking({
              vehicleType: 'Car',
              vehicleId: car.id,
              duration: '12 Hours',
            })
          }
          className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#F36B16] hover:bg-[#d95b0e] text-white text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#071D3A]"
        >
          {ctaLabel}
        </button>
      </div>
    </article>
  );
}
