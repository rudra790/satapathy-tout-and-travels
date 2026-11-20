import React, { useEffect, useMemo, useState } from 'react';
import { Bike, Calendar, Car, Clock, Info, Layers, Mail, MessageCircle } from 'lucide-react';
import {
  BRAND_CONFIG,
  CAR_MODELS,
  RENTAL_DURATIONS,
  type RentalDuration,
  type VehicleType,
  formatINR,
  getCarById,
} from '../data/vehicles';
import { type BookingPrefill } from '../context/BookingContext';
import {
  addDaysToDateString,
  calculateRentalHours,
  computePriceEstimate,
  formatDisplayTime,
  formatIndianDate,
  formatIndianMobileDisplay,
  getTodayDateString,
  getTomorrowDateString,
  sanitizeInput,
  validateFullName,
  validateIndianMobile,
  validateSchedule,
} from '../utils/validation';
import {
  buildBookingWhatsAppMessage,
  buildMailtoUrl,
  buildWhatsAppUrl,
  triggerExternalEmail,
  triggerExternalWhatsApp,
} from '../utils/whatsapp';
import { BookingSuccess } from './BookingSuccess';
import { ResilientImage } from './ResilientImage';
import { DocumentChecklist } from './DocumentChecklist';

interface BookingFormProps {
  prefill?: BookingPrefill;
  onClose?: () => void;
  showMaybeLater?: boolean;
  onMaybeLater?: () => void;
}

const OTHER_MODEL_ID = 'others';

export function BookingForm({
  prefill,
  onClose,
  showMaybeLater = false,
  onMaybeLater,
}: BookingFormProps) {
  const today = useMemo(() => getTodayDateString(), []);
  const tomorrow = useMemo(() => getTomorrowDateString(), []);

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>(prefill?.vehicleType || 'Car');
  const [selectedCarId, setSelectedCarId] = useState<string>(
    prefill?.vehicleId === OTHER_MODEL_ID
      ? OTHER_MODEL_ID
      : prefill?.vehicleId && getCarById(prefill.vehicleId)
        ? getCarById(prefill.vehicleId)!.id
        : CAR_MODELS[0].id
  );
  const [customVehicleText, setCustomVehicleText] = useState('');
  const [duration, setDuration] = useState<RentalDuration>(prefill?.duration || '12 Hours');
  const [customDurationText, setCustomDurationText] = useState('');
  const [pickupDate, setPickupDate] = useState<string>(prefill?.pickupDate || today);
  const [pickupTime, setPickupTime] = useState<string>('09:00');
  const [returnDate, setReturnDate] = useState<string>(
    prefill?.duration === '24 Hours' ? tomorrow : prefill?.pickupDate || today
  );
  const [returnTime, setReturnTime] = useState<string>(
    prefill?.duration === '24 Hours' ? '09:00' : '21:00'
  );
  const [description, setDescription] = useState('');

  const [submittedErrors, setSubmittedErrors] = useState<Record<string, string>>({});
  const [successData, setSuccessData] = useState<{
    whatsappUrl: string;
    emailUrl: string;
    message: string;
    channel: 'WhatsApp' | 'Email' | 'Both';
  } | null>(null);

  useEffect(() => {
    if (prefill?.vehicleType) {
      setVehicleType(prefill.vehicleType);
    }
    if (prefill?.vehicleId) {
      if (prefill.vehicleId === OTHER_MODEL_ID) {
        setSelectedCarId(OTHER_MODEL_ID);
      } else {
        const found = getCarById(prefill.vehicleId);
        if (found) setSelectedCarId(found.id);
      }
    }
    if (prefill?.duration) {
      setDuration(prefill.duration);
    }
    if (prefill?.pickupDate && prefill.pickupDate >= today) {
      setPickupDate(prefill.pickupDate);
      setReturnDate(prefill.pickupDate);
    }
    setSuccessData(null);
    setSubmittedErrors({});
  }, [prefill, today]);

  const handleDurationChange = (nextDuration: RentalDuration) => {
    setDuration(nextDuration);
    const baseDate = pickupDate >= today ? pickupDate : today;

    if (nextDuration === '12 Hours') {
      setReturnDate(baseDate);
      setReturnTime('21:00');
    } else if (nextDuration === '24 Hours') {
      setReturnDate(addDaysToDateString(baseDate, 1));
      setReturnTime(pickupTime);
    } else if (nextDuration === '48 Hours') {
      setReturnDate(addDaysToDateString(baseDate, 2));
      setReturnTime(pickupTime);
    } else if (nextDuration === '5 Days') {
      setReturnDate(addDaysToDateString(baseDate, 5));
      setReturnTime(pickupTime);
    } else if (nextDuration === '1 Week') {
      setReturnDate(addDaysToDateString(baseDate, 7));
      setReturnTime(pickupTime);
    } else if (nextDuration === '1 Month') {
      setReturnDate(addDaysToDateString(baseDate, 30));
      setReturnTime(pickupTime);
    }
  };

  const isOtherCarModel = vehicleType === 'Car' && selectedCarId === OTHER_MODEL_ID;
  const selectedCar = useMemo(
    () => (isOtherCarModel ? undefined : getCarById(selectedCarId)),
    [selectedCarId, isOtherCarModel]
  );

  const rentalHours = useMemo(
    () => calculateRentalHours(pickupDate, pickupTime, returnDate, returnTime),
    [pickupDate, pickupTime, returnDate, returnTime]
  );

  const priceEstimate = useMemo(
    () =>
      computePriceEstimate({
        vehicleType,
        car: selectedCar,
        isOtherModel: isOtherCarModel,
        duration,
        rentalHours,
      }),
    [vehicleType, selectedCar, isOtherCarModel, duration, rentalHours]
  );

  const resolvedVehicleModelLabel = useMemo(() => {
    const cleanCustom = sanitizeInput(customVehicleText, 100);
    if (vehicleType === 'Car') {
      if (isOtherCarModel) {
        return cleanCustom ? `Others (${cleanCustom})` : 'Others (Custom Car Enquiry)';
      }
      return selectedCar?.name || CAR_MODELS[0].name;
    }
    if (vehicleType === 'Bike') {
      return cleanCustom
        ? `Upcoming Bike Rental (${cleanCustom})`
        : 'Upcoming Self-Drive Bike Rental (General Enquiry)';
    }
    return cleanCustom ? `Others (${cleanCustom})` : 'Others (Custom Vehicle Enquiry)';
  }, [vehicleType, isOtherCarModel, selectedCar, customVehicleText]);

  const resolvedDurationLabel = useMemo(() => {
    const cleanCustomDur = sanitizeInput(customDurationText, 80);
    if (duration === 'Others' && cleanCustomDur) {
      return `Others (${cleanCustomDur})`;
    }
    return duration;
  }, [duration, customDurationText]);

  const submitWithChannel = (channel: 'WhatsApp' | 'Email' | 'Both') => {
    const nextErrors: Record<string, string> = {};
    const nameError = validateFullName(fullName);
    if (nameError) nextErrors.fullName = nameError;

    const phoneError = validateIndianMobile(mobile);
    if (phoneError) nextErrors.mobile = phoneError;

    const scheduleErrors = validateSchedule(pickupDate, pickupTime, returnDate, returnTime);
    if (scheduleErrors.pickupError) nextErrors.pickup = scheduleErrors.pickupError;
    if (scheduleErrors.returnError) nextErrors.return = scheduleErrors.returnError;

    if (Object.keys(nextErrors).length > 0) {
      setSubmittedErrors(nextErrors);
      return;
    }

    setSubmittedErrors({});

    const message = buildBookingWhatsAppMessage({
      customerName: fullName,
      customerPhone: mobile,
      vehicleType,
      vehicleModel: resolvedVehicleModelLabel,
      rentalDuration: resolvedDurationLabel,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      estimatedPrice: priceEstimate.whatsappPriceValue,
      description,
    });

    const whatsappUrl = buildWhatsAppUrl(message);
    const emailSubject = `Self-Drive Booking Request: ${resolvedVehicleModelLabel} (${resolvedDurationLabel})`;
    const emailUrl = buildMailtoUrl(emailSubject, message);

    if (channel === 'WhatsApp') {
      triggerExternalWhatsApp(whatsappUrl);
    } else if (channel === 'Email') {
      triggerExternalEmail(emailUrl);
    } else {
      triggerExternalWhatsApp(whatsappUrl);
      triggerExternalEmail(emailUrl);
    }

    setSuccessData({ whatsappUrl, emailUrl, message, channel });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitWithChannel('WhatsApp');
  };

  if (successData) {
    return (
      <BookingSuccess
        whatsappUrl={successData.whatsappUrl}
        emailUrl={successData.emailUrl}
        summaryText={successData.message}
        channelLabel={successData.channel}
        onEdit={() => setSuccessData(null)}
        onClose={() => onClose?.()}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Step 1: Customer Details */}
      <section aria-labelledby="booking-step-1">
        <h3 id="booking-step-1" className="text-sm font-bold text-[#071D3A] uppercase tracking-wider mb-3">
          1. Customer Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="booking-full-name" className="block text-sm font-medium text-[#172337] mb-1.5">
              Full Name <span className="text-[#F36B16]">*</span>
            </label>
            <input
              id="booking-full-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              autoComplete="name"
              maxLength={80}
              required
              aria-invalid={Boolean(submittedErrors.fullName)}
              aria-describedby={submittedErrors.fullName ? 'err-full-name' : undefined}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAF0] bg-white text-[#172337] text-sm focus:outline-none focus:border-[#F36B16] focus:ring-2 focus:ring-[#F36B16]/20"
            />
            {submittedErrors.fullName && (
              <p id="err-full-name" className="mt-1.5 text-xs font-medium text-red-600" role="alert">
                {submittedErrors.fullName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="booking-mobile" className="block text-sm font-medium text-[#172337] mb-1.5">
              Mobile Number <span className="text-[#F36B16]">*</span>
            </label>
            <input
              id="booking-mobile"
              type="tel"
              inputMode="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="10-digit mobile number"
              autoComplete="tel"
              maxLength={16}
              required
              aria-invalid={Boolean(submittedErrors.mobile)}
              aria-describedby={submittedErrors.mobile ? 'err-mobile' : undefined}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAF0] bg-white text-[#172337] text-sm tabular-nums focus:outline-none focus:border-[#F36B16] focus:ring-2 focus:ring-[#F36B16]/20"
            />
            {submittedErrors.mobile && (
              <p id="err-mobile" className="mt-1.5 text-xs font-medium text-red-600" role="alert">
                {submittedErrors.mobile}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Step 2: Vehicle Type */}
      <section aria-labelledby="booking-step-2">
        <h3 id="booking-step-2" className="text-sm font-bold text-[#071D3A] uppercase tracking-wider mb-3">
          2. Vehicle Type
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setVehicleType('Car')}
            className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              vehicleType === 'Car'
                ? 'border-[#F36B16] bg-[#FFF3E9] text-[#071D3A]'
                : 'border-[#E5EAF0] bg-white text-[#172337] hover:bg-[#F5F7FA]'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                vehicleType === 'Car' ? 'bg-[#F36B16] text-white' : 'bg-[#F5F7FA] text-[#071D3A]'
              }`}
            >
              <Car className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <span className="block text-sm font-bold">Car</span>
              <span className="block text-xs text-[#697586] truncate">Available now</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setVehicleType('Bike')}
            className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              vehicleType === 'Bike'
                ? 'border-[#F36B16] bg-[#FFF3E9] text-[#071D3A]'
                : 'border-[#E5EAF0] bg-white text-[#172337] hover:bg-[#F5F7FA]'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                vehicleType === 'Bike' ? 'bg-[#F36B16] text-white' : 'bg-[#F5F7FA] text-[#071D3A]'
              }`}
            >
              <Bike className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <span className="block text-sm font-bold">Bike</span>
              <span className="block text-xs text-[#F36B16] font-medium truncate">Coming Soon</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setVehicleType('Others')}
            className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              vehicleType === 'Others'
                ? 'border-[#F36B16] bg-[#FFF3E9] text-[#071D3A]'
                : 'border-[#E5EAF0] bg-white text-[#172337] hover:bg-[#F5F7FA]'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                vehicleType === 'Others' ? 'bg-[#F36B16] text-white' : 'bg-[#F5F7FA] text-[#071D3A]'
              }`}
            >
              <Layers className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <span className="block text-sm font-bold">Others</span>
              <span className="block text-xs text-[#697586] truncate">Custom enquiry</span>
            </div>
          </button>
        </div>
      </section>

      {/* Step 3: Vehicle Model */}
      <section aria-labelledby="booking-step-3">
        <h3 id="booking-step-3" className="text-sm font-bold text-[#071D3A] uppercase tracking-wider mb-3">
          3. Select Vehicle Model
        </h3>

        {vehicleType === 'Car' ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CAR_MODELS.map((car) => {
                const isSelected = selectedCarId === car.id;
                return (
                  <button
                    key={car.id}
                    type="button"
                    onClick={() => setSelectedCarId(car.id)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#F36B16] bg-[#FFF3E9]'
                        : 'border-[#E5EAF0] bg-white hover:bg-[#F5F7FA]'
                    }`}
                  >
                    <div className="w-20 h-14 rounded-lg overflow-hidden bg-[#F5F7FA] shrink-0">
                      <ResilientImage
                        src={car.image}
                        alt={car.name}
                        lazy={false}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-[#071D3A] truncate">
                        {car.name}
                      </span>
                      <span className="block text-xs text-[#697586] tabular-nums mt-0.5">
                        12h: {formatINR(car.price12h)} · 24h: {formatINR(car.price24h)}
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* Others Option for Cars */}
              <button
                type="button"
                onClick={() => setSelectedCarId(OTHER_MODEL_ID)}
                className={`sm:col-span-2 flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isOtherCarModel
                    ? 'border-[#F36B16] bg-[#FFF3E9]'
                    : 'border-[#E5EAF0] bg-white hover:bg-[#F5F7FA]'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-[#F5F7FA] text-[#071D3A] flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5 text-[#F36B16]" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-[#071D3A]">Others</span>
                  <span className="block text-xs text-[#697586]">
                    Looking for another car or custom request? Select to specify.
                  </span>
                </div>
              </button>
            </div>

            {isOtherCarModel && (
              <div>
                <label htmlFor="booking-custom-car" className="block text-xs font-medium text-[#697586] mb-1">
                  Specify Preferred Car / Requirement (Optional)
                </label>
                <input
                  id="booking-custom-car"
                  type="text"
                  value={customVehicleText}
                  onChange={(e) => setCustomVehicleText(e.target.value)}
                  placeholder="Type your preferred vehicle or enquiry..."
                  maxLength={100}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAF0] bg-white text-sm text-[#172337] focus:outline-none focus:border-[#F36B16]"
                />
              </div>
            )}
          </div>
        ) : vehicleType === 'Bike' ? (
          <div className="space-y-3">
            <div className="rounded-xl border border-[#F36B16]/40 bg-[#FFF3E9] p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-[#F36B16] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-sm text-[#172337]">
                <p className="font-semibold text-[#071D3A]">
                  Self-drive bike rentals are coming soon.
                </p>
                <p className="mt-1 text-xs text-[#697586] leading-relaxed">
                  This service has not launched yet. Submit your details below to send a general bike rental interest enquiry via WhatsApp or Email.
                </p>
              </div>
            </div>
            <div>
              <label htmlFor="booking-custom-bike" className="block text-xs font-medium text-[#697586] mb-1">
                Others / Enquiry Note for Bike Rental (Optional)
              </label>
              <input
                id="booking-custom-bike"
                type="text"
                value={customVehicleText}
                onChange={(e) => setCustomVehicleText(e.target.value)}
                placeholder="Optional note or preferred two-wheeler category..."
                maxLength={100}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAF0] bg-white text-sm text-[#172337] focus:outline-none focus:border-[#F36B16]"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label htmlFor="booking-custom-other" className="block text-xs font-medium text-[#697586]">
              Specify Vehicle / Custom Requirement (Optional)
            </label>
            <input
              id="booking-custom-other"
              type="text"
              value={customVehicleText}
              onChange={(e) => setCustomVehicleText(e.target.value)}
              placeholder="Describe the vehicle or custom rental requirement..."
              maxLength={100}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAF0] bg-white text-sm text-[#172337] focus:outline-none focus:border-[#F36B16]"
            />
          </div>
        )}
      </section>

      {/* Step 4: Rental Duration */}
      <section aria-labelledby="booking-step-4">
        <h3 id="booking-step-4" className="text-sm font-bold text-[#071D3A] uppercase tracking-wider mb-3">
          4. Rental Duration Package
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {RENTAL_DURATIONS.map((pkg) => {
            const active = duration === pkg;
            let pkgSubtext = 'On Enquiry';
            if (vehicleType === 'Bike') {
              pkgSubtext = 'Coming Soon';
            } else if (
              vehicleType === 'Car' &&
              !isOtherCarModel &&
              selectedCar &&
              (pkg === '12 Hours' || pkg === '24 Hours')
            ) {
              pkgSubtext = formatINR(pkg === '12 Hours' ? selectedCar.price12h : selectedCar.price24h);
            } else if (pkg === 'Others') {
              pkgSubtext = 'Custom';
            }

            return (
              <button
                key={pkg}
                type="button"
                onClick={() => handleDurationChange(pkg)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  active
                    ? 'border-[#F36B16] bg-[#FFF3E9]'
                    : 'border-[#E5EAF0] bg-white hover:bg-[#F5F7FA]'
                }`}
              >
                <span className="block text-sm font-bold text-[#071D3A]">{pkg}</span>
                <span className="block text-xs font-semibold text-[#F36B16] tabular-nums mt-0.5">
                  {pkgSubtext}
                </span>
              </button>
            );
          })}
        </div>

        {duration === 'Others' && (
          <div className="mt-3">
            <label htmlFor="booking-custom-duration" className="block text-xs font-medium text-[#697586] mb-1">
              Specify Custom Duration (Optional)
            </label>
            <input
              id="booking-custom-duration"
              type="text"
              value={customDurationText}
              onChange={(e) => setCustomDurationText(e.target.value)}
              placeholder="e.g., 3 Days, 10 Days, or Weekend trip"
              maxLength={80}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAF0] bg-white text-sm text-[#172337] focus:outline-none focus:border-[#F36B16]"
            />
          </div>
        )}
      </section>

      {/* Step 5: Pickup & Return */}
      <section aria-labelledby="booking-step-5">
        <h3 id="booking-step-5" className="text-sm font-bold text-[#071D3A] uppercase tracking-wider mb-3">
          5. Pickup &amp; Return Schedule
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3 p-3.5 rounded-xl bg-[#F5F7FA] border border-[#E5EAF0]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#071D3A]">
              <Calendar className="w-4 h-4 text-[#F36B16]" aria-hidden="true" />
              <span>Pickup</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label htmlFor="booking-pickup-date" className="block text-xs font-medium text-[#697586] mb-1">
                  Date
                </label>
                <input
                  id="booking-pickup-date"
                  type="date"
                  min={today}
                  value={pickupDate}
                  onChange={(e) => {
                    const next = e.target.value;
                    setPickupDate(next);
                    if (returnDate < next) {
                      setReturnDate(next);
                    }
                  }}
                  required
                  className="w-full px-2.5 py-2 rounded-lg border border-[#E5EAF0] bg-white text-[#172337] text-xs sm:text-sm focus:outline-none focus:border-[#F36B16]"
                />
              </div>
              <div>
                <label htmlFor="booking-pickup-time" className="block text-xs font-medium text-[#697586] mb-1">
                  Time
                </label>
                <input
                  id="booking-pickup-time"
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  required
                  className="w-full px-2.5 py-2 rounded-lg border border-[#E5EAF0] bg-white text-[#172337] text-xs sm:text-sm focus:outline-none focus:border-[#F36B16]"
                />
              </div>
            </div>
            {submittedErrors.pickup && (
              <p className="text-xs font-medium text-red-600" role="alert">
                {submittedErrors.pickup}
              </p>
            )}
          </div>

          <div className="space-y-3 p-3.5 rounded-xl bg-[#F5F7FA] border border-[#E5EAF0]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#071D3A]">
              <Clock className="w-4 h-4 text-[#F36B16]" aria-hidden="true" />
              <span>Return</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label htmlFor="booking-return-date" className="block text-xs font-medium text-[#697586] mb-1">
                  Date
                </label>
                <input
                  id="booking-return-date"
                  type="date"
                  min={pickupDate || today}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                  className="w-full px-2.5 py-2 rounded-lg border border-[#E5EAF0] bg-white text-[#172337] text-xs sm:text-sm focus:outline-none focus:border-[#F36B16]"
                />
              </div>
              <div>
                <label htmlFor="booking-return-time" className="block text-xs font-medium text-[#697586] mb-1">
                  Time
                </label>
                <input
                  id="booking-return-time"
                  type="time"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  required
                  className="w-full px-2.5 py-2 rounded-lg border border-[#E5EAF0] bg-white text-[#172337] text-xs sm:text-sm focus:outline-none focus:border-[#F36B16]"
                />
              </div>
            </div>
            {submittedErrors.return && (
              <p className="text-xs font-medium text-red-600" role="alert">
                {submittedErrors.return}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Step 6: Optional Description Box */}
      <section aria-labelledby="booking-step-6">
        <label htmlFor="booking-description" id="booking-step-6" className="block text-sm font-bold text-[#071D3A] uppercase tracking-wider mb-2">
          6. Description / Notes <span className="text-xs font-normal normal-case text-[#697586]">(Optional)</span>
        </label>
        <textarea
          id="booking-description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional: Add pickup area in Rourkela, trip details, or any special requests..."
          maxLength={350}
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAF0] bg-white text-[#172337] text-sm focus:outline-none focus:border-[#F36B16] focus:ring-2 focus:ring-[#F36B16]/20"
        />
      </section>

      {/* Required Documents Checklist Reminder */}
      <DocumentChecklist variant="compact" className="my-2" />

      {/* Step 7: Live Price Estimate & Booking Summary */}
      <section aria-labelledby="booking-summary-heading" className="rounded-2xl bg-[#071D3A] text-white p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/15">
          <div>
            <h3 id="booking-summary-heading" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Estimated Price
            </h3>
            <p className="mt-1 text-2xl font-bold text-[#F36B16] tabular-nums">
              {priceEstimate.displayPrice}
            </p>
          </div>
          <span className="text-xs font-semibold text-white/90 bg-white/10 px-3 py-1.5 rounded-lg self-start sm:self-center">
            Prices are negotiable
          </span>
        </div>

        <p className="mt-3 text-xs text-slate-300 leading-relaxed">
          {priceEstimate.helperText}
        </p>

        <dl className="mt-4 pt-4 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5 text-xs">
          <div>
            <dt className="text-slate-400">Customer</dt>
            <dd className="font-semibold text-white truncate">
              {fullName.trim() || 'Not entered'}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Phone</dt>
            <dd className="font-semibold text-white tabular-nums truncate">
              {mobile.trim() ? formatIndianMobileDisplay(mobile) : 'Not entered'}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Vehicle</dt>
            <dd className="font-semibold text-white truncate">
              {resolvedVehicleModelLabel}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Package</dt>
            <dd className="font-semibold text-white truncate">{resolvedDurationLabel}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Pickup</dt>
            <dd className="font-semibold text-white tabular-nums">
              {formatIndianDate(pickupDate)} · {formatDisplayTime(pickupTime)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Return</dt>
            <dd className="font-semibold text-white tabular-nums">
              {formatIndianDate(returnDate)} · {formatDisplayTime(returnTime)}
            </dd>
          </div>
          {description.trim() && (
            <div className="col-span-2 sm:col-span-3">
              <dt className="text-slate-400">Notes</dt>
              <dd className="font-semibold text-white break-words">
                {sanitizeInput(description, 160)}
              </dd>
            </div>
          )}
        </dl>
      </section>

      {/* Step 8: Send via WhatsApp, Email, or Both */}
      <div className="space-y-3 pt-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#071D3A]"
          >
            <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>Send on WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => submitWithChannel('Email')}
            className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#F36B16] hover:bg-[#d95b0e] text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#071D3A]"
          >
            <Mail className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>Send via Email</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={() => submitWithChannel('Both')}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#071D3A] hover:bg-[#0B2345] text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            <span>Send to Both (WhatsApp &amp; {BRAND_CONFIG.email})</span>
          </button>

          {showMaybeLater && onMaybeLater && (
            <button
              type="button"
              onClick={onMaybeLater}
              className="py-3 px-5 rounded-xl border border-[#E5EAF0] text-[#697586] hover:text-[#071D3A] hover:bg-[#F5F7FA] font-semibold text-sm transition-colors cursor-pointer"
            >
              Maybe Later
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
