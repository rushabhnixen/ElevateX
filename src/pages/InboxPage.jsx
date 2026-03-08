import React, { useState } from 'react';
import { conversations, notifications } from '../lib/mockData';
import ConversationItem from '../components/inbox/ConversationItem';
import NotificationItem from '../components/inbox/NotificationItem';
import ChatView from '../components/inbox/ChatView';

export default function InboxPage() {
  const [tab, setTab] = useState('messages');
  const [activeConv, setActiveConv] = useState(null);

  if (activeConv) {
    return <ChatView conversation={activeConv} onBack={() => setActiveConv(null)} />;
  }

  return (
    <div className="h-dvh overflow-y-auto scrollbar-hide bg-background">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-4 pt-12 pb-3">
        <h1 className="text-2xl font-bold text-white mb-4">Inbox</h1>
        <div className="flex bg-surface rounded-xl p-1">
          {['messages', 'notifications'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                tab === t ? 'bg-accent text-white' : 'text-muted'
              }`}
            >
              {t}
              {t === 'notifications' && notifications.filter(n => !n.read).length > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 flex flex-col gap-1">
        {tab === 'messages' ? (
          conversations.map(conv => (
            <ConversationItem key={conv.id} conversation={conv} onClick={() => setActiveConv(conv)} />
          ))
        ) : (
          notifications.map(notif => (
            <NotificationItem key={notif.id} notification={notif} />
          ))
        )}
      </div>
    </div>
  );
}
