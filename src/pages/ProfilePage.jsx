import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, LogOut, ChevronRight, Edit3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import { startups } from '../lib/mockData';
import StartupCard from '../components/explore/StartupCard';

function StatCard({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <span className="text-white font-bold text-xl">{value}</span>
      <span className="text-muted text-xs">{label}</span>
    </div>
  );
}

export default function ProfilePage() {
  const { role, logout } = useAuth();
  const isFounder = role === 'founder';
  const myStartups = startups.slice(0, 2);

  const menuItems = [
    { icon: Edit3, label: 'Edit Profile' },
    { icon: Bell, label: 'Notifications' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="h-dvh overflow-y-auto scrollbar-hide bg-background pb-6">
      <div className="px-4 pt-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 py-6"
        >
          <Avatar name="John Doe" size="xl" />
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">John Doe</h1>
            <p className="text-muted text-sm">john@example.com</p>
            <Badge label={isFounder ? 'Founder' : 'Investor'} className="mt-2" />
          </div>
        </motion.div>

        {/* Stats */}
        <div className="flex bg-surface rounded-2xl p-4 mb-6 border border-border">
          <StatCard value={isFounder ? '3' : '12'} label={isFounder ? 'Pitches' : 'Invested'} />
          <div className="w-px bg-border" />
          <StatCard value="48" label="Following" />
          <div className="w-px bg-border" />
          <StatCard value="156" label="Followers" />
        </div>

        {/* Content */}
        {isFounder ? (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">My Pitches</h2>
            <div className="grid grid-cols-2 gap-3">
              {myStartups.map(s => <StartupCard key={s.id} startup={s} />)}
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">Bookmarked</h2>
            <div className="grid grid-cols-2 gap-3">
              {myStartups.map(s => <StartupCard key={s.id} startup={s} />)}
            </div>
          </div>
        )}

        {/* Menu */}
        <div className="bg-surface rounded-2xl border border-border overflow-hidden mb-4">
          {menuItems.map(({ icon: Icon, label }, i) => (
            <button
              key={label}
              className={`w-full flex items-center gap-4 px-4 py-4 text-white active:bg-border transition-colors ${
                i < menuItems.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <Icon size={18} className="text-muted" />
              <span className="flex-1 text-left text-sm font-medium">{label}</span>
              <ChevronRight size={16} className="text-muted" />
            </button>
          ))}
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-4 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 active:bg-red-500/20 transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
}
