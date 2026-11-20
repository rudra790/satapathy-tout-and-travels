import React from 'react';
import { CheckCircle2, FileText, CreditCard, ShieldCheck, MapPin, AlertCircle } from 'lucide-react';

interface DocumentChecklistProps {
  className?: string;
  variant?: 'full' | 'compact';
}

export const REQUIRED_DOCUMENTS = [
  {
    id: 'aadhaar',
    title: 'Aadhaar Card',
    tag: 'Mandatory',
    tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'Original Aadhaar Card (front & back) for identity and permanent address verification.',
    subnote: 'DigiLocker or physical original card verified at doorstep.',
    icon: FileText,
  },
  {
    id: 'dl',
    title: 'Valid Driving Licence (DL)',
    tag: 'Mandatory',
    tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'Original physical driving licence for Light Motor Vehicles (LMV / 4-Wheeler).',
    subnote: 'Must be valid & held for at least 1 year. Learner licences not accepted.',
    icon: CreditCard,
  },
  {
    id: 'advance',
    title: 'Advance Booking Token',
    tag: 'To Confirm Slot',
    tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
    description: 'Nominal advance payment via UPI (Google Pay, PhonePe, Paytm) to lock your car reservation.',
    subnote: 'Adjusted in final rental bill. Transparent & negotiable pricing.',
    icon: CheckCircle2,
  },
  {
    id: 'security',
    title: 'Refundable Security Deposit',
    tag: '100% Refundable',
    tagColor: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Nominal security deposit collected during car handover.',
    subnote: 'Refunded immediately upon safe return & quick vehicle check.',
    icon: ShieldCheck,
  },
];

export function DocumentChecklist({ className = '', variant = 'full' }: DocumentChecklistProps) {
  if (variant === 'compact') {
    return (
      <div className={`p-4 rounded-xl bg-[#FFF3E9] border border-[#F36B16]/20 ${className}`}>
        <div className="flex items-center gap-2 mb-2 text-[#071D3A] font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-[#F36B16]" />
          <span>Documents Required for Handover</span>
        </div>
        <ul className="space-y-1.5 text-xs text-[#172337]">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span><strong>Aadhaar Card:</strong> Original copy for identity/address proof</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span><strong>Driving Licence:</strong> Valid physical LMV licence (18+ years)</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span><strong>Advance Token:</strong> UPI payment to lock your car slot</span>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <section className={`py-16 sm:py-20 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF3E9] border border-[#F36B16]/20 text-[#F36B16] text-xs font-bold uppercase tracking-widest mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Hassle-Free Verification</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#071D3A] tracking-tight">
            Checklist of Required Documents
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#697586] leading-relaxed">
            Quick 2-minute digital verification with zero complicated paperwork. Keep these ready for instant booking confirmation and smooth doorstep handover.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REQUIRED_DOCUMENTS.map((doc, idx) => {
            const Icon = doc.icon;
            return (
              <div
                key={doc.id}
                className="group relative bg-[#F5F7FA] hover:bg-white rounded-2xl border border-[#E5EAF0] hover:border-[#F36B16]/40 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#E5EAF0] text-[#F36B16] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${doc.tagColor}`}>
                      {doc.tag}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Item 0{idx + 1}
                  </span>
                  <h3 className="text-lg font-bold text-[#071D3A] mt-1 mb-2">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-[#697586] leading-relaxed mb-4">
                    {doc.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5EAF0] flex items-start gap-2 text-xs text-slate-500 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{doc.subnote}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Verification Note & Doorstep Handover Guarantee */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-[#071D3A] to-[#0B2345] text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F36B16]/20 border border-[#F36B16]/40 text-[#F36B16] flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">
                Doorstep Handover Anywhere in Rourkela
              </h4>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Once documents are verified on WhatsApp and your advance is received, our representative delivers the sanitized car right to your location (home, hotel, railway station, or office) with instant keys handover!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 bg-white/10 px-4 py-2.5 rounded-xl border border-white/15 text-xs font-semibold text-slate-200">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Carry Original DL &amp; Aadhaar for Handover</span>
          </div>
        </div>
      </div>
    </section>
  );
}
