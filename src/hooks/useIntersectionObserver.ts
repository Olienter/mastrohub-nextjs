import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  root?: Element | null;
}

export function useIntersectionObserver(options: UseIntersectionObserverOptions = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef<HTMLElement>(null);

  const callback = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setIsIntersecting(entry.isIntersecting);
    if (entry.isIntersecting && !hasIntersected) {
      setHasIntersected(true);
    }
  }, [hasIntersected]);

  useEffect(() => {
    const observer = new IntersectionObserver(callback, {
      threshold: options.threshold || 0,
      rootMargin: options.rootMargin || '0px',
      root: options.root || null,
    });

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => observer.disconnect();
  }, [callback, options.threshold, options.rootMargin, options.root]);

  return { targetRef, isIntersecting, hasIntersected };
} 