import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Info, Mail, MessageCircle } from 'lucide-react';
import { BRAND_CONFIG } from '../data/vehicles';
import { usePageMeta } from '../utils/seo';
import {
  sanitizeInput,
  validateFullName,
  validateIndianMobile,
} from '../utils/validation';
import {
  buildBikeEnquiryEmailUrl,
  buildBikeEnquiryWhatsAppUrl,
  triggerExternalEmail,
  triggerExternalWhatsApp,
} from '../utils/whatsapp';
import { ResilientImage } from '../components/ResilientImage';

export function Bikes() {
  usePageMeta({
    title: 'Self-Drive Bikes (Coming Soon) – Satapathy Tour and Travels',
    description:
      'Self-drive bike rentals are coming soon to Satapathy Tour and Travels. Register your interest via WhatsApp or Email.',
  });

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [readyLinks, setReadyLinks] = useState<{
    whatsappUrl: string;
    emailUrl: string;
  } | null>(null);

  const submitInterest = (channel: 'WhatsApp' | 'Email' | 'Both') => {
    const nextErrors: Record<string, string> = {};

    const nameErr = validateFullName(name);
    if (nameErr) nextErrors.name = nameErr;

    const phoneErr = validateIndianMobile(mobile);
    if (phoneErr) nextErrors.mobile = phoneErr;

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    const cleanNote = sanitizeInput(note, 250);
    const whatsappUrl = buildBikeEnquiryWhatsAppUrl(name, mobile, cleanNote);
    const emailUrl = buildBikeEnquiryEmailUrl(name, mobile, cleanNote);

    if (channel === 'WhatsApp') {
      triggerExternalWhatsApp(whatsappUrl);
    } else if (channel === 'Email') {
      triggerExternalEmail(emailUrl);
    } else {
      triggerExternalWhatsApp(whatsappUrl);
      triggerExternalEmail(emailUrl);
    }

    setReadyLinks({ whatsappUrl, emailUrl });
  };

  const handleInterestSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitInterest('WhatsApp');
  };

  return (
    <div className="bg-[#071D3A] text-white min-h-[80vh]">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white rounded-xl p-2 inline-block shadow-sm">
                  <img
                    src={BRAND_CONFIG.logoPath}
                    alt={BRAND_CONFIG.name}
                    className="h-10 w-auto object-contain"
                  />
                </div>
                <span className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-[#F36B16] text-white text-xs font-bold uppercase tracking-wider">
                  Coming Soon
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance">
                Two-Wheel Adventures Are Coming Soon!
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                We are preparing something exciting for bike enthusiasts. Our self-drive bike rental service will be available soon.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <a
                  href={buildBikeEnquiryWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm sm:text-base transition-colors"
                >
                  <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>Enquire on WhatsApp</span>
                </a>

                <a
                  href={buildBikeEnquiryEmailUrl()}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#F36B16] hover:bg-[#d95b0e] text-white font-semibold text-sm sm:text-base transition-colors"
                >
                  <Mail className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>Enquire via Email</span>
                </a>

                <Link
                  to="/cars"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm sm:text-base transition-colors"
                >
                  <span>Explore Cars</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="aspect-16/10 rounded-2xl overflow-hidden border border-white/15 bg-[#0B2345] shadow-2xl">
              <ResilientImage
                src={BRAND_CONFIG.bikeHeroImage}
                alt="Upcoming self-drive motorcycle rentals at Satapathy Tour and Travels"
                lazy={false}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* BIKE INTEREST ENQUIRY FORM */}
      <section className="py-14 sm:py-20 bg-[#0B2345]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white text-[#172337] p-6 sm:p-8 shadow-xl">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FFF3E9] border border-[#F36B16]/30 mb-6">
              <Info className="w-5 h-5 text-[#F36B16] shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs sm:text-sm text-[#172337] leading-relaxed">
                <strong>Service Notice:</strong> Our self-drive bike rental service has not launched yet. Bike models and pricing will be announced upon launch. You can share your interest below via WhatsApp or Email ({BRAND_CONFIG.email}).
              </p>
            </div>

            <h2 className="text-2xl font-bold text-[#071D3A]">
              Register Your Bike Rental Interest
            </h2>
            <p className="mt-1.5 text-sm text-[#697586]">
              Send us a quick WhatsApp or Email message so we can notify you when bike rentals launch in Rourkela.
            </p>

            {readyLinks ? (
              <div className="mt-6 p-6 rounded-xl bg-[#F5F7FA] border border-[#E5EAF0] text-center">
                <CheckCircle2 className="w-10 h-10 text-[#F36B16] mx-auto mb-3" aria-hidden="true" />
                <h3 className="text-lg font-bold text-[#071D3A]">
                  Your bike enquiry message is ready!
                </h3>
                <p className="mt-2 text-sm text-[#697586]">
                  Send the prepared message via WhatsApp or Email ({BRAND_CONFIG.email}) to let our team know you are interested.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <a
                    href={readyLinks.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Open WhatsApp</span>
                  </a>
                  <a
                    href={readyLinks.emailUrl}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F36B16] hover:bg-[#d95b0e] text-white text-sm font-semibold"
                  >
                    <Mail className="w-4 h-4" aria-hidden="true" />
                    <span>Send via Email</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setReadyLinks(null)}
                    className="px-4 py-2.5 rounded-xl border border-[#E5EAF0] text-[#071D3A] text-sm font-semibold cursor-pointer"
                  >
                    Back
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInterestSubmit} noValidate className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bike-name" className="block text-sm font-medium text-[#172337] mb-1.5">
                      Full Name <span className="text-[#F36B16]">*</span>
                    </label>
                    <input
                      id="bike-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      maxLength={80}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAF0] text-sm text-[#172337] focus:outline-none focus:border-[#F36B16]"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600" role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="bike-mobile" className="block text-sm font-medium text-[#172337] mb-1.5">
                      Mobile Number <span className="text-[#F36B16]">*</span>
                    </label>
                    <input
                      id="bike-mobile"
                      type="tel"
                      inputMode="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="10-digit mobile number"
                      maxLength={16}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAF0] text-sm text-[#172337] tabular-nums focus:outline-none focus:border-[#F36B16]"
                    />
                    {errors.mobile && (
                      <p className="mt-1 text-xs text-red-600" role="alert">
                        {errors.mobile}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="bike-note" className="block text-sm font-medium text-[#172337] mb-1.5">
                    Message (Optional)
                  </label>
                  <textarea
                    id="bike-note"
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Let us know when you plan to rent or any questions you have..."
                    maxLength={250}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAF0] text-sm text-[#172337] focus:outline-none focus:border-[#F36B16]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Send on WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => submitInterest('Email')}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#F36B16] hover:bg-[#d95b0e] text-white font-semibold text-sm transition-colors cursor-pointer"
                  >
                    <Mail className="w-4 h-4" aria-hidden="true" />
                    <span>Send via Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => submitInterest('Both')}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#071D3A] hover:bg-[#0B2345] text-white font-semibold text-sm transition-colors cursor-pointer"
                  >
                    <span>Send to Both</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
