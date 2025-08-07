'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { UtensilsCrossed, TrendingUp, Building2, Megaphone, Users, ArrowRight, CheckCircle } from 'lucide-react';

interface HorizontalToolsProps {
  onToolClick?: (toolId: string, path: string) => void;
}

const HorizontalTools: React.FC<HorizontalToolsProps> = ({ onToolClick }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tools = [
    {
      id: 'menu-maker',
      title: 'Menu Maker',
      description: 'AI-powered menu engineering to optimize your menu for maximum profitability. Analyze dish performance and create seasonal menus.',
      icon: <UtensilsCrossed size={32} strokeWidth={2} />,
      path: '/menu-maker',
      color: 'from-orange-400 to-yellow-400',
      features: ['Menu optimization', 'Seasonal planning', 'Cost analysis', 'Menu testing'],
      stats: 'Professional'
    },
    {
      id: 'forecast-planner',
      title: 'Forecast Planner',
      description: 'Predict demand with AI to reduce waste and optimize inventory management with smart forecasting algorithms.',
      icon: <TrendingUp size={32} strokeWidth={2} />,
      path: '/forecast-planner',
      color: 'from-blue-400 to-cyan-400',
      features: ['Demand prediction', 'Inventory optimization', 'Waste reduction', 'Smart ordering'],
      stats: 'Professional'
    },
    {
      id: 'restaurant-curator',
      title: 'Restaurant Curator',
      description: 'Complete restaurant management platform. Manage operations, staff, customer data, and business analytics in one unified dashboard.',
      icon: <Building2 size={32} strokeWidth={2} />,
      path: '/restaurant-curator',
      color: 'from-purple-400 to-pink-400',
      features: ['Operations management', 'Staff scheduling', 'Customer insights', 'Business analytics'],
      stats: 'Professional'
    },
    {
      id: 'marketing-assistant',
      title: 'Marketing Assistant',
      description: 'Grow your customer base with AI-driven marketing campaigns. Automated social media, email marketing, and customer retention strategies.',
      icon: <Megaphone size={32} strokeWidth={2} />,
      path: '/marketing-assistant',
      color: 'from-green-400 to-emerald-400',
      features: ['Social media automation', 'Email campaigns', 'Customer retention', 'Growth analytics'],
      stats: 'Professional'
    },
    {
      id: 'guest-manager',
      title: 'Guest Manager',
      description: 'Enhance guest experience with smart reservation management, customer feedback analysis, and personalized service recommendations.',
      icon: <Users size={32} strokeWidth={2} />,
              path: '/restaurant-curator',
      color: 'from-indigo-400 to-purple-400',
      features: ['Reservation management', 'Customer feedback', 'Personalized service', 'Guest analytics'],
      stats: 'Professional'
    }
  ];

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e: WheelEvent) => {
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

  const handleToolClick = async (toolId: string, path: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call parent handler if provided
      if (onToolClick) {
        onToolClick(toolId, path);
      } else {
        // Fallback to direct navigation
        window.location.href = path;
      }
    } catch (error) {
      console.error('Tool navigation error:', error);
      setError('Failed to navigate to tool. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Our Tools (Free)
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Complete set of tools for modern gastro business. Everything completely free.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Tools Grid */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="flex-shrink-0 w-80 bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-gray-300"
            onMouseEnter={() => setHoveredTool(tool.id)}
            onMouseLeave={() => setHoveredTool(null)}
          >
            {/* Tool Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center`}>
                  <div className="text-white">
                    {tool.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{tool.title}</h3>
                  <p className="text-sm text-green-600 font-medium">{tool.stats}</p>
                </div>
              </div>
            </div>

            {/* Tool Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              {tool.description}
            </p>

            {/* Features List */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Key features:</h4>
              <ul className="space-y-2">
                {tool.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Try Button */}
            <button
              onClick={() => handleToolClick(tool.id, tool.path)}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              aria-label={`Try ${tool.title}`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-label="Loading"></div>
                  Loading...
                </>
              ) : (
                <>
                  Try {tool.title}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-12">
        <div className="bg-blue-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            All tools are free
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            No hidden fees, no commitments. All our tools are completely free 
            and available to every gastro professional.
          </p>
          <Link href="/register">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Start using for free
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HorizontalTools; 