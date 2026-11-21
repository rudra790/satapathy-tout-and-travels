import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MapPin, ShieldCheck, Zap, ChevronRight, Gauge } from 'lucide-react';
import { BRAND_CONFIG } from '../data/vehicles';
import { useBooking } from '../context/BookingContext';

export function IntroSplash() {
  const { introFinished, finishIntro } = useBooking();
  const [visible, setVisible] = useState(true);
  const [logoLoaded, setLogoLoaded] = useState(true);
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const durationMs = prefersReducedMotion ? 1200 : 3600;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Speedometer counter effect
    let startTimestamp: number | null = null;
    let animFrame: number;

    const updateSpeed = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (durationMs * 0.75), 1);
      // Easing: easeOutExpo-like curve to 120 km/h
      const currentSpeed = Math.round(120 * Math.sin((progress * Math.PI) / 2));
      setSpeed(currentSpeed);
      if (progress < 1) {
        animFrame = requestAnimationFrame(updateSpeed);
      }
    };

    animFrame = requestAnimationFrame(updateSpeed);

    const timer = window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = prevOverflow;
      finishIntro();
    }, durationMs);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(animFrame);
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
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: 'blur(10px)',
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[100] bg-[#040C1A] flex flex-col items-center justify-between overflow-hidden select-none py-6 px-4"
          role="presentation"
        >
          {/* ============================================================== */}
          {/* ATMOSPHERIC BACKGROUND EFFECTS                                 */}
          {/* ============================================================== */}
          {/* Twilight horizon glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 48%, rgba(243, 107, 22, 0.22) 0%, rgba(15, 34, 64, 0.75) 45%, rgba(4, 12, 26, 0.98) 85%)',
            }}
          />

          {/* Futuristic grid horizon */}
          <div
            className="absolute inset-0 opacity-[0.12] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
              maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 80%)',
            }}
          />

          {/* Glowing ambient light orbs */}
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.25, 0.45, 0.25],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#F36B16]/20 blur-3xl pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-[#3B82F6]/20 blur-3xl pointer-events-none"
          />

          {/* ============================================================== */}
          {/* TOP BAR: LOCATION & SKIP                                       */}
          {/* ============================================================== */}
          <div className="relative z-20 w-full max-w-5xl flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <MapPin className="w-3.5 h-3.5 text-[#F36B16]" />
              <span className="text-[11px] font-semibold text-slate-300 tracking-wider uppercase">
                {BRAND_CONFIG.locationSummary}
              </span>
            </motion.div>

            <motion.button
              type="button"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              onClick={handleSkip}
              className="group inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white backdrop-blur-md transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[#F36B16]/20 hover:border-[#F36B16]/60"
            >
              <span>Skip Intro</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#F36B16] group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </div>

          {/* ============================================================== */}
          {/* CENTER HERO: LOGO BADGE + LUXURY TITLE                         */}
          {/* ============================================================== */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl my-auto">
            {/* Animated Logo Hologram / Shield */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-5"
            >
              {/* Outer rotating neon ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-3 rounded-full opacity-70 pointer-events-none"
                style={{
                  background:
                    'conic-gradient(from 0deg, #F36B16, #FF9B50, transparent 40%, #3B82F6 70%, #F36B16 100%)',
                  filter: 'blur(3px)',
                }}
              />

              {/* Pulsing glow behind badge */}
              <div className="absolute -inset-2 rounded-full bg-[#F36B16]/30 blur-md animate-pulse" />

              {/* Logo container glass card */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-[#0F284E] to-[#07162C] p-2 border-2 border-white/30 shadow-2xl flex items-center justify-center overflow-hidden">
                {logoLoaded ? (
                  <img
                    src={BRAND_CONFIG.logoPath}
                    alt={BRAND_CONFIG.name}
                    onError={() => setLogoLoaded(false)}
                    className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                  />
                ) : (
                  <Sparkles className="w-10 h-10 text-[#F36B16]" />
                )}
                {/* Gloss reflection sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
              </div>
            </motion.div>

            {/* Sub-badge: "EXPERIENCE THE ROAD" */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F36B16]/15 border border-[#F36B16]/40 text-[#F36B16] text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase mb-3 shadow-inner"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Premium Self-Drive Experience</span>
            </motion.div>

            {/* Grand Brand Heading with shimmering gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 25, letterSpacing: '0.04em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '-0.02em' }}
              transition={{ duration: 0.85, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg"
            >
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Satapathy
              </span>{' '}
              <span className="bg-gradient-to-r from-[#F36B16] via-[#FF9248] to-[#FFB37C] bg-clip-text text-transparent">
                Tour & Travels
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.5 }}
              className="mt-3 text-xs sm:text-sm font-semibold tracking-[0.26em] text-slate-300 uppercase max-w-xl mx-auto"
            >
              {BRAND_CONFIG.tagline}
            </motion.p>

            {/* Feature Pills Ticker */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.65 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
            >
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-[11px] sm:text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Sanitized Fleet</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-[11px] sm:text-xs font-medium">
                <Gauge className="w-3.5 h-3.5 text-[#F36B16]" />
                <span>Zero Hidden Fees</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-[11px] sm:text-xs font-medium">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant Doorstep Key</span>
              </div>
            </motion.div>
          </div>

          {/* ============================================================== */}
          {/* HIGHWAY PERSPECTIVE & CINEMATIC RUNNING VEHICLES              */}
          {/* ============================================================== */}
          <div className="relative z-10 w-full max-w-4xl mt-auto">
            {/* Speedometer Digital HUD readout */}
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="flex items-baseline gap-1 text-white">
                <span className="text-xl sm:text-2xl font-black tabular-nums tracking-tight text-[#F36B16]">
                  {speed}
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                  KM/H
                </span>
              </div>
              <span className="w-1 h-3 bg-white/20 rounded-full" />
              <div className="text-[10px] font-semibold tracking-widest uppercase text-slate-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F36B16] animate-ping" />
                <span>SYSTEM READY • ENGINE ENGAGED</span>
              </div>
            </div>

            {/* Track Frame */}
            <div className="relative h-28 sm:h-36 overflow-hidden rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border-t border-white/10 px-2">
              {/* Vanishing road perspective lines */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  background:
                    'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.06) 40px, rgba(255,255,255,0.06) 41px)',
                }}
              />

              {/* Rushing Highway Center Dashes */}
              <motion.div
                initial={{ x: '0%' }}
                animate={{ x: '-50%' }}
                transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                className="absolute bottom-6 left-0 w-[200%] flex items-center gap-8 opacity-70"
                aria-hidden="true"
              >
                {Array.from({ length: 30 }).map((_, idx) => (
                  <span
                    key={idx}
                    className="w-14 sm:w-20 h-1 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-white shadow-[0_0_8px_rgba(251,191,36,0.6)] shrink-0"
                  />
                ))}
              </motion.div>

              {/* Glowing Road Shoulders */}
              <div className="absolute bottom-9 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#F36B16] to-transparent opacity-80" />
              <div className="absolute bottom-3 inset-x-0 h-[1px] bg-white/20" />

              {/* ---------------------------------------------------------- */}
              {/* RUNNING MODERN SPORTBIKE (Leading the track)              */}
              {/* ---------------------------------------------------------- */}
              <motion.div
                initial={{ x: '-120%', opacity: 0 }}
                animate={{
                  x: ['-120%', '32vw', '56vw', '120vw'],
                  opacity: [0, 1, 1, 0],
                  y: [0, -2, 0, -1.5],
                }}
                transition={{
                  duration: 3.3,
                  times: [0, 0.28, 0.65, 1],
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute bottom-[24px] left-0 w-28 sm:w-36 drop-shadow-[0_12px_20px_rgba(0,0,0,0.7)] pointer-events-none"
              >
                {/* Bike Headlight Beam (Bright Projector Cone) */}
                <div
                  className="absolute right-[-48px] bottom-5 w-20 h-8 rounded-r-full blur-[2px] opacity-80 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(255, 200, 150, 0.95) 0%, rgba(243, 107, 22, 0.4) 50%, rgba(255, 255, 255, 0) 100%)',
                  }}
                />

                <svg viewBox="0 0 180 95" className="w-full h-auto">
                  {/* Speed trail streaks */}
                  <line x1="2" y1="46" x2="36" y2="46" stroke="#F36B16" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
                  <line x1="12" y1="58" x2="42" y2="58" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

                  {/* Rear Wheel with neon rim */}
                  <g transform="translate(52,68)">
                    <circle cx="0" cy="0" r="18" fill="#061325" stroke="#FFFFFF" strokeWidth="3.5" />
                    <circle cx="0" cy="0" r="14" fill="none" stroke="#F36B16" strokeWidth="2" strokeDasharray="4 2" />
                    <circle cx="0" cy="0" r="6" fill="#F36B16" />
                    <motion.g
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.35, repeat: Infinity, ease: 'linear' }}
                    >
                      <line x1="-13" y1="0" x2="13" y2="0" stroke="#CBD5E1" strokeWidth="1.5" />
                      <line x1="0" y1="-13" x2="0" y2="13" stroke="#CBD5E1" strokeWidth="1.5" />
                    </motion.g>
                  </g>

                  {/* Front Wheel with neon rim */}
                  <g transform="translate(142,68)">
                    <circle cx="0" cy="0" r="18" fill="#061325" stroke="#FFFFFF" strokeWidth="3.5" />
                    <circle cx="0" cy="0" r="14" fill="none" stroke="#F36B16" strokeWidth="2" strokeDasharray="4 2" />
                    <circle cx="0" cy="0" r="6" fill="#F36B16" />
                    <motion.g
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.35, repeat: Infinity, ease: 'linear' }}
                    >
                      <line x1="-13" y1="0" x2="13" y2="0" stroke="#CBD5E1" strokeWidth="1.5" />
                      <line x1="0" y1="-13" x2="0" y2="13" stroke="#CBD5E1" strokeWidth="1.5" />
                    </motion.g>
                  </g>

                  {/* Bike Frame & Aggressive Tank Fairing */}
                  <path
                    d="M34 42 L62 42 L78 32 L114 28 L136 38 L142 66 M68 54 L110 54 L124 36"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Aerodynamic Tank in Brand Orange */}
                  <path
                    d="M72 32 C86 20, 112 24, 126 36 L108 46 L76 46 Z"
                    fill="#F36B16"
                  />
                  {/* Tail piece */}
                  <path d="M40 40 L68 38 L76 44 L46 45 Z" fill="#FFFFFF" />
                  {/* LED Headlamp */}
                  <polygon points="135,36 144,38 138,42" fill="#FFFBEB" />
                  <circle cx="140" cy="38" r="3" fill="#FFF" />
                </svg>
              </motion.div>

              {/* ---------------------------------------------------------- */}
              {/* RUNNING LUXURY CAR (Powerful presence on the track)        */}
              {/* ---------------------------------------------------------- */}
              <motion.div
                initial={{ x: '-140%', opacity: 0 }}
                animate={{
                  x: ['-140%', '6vw', '28vw', '120vw'],
                  opacity: [0, 1, 1, 0],
                  y: [0, -1.2, 0.4, 0],
                }}
                transition={{
                  duration: 3.4,
                  times: [0, 0.25, 0.62, 1],
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute bottom-[22px] left-0 w-48 sm:w-64 drop-shadow-[0_16px_28px_rgba(0,0,0,0.85)] pointer-events-none"
              >
                {/* Long Projector Headlight Cone on the Asphalt */}
                <div
                  className="absolute right-[-65px] bottom-4 w-28 h-10 rounded-r-full blur-[3px] opacity-90 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(243, 107, 22, 0.5) 45%, rgba(255, 255, 255, 0) 100%)',
                  }}
                />

                {/* Underglow Neon (Amber/Orange) */}
                <div className="absolute left-10 right-10 -bottom-1 h-3 rounded-full bg-[#F36B16]/50 blur-sm pointer-events-none" />

                <svg viewBox="0 0 280 100" className="w-full h-auto">
                  {/* Speed streaks behind car */}
                  <line x1="0" y1="52" x2="34" y2="52" stroke="#F36B16" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
                  <line x1="10" y1="64" x2="44" y2="64" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
                  <line x1="2" y1="74" x2="30" y2="74" stroke="#F36B16" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

                  {/* Sleek Aerodynamic Car Silhouette */}
                  <path
                    d="M34 68 L34 50 C34 42, 44 38, 58 36 L92 18 C106 12, 142 12, 172 18 L212 36 L252 40 C264 43, 272 50, 272 60 L272 68 Z"
                    fill="url(#carGradient)"
                  />

                  {/* Tinted Panoramic Windows with reflections */}
                  <path
                    d="M96 22 L138 18 L138 36 L74 36 Z"
                    fill="#040C1A"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="1"
                  />
                  <path
                    d="M144 18 L170 20 L202 36 L144 36 Z"
                    fill="#040C1A"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="1"
                  />

                  {/* Window Highlight Reflection */}
                  <line x1="98" y1="26" x2="132" y2="20" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                  <line x1="146" y1="22" x2="168" y2="23" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />

                  {/* Dynamic Orange Speed Belt Line */}
                  <path
                    d="M48 54 L258 54"
                    stroke="#F36B16"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Projector LED Headlight */}
                  <rect x="258" y="46" width="12" height="7" rx="2" fill="#FFFFFF" />
                  <rect x="264" y="47" width="5" height="5" rx="1" fill="#FFF3E9" />

                  {/* Smoked Red LED Taillight */}
                  <rect x="34" y="46" width="9" height="7" rx="2" fill="#EF4444" />
                  <line x1="30" y1="49" x2="34" y2="49" stroke="#EF4444" strokeWidth="2" />

                  {/* Rear Wheel with Premium Sport Rim */}
                  <g transform="translate(82,70)">
                    <circle cx="0" cy="0" r="19" fill="#040C1A" stroke="#E2E8F0" strokeWidth="4" />
                    <circle cx="0" cy="0" r="14" fill="none" stroke="#F36B16" strokeWidth="2" strokeDasharray="3 3" />
                    <circle cx="0" cy="0" r="7" fill="#F36B16" />
                    <motion.g
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.35, repeat: Infinity, ease: 'linear' }}
                    >
                      <line x1="-13" y1="0" x2="13" y2="0" stroke="#94A3B8" strokeWidth="2" />
                      <line x1="0" y1="-13" x2="0" y2="13" stroke="#94A3B8" strokeWidth="2" />
                      <line x1="-9" y1="-9" x2="9" y2="9" stroke="#94A3B8" strokeWidth="1.5" />
                      <line x1="-9" y1="9" x2="9" y2="-9" stroke="#94A3B8" strokeWidth="1.5" />
                    </motion.g>
                  </g>

                  {/* Front Wheel with Premium Sport Rim */}
                  <g transform="translate(224,70)">
                    <circle cx="0" cy="0" r="19" fill="#040C1A" stroke="#E2E8F0" strokeWidth="4" />
                    <circle cx="0" cy="0" r="14" fill="none" stroke="#F36B16" strokeWidth="2" strokeDasharray="3 3" />
                    <circle cx="0" cy="0" r="7" fill="#F36B16" />
                    <motion.g
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.35, repeat: Infinity, ease: 'linear' }}
                    >
                      <line x1="-13" y1="0" x2="13" y2="0" stroke="#94A3B8" strokeWidth="2" />
                      <line x1="0" y1="-13" x2="0" y2="13" stroke="#94A3B8" strokeWidth="2" />
                      <line x1="-9" y1="-9" x2="9" y2="9" stroke="#94A3B8" strokeWidth="1.5" />
                      <line x1="-9" y1="9" x2="9" y2="-9" stroke="#94A3B8" strokeWidth="1.5" />
                    </motion.g>
                  </g>

                  {/* Car gradient def */}
                  <defs>
                    <linearGradient id="carGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="60%" stopColor="#F1F5F9" />
                      <stop offset="100%" stopColor="#CBD5E1" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* BOTTOM TIMELINE PROGRESS BAR                                  */}
          {/* ============================================================== */}
          <div className="relative z-20 w-full max-w-md mt-4">
            <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 3.4, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-[#F36B16] via-[#FF9B50] to-white origin-left shadow-[0_0_12px_#F36B16]"
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium mt-1 px-1">
              <span>Ignition</span>
              <span className="text-[#F36B16] font-semibold">Satapathy Tour and Travels</span>
              <span>Departure</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
