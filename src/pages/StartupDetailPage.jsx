import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { ArrowLeft, Heart, Bookmark, Share2, MessageCircle, Users, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { startups } from '../lib/mockData';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import { formatNumber } from '../lib/utils';

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
  const startup = startups.find(s => s.id === id) || startups[0];
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="h-dvh overflow-y-auto scrollbar-hide bg-background">
      {/* Video hero */}
      <div className="relative w-full aspect-video bg-black">
        <ReactPlayer url={startup.videoUrl} width="100%" height="100%" controls playsinline />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
      </div>

      <div className="px-4 py-4 flex flex-col gap-5">
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
            <button onClick={() => setLiked(l => !l)}>
              <Heart size={22} fill={liked ? '#ef4444' : 'transparent'} className={liked ? 'text-red-500' : 'text-muted'} />
            </button>
            <button onClick={() => setBookmarked(b => !b)}>
              <Bookmark size={22} fill={bookmarked ? '#6366f1' : 'transparent'} className={bookmarked ? 'text-accent' : 'text-muted'} />
            </button>
            <button><Share2 size={22} className="text-muted" /></button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-2">
          <StatItem icon={DollarSign} label="Raising" value={`$${startup.askAmount}`} />
          <StatItem icon={TrendingUp} label="Equity" value={startup.equity} />
          <StatItem icon={Users} label="Traction" value={startup.traction} />
        </div>

        {/* Engagement */}
        <div className="flex gap-4 py-3 border-y border-border">
          <span className="text-muted text-sm flex items-center gap-1.5"><Heart size={14} /> {formatNumber(startup.likes)} likes</span>
          <span className="text-muted text-sm flex items-center gap-1.5"><MessageCircle size={14} /> {formatNumber(startup.comments)} comments</span>
          <span className="text-muted text-sm flex items-center gap-1.5"><Bookmark size={14} /> {formatNumber(startup.bookmarks)} saves</span>
        </div>

        {/* About */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">About</h2>
          <p className="text-muted text-sm leading-relaxed">{startup.description}</p>
        </div>

        {/* Founder */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Founder</h2>
          <div className="flex items-center gap-3 bg-surface rounded-xl p-4">
            <Avatar name={startup.founder.name} size="lg" />
            <div>
              <p className="text-white font-semibold">{startup.founder.name}</p>
              <p className="text-accent text-xs">{startup.founder.title}</p>
              <p className="text-muted text-xs mt-1">{startup.founder.bio}</p>
            </div>
          </div>
        </div>

        {/* Team */}
        {startup.team.length > 1 && (
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

        {/* CTA */}
        <div className="flex gap-3 pt-2">
          <Button size="lg" className="flex-1">
            💼 Connect &amp; Invest
          </Button>
          <Button variant="outline" size="lg" className="flex-1">
            <MessageCircle size={16} className="inline mr-2" />
            Message
          </Button>
        </div>
      </div>
    </div>
  );
}
