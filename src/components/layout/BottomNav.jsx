import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, PlusCircle, MessageCircle, User, Bookmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notificationsAPI } from '../../lib/api';

export default function BottomNav() {
  const { role } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    notificationsAPI.list().then(d => setUnread(d.unreadCount)).catch(() => {});
    const interval = setInterval(() => {
      notificationsAPI.list().then(d => setUnread(d.unreadCount)).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { to: '/', icon: Compass, label: 'Explore' },
    { to: '/feed', icon: Home, label: 'Feed' },
    role === 'founder'
      ? { to: '/upload', icon: PlusCircle, label: 'Pitch', accent: true }
      : { to: '/feed', icon: Bookmark, label: 'Saved', accent: true, hidden: true },
    { to: '/inbox', icon: MessageCircle, label: 'Inbox', badge: unread },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const visibleTabs = role === 'founder' ? tabs : [
    { to: '/', icon: Compass, label: 'Explore' },
    { to: '/feed', icon: Home, label: 'Feed' },
    { to: '/inbox', icon: MessageCircle, label: 'Inbox', badge: unread },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const finalTabs = role === 'founder' ? tabs : visibleTabs;

  return (
    <nav className="sticky bottom-0 bg-surface/95 backdrop-blur-lg border-t border-border safe-bottom z-50 lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {finalTabs.map(({ to, icon: Icon, label, accent, badge }) => (
          <NavLink
            key={label}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors relative ${
                isActive ? 'text-accent' : 'text-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {accent ? (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center -mt-5 shadow-lg shadow-accent/30 ring-4 ring-surface">
                    <Icon size={20} className="text-white" />
                  </div>
                ) : (
                  <div className="relative">
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                    {badge > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                        {badge > 99 ? '99+' : badge}
                      </span>
                    )}
                  </div>
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
