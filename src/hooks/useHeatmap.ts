import { useEffect } from 'react';

export function useHeatmap() {
  useEffect(() => {
    const trackMouseMovement = (e: MouseEvent) => {
      // Track mouse movements for heatmap
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'mouse_movement', {
          event_category: 'user_behavior',
          event_label: `${e.pageX},${e.pageY}`,
          value: 1
        });
      }
    };

    document.addEventListener('mousemove', trackMouseMovement);
    return () => document.removeEventListener('mousemove', trackMouseMovement);
  }, []);
} 