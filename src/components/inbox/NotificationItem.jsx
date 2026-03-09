import React from 'react';
import { Eye, Heart, Zap, MessageCircle } from 'lucide-react';
import { formatTime } from '../../lib/utils';

const icons = {
  view: { icon: Eye, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  like: { icon: Heart, color: 'text-red-400', bg: 'bg-red-500/20' },
  match: { icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  comment: { icon: MessageCircle, color: 'text-green-400', bg: 'bg-green-500/20' },
};

export default function NotificationItem({ notification }) {
  const { icon: Icon, color, bg } = icons[notification.type] || icons.view;

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${notification.read ? '' : 'bg-surface'}`}>
      <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={18} className={color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${notification.read ? 'text-muted' : 'text-white font-medium'}`}>
          {notification.message}
        </p>
        <p className="text-muted text-xs mt-0.5">{formatTime(notification.time)}</p>
      </div>
      {!notification.read && <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-1.5" />}
    </div>
  );
}
