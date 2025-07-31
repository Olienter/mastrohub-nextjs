import { useEffect, useCallback } from 'react';

export function useInfiniteScroll(callback: () => void, deps: any[] = []) {
  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
      callback();
    }
  }, [callback]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, ...deps]);
} 