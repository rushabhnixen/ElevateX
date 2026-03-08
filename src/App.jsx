import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Onboarding from './pages/Onboarding';
import RoleSelect from './pages/RoleSelect';
import MainLayout from './components/layout/MainLayout';
import FeedPage from './pages/FeedPage';
import ExplorePage from './pages/ExplorePage';
import UploadPage from './pages/UploadPage';
import InboxPage from './pages/InboxPage';
import ProfilePage from './pages/ProfilePage';
import StartupDetailPage from './pages/StartupDetailPage';

function AppRoutes() {
  const { role } = useAuth();
  const [onboarded, setOnboarded] = useState(() =>
    localStorage.getItem('elevate_onboarded') === 'true'
  );

  if (!onboarded) {
    return <Onboarding onComplete={() => {
      localStorage.setItem('elevate_onboarded', 'true');
      setOnboarded(true);
    }} />;
  }

  if (!role) {
    return <RoleSelect />;
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<FeedPage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="inbox" element={<InboxPage />} />
        <Route path="profile" element={<ProfilePage />} />
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
          <AnimatePresence mode="wait">
            <AppRoutes />
          </AnimatePresence>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}
