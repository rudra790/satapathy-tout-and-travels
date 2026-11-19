import React, { useState } from 'react';
import { CheckCircle2, Mail, MessageCircle } from 'lucide-react';
import { BRAND_CONFIG, CAR_MODELS, type VehicleType } from '../data/vehicles';
import {
  sanitizeInput,
  validateFullName,
  validateIndianMobile,
} from '../utils/validation';
import {
  buildContactEmailUrl,
  buildContactWhatsAppUrl,
  triggerExternalEmail,
  triggerExternalWhatsApp,
} from '../utils/whatsapp';

export function ContactForm() {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Car');
  const [vehicleModel, setVehicleModel] = useState<string>(CAR_MODELS[0].name);
  const [customModel, setCustomModel] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedLinks, setSubmittedLinks] = useState<{
    whatsappUrl: string;
    emailUrl: string;
  } | null>(null);

  const handleVehicleTypeChange = (nextType: VehicleType) => {
    setVehicleType(nextType);
    if (nextType === 'Car') {
      setVehicleModel(CAR_MODELS[0].name);
    } else if (nextType === 'Bike') {
      setVehicleModel('Self-Drive Bike Rental (Coming Soon Enquiry)');
    } else {
      setVehicleModel('Others');
    }
  };

  const submitWithChannel = (channel: 'WhatsApp' | 'Email' | 'Both') => {
    const nextErrors: Record<string, string> = {};
    const nameError = validateFullName(fullName);
    if (nameError) nextErrors.fullName = nameError;

    const phoneError = validateIndianMobile(mobile);
    if (phoneError) nextErrors.mobile = phoneError;

    const cleanedMessage = sanitizeInput(message, 400);
    if (!cleanedMessage || cleanedMessage.length < 5) {
      nextErrors.message = 'Please enter a short message (at least 5 characters).';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    const cleanCustom = sanitizeInput(customModel, 100);
    const finalModel =
      vehicleType === 'Others' || vehicleModel === 'Others'
        ? cleanCustom
          ? `Others (${cleanCustom})`
          : 'Others'
        : vehicleModel;

    const payload = {
      fullName,
      mobile,
      vehicleType,
      vehicleModel: finalModel,
      message: cleanedMessage,
    };

    const whatsappUrl = buildContactWhatsAppUrl(payload);
    const emailUrl = buildContactEmailUrl(payload);

    if (channel === 'WhatsApp') {
      triggerExternalWhatsApp(whatsappUrl);
    } else if (channel === 'Email') {
      triggerExternalEmail(emailUrl);
    } else {
      triggerExternalWhatsApp(whatsappUrl);
      triggerExternalEmail(emailUrl);
    }

    setSubmittedLinks({ whatsappUrl, emailUrl });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitWithChannel('WhatsApp');
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5EAF0] p-6 sm:p-8 shadow-xs">
      <h2 className="text-2xl font-bold text-[#071D3A]">Send Us a Message</h2>
      <p className="mt-1.5 text-sm text-[#697586]">
        Fill out your enquiry below to send a booking or general request via WhatsApp, Email ({BRAND_CONFIG.email}), or both.
      </p>

      {submittedLinks ? (
        <div className="mt-6 rounded-xl bg-[#F5F7FA] border border-[#E5EAF0] p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#FFF3E9] text-[#F36B16] mx-auto flex items-center justify-center mb-3">
            <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-bold text-[#071D3A]">
            Your enquiry is ready!
          </h3>
          <p className="mt-2 text-sm text-[#697586]">
            Send your prepared message via WhatsApp or Email ({BRAND_CONFIG.email}) to reach Satapathy Tour and Travels. Enquiries are sent directly through your chosen app and are not stored on a server.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <a
              href={submittedLinks.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Open WhatsApp</span>
            </a>
            <a
              href={submittedLinks.emailUrl}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F36B16] hover:bg-[#d95b0e] text-white text-sm font-semibold"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              <span>Send via Email</span>
            </a>
            <button
              type="button"
              onClick={() => setSubmittedLinks(null)}
              className="px-4 py-2.5 rounded-xl border border-[#E5EAF0] text-[#071D3A] hover:bg-white text-sm font-semibold cursor-pointer"
            >
              Send Another Enquiry
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-[#172337] mb-1.5">
                Full Name <span className="text-[#F36B16]">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                maxLength={80}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAF0] text-sm text-[#172337] focus:outline-none focus:border-[#F36B16] focus:ring-2 focus:ring-[#F36B16]/20"
              />
              {errors.fullName && (
                <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="contact-mobile" className="block text-sm font-medium text-[#172337] mb-1.5">
                Mobile Number <span className="text-[#F36B16]">*</span>
              </label>
              <input
                id="contact-mobile"
                type="tel"
                inputMode="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit mobile number"
                maxLength={16}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAF0] text-sm text-[#172337] tabular-nums focus:outline-none focus:border-[#F36B16] focus:ring-2 focus:ring-[#F36B16]/20"
              />
              {errors.mobile && (
                <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
                  {errors.mobile}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-vehicle-type" className="block text-sm font-medium text-[#172337] mb-1.5">
                Vehicle Type <span className="text-[#F36B16]">*</span>
              </label>
              <select
                id="contact-vehicle-type"
                value={vehicleType}
                onChange={(e) => handleVehicleTypeChange(e.target.value as VehicleType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAF0] bg-white text-sm text-[#172337] focus:outline-none focus:border-[#F36B16] focus:ring-2 focus:ring-[#F36B16]/20"
              >
                <option value="Car">Car (Available)</option>
                <option value="Bike">Bike (Coming Soon)</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-vehicle-model" className="block text-sm font-medium text-[#172337] mb-1.5">
                Vehicle Model <span className="text-[#F36B16]">*</span>
              </label>
              {vehicleType === 'Car' ? (
                <select
                  id="contact-vehicle-model"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAF0] bg-white text-sm text-[#172337] focus:outline-none focus:border-[#F36B16] focus:ring-2 focus:ring-[#F36B16]/20"
                >
                  {CAR_MODELS.map((car) => (
                    <option key={car.id} value={car.name}>
                      {car.name}
                    </option>
                  ))}
                  <option value="Others">Others</option>
                </select>
              ) : vehicleType === 'Bike' ? (
                <input
                  id="contact-vehicle-model"
                  type="text"
                  readOnly
                  value="Self-Drive Bike Rental (Coming Soon Enquiry)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAF0] bg-[#F5F7FA] text-sm text-[#697586]"
                />
              ) : (
                <input
                  id="contact-vehicle-model"
                  type="text"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  placeholder="Specify vehicle or custom request"
                  maxLength={100}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAF0] bg-white text-sm text-[#172337] focus:outline-none focus:border-[#F36B16]"
                />
              )}
            </div>
          </div>

          {vehicleType === 'Car' && vehicleModel === 'Others' && (
            <div>
              <label htmlFor="contact-custom-model" className="block text-sm font-medium text-[#172337] mb-1.5">
                Specify Other Vehicle Requirement (Optional)
              </label>
              <input
                id="contact-custom-model"
                type="text"
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                placeholder="Type your preferred vehicle or enquiry..."
                maxLength={100}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAF0] text-sm text-[#172337] focus:outline-none focus:border-[#F36B16]"
              />
            </div>
          )}

          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium text-[#172337] mb-1.5">
              Message <span className="text-[#F36B16]">*</span>
            </label>
            <textarea
              id="contact-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your pickup area in Rourkela, rental dates, or pricing enquiry..."
              maxLength={400}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAF0] text-sm text-[#172337] focus:outline-none focus:border-[#F36B16] focus:ring-2 focus:ring-[#F36B16]/20"
            />
            {errors.message && (
              <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
                {errors.message}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>Send on WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => submitWithChannel('Email')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#F36B16] hover:bg-[#d95b0e] text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              <Mail className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>Send via Email</span>
            </button>

            <button
              type="button"
              onClick={() => submitWithChannel('Both')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#071D3A] hover:bg-[#0B2345] text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              <span>Send to Both</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
