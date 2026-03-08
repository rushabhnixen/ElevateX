import React from 'react';
import Avatar from '../ui/Avatar';
import { formatTime } from '../../lib/utils';

export default function ConversationItem({ conversation, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-xl active:bg-surface transition-colors text-left"
    >
      <div className="relative">
        <Avatar name={conversation.participant.name} size="md" />
        {conversation.unread > 0 && (
          <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
            <span className="text-white text-[9px] font-bold">{conversation.unread}</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-white font-semibold text-sm truncate">{conversation.participant.name}</p>
          <span className="text-muted text-xs flex-shrink-0">{formatTime(conversation.time)}</span>
        </div>
        <p className={`text-xs truncate mt-0.5 ${conversation.unread > 0 ? 'text-white font-medium' : 'text-muted'}`}>
          {conversation.lastMessage}
        </p>
      </div>
    </button>
  );
}
