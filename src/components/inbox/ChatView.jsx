import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Send, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatTime } from '../../lib/utils';
import { messagesAPI } from '../../lib/api';
import { useSocketContext } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';

export default function ChatView({ roomId, otherUser, startup, onBack }) {
  const { user } = useAuth();
  const { socketRef } = useSocketContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    if (!roomId) return;
    setLoading(true);
    messagesAPI
      .list(roomId)
      .then((msgs) => {
        setMessages(
          msgs.map((m) => ({
            id: m._id,
            text: m.text,
            sender: m.sender?._id === user?._id ? 'me' : 'them',
            senderName: m.sender?.name,
            time: new Date(m.createdAt),
          }))
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [roomId, user?._id]);

  useEffect(() => {
    const socket = socketRef?.current;
    if (!socket || !roomId) return;
    socket.emit('join_room', roomId);
    const handleReceive = (data) => {
      if (data.roomId !== roomId || data.senderId === user?._id) return;
      setMessages((m) => [...m, { id: Date.now().toString(), text: data.text, sender: 'them', senderName: data.senderName, time: new Date(data.timestamp) }]);
    };
    const handleTyping = ({ isTyping }) => setTypingIndicator(isTyping);
    socket.on('receive_message', handleReceive);
    socket.on('typing', handleTyping);
    return () => { socket.off('receive_message', handleReceive); socket.off('typing', handleTyping); };
  }, [roomId, socketRef, user?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingIndicator]);

  const emitTyping = useCallback((isTyping) => {
    socketRef?.current?.emit('typing', { roomId, userId: user?._id, isTyping });
  }, [roomId, user?._id, socketRef]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    emitTyping(true);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => emitTyping(false), 1500);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    const newMsg = { id: Date.now().toString(), text, sender: 'me', time: new Date() };
    setMessages((m) => [...m, newMsg]);
    setInput('');
    emitTyping(false);
    socketRef?.current?.emit('send_message', { roomId, text, senderId: user?._id, senderName: user?.name });
    messagesAPI.send({ roomId, text }).catch(() => {});
  };

  return (
    <div className="h-dvh flex flex-col bg-background">
      <div className="flex items-center gap-3 px-4 pt-12 pb-3 border-b border-border bg-surface/80 backdrop-blur-lg">
        <button onClick={onBack} className="text-muted hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {otherUser?.name?.[0]?.toUpperCase() || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{otherUser?.name || 'Unknown'}</p>
          <p className="text-muted text-[11px]">{otherUser?.role}{startup ? ` · ${startup.name}` : ''}</p>
        </div>
      </div>

      {startup && (
        <div className="px-4 py-2 bg-accent/5 border-b border-border/50 flex items-center gap-2">
          <Info size={14} className="text-accent flex-shrink-0" />
          <p className="text-xs text-zinc-400 truncate">
            Discussing <span className="text-accent font-medium">{startup.name}</span>
            {startup.tagline && ` — ${startup.tagline}`}
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 flex flex-col gap-2">
        {loading && (
          <div className="flex justify-center py-4">
            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!loading && messages.length === 0 && (
          <div className="text-center py-12 text-muted text-sm">
            <p>No messages yet. Say hello! 👋</p>
          </div>
        )}
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
              msg.sender === 'me'
                ? 'bg-accent text-white rounded-br-md'
                : 'bg-surface text-white rounded-bl-md'
            }`}>
              <p>{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.sender === 'me' ? 'text-white/50' : 'text-muted'}`}>
                {formatTime(msg.time)}
              </p>
            </div>
          </motion.div>
        ))}
        {typingIndicator && (
          <div className="flex justify-start">
            <div className="bg-surface rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 bg-muted rounded-full inline-block animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-border flex gap-2 bg-surface/80 backdrop-blur-lg safe-bottom">
        <input
          className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-white placeholder:text-muted focus:outline-none focus:border-accent text-sm"
          placeholder="Type a message..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center active:scale-95 transition-all disabled:opacity-40"
        >
          <Send size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}

