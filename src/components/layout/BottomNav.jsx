import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, PlusCircle, MessageCircle, User } from 'lucide-react';

const tabs = [
  { to: '/', icon: Home, label: 'Feed' },
  { to: '/explore', icon: Compass, label: 'Explore' },
  { to: '/upload', icon: PlusCircle, label: 'Upload', accent: true },
  { to: '/inbox', icon: MessageCircle, label: 'Inbox' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  return (
    <nav className="sticky bottom-0 bg-surface border-t border-border safe-bottom z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map(({ to, icon: Icon, label, accent }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${
                isActive ? 'text-accent' : 'text-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {accent ? (
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center -mt-4 shadow-lg shadow-accent/30">
                    <Icon size={20} className="text-white" />
                  </div>
                ) : (
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                )}
                {!accent && <span className="text-[10px] font-medium">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
