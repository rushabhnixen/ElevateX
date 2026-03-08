import { useEffect, useRef, useState, useMemo } from 'react';

export function useIntersection(options = {}) {
  const ref = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const stableOptions = useMemo(() => ({ threshold: 0.6, ...options }), [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(options),
  ]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      stableOptions
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [stableOptions]);

  return { ref, isIntersecting };
}
