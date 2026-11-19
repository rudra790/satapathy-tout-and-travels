import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { IntroSplash } from './components/IntroSplash';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { MobileContactBar } from './components/MobileContactBar';
import { Home } from './pages/Home';
import { Cars } from './pages/Cars';
import { Bikes } from './pages/Bikes';
import { About } from './pages/About';
import { Pricing } from './pages/Pricing';
import { Contact } from './pages/Contact';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <BookingProvider>
        <IntroSplash />
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-white text-[#172337] overflow-x-clip">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cars" element={<Cars />} />
              <Route path="/bikes" element={<Bikes />} />
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <FloatingWhatsApp />
          <MobileContactBar />
          <BookingModal />
        </div>
      </BookingProvider>
    </BrowserRouter>
  );
}
