import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { startups } from '../lib/mockData';
import VideoCard from '../components/feed/VideoCard';
import { useSwipeFeed } from '../hooks/useSwipeFeed';

export default function FeedPage() {
  const { current, handleTouchStart, handleTouchEnd } = useSwipeFeed(startups.length);
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-dvh overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        className="flex flex-col"
        animate={{ y: `-${current * 100}dvh` }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {startups.map((startup, idx) => (
          <VideoCard key={startup.id} startup={startup} isActive={idx === current} />
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-10">
        {startups.map((_, i) => (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-300 ${
              i === current ? 'h-6 bg-white' : 'h-1.5 bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
