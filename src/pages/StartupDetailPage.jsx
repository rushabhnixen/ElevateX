import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { ArrowLeft, Heart, Bookmark, Share2, MessageCircle, Users, TrendingUp, DollarSign, CheckCircle, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import CommentsSheet from '../components/feed/CommentsSheet';
import { formatNumber } from '../lib/utils';
import { matchesAPI, startupsAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';

function StatItem({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-surface rounded-xl p-3 flex-1">
      <Icon size={16} className="text-accent" />
      <span className="text-white font-bold text-sm">{value}</span>
      <span className="text-muted text-xs">{label}</span>
    </div>
  );
}

export default function StartupDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connectError, setConnectError] = useState('');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectMessage, setConnectMessage] = useState('');
  const [commentsOpen, setCommentsOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await startupsAPI.get(id);
        setStartup(data);
        setLikes(data.likes || 0);
        if (user?._id) {
          setLiked(data.likedBy?.includes(user._id) || false);
          setBookmarked(data.bookmarkedBy?.includes(user._id) || false);
        }
      } catch {
        setError('Startup not found');
      } finally { setLoading(false); }
    };
    if (id) load();
  }, [id, user?._id]);

  const handleLike = async () => {
    try {
      const res = await startupsAPI.like(id);
      setLiked(res.liked);
      setLikes(res.likes);
    } catch {}
  };

  const handleBookmark = async () => {
    try {
      const res = await startupsAPI.bookmark(id);
      setBookmarked(res.bookmarked);
    } catch {}
  };

  const handleShare = () => {
    const shareData = {
      title: startup?.name || '',
      text: `${startup?.tagline} — ${startup?.stage}`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  };

  const handleConnect = () => {
    if (!user) return;
    if (role !== 'investor') {
      setConnectError('Only investors can send connection requests.');
      return;
    }
    setShowConnectModal(true);
  };

  const submitConnect = async () => {
    setConnecting(true);
    setConnectError('');
    try {
      await matchesAPI.create({
        founderId: startup.founder?.userId,
        startupId: startup._id,
        message: connectMessage,
      });
      setConnected(true);
      setShowConnectModal(false);
    } catch (err) {
      const msg = err?.response?.data?.error || '';
      if (msg.includes('already exists')) {
        setConnected(true);
        setShowConnectModal(false);
      } else {
        setConnectError(msg || 'Failed to send request.');
      }
    } finally { setConnecting(false); }
  };

  if (loading) {
    return (
      <div className="h-full bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="h-full bg-background flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-muted text-lg">{error || 'Not found'}</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-hide bg-background">
      {/* Video hero */}
      <div className="relative w-full aspect-video bg-black">
        {startup.videoUrl ? (
          <ReactPlayer url={startup.videoUrl} width="100%" height="100%" controls playsinline />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/30 to-purple-600/30 flex items-center justify-center">
            <span className="text-white/30 text-6xl font-black">{startup.name?.[0]}</span>
          </div>
        )}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
      </div>

      <div className="px-4 lg:px-6 py-4 flex flex-col gap-5 max-w-3xl mx-auto">
        {/* Title + actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{startup.name}</h1>
            <p className="text-muted text-sm mt-1">{startup.tagline}</p>
            <div className="flex gap-2 mt-2">
              <Badge label={startup.industry} />
              <Badge label={startup.stage} />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleLike}>
              <Heart size={22} fill={liked ? '#ef4444' : 'transparent'} className={liked ? 'text-red-500' : 'text-muted'} />
            </button>
            <button onClick={handleBookmark}>
              <Bookmark size={22} fill={bookmarked ? '#6366f1' : 'transparent'} className={bookmarked ? 'text-accent' : 'text-muted'} />
            </button>
            <button onClick={handleShare}>
              <Share2 size={22} className="text-muted" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-2">
          <StatItem icon={DollarSign} label="Raising" value={`$${startup.askAmount || '—'}`} />
          <StatItem icon={TrendingUp} label="Equity" value={startup.equity || '—'} />
          <StatItem icon={Users} label="Traction" value={startup.traction || '—'} />
        </div>

        {/* Engagement */}
        <div className="flex gap-4 py-3 border-y border-border">
          <span className="text-muted text-sm flex items-center gap-1.5"><Heart size={14} /> {formatNumber(likes)} likes</span>
          <button onClick={() => setCommentsOpen(true)} className="text-muted text-sm flex items-center gap-1.5">
            <MessageCircle size={14} /> Comments
          </button>
          <span className="text-muted text-sm flex items-center gap-1.5"><Eye size={14} /> {formatNumber(startup.views || 0)} views</span>
        </div>

        {/* About */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">About</h2>
          <p className="text-muted text-sm leading-relaxed">{startup.description}</p>
        </div>

        {/* Metrics */}
        {startup.metrics && (startup.metrics.revenue || startup.metrics.users || startup.metrics.growth) && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Key Metrics</h2>
            <div className="flex gap-2">
              {startup.metrics.revenue && <StatItem icon={DollarSign} label="Revenue" value={startup.metrics.revenue} />}
              {startup.metrics.users && <StatItem icon={Users} label="Users" value={startup.metrics.users} />}
              {startup.metrics.growth && <StatItem icon={TrendingUp} label="Growth" value={startup.metrics.growth} />}
            </div>
          </div>
        )}

        {/* Founder */}
        {startup.founder && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Founder</h2>
            <div className="flex items-center gap-3 bg-surface rounded-xl p-4">
              <Avatar name={startup.founder.name} size="lg" />
              <div>
                <p className="text-white font-semibold">{startup.founder.name}</p>
                {startup.founder.title && <p className="text-accent text-xs">{startup.founder.title}</p>}
                {startup.founder.bio && <p className="text-muted text-xs mt-1">{startup.founder.bio}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Team */}
        {startup.team?.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Team</h2>
            <div className="flex gap-3 flex-wrap">
              {startup.team.map((member, i) => (
                <div key={i} className="flex items-center gap-2 bg-surface rounded-xl px-3 py-2">
                  <Avatar name={member.name} size="sm" />
                  <div>
                    <p className="text-white text-xs font-medium">{member.name}</p>
                    <p className="text-muted text-xs">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {connectError && !showConnectModal && (
          <p className="text-red-400 text-sm bg-red-500/10 rounded-xl px-4 py-2">{connectError}</p>
        )}

        {/* CTA - only for investors viewing someone else's startup */}
        {role === 'investor' && startup.founder?.userId !== user?._id && (
          <div className="flex gap-3 pt-2 pb-4">
            <Button size="lg" className="flex-1" onClick={handleConnect} disabled={connected || connecting}>
              {connected ? (
                <span className="flex items-center gap-2"><CheckCircle size={16} /> Request Sent</span>
              ) : connecting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…
                </span>
              ) : '💼 Connect & Invest'}
            </Button>
          </div>
        )}
      </div>

      {/* Comments Sheet */}
      <CommentsSheet open={commentsOpen} onClose={() => setCommentsOpen(false)} startupId={id} />

      {/* Connect modal */}
      <AnimatePresence>
        {showConnectModal && (
          <>
            <motion.div className="fixed inset-0 bg-black/60 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConnectModal(false)} />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-3xl max-w-mobile mx-auto p-6 flex flex-col gap-4"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <h3 className="text-white font-semibold text-lg">Connect with {startup.founder?.name}</h3>
              <p className="text-muted text-sm">Send an optional intro message with your request.</p>
              <textarea
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-accent resize-none text-sm"
                rows={3} placeholder="Hi, I'm interested in your pitch…"
                value={connectMessage} onChange={e => setConnectMessage(e.target.value)}
              />
              {connectError && <p className="text-red-400 text-sm">{connectError}</p>}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowConnectModal(false)}>Cancel</Button>
                <Button className="flex-1" onClick={submitConnect} disabled={connecting}>
                  {connecting ? 'Sending…' : 'Send Request'}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

