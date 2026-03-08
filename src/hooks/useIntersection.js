import { useEffect, useRef, useState } from 'react';

export function useIntersection({ threshold = 0.6, root = null, rootMargin = '0px' } = {}) {
  const ref = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold, root, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, root, rootMargin]);

  return { ref, isIntersecting };
}
