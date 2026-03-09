import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import Avatar from '../ui/Avatar';
import { formatTime } from '../../lib/utils';

export default function ChatView({ conversation, onBack }) {
  const [messages, setMessages] = useState(conversation.messages || []);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { id: Date.now().toString(), text: input, sender: 'me', time: new Date() }]);
    setInput('');
  };

  return (
    <div className="h-dvh flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4 border-b border-border bg-surface/80 backdrop-blur-sm">
        <button onClick={onBack} className="text-muted">
          <ArrowLeft size={20} />
        </button>
        <Avatar name={conversation.participant.name} size="sm" />
        <div>
          <p className="text-white font-semibold text-sm">{conversation.participant.name}</p>
          <p className="text-muted text-xs">{conversation.participant.role}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 flex flex-col gap-3">
        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                msg.sender === 'me'
                  ? 'bg-accent text-white rounded-br-sm'
                  : 'bg-surface text-white rounded-bl-sm'
              }`}
            >
              <p>{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.sender === 'me' ? 'text-white/60' : 'text-muted'}`}>
                {formatTime(msg.time)}
              </p>
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border flex gap-3 bg-surface/80">
        <input
          className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-white placeholder:text-muted focus:outline-none focus:border-accent text-sm"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center active:scale-95 transition-all"
        >
          <Send size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}
