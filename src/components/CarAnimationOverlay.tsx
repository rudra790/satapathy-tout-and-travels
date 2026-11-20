import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gauge, Zap, Flame, Sparkles } from 'lucide-react';
import { BRAND_CONFIG } from '../data/vehicles';

interface CarAnimationOverlayProps {
  isVisible: boolean;
  onComplete: () => void;
}

export function CarAnimationOverlay({ isVisible, onComplete }: CarAnimationOverlayProps) {
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setSpeed(0);
      return;
    }

    const durationMs = 2000;
    const startTime = performance.now();
    let animId: number;

    const updateSpeed = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / 1600, 1);
      // Accelerate rapidly from 0 to 140 km/h
      const currentSpeed = Math.round(140 * Math.pow(progress, 1.4));
      setSpeed(currentSpeed);

      if (elapsed < durationMs) {
        animId = requestAnimationFrame(updateSpeed);
      }
    };

    animId = requestAnimationFrame(updateSpeed);

    const timer = window.setTimeout(() => {
      onComplete();
    }, durationMs);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(animId);
    };
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="car-section-animation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: 'blur(8px)',
            transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[120] bg-[#030814]/95 backdrop-blur-md flex flex-col items-center justify-between py-8 px-4 overflow-hidden select-none pointer-events-auto"
          role="dialog"
          aria-label="Car section loading animation"
        >
          {/* Radial speed glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 55%, rgba(243, 107, 22, 0.28) 0%, rgba(11, 27, 54, 0.7) 45%, rgba(3, 8, 20, 0.98) 85%)',
            }}
          />

          {/* Perspective highway speed grid */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(243, 107, 22, 0.15) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
              backgroundSize: '36px 36px',
              maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%)',
            }}
          />

          {/* TOP STATUS HEADER */}
          <div className="relative z-10 w-full max-w-4xl flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F36B16]/15 border border-[#F36B16]/30 text-[#F36B16] text-xs font-bold tracking-wider uppercase"
            >
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              <span>Self-Drive Fleet Loaded</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-right text-[11px] font-semibold tracking-widest text-slate-400 uppercase"
            >
              <span className="text-[#F36B16] font-bold">2.0s</span> FAST LAUNCH
            </motion.div>
          </div>

          {/* CENTER: SPEEDOMETER & BRAND ANNOUNCEMENT */}
          <div className="relative z-10 flex flex-col items-center text-center my-auto">
            {/* Speed HUD Gauge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="relative mb-3 flex flex-col items-center"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-[#F36B16] tabular-nums tracking-tighter drop-shadow-[0_4px_16px_rgba(243,107,22,0.6)]">
                  {speed}
                </span>
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-300">
                  KM/H
                </span>
              </div>

              {/* Tachometer RPM indicator bars */}
              <div className="flex items-center gap-1 mt-2">
                {Array.from({ length: 16 }).map((_, i) => {
                  const active = (speed / 140) * 16 > i;
                  return (
                    <motion.span
                      key={i}
                      className={`h-2 sm:h-2.5 w-1.5 sm:w-2 rounded-xs transition-colors duration-75 ${
                        active
                          ? i > 12
                            ? 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]'
                            : i > 8
                            ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]'
                            : 'bg-[#F36B16] shadow-[0_0_6px_rgba(243,107,22,0.8)]'
                          : 'bg-white/10'
                      }`}
                    />
                  );
                })}
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight"
            >
              Satapathy Self-Drive Cars
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="mt-1 text-xs sm:text-sm font-semibold text-slate-300 tracking-[0.2em] uppercase"
            >
              Swift Dzire • Baleno • Fronx • Swift
            </motion.p>
          </div>

          {/* LOWER SECTION: HIGHWAY TRACK WITH ACCELERATING CAR */}
          <div className="relative z-10 w-full max-w-4xl h-32 sm:h-40 overflow-hidden rounded-2xl bg-gradient-to-t from-white/[0.05] to-transparent border-b border-white/10">
            {/* Rushing center dashes */}
            <motion.div
              initial={{ x: '0%' }}
              animate={{ x: '-50%' }}
              transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
              className="absolute bottom-6 left-0 w-[200%] flex items-center gap-6 opacity-80"
              aria-hidden="true"
            >
              {Array.from({ length: 32 }).map((_, idx) => (
                <span
                  key={idx}
                  className="w-16 h-1 rounded-full bg-gradient-to-r from-amber-400 to-white shadow-[0_0_10px_rgba(243,107,22,0.8)] shrink-0"
                />
              ))}
            </motion.div>

            {/* Road borders */}
            <div className="absolute bottom-9 inset-x-0 h-0.5 bg-[#F36B16]/80" />
            <div className="absolute bottom-3 inset-x-0 h-[1px] bg-white/20" />

            {/* -------------------------------------------------------- */}
            {/* THE ACCELERATING RACING CAR                               */}
            {/* -------------------------------------------------------- */}
            <motion.div
              initial={{ x: '-35vw', scale: 0.95 }}
              animate={{
                x: ['-30vw', '20vw', '45vw', '110vw'],
                scale: [0.95, 1.05, 1.08, 1.15],
                y: [0, -2, 1, 0],
              }}
              transition={{
                duration: 2.0,
                times: [0, 0.35, 0.7, 1],
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute bottom-[20px] left-0 w-60 sm:w-80"
            >
              {/* Ultra Bright Headlight Beam Cone */}
              <div
                className="absolute right-[-80px] bottom-5 w-36 h-12 rounded-r-full blur-[3px] opacity-90 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(243, 107, 22, 0.7) 40%, rgba(255, 255, 255, 0) 100%)',
                }}
              />

              {/* Glowing Amber Underglow */}
              <div className="absolute left-8 right-8 -bottom-1 h-3.5 rounded-full bg-[#F36B16] blur-md pointer-events-none" />

              <svg viewBox="0 0 300 100" className="w-full h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)]">
                {/* Wind / speed streaks behind */}
                <line x1="0" y1="52" x2="45" y2="52" stroke="#F36B16" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
                <line x1="12" y1="64" x2="55" y2="64" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                <line x1="2" y1="74" x2="38" y2="74" stroke="#F36B16" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />

                {/* Exhaust flame burst */}
                <motion.polygon
                  points="25,62 5,66 25,70"
                  animate={{
                    opacity: [0.6, 1, 0.4, 0.9],
                    scaleX: [1, 1.4, 0.9, 1.3],
                  }}
                  transition={{ duration: 0.15, repeat: Infinity }}
                  fill="#FF4500"
                />
                <circle cx="28" cy="66" r="3" fill="#FFF3E9" />

                {/* Sleek Aerodynamic Car Body */}
                <path
                  d="M38 68 L38 50 C38 42, 48 38, 64 36 L102 16 C118 10, 156 10, 188 16 L232 36 L272 40 C284 43, 292 50, 292 60 L292 68 Z"
                  fill="url(#racingCarGrad)"
                />

                {/* Tinted Windows */}
                <path d="M106 20 L152 16 L152 35 L82 35 Z" fill="#030814" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                <path d="M158 16 L186 18 L222 35 L158 35 Z" fill="#030814" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />

                {/* Window glare reflection */}
                <line x1="108" y1="24" x2="146" y2="18" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
                <line x1="162" y1="20" x2="184" y2="21" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />

                {/* Orange Racing Belt Accent Stripe */}
                <path d="M52 54 L278 54" stroke="#F36B16" strokeWidth="4" strokeLinecap="round" />

                {/* High-output LED Headlight */}
                <rect x="278" y="46" width="14" height="8" rx="2" fill="#FFFFFF" />
                <rect x="286" y="47" width="6" height="6" rx="1" fill="#FFF3E9" />

                {/* Smoked Red LED Taillight */}
                <rect x="38" y="46" width="10" height="7" rx="2" fill="#EF4444" />

                {/* Rear Sport Alloy Wheel */}
                <g transform="translate(90,70)">
                  <circle cx="0" cy="0" r="20" fill="#030814" stroke="#E2E8F0" strokeWidth="4.5" />
                  <circle cx="0" cy="0" r="15" fill="none" stroke="#F36B16" strokeWidth="2.5" strokeDasharray="3 3" />
                  <circle cx="0" cy="0" r="7" fill="#F36B16" />
                  <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.25, repeat: Infinity, ease: 'linear' }}
                  >
                    <line x1="-14" y1="0" x2="14" y2="0" stroke="#94A3B8" strokeWidth="2.5" />
                    <line x1="0" y1="-14" x2="0" y2="14" stroke="#94A3B8" strokeWidth="2.5" />
                    <line x1="-10" y1="-10" x2="10" y2="10" stroke="#94A3B8" strokeWidth="2" />
                    <line x1="-10" y1="10" x2="10" y2="-10" stroke="#94A3B8" strokeWidth="2" />
                  </motion.g>
                </g>

                {/* Front Sport Alloy Wheel */}
                <g transform="translate(242,70)">
                  <circle cx="0" cy="0" r="20" fill="#030814" stroke="#E2E8F0" strokeWidth="4.5" />
                  <circle cx="0" cy="0" r="15" fill="none" stroke="#F36B16" strokeWidth="2.5" strokeDasharray="3 3" />
                  <circle cx="0" cy="0" r="7" fill="#F36B16" />
                  <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.25, repeat: Infinity, ease: 'linear' }}
                  >
                    <line x1="-14" y1="0" x2="14" y2="0" stroke="#94A3B8" strokeWidth="2.5" />
                    <line x1="0" y1="-14" x2="0" y2="14" stroke="#94A3B8" strokeWidth="2.5" />
                    <line x1="-10" y1="-10" x2="10" y2="10" stroke="#94A3B8" strokeWidth="2" />
                    <line x1="-10" y1="10" x2="10" y2="-10" stroke="#94A3B8" strokeWidth="2" />
                  </motion.g>
                </g>

                <defs>
                  <linearGradient id="racingCarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="50%" stopColor="#F8FAFC" />
                    <stop offset="100%" stopColor="#94A3B8" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          </div>

          {/* EXACT 2-SECOND LINEAR PROGRESS BAR */}
          <div className="relative z-10 w-full max-w-md mt-4">
            <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2.0, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-[#F36B16] via-[#FF8A3D] to-white origin-left shadow-[0_0_12px_#F36B16]"
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 font-semibold mt-1 px-1">
              <span>0.0s</span>
              <span className="text-[#F36B16] font-bold tracking-wider">NAVIGATING TO CARS</span>
              <span>2.0s</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
