import React from 'react';

export default function FilterChips({ options, selected, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            selected === opt
              ? 'bg-accent text-white'
              : 'bg-surface border border-border text-muted'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
