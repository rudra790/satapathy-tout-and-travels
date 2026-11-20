import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle, Phone, Search, ShieldCheck } from 'lucide-react';
import { BRAND_CONFIG } from '../data/vehicles';

export interface FAQItem {
  question: string;
  answer: string;
  category: 'Documents' | 'Booking & Advance' | 'Delivery & Handover' | 'Pricing & Fuel';
}

export const FAQS: FAQItem[] = [
  {
    category: 'Documents',
    question: 'What documents are required to rent a self-drive car in Rourkela?',
    answer:
      'You only need two primary documents: 1) An original valid Driving Licence (LMV / 4-Wheeler, held for at least 1 year) and 2) An original Aadhaar Card (physical or DigiLocker) for identity and address verification. You can share clear photos on WhatsApp for fast pre-verification before handover.',
  },
  {
    category: 'Booking & Advance',
    question: 'How does the booking process work step-by-step?',
    answer:
      'Our booking process is simple and transparent: 1) Fill up the booking form with your preferred car and schedule. 2) Pay a nominal advance booking token via UPI (GPay, PhonePe, Paytm) to lock your reservation. 3) Send your Driving Licence and Aadhaar Card on WhatsApp for instant 2-minute verification. 4) We deliver and handover the keys right at your location anywhere in Rourkela!',
  },
  {
    category: 'Booking & Advance',
    question: 'Why do I need to pay an advance booking amount?',
    answer:
      'The nominal advance payment locks your requested car model and reserved time slot exclusively for you so nobody else can take it. This advance is fully adjusted in your final rental bill at vehicle return.',
  },
  {
    category: 'Delivery & Handover',
    question: 'Do you deliver and handover the car to my location in Rourkela?',
    answer:
      'Yes, we provide doorstep delivery and handover all over Rourkela! Whether you are at Rourkela Railway Station, Civil Township, Chhend Colony, Koel Nagar, Panposh, Basanti Colony, or any of the Sectors, our team coordinates your exact pickup and drop location.',
  },
  {
    category: 'Pricing & Fuel',
    question: 'Are the displayed rental package prices negotiable?',
    answer:
      'Yes! All prices listed on our website are negotiable. Depending on your travel duration (12h, 24h, weekend, multi-day, or monthly) and distance, we are happy to offer the best competitive price. Connect directly with us on WhatsApp or phone to finalize your deal.',
  },
  {
    category: 'Pricing & Fuel',
    question: 'Is fuel included in the rental price?',
    answer:
      'Rentals follow a fair "Same-to-Same" fuel policy. The car is handed over to you with a recorded fuel level and you simply return it with the same fuel level. Fuel costs during your journey are borne by the renter.',
  },
  {
    category: 'Booking & Advance',
    question: 'Is there a security deposit, and when is it refunded?',
    answer:
      'Yes, a nominal refundable security deposit is collected during vehicle handover. Once you return the car safely and a quick exterior/interior check is completed, your deposit is refunded instantly to your UPI account.',
  },
  {
    category: 'Documents',
    question: 'What is the minimum age requirement to drive?',
    answer:
      'The driver must be at least 18 years of age with a valid permanent Indian 4-wheeler (LMV) driving licence. Learning licences and expired licences cannot be accepted under self-drive rental terms.',
  },
  {
    category: 'Delivery & Handover',
    question: 'Can I extend my rental duration after taking the car?',
    answer:
      'Yes, extensions are welcome subject to vehicle availability. Please inform us via phone or WhatsApp at least 3 to 4 hours before your scheduled return time so we can extend your booking seamlessly.',
  },
];

const CATEGORIES = ['All', 'Documents', 'Booking & Advance', 'Delivery & Handover', 'Pricing & Fuel'] as const;

export function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="py-16 sm:py-24 bg-[#F5F7FA] border-t border-[#E5EAF0]" id="faq">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF3E9] border border-[#F36B16]/20 text-[#F36B16] text-xs font-bold uppercase tracking-widest mb-3">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions? We Have Answers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#071D3A] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#697586] leading-relaxed">
            Everything you need to know about required documents, advance payments, doorstep handover, and self-drive car rentals in Rourkela.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-8">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. Aadhaar, advance, delivery, fuel)..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-[#E5EAF0] text-sm text-[#172337] placeholder:text-slate-400 focus:outline-none focus:border-[#F36B16] shadow-xs"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#071D3A] text-white shadow-sm'
                  : 'bg-white text-[#697586] hover:text-[#071D3A] border border-[#E5EAF0] hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#E5EAF0] p-6 text-slate-500">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold">No questions matching your search.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="mt-3 text-xs font-bold text-[#F36B16] hover:underline"
              >
                Reset search filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.question}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-[#F36B16]/50 shadow-md ring-1 ring-[#F36B16]/20'
                      : 'border-[#E5EAF0] hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(idx)}
                    aria-expanded={isOpen}
                    className="w-full text-left px-5 sm:px-6 py-4.5 sm:py-5 flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F36B16]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#F36B16] shrink-0" />
                      <span className="text-base sm:text-lg font-bold text-[#071D3A] text-balance">
                        {faq.question}
                      </span>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-[#FFF3E9] text-[#F36B16]' : 'bg-[#F5F7FA] text-slate-500'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-sm sm:text-base text-[#697586] leading-relaxed border-t border-[#F5F7FA]">
                      <p>{faq.answer}</p>
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#F36B16]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Category: {faq.category}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* WhatsApp & Call Direct Help Banner */}
        <div className="mt-12 rounded-2xl bg-white border border-[#E5EAF0] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-[#071D3A]">
              Still have a specific question about your trip?
            </h3>
            <p className="text-sm text-[#697586] mt-1">
              Connect directly with our team on WhatsApp or phone for immediate assistance anytime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={BRAND_CONFIG.whatsappBaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask on WhatsApp</span>
            </a>
            <a
              href={BRAND_CONFIG.phoneHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E5EAF0] bg-white hover:bg-slate-50 text-[#071D3A] font-semibold text-sm transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call Us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
