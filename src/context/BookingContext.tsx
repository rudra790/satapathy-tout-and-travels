import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { RentalDuration, VehicleType } from '../data/vehicles';

export interface BookingPrefill {
  vehicleType?: VehicleType;
  vehicleId?: string;
  duration?: RentalDuration;
  pickupDate?: string;
}

interface BookingContextValue {
  isOpen: boolean;
  isAutoPopup: boolean;
  prefill: BookingPrefill;
  introFinished: boolean;
  isCarAnimating: boolean;
  finishIntro: () => void;
  openBooking: (prefill?: BookingPrefill) => void;
  closeBooking: () => void;
  triggerCarAnimation: () => void;
  stopCarAnimation: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAutoPopup, setIsAutoPopup] = useState(false);
  const [prefill, setPrefill] = useState<BookingPrefill>({});
  const [introFinished, setIntroFinished] = useState(false);
  const [isCarAnimating, setIsCarAnimating] = useState(false);

  const finishIntro = useCallback(() => {
    setIntroFinished(true);
  }, []);

  const openBooking = useCallback((nextPrefill: BookingPrefill = {}) => {
    setIsAutoPopup(false);
    setPrefill(nextPrefill);
    setIsOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setIsOpen(false);
    setIsAutoPopup(false);
  }, []);

  const triggerCarAnimation = useCallback(() => {
    setIsCarAnimating(true);
  }, []);

  const stopCarAnimation = useCallback(() => {
    setIsCarAnimating(false);
  }, []);

  // Trigger booking popup every 10 seconds whenever the modal is closed and intro splash is done
  useEffect(() => {
    if (!introFinished || isOpen || isCarAnimating) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsAutoPopup(true);
      setPrefill((prev) => ({
        vehicleType: prev.vehicleType || 'Car',
        vehicleId: prev.vehicleId || 'swift-dzire',
        duration: prev.duration || '12 Hours',
      }));
      setIsOpen(true);
    }, 10000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [introFinished, isOpen, isCarAnimating]);

  return (
    <BookingContext.Provider
      value={{
        isOpen,
        isAutoPopup,
        prefill,
        introFinished,
        isCarAnimating,
        finishIntro,
        openBooking,
        closeBooking,
        triggerCarAnimation,
        stopCarAnimation,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return ctx;
}
