'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { UtensilsCrossed, TrendingUp, Building2, Megaphone, Users } from 'lucide-react';

const HorizontalTools = () => {
  const scrollContainerRef = useRef(null);

  const tools = [
    {
      id: 'menu-maker',
      title: 'Menu Maker',
      description: 'Create & optimize your menu for maximum profit.',
      icon: <UtensilsCrossed size={32} strokeWidth={2} />,
      path: '/menu-maker',
      color: 'from-orange-400 to-yellow-400'
    },
    {
      id: 'forecast-planner',
      title: 'Forecast Planner',
      description: 'Predict demand & plan inventory smartly.',
      icon: <TrendingUp size={32} strokeWidth={2} />,
      path: '/forecast-planner',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      id: 'restaurant-curator',
      title: 'Restaurant Curator',
      description: 'Manage your restaurant profile & operations.',
      icon: <Building2 size={32} strokeWidth={2} />,
      path: '/restaurant-curator',
      color: 'from-purple-400 to-pink-400'
    },
    {
      id: 'marketing-assistant',
      title: 'Marketing Assistant',
      description: 'Grow your customer base with smart campaigns.',
      icon: <Megaphone size={32} strokeWidth={2} />,
      path: '/marketing-assistant',
      color: 'from-green-400 to-emerald-400'
    },
    {
      id: 'guest-manager',
      title: 'Guest Manager',
      description: 'Manage guest experience & reservations.',
      icon: <Users size={32} strokeWidth={2} />,
              path: '/restaurant-curator',
      color: 'from-indigo-400 to-purple-400'
    }
  ];

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e) => {
      const rect = scrollContainer.getBoundingClientRect();
      const isInCardArea = e.clientY >= rect.top && e.clientY <= rect.bottom;
      
      if (!isInCardArea) {
        return;
      }

      e.preventDefault();
      
      const scrollSpeed = 3.0;
      scrollContainer.scrollLeft += e.deltaY * scrollSpeed;
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <section className="py-16 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Our Tools</h2>
          <p className="text-xl text-white/70 drop-shadow-lg">Everything you need to run a successful restaurant</p>
        </div>
        
        <div 
          ref={scrollContainerRef}
          className="flex gap-8 overflow-x-auto scrollbar-none pb-4"
          style={{ 
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {tools.map((tool) => (
            <Link 
              key={tool.id} 
              to={tool.path}
              className="group flex-shrink-0 w-80"
            >
              <div className="rounded-2xl p-8 h-full transition-all duration-300 hover:bg-white/5 hover:scale-105 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-400/30 cursor-pointer border border-white/10">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${tool.color} border border-white/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                  <div className="text-white group-hover:scale-110 transition-transform duration-300">
                    {tool.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3 transition-colors duration-300 drop-shadow-lg">
                  {tool.title}
                </h3>
                
                <p className="text-white/80 group-hover:text-white transition-colors duration-300 drop-shadow-lg">
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HorizontalTools; 