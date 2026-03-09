import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, MessageCircle, Bell, Check, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { matchesAPI, notificationsAPI } from '../lib/api';
import ChatView from '../components/inbox/ChatView';
import { formatTime } from '../lib/utils';

export default function InboxPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('messages');
  const [matches, setMatches] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeMatch, setActiveMatch] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [matchData, notifData] = await Promise.all([
        matchesAPI.list({ status: 'matched' }),
        notificationsAPI.list(),
      ]);
      setMatches(matchData || []);
      setNotifications(notifData.notifications || []);
      setUnreadCount(notifData.unreadCount || 0);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAccept = async (matchId) => {
    try {
      await matchesAPI.update(matchId, 'matched');
      loadData();
    } catch {}
  };

  const handleReject = async (matchId) => {
    try {
      await matchesAPI.update(matchId, 'rejected');
      loadData();
    } catch {}
  };

  const markAllRead = async () => {
    await notificationsAPI.readAll();
    setNotifications(n => n.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  if (activeMatch) {
    const other = activeMatch.founder?._id === user._id ? activeMatch.investor : activeMatch.founder;
    return (
      <ChatView
        roomId={activeMatch.roomId}
        otherUser={other}
        startup={activeMatch.startup}
        onBack={() => { setActiveMatch(null); loadData(); }}
      />
    );
  }

  // Also load pending match requests for founders
  const [pendingMatches, setPendingMatches] = useState([]);
  useEffect(() => {
    matchesAPI.list({ status: 'pending' }).then(d => setPendingMatches(d || [])).catch(() => {});
  }, []);

  const incomingRequests = pendingMatches.filter(m => m.founder?._id === user._id);

  return (
    <div className="h-full overflow-y-auto scrollbar-hide bg-background pb-20">
      <div className="sticky top-0 bg-background/95 backdrop-blur-lg z-10 px-4 lg:px-6 pt-12 lg:pt-6 pb-3 border-b border-border/50">
        <h1 className="text-2xl font-bold text-white mb-4">Inbox</h1>
        <div className="flex bg-surface rounded-xl p-1">
          {['messages', 'requests', 'notifications'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                tab === t ? 'bg-accent text-white shadow-sm' : 'text-muted'
              }`}
            >
              {t}
              {t === 'requests' && incomingRequests.length > 0 && (
                <span className="ml-1 bg-orange-500 text-white text-[10px] rounded-full px-1.5 py-0.5">{incomingRequests.length}</span>
              )}
              {t === 'notifications' && unreadCount > 0 && (
                <span className="ml-1 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-accent animate-spin" /></div>
      ) : (
        <div className="px-4 pt-2">
          {tab === 'messages' && (
            matches.length === 0 ? (
              <div className="text-center py-20 text-muted">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No conversations yet</p>
                <p className="text-sm mt-1">Connect with founders or investors to start chatting</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {matches.map(m => {
                  const other = m.founder?._id === user._id ? m.investor : m.founder;
                  return (
                    <button
                      key={m._id}
                      onClick={() => setActiveMatch(m)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface/80 transition-colors text-left w-full"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {other?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white text-sm truncate">{other?.name}</span>
                          <span className="text-[10px] text-muted flex-shrink-0">{formatTime(m.updatedAt)}</span>
                        </div>
                        <p className="text-xs text-muted truncate mt-0.5">
                          {m.startup?.name && <span className="text-accent/80">{m.startup.name}</span>}
                          {m.startup?.name && ' · '}
                          {m.message || 'Start chatting...'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )
          )}

          {tab === 'requests' && (
            incomingRequests.length === 0 ? (
              <div className="text-center py-20 text-muted">
                <Check className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No pending requests</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                {incomingRequests.map(m => (
                  <div key={m._id} className="bg-surface rounded-2xl p-4 border border-border/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold">
                        {m.investor?.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white text-sm">{m.investor?.name}</p>
                        <p className="text-xs text-muted">{m.investor?.role} · {formatTime(m.createdAt)}</p>
                      </div>
                    </div>
                    {m.startup && (
                      <p className="text-xs text-accent mb-2">Interested in: {m.startup.name}</p>
                    )}
                    {m.message && (
                      <p className="text-sm text-zinc-300 mb-3 bg-background/50 rounded-lg p-2.5 italic">"{m.message}"</p>
                    )}
                    <div className="flex gap-2">
                      <button onClick={() => handleAccept(m._id)} className="flex-1 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold hover:bg-green-500/30 transition-colors">Accept</button>
                      <button onClick={() => handleReject(m._id)} className="flex-1 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-500/20 transition-colors">Decline</button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {tab === 'notifications' && (
            <>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-accent font-medium mb-3 flex items-center gap-1">
                  <CheckCheck size={14} /> Mark all read
                </button>
              )}
              {notifications.length === 0 ? (
                <div className="text-center py-20 text-muted">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No notifications</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {notifications.map(n => (
                    <div
                      key={n._id}
                      className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${!n.read ? 'bg-accent/5' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        n.type.includes('match') ? 'bg-green-500/20 text-green-400' :
                        n.type === 'like' ? 'bg-red-500/20 text-red-400' :
                        n.type === 'comment' ? 'bg-blue-500/20 text-blue-400' :
                        n.type.includes('startup') ? 'bg-purple-500/20 text-purple-400' :
                        'bg-accent/20 text-accent'
                      }`}>
                        <Bell size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white">
                          {n.from?.name && <span className="font-semibold">{n.from.name} </span>}
                          <span className="text-zinc-400">{n.message}</span>
                        </p>
                        <p className="text-[10px] text-muted mt-0.5">{formatTime(n.createdAt)}</p>
                      </div>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

