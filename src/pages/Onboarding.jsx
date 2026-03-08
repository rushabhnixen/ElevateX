import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  { emoji: '🚀', title: 'Discover Startups', desc: 'Find the next unicorn before anyone else. Browse hundreds of startup pitches curated just for you.' },
  { emoji: '🎬', title: 'Video Pitches', desc: 'Watch 60-second video pitches from founders. Get the full story in the time it takes to make coffee.' },
  { emoji: '💼', title: 'Connect & Invest', desc: 'Message founders directly, schedule calls, and make investment decisions all in one place.' },
  { emoji: '✨', title: 'Join the Future', desc: 'Be part of the ecosystem shaping tomorrow. Join thousands of investors and founders on ElevateX.' },
];

export default function Onboarding({ onComplete }) {
  const [current, setCurrent] = useState(0);
  const isLast = current === slides.length - 1;

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-between px-6 py-12 max-w-mobile mx-auto">
      <button onClick={onComplete} className="self-end text-muted text-sm font-medium">Skip</button>

      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center gap-6"
          >
            <div className="w-28 h-28 rounded-3xl bg-surface flex items-center justify-center text-6xl shadow-lg">
              {slides[current].emoji}
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-bold text-white">{slides[current].title}</h1>
              <p className="text-muted text-base leading-relaxed max-w-xs">{slides[current].desc}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center gap-6 w-full">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${i === current ? 'w-6 bg-accent' : 'w-2 bg-border'}`}
            />
          ))}
        </div>

        {isLast ? (
          <button
            onClick={onComplete}
            className="w-full py-4 rounded-2xl bg-accent hover:bg-accent-hover text-white font-semibold text-lg transition-all active:scale-95"
          >
            Get Started 🎉
          </button>
        ) : (
          <button
            onClick={() => setCurrent(c => c + 1)}
            className="w-full py-4 rounded-2xl bg-surface border border-border text-white font-semibold text-lg transition-all active:scale-95"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
