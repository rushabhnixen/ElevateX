import React from 'react';
import { cn } from '../../lib/utils';

const colors = {
  FinTech: 'bg-blue-500/20 text-blue-400',
  CleanTech: 'bg-green-500/20 text-green-400',
  EdTech: 'bg-yellow-500/20 text-yellow-400',
  HealthTech: 'bg-pink-500/20 text-pink-400',
  SaaS: 'bg-purple-500/20 text-purple-400',
  DeepTech: 'bg-red-500/20 text-red-400',
  'Pre-seed': 'bg-orange-500/20 text-orange-400',
  Seed: 'bg-cyan-500/20 text-cyan-400',
  'Series A': 'bg-indigo-500/20 text-indigo-400',
  Founder: 'bg-purple-500/20 text-purple-400',
  Investor: 'bg-blue-500/20 text-blue-400',
};

export default function Badge({ label, className }) {
  return (
    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', colors[label] || 'bg-surface text-muted', className)}>
      {label}
    </span>
  );
}
