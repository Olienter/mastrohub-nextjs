'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const tools = [
  {
    id: 'menu-engineering',
    title: 'Menu Engineering',
    description: 'Design dishes that delight &\nprofit.',
    icon: '🍽️',
    color: 'from-purple-400 to-purple-600',
    href: '/menu-maker'
  },
  {
    id: 'smart-pricing',
    title: 'Smart Pricing',
    description: 'Price each plate, maximise\nmargin.',
    icon: '💰',
    color: 'from-blue-400 to-blue-600',
    href: '/forecast-planner'
  },
  {
    id: 'foodwaste',
    title: 'Foodwaste',
    description: 'Track waste, save money.',
    icon: '♻️',
    color: 'from-green-400 to-green-600',
    href: '/restaurant-curator'
  },
  {
    id: 'marketing',
    title: 'Marketing',
    description: 'Grow your customer base',
    icon: '🚀',
    color: 'from-cyan-400 to-cyan-600',
    href: '/marketing-assistant'
  }
];

export default function OurTools() {
  return (
    <section className="relative py-20">
      <div className="max-w-6xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Tools
          </h2>
          <p className="text-xl text-white/80">
            Everything you need to run a successful restaurant
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group cursor-pointer"
            >
              <Link href={tool.href}>
                <div className="text-center p-6 rounded-2xl bg-neutral-800/40 backdrop-blur border border-white/10 hover:border-white/20 transition-all duration-300">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl`}>
                    {tool.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">
                    {tool.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 