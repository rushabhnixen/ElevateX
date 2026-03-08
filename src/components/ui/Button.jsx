import React from 'react';
import { cn } from '../../lib/utils';

export default function Button({ children, variant = 'primary', size = 'md', className, ...props }) {
  const variants = {
    primary: 'bg-accent hover:bg-accent-hover text-white',
    outline: 'border border-border text-white hover:bg-surface',
    ghost: 'text-white hover:bg-surface',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  return (
    <button
      className={cn(
        'rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
