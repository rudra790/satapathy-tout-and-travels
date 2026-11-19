import React from 'react';
import { CAR_MODELS, formatINR } from '../data/vehicles';
import { useBooking } from '../context/BookingContext';

export function PricingTable() {
  const { openBooking } = useBooking();

  return (
    <div className="bg-white rounded-2xl border border-[#E5EAF0] overflow-hidden">
      {/* Desktop & Tablet Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#071D3A] text-white">
              <th scope="col" className="py-4 px-6 text-sm font-semibold">
                Vehicle
              </th>
              <th scope="col" className="py-4 px-6 text-sm font-semibold">
                12 Hours
              </th>
              <th scope="col" className="py-4 px-6 text-sm font-semibold">
                24 Hours
              </th>
              <th scope="col" className="py-4 px-6 text-sm font-semibold text-right">
                Book Now
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5EAF0]">
            {CAR_MODELS.map((car) => (
              <tr key={car.id} className="hover:bg-[#F5F7FA]/70 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-16 h-12 rounded-lg object-cover bg-[#F5F7FA] shrink-0"
                    />
                    <div>
                      <span className="block text-base font-bold text-[#071D3A]">
                        {car.name}
                      </span>
                      <span className="block text-xs text-[#F36B16] font-medium">
                        Negotiable Price
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-base font-bold text-[#071D3A] tabular-nums">
                  {formatINR(car.price12h)}
                </td>
                <td className="py-4 px-6 text-base font-bold text-[#071D3A] tabular-nums">
                  {formatINR(car.price24h)}
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    type="button"
                    onClick={() =>
                      openBooking({
                        vehicleType: 'Car',
                        vehicleId: car.id,
                        duration: '12 Hours',
                      })
                    }
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#F36B16] hover:bg-[#d95b0e] text-white text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer"
                  >
                    Book Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Comparison Cards (Zero Overflow) */}
      <div className="sm:hidden divide-y divide-[#E5EAF0]">
        {CAR_MODELS.map((car) => (
          <div key={car.id} className="p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-14 h-11 rounded-lg object-cover bg-[#F5F7FA] shrink-0"
                />
                <div className="min-w-0">
                  <span className="block text-base font-bold text-[#071D3A] truncate">
                    {car.name}
                  </span>
                  <span className="block text-xs text-[#F36B16] font-medium">
                    Negotiable Price
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  openBooking({
                    vehicleType: 'Car',
                    vehicleId: car.id,
                    duration: '12 Hours',
                  })
                }
                className="px-4 py-2 rounded-xl bg-[#F36B16] hover:bg-[#d95b0e] text-white text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
              >
                Book Now
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-xl bg-[#F5F7FA]">
                <span className="block text-xs text-[#697586]">12 Hours</span>
                <span className="block text-base font-bold text-[#071D3A] tabular-nums">
                  {formatINR(car.price12h)}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F5F7FA]">
                <span className="block text-xs text-[#697586]">24 Hours</span>
                <span className="block text-base font-bold text-[#071D3A] tabular-nums">
                  {formatINR(car.price24h)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
