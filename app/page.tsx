'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import BrowserMockup from '@/components/BrowserMockup';
import FloatingShapes from '@/components/FloatingShapes';

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <FloatingShapes />
      <Navigation />
      <HeroSection />
      <div id="dashboard" className="relative z-10 flex justify-center px-4 py-20 scroll-mt-28">
        <BrowserMockup />
      </div>
    </main>
  );
}
