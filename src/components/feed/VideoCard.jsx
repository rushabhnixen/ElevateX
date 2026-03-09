import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import CommentsSheet from './CommentsSheet';
import { formatNumber } from '../../lib/utils';
import { startupsAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function VideoCard({ startup, isActive }) {
  const { user } = useAuth();
  const sid = startup._id || startup.id;
  const [liked, setLiked] = useState(user?._id && startup.likedBy?.includes(user._id));
  const [bookmarked, setBookmarked] = useState(user?._id && startup.bookmarkedBy?.includes(user._id));
  const [likes, setLikes] = useState(startup.likes || 0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showMuteHint, setShowMuteHint] = useState(false);
  const [following, setFollowing] = useState(false);

  const handleTap = () => {
    setMuted(m => !m);
    setShowMuteHint(true);
    setTimeout(() => setShowMuteHint(false), 800);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const res = await startupsAPI.like(sid);
      setLiked(res.liked);
      setLikes(res.likes);
    } catch {}
  };

  const handleBookmark = async (e) => {
    e.stopPropagation();
    try {
      const res = await startupsAPI.bookmark(sid);
      setBookmarked(res.bookmarked);
    } catch {}
  };

  const handleFollow = (e) => {
    e.stopPropagation();
    if (startup.founder?.userId && user?._id) {
      usersAPI.follow(startup.founder.userId).catch(() => {});
    }
    setFollowing(f => !f);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const shareData = {
      title: startup.name,
      text: startup.tagline,
      url: `${window.location.origin}/startup/${sid}`,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareData.url).catch(() => {});
    }
  };

  return (
    <div className="relative w-full h-full bg-black flex-shrink-0 overflow-hidden">
      <div className="absolute inset-0" onClick={handleTap}>
        <ReactPlayer
          url={startup.videoUrl}
          playing={isActive}
          loop
          muted={muted}
          width="100%"
          height="100%"
          style={{ objectFit: 'cover' }}
          playsinline
          config={{ file: { attributes: { style: { width: '100%', height: '100%', objectFit: 'cover' } } } }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

      <div className="absolute top-12 left-4 flex gap-2 z-10">
        <Badge label={startup.industry} />
        <Badge label={startup.stage} />
      </div>

      <div className="absolute right-4 bottom-40 flex flex-col gap-5 items-center z-10">
        <button onClick={handleLike} className="flex flex-col items-center gap-1">
          <motion.div whileTap={{ scale: 1.4 }}>
            <Heart size={28} fill={liked ? '#ef4444' : 'transparent'} className={liked ? 'text-red-500' : 'text-white'} strokeWidth={2} />
          </motion.div>
          <span className="text-white text-xs font-medium">{formatNumber(likes)}</span>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); setCommentsOpen(true); }}
          className="flex flex-col items-center gap-1"
        >
          <MessageCircle size={28} className="text-white" strokeWidth={2} />
          <span className="text-white text-xs font-medium">Chat</span>
        </button>

        <button onClick={handleBookmark} className="flex flex-col items-center gap-1">
          <motion.div whileTap={{ scale: 1.3 }}>
            <Bookmark size={28} fill={bookmarked ? '#6366f1' : 'transparent'} className={bookmarked ? 'text-accent' : 'text-white'} strokeWidth={2} />
          </motion.div>
          <span className="text-white text-xs font-medium">Save</span>
        </button>

        <button onClick={handleShare} className="flex flex-col items-center gap-1">
          <Share2 size={26} className="text-white" strokeWidth={2} />
          <span className="text-white text-xs font-medium">Share</span>
        </button>
      </div>

      <div className="absolute bottom-20 left-4 right-20 flex flex-col gap-2 z-10">
        <div className="flex items-center gap-3">
          <Avatar name={startup.founder.name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-base leading-tight truncate">{startup.name}</p>
            <p className="text-white/70 text-xs">{startup.founder.name}</p>
          </div>
          <button
            onClick={handleFollow}
            className={`border text-xs px-3 py-1 rounded-full flex-shrink-0 transition-colors ${
              following
                ? 'border-accent bg-accent/20 text-accent'
                : 'border-white/50 text-white'
            }`}
          >
            {following ? 'Following' : 'Follow'}
          </button>
        </div>

        <p className="text-white font-semibold text-sm">{startup.tagline}</p>

        <div className="flex items-center gap-3 text-white/80 text-xs flex-wrap">
          <span>💰 ${startup.askAmount}</span>
          <span>📈 {startup.equity} equity</span>
          <span>📊 {startup.traction}</span>
        </div>

        {showMore && (
          <p className="text-white/70 text-xs leading-relaxed">{startup.description}</p>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); setShowMore(s => !s); }}
          className="text-white/60 text-xs text-left"
        >
          {showMore ? 'less ▲' : 'more ▼'}
        </button>
      </div>

      {showMuteHint && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
        >
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.8 }}
            className="bg-black/50 rounded-full p-4"
          >
            <span className="text-white text-2xl" aria-hidden="true">{muted ? '🔇' : '🔊'}</span>
          </motion.div>
          <span className="sr-only">{muted ? 'Video muted' : 'Video unmuted'}</span>
        </div>
      )}

      <CommentsSheet
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        startupId={sid}
      />
    </div>
  );
}

