import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Badge from '../ui/Badge';
import { formatNumber } from '../../lib/utils';

const gradients = {
  FinTech: 'from-blue-600 to-indigo-600',
  CleanTech: 'from-green-600 to-emerald-600',
  EdTech: 'from-yellow-500 to-orange-500',
  HealthTech: 'from-pink-500 to-rose-500',
  SaaS: 'from-purple-500 to-violet-600',
  DeepTech: 'from-red-500 to-orange-600',
  'AI/ML': 'from-cyan-500 to-blue-600',
  Web3: 'from-amber-500 to-orange-600',
  BioTech: 'from-teal-500 to-green-600',
};

export default function StartupCard({ startup, compact }) {
  const navigate = useNavigate();
  const gradient = gradients[startup.industry] || 'from-gray-600 to-gray-700';

  return (
    <button
      onClick={() => navigate(`/startup/${startup._id || startup.id}`)}
      className={`w-full bg-surface rounded-2xl overflow-hidden border border-border active:scale-95 transition-all text-left ${compact ? 'h-36' : ''}`}
    >
      <div className={`w-full ${compact ? 'h-20' : 'h-28'} bg-gradient-to-br ${gradient} relative flex items-center justify-center`}>
        <span className="text-white/20 font-black text-4xl">{startup.name[0]}</span>
        <div className="absolute top-2 left-2">
          <Badge label={startup.industry} />
        </div>
        <div className="absolute top-2 right-2 bg-black/40 rounded-full px-2 py-0.5 flex items-center gap-1">
          <Heart size={10} className="text-red-400" fill="#f87171" />
          <span className="text-white text-[10px]">{formatNumber(startup.likes || 0)}</span>
        </div>
      </div>
      <div className="p-2.5">
        <p className="text-white font-semibold text-xs truncate">{startup.name}</p>
        {!compact && <p className="text-muted text-[10px] truncate mt-0.5">{startup.tagline}</p>}
        <div className="flex items-center justify-between mt-1.5">
          <Badge label={startup.stage} />
          <span className="text-accent text-[10px] font-semibold">${startup.askAmount}</span>
        </div>
      </div>
    </button>
  );
}
