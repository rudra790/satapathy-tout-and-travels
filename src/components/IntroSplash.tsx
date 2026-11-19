import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BRAND_CONFIG } from '../data/vehicles';
import { useBooking } from '../context/BookingContext';

export function IntroSplash() {
  const { introFinished, finishIntro } = useBooking();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const durationMs = prefersReducedMotion ? 1000 : 3000;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timer = window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = prevOverflow;
      finishIntro();
    }, durationMs);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
    };
  }, [finishIntro]);

  const handleSkip = () => {
    setVisible(false);
    document.body.style.overflow = '';
    finishIntro();
  };

  if (introFinished && !visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[100] bg-[#071D3A] flex flex-col items-center justify-center overflow-hidden px-4 select-none"
          role="presentation"
        >
          {/* Ambient twilight glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 42%, rgba(243, 107, 22, 0.16) 0%, rgba(11, 35, 69, 0.65) 45%, rgba(7, 29, 58, 1) 85%)',
            }}
          />

          {/* Skip button */}
          <button
            type="button"
            onClick={handleSkip}
            className="absolute top-5 right-5 z-20 px-3.5 py-1.5 rounded-lg border border-white/20 text-xs font-semibold text-slate-300 hover:text-white hover:border-white/40 transition-colors cursor-pointer"
          >
            Skip Intro
          </button>

          {/* Animated Brand Title */}
          <div className="relative z-10 text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-3 mb-4"
            >
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-8 sm:w-12 h-0.5 bg-[#F36B16] origin-right"
              />
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase text-[#F36B16]">
                {BRAND_CONFIG.locationSummary}
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-8 sm:w-12 h-0.5 bg-[#F36B16] origin-left"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20, letterSpacing: '0.08em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '-0.02em' }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight text-balance"
            >
              Satapathy Tour and Travels
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-slate-300"
            >
              {BRAND_CONFIG.tagline}
            </motion.p>
          </div>

          {/* Animated Highway Track with Running Car & Bike */}
          <div className="relative z-10 w-full max-w-4xl h-28 sm:h-36 overflow-hidden">
            {/* Speed lines */}
            <motion.div
              initial={{ x: '0%' }}
              animate={{ x: '-50%' }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
              className="absolute bottom-8 left-0 w-[200%] flex items-center gap-8 opacity-40"
              aria-hidden="true"
            >
              {Array.from({ length: 24 }).map((_, idx) => (
                <span key={idx} className="w-12 h-1 rounded-full bg-white/60 shrink-0" />
              ))}
            </motion.div>

            {/* Road Surface + Orange Horizon Accent */}
            <div className="absolute bottom-5 inset-x-0 h-1 bg-[#F36B16]/80 rounded-full" />
            <div className="absolute bottom-2 inset-x-0 h-0.5 bg-white/20 rounded-full" />

            {/* Running Sports Bike (ahead on the track) */}
            <motion.div
              initial={{ x: '-25vw', opacity: 0 }}
              animate={{
                x: ['-20vw', '28vw', '46vw', '108vw'],
                opacity: [0, 1, 1, 0],
                y: [0, -1.5, 0, -1],
              }}
              transition={{
                duration: 2.85,
                times: [0, 0.28, 0.65, 1],
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute bottom-[22px] left-0 w-28 sm:w-36"
            >
              {/* Headlight beam */}
              <div
                className="absolute right-[-36px] bottom-5 w-14 h-6 rounded-r-full blur-xs opacity-70 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, rgba(243,107,22,0.75) 0%, rgba(255,255,255,0) 100%)',
                }}
              />
              <svg viewBox="0 0 180 95" className="w-full h-auto drop-shadow-[0_8px_12px_rgba(0,0,0,0.45)]">
                {/* Speed streaks */}
                <line x1="2" y1="45" x2="28" y2="45" stroke="#F36B16" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
                <line x1="10" y1="56" x2="34" y2="56" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                {/* Rear Wheel */}
                <g transform="translate(52,68)">
                  <circle cx="0" cy="0" r="18" fill="#0B2345" stroke="#FFFFFF" strokeWidth="4" />
                  <circle cx="0" cy="0" r="7" fill="#F36B16" />
                  <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.45, repeat: Infinity, ease: 'linear' }}
                  >
                    <line x1="-13" y1="0" x2="13" y2="0" stroke="#94A3B8" strokeWidth="1.5" />
                    <line x1="0" y1="-13" x2="0" y2="13" stroke="#94A3B8" strokeWidth="1.5" />
                  </motion.g>
                </g>
                {/* Front Wheel */}
                <g transform="translate(142,68)">
                  <circle cx="0" cy="0" r="18" fill="#0B2345" stroke="#FFFFFF" strokeWidth="4" />
                  <circle cx="0" cy="0" r="7" fill="#F36B16" />
                  <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.45, repeat: Infinity, ease: 'linear' }}
                  >
                    <line x1="-13" y1="0" x2="13" y2="0" stroke="#94A3B8" strokeWidth="1.5" />
                    <line x1="0" y1="-13" x2="0" y2="13" stroke="#94A3B8" strokeWidth="1.5" />
                  </motion.g>
                </g>
                {/* Bike Chassis & Fairing */}
                <path
                  d="M36 42 L62 42 L78 34 L112 30 L134 40 L142 66 M68 54 L110 54 L122 38"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M72 34 C86 24, 110 26, 124 38 L106 46 L76 46 Z"
                  fill="#F36B16"
                />
                <path
                  d="M42 40 L68 38 L78 44 L48 45 Z"
                  fill="#FFFFFF"
                />
                <circle cx="136" cy="40" r="3.5" fill="#FFF3E9" />
              </svg>
            </motion.div>

            {/* Running Premium Car */}
            <motion.div
              initial={{ x: '-45vw', opacity: 0 }}
              animate={{
                x: ['-38vw', '4vw', '22vw', '104vw'],
                opacity: [0, 1, 1, 0],
                y: [0, -1, 0.5, 0],
              }}
              transition={{
                duration: 2.95,
                times: [0, 0.25, 0.62, 1],
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute bottom-[20px] left-0 w-44 sm:w-56"
            >
              {/* Headlight beam */}
              <div
                className="absolute right-[-48px] bottom-5 w-16 h-7 rounded-r-full blur-xs opacity-75 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, rgba(255,243,233,0.85) 0%, rgba(255,255,255,0) 100%)',
                }}
              />
              <svg viewBox="0 0 260 100" className="w-full h-auto drop-shadow-[0_10px_16px_rgba(0,0,0,0.5)]">
                {/* Speed streaks */}
                <line x1="0" y1="54" x2="26" y2="54" stroke="#F36B16" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
                <line x1="8" y1="65" x2="32" y2="65" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                {/* Car Body */}
                <path
                  d="M34 68 L34 52 C34 45, 42 42, 54 40 L84 22 C96 16, 126 16, 152 22 L188 40 L224 44 C236 46, 244 52, 244 62 L244 68 Z"
                  fill="#FFFFFF"
                />
                {/* Windows */}
                <path
                  d="M88 26 L124 22 L124 40 L68 40 Z"
                  fill="#0B2345"
                />
                <path
                  d="M130 22 L152 24 L178 40 L130 40 Z"
                  fill="#0B2345"
                />
                {/* Orange Body Accent Stripe */}
                <path
                  d="M44 56 L228 56"
                  stroke="#F36B16"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Headlight & Taillight */}
                <rect x="232" y="49" width="10" height="6" rx="2" fill="#FFF3E9" />
                <rect x="34" y="48" width="7" height="6" rx="1.5" fill="#F36B16" />

                {/* Rear Wheel */}
                <g transform="translate(76,70)">
                  <circle cx="0" cy="0" r="18" fill="#071D3A" stroke="#CBD5E1" strokeWidth="4" />
                  <circle cx="0" cy="0" r="7" fill="#F36B16" />
                  <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.45, repeat: Infinity, ease: 'linear' }}
                  >
                    <line x1="-13" y1="0" x2="13" y2="0" stroke="#94A3B8" strokeWidth="2" />
                    <line x1="0" y1="-13" x2="0" y2="13" stroke="#94A3B8" strokeWidth="2" />
                  </motion.g>
                </g>

                {/* Front Wheel */}
                <g transform="translate(198,70)">
                  <circle cx="0" cy="0" r="18" fill="#071D3A" stroke="#CBD5E1" strokeWidth="4" />
                  <circle cx="0" cy="0" r="7" fill="#F36B16" />
                  <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.45, repeat: Infinity, ease: 'linear' }}
                  >
                    <line x1="-13" y1="0" x2="13" y2="0" stroke="#94A3B8" strokeWidth="2" />
                    <line x1="0" y1="-13" x2="0" y2="13" stroke="#94A3B8" strokeWidth="2" />
                  </motion.g>
                </g>
              </svg>
            </motion.div>
          </div>

          {/* Bottom 3-sec progress indicator */}
          <div className="relative z-10 w-48 h-1 bg-white/15 rounded-full overflow-hidden mt-4">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2.9, ease: 'linear' }}
              className="h-full bg-[#F36B16] origin-left"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
