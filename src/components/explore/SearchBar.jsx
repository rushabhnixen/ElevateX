import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
      <input
        type="text"
        placeholder="Search startups..."
        value={value}
        onChange={onChange}
        className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-muted focus:outline-none focus:border-accent text-sm"
      />
    </div>
  );
}
