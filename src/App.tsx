
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { AudioProvider } from './contexts/AudioContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AppLayout from './components/AppLayout';
import UserDashboard from './components/UserDashboard';
import AdminPanel from './components/AdminPanel';
import VIPSubscription from './components/VIPSubscription';
import AchievementSystem from './components/AchievementSystem';
import AdvancedTournamentSystem from './components/AdvancedTournamentSystem';
import CryptoPaymentProcessor from './components/CryptoPaymentProcessor';
import CasinoHub from './components/CasinoHub';
import SportsBetting from './components/SportsBetting';
import ClassicBingo from './components/ClassicBingo';
import FortuneSlots from './components/FortuneSlots';
import LiveBlackjack from './components/LiveBlackjack';
import SpeedBingo from './components/SpeedBingo';
import ProgressiveBingo from './components/ProgressiveBingo';
import PaymentSystem from './components/PaymentSystem';
import LoginPage from './components/LoginPage';
import { Toaster } from './components/ui/toaster';
import './App.css';

// Main App Content with Navigation
const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  // Check if user is admin (you can implement proper admin logic)
  const isAdmin = user?.username === 'admin' || user?.email === 'admin@betbingo.com';

  return (
    <Router>
      <Routes>
        {/* Main Casino Hub */}
        <Route path="/" element={<AppLayout />} />
        
        {/* Game Routes */}
        <Route path="/classic-bingo" element={<ClassicBingo />} />
        <Route path="/speed-bingo" element={<SpeedBingo />} />
        <Route path="/progressive-bingo" element={<ProgressiveBingo />} />
        <Route path="/fortune-slots" element={<FortuneSlots />} />
        <Route path="/live-blackjack" element={<LiveBlackjack />} />
        <Route path="/payment" element={<PaymentSystem />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Feature Routes */}
        <Route path="/dashboard" element={isAuthenticated ? <UserDashboard /> : <Navigate to="/" />} />
        <Route path="/admin" element={isAdmin ? <AdminPanel /> : <Navigate to="/" />} />
        <Route path="/vip" element={<VIPSubscription />} />
        <Route path="/achievements" element={<AchievementSystem />} />
        <Route path="/tournaments" element={<AdvancedTournamentSystem />} />
        <Route path="/crypto" element={<CryptoPaymentProcessor />} />
        <Route path="/casino" element={<CasinoHub />} />
        <Route path="/sports" element={<SportsBetting />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AudioProvider>
        <AppProvider>
          <AppContent />
          <Toaster />
        </AppProvider>
      </AudioProvider>
    </AuthProvider>
  );
};

export default App;
