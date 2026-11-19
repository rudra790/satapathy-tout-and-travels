import React from 'react';

interface SectionHeadingProps {
  title: string;
  description?: string;
  eyebrow?: string;
  align?: 'left' | 'center';
  light?: boolean;
}

export function SectionHeading({
  title,
  description,
  eyebrow,
  align = 'left',
  light = false,
}: SectionHeadingProps) {
  const isCentered = align === 'center';

  return (
    <div className={isCentered ? 'max-w-2xl mx-auto text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <div className={`flex items-center gap-3 mb-3 ${isCentered ? 'justify-center' : ''}`}>
          <span className="w-8 h-0.5 bg-[#F36B16] inline-block shrink-0" aria-hidden="true" />
          <span
            className={`text-xs font-semibold tracking-wider uppercase ${
              light ? 'text-[#F36B16]' : 'text-[#F36B16]'
            }`}
          >
            {eyebrow}
          </span>
        </div>
      )}
      <h2
        className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-balance leading-tight ${
          light ? 'text-white' : 'text-[#071D3A]'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-3 text-base sm:text-lg leading-relaxed ${
            light ? 'text-slate-300' : 'text-[#697586]'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
