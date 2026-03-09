import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { startupsAPI } from '../../lib/api';

export default function CommentsSheet({ open, onClose, startupId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (open && startupId) {
      setLoading(true);
      startupsAPI.getComments(startupId)
        .then(data => setComments(data || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [open, startupId]);

  const addComment = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const comment = await startupsAPI.addComment(startupId, input.trim());
      setComments(c => [comment, ...c]);
      setInput('');
    } catch {} finally { setSending(false); }
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `${days}d`;
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-3xl max-w-mobile mx-auto flex flex-col"
            style={{ height: '70vh' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-white">Comments</h3>
              <button onClick={onClose} aria-label="Close comments">
                <X size={20} className="text-muted" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide p-4 flex flex-col gap-4">
              {loading ? (
                <div className="flex justify-center py-10"><div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>
              ) : comments.length === 0 ? (
                <p className="text-center text-muted py-10 text-sm">No comments yet. Be the first!</p>
              ) : (
                comments.map(c => (
                  <div key={c._id} className="flex gap-3">
                    <Avatar name={c.user?.name || 'User'} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-white text-sm font-medium">{c.user?.name || 'User'}</span>
                        <span className="text-muted text-xs">{timeAgo(c.createdAt)}</span>
                      </div>
                      <p className="text-white/80 text-sm">{c.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-border flex gap-3">
              <input
                className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-white placeholder:text-muted focus:outline-none focus:border-accent text-sm"
                placeholder="Add a comment…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addComment()}
              />
              <button
                onClick={addComment}
                disabled={sending || !input.trim()}
                className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center active:scale-95 transition-all disabled:opacity-50"
              >
                <Send size={16} className="text-white" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

