import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import Avatar from '../ui/Avatar';

const mockComments = [
  { id: '1', author: 'Sarah Johnson', text: 'Amazing product! The traction numbers are insane.', time: '2m' },
  { id: '2', author: 'Michael Chang', text: 'Would love to connect. Sent you a message!', time: '5m' },
  { id: '3', author: 'Lisa Park', text: 'The team background is impressive. Backed!', time: '12m' },
  { id: '4', author: 'David Kim', text: 'What markets are you targeting first?', time: '25m' },
  { id: '5', author: 'Emma Wilson', text: 'This solves a real problem. Great pitch!', time: '1h' },
];

export default function CommentsSheet({ open, onClose }) {
  const [comments, setComments] = useState(mockComments);
  const [input, setInput] = useState('');

  const addComment = () => {
    if (!input.trim()) return;
    setComments(c => [{ id: Date.now().toString(), author: 'You', text: input, time: 'now' }, ...c]);
    setInput('');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 bg-black/60 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
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
              <button onClick={onClose}><X size={20} className="text-muted" /></button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide p-4 flex flex-col gap-4">
              {comments.map(c => (
                <div key={c.id} className="flex gap-3">
                  <Avatar name={c.author} size="sm" />
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-white text-sm font-medium">{c.author}</span>
                      <span className="text-muted text-xs">{c.time}</span>
                    </div>
                    <p className="text-white/80 text-sm">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border flex gap-3">
              <input
                className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-white placeholder:text-muted focus:outline-none focus:border-accent text-sm"
                placeholder="Add a comment..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addComment()}
              />
              <button onClick={addComment} className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Send size={16} className="text-white" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
