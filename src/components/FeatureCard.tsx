import React from 'react';
import { LucideIcon } from 'lucide-react';

const glowMap = {
  forecast: { from: '#ffe066', to: '#fffbe6' },
  pricing: { from: '#5eead4', to: '#e0fff9' },
  menu: { from: '#ffb347', to: '#fffbe6' },
  foodwaste: { from: '#6ee7b7', to: '#e0fff9' },
  marketing: { from: '#facc15', to: '#fffbe6' },
};

type GlowType = keyof typeof glowMap;

// Podporujeme aj custom SVG ikony aj Lucide ikony
type IconType = LucideIcon | (() => React.JSX.Element);

export default function FeatureCard({
  Icon, title, text, glow, altText
}: {
  Icon: IconType;
  title: string;
  text: string;
  glow: GlowType;
  altText?: string;
}) {
  const style = {
    '--glow-from': glowMap[glow].from,
    '--glow-to': glowMap[glow].to,
  } as React.CSSProperties;

  // Renderujeme ikonu podľa typu
  const renderIcon = () => {
    if (typeof Icon === 'function' && Icon.prototype?.isReactComponent === undefined) {
      // Custom SVG ikona
      return <Icon />;
    } else {
      // Lucide ikona
      return <Icon className="h-12 w-12" strokeWidth={2.2} />;
    }
  };

  return (
    <article
      className="group glass-card shadow-2xl p-10 min-w-[240px] min-h-[340px] flex flex-col items-center justify-center relative overflow-visible"
      data-glow={glow}
      style={style}
    >
      <div className="icon-outline-gradient mb-8">
        <span 
          className="icon-outline-inner flex items-center justify-center h-24 w-24 rounded-full bg-glass1/80 border-2 border-white/10 relative z-20"
          title={altText}
          role="img"
          aria-label={altText}
        >
          {renderIcon()}
        </span>
      </div>
      {/* Overlay for text readability on hover */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-1/2 z-10 opacity-0 group-hover:opacity-80 transition-opacity duration-200" style={{background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.45) 100%)'}} />
      <div className="relative z-20 flex flex-col items-center">
        <h3 className="text-white text-2xl font-bold mb-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] text-center group-hover:text-neutral-900 group-hover:drop-shadow-[0_2px_12px_rgba(255,255,255,0.7)] transition-colors duration-200">
          {title}
        </h3>
        <p className="text-slate-200 text-base max-w-[20ch] mx-auto text-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] group-hover:text-neutral-900 group-hover:drop-shadow-[0_2px_12px_rgba(255,255,255,0.7)] transition-colors duration-200">
          {text}
        </p>
      </div>
    </article>
  );
} 