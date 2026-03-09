import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Onboarding from './pages/Onboarding';
import RoleSelect from './pages/RoleSelect';
import AuthPage from './pages/AuthPage';
import MainLayout from './components/layout/MainLayout';
import FeedPage from './pages/FeedPage';
import ExplorePage from './pages/ExplorePage';
import UploadPage from './pages/UploadPage';
import InboxPage from './pages/InboxPage';
import ProfilePage from './pages/ProfilePage';
import StartupDetailPage from './pages/StartupDetailPage';
import AdminPage from './pages/AdminPage';

const Spinner = () => (
  <div className="h-dvh bg-background flex items-center justify-center">
    <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
  </div>
);

function AppRoutes() {
  const { role, user, loading } = useAuth();
  const [onboarded, setOnboarded] = useState(() =>
    localStorage.getItem('elevate_onboarded') === 'true'
  );

  if (loading) return <Spinner />;

  if (!onboarded) {
    return <Onboarding onComplete={() => {
      localStorage.setItem('elevate_onboarded', 'true');
      setOnboarded(true);
    }} />;
  }

  if (!user) return <AuthPage />;

  // Admin goes straight to admin panel
  if (user.role === 'admin') {
    return (
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  if (!role) return <RoleSelect />;

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<ExplorePage />} />
        <Route path="feed" element={<FeedPage />} />
        {role === 'founder' && <Route path="upload" element={<UploadPage />} />}
        <Route path="inbox" element={<InboxPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/:userId" element={<ProfilePage />} />
        <Route path="startup/:id" element={<StartupDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

