import React from 'react';
import { useCallback } from 'react';

const tools = ['Forecast','Menu Engineering','Smart Pricing','Foodwaste','Marketing','Pricing'];

export default function HeroSection() {
  const slides = useCallback(() => tools.map(t => (
    <li key={t} className="min-w-full px-6">
      <div className="rounded-xl bg-neutral-800/60 backdrop-blur p-8 text-center">
        <h3 className="font-display text-2xl text-mastroCyan-400 mb-2">{t}</h3>
        <p className="text-slate-300">AI-powered insight for better days.</p>
      </div>
    </li>
  )), []);

  return (
    <section className="relative isolate overflow-hidden py-24 md:py-32 text-center">
      {/* bg animated gradient + grain */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#0f172a] via-[#172136] to-[#101521] animate-pulse" />
      <div className="absolute inset-0 -z-10 bg-neutral-800/20" />

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
          Culinary Intelligence
        </h1>
        <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
          Menu, forecast & profit tools. All in one brain.
        </p>
        
        {/* Tools Carousel */}
        <div className="overflow-hidden">
          <ul className="flex gap-6 animate-scroll-infinite">
            {slides()}
          </ul>
        </div>
      </div>
    </section>
  );
} 