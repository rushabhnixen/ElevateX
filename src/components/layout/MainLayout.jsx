import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Compass, PlusCircle, MessageCircle, User, Shield, LogOut, Rocket } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BottomNav from './BottomNav';

function DesktopSidebar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: '/', icon: Compass, label: 'Explore', end: true },
    { to: '/feed', icon: Home, label: 'Feed' },
    ...(role === 'founder' ? [{ to: '/upload', icon: PlusCircle, label: 'Upload Pitch' }] : []),
    { to: '/inbox', icon: MessageCircle, label: 'Inbox' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <aside className="hidden lg:flex lg:w-60 xl:w-64 flex-col border-r border-border bg-surface/50 shrink-0">
      <div className="p-5 border-b border-border">
        <button onClick={() => navigate('/')} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center">
            <Rocket size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white">ElevateX</span>
        </button>
      </div>
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {links.map(l => {
          const Icon = l.icon;
          return (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-accent text-white' : 'text-muted hover:bg-background hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              <span>{l.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-muted text-[10px] truncate">{role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </aside>
  );
}

export default function MainLayout() {
  return (
    <div className="flex h-dvh bg-background">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col max-w-mobile lg:max-w-none mx-auto lg:mx-0 relative">
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
