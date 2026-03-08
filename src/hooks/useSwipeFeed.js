import { useState, useRef, useCallback } from 'react';

export function useSwipeFeed(total) {
  const [current, setCurrent] = useState(0);
  const startY = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = useCallback((e) => {
    startY.current = e.touches[0].clientY;
    isDragging.current = true;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!isDragging.current) return;
    const diff = startY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && current < total - 1) setCurrent(c => c + 1);
      if (diff < 0 && current > 0) setCurrent(c => c - 1);
    }
    isDragging.current = false;
  }, [current, total]);

  const goTo = useCallback((idx) => {
    if (idx >= 0 && idx < total) setCurrent(idx);
  }, [total]);

  return { current, handleTouchStart, handleTouchEnd, goTo };
}
