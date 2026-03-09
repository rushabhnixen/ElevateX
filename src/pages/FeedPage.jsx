import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Compass, PlusCircle } from 'lucide-react';
import { startupsAPI } from '../lib/api';
import VideoCard from '../components/feed/VideoCard';
import { useSwipeFeed } from '../hooks/useSwipeFeed';
import { useAuth } from '../context/AuthContext';

export default function FeedPage() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { role } = useAuth();

  const load = useCallback(async () => {
    try {
      const data = await startupsAPI.list({ status: 'approved', limit: 20 });
      setStartups(data.startups || []);
    } catch {
      setStartups([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const { current, handleTouchStart, handleTouchEnd } = useSwipeFeed(startups.length);

  if (loading) {
    return (
      <div className="h-full bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (startups.length === 0) {
    return (
      <div className="h-full bg-background flex flex-col items-center justify-center text-center px-8">
        <div className="text-6xl mb-4">🚀</div>
        <h2 className="text-xl font-bold text-white mb-2">No pitches yet</h2>
        <p className="text-muted text-sm mb-6">Be the first to discover amazing startups. Check back soon!</p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/explore')}
            className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-border rounded-xl text-white text-sm font-medium active:scale-95 transition-all"
          >
            <Compass size={16} className="text-accent" /> Explore
          </button>
          {role === 'founder' && (
            <button
              onClick={() => navigate('/upload')}
              className="flex items-center gap-2 px-5 py-2.5 bg-accent rounded-xl text-white text-sm font-medium active:scale-95 transition-all"
            >
              <PlusCircle size={16} /> Upload Pitch
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full h-full max-w-md lg:max-w-lg mx-auto">
        <motion.div
          className="flex flex-col h-full"
          animate={{ y: `-${current * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {startups.map((startup, idx) => (
            <VideoCard key={startup._id} startup={startup} isActive={idx === current} />
          ))}
        </motion.div>

        {startups.length > 1 && (
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
        )}
      </div>
    </div>
  );
}
