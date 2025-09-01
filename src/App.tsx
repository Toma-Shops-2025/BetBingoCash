
import React, { useState } from 'react';
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
import { Toaster } from './components/ui/toaster';
import './App.css';

// Main App Content with Navigation
const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [currentView, setCurrentView] = useState<'main' | 'dashboard' | 'admin' | 'vip' | 'achievements' | 'tournaments' | 'crypto' | 'casino' | 'sports'>('main');

  // Check if user is admin (you can implement proper admin logic)
  const isAdmin = user?.username === 'admin' || user?.email === 'admin@betbingo.com';

  // Render different views based on selection
  if (currentView === 'admin' && isAdmin) {
    return <AdminPanel />;
  }

  if (currentView === 'dashboard' && isAuthenticated) {
    return <UserDashboard />;
  }

  if (currentView === 'vip') {
    return <VIPSubscription />;
  }

  if (currentView === 'achievements') {
    return <AchievementSystem />;
  }

  if (currentView === 'tournaments') {
    return <AdvancedTournamentSystem />;
  }

  if (currentView === 'crypto') {
    return <CryptoPaymentProcessor />;
  }

  if (currentView === 'casino') {
    return <CasinoHub />;
  }

  if (currentView === 'sports') {
    return <SportsBetting />;
  }

  return (
    <AppLayout>
      {/* Navigation for authenticated users */}
      {isAuthenticated && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setCurrentView('main')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                🏠 Main
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                👤 Dashboard
              </button>
              <button
                onClick={() => setCurrentView('casino')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                🎰 Casino
              </button>
              <button
                onClick={() => setCurrentView('sports')}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                🏈 Sports
              </button>
              <button
                onClick={() => setCurrentView('vip')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                👑 VIP
              </button>
              <button
                onClick={() => setCurrentView('achievements')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                🏆 Achievements
              </button>
              <button
                onClick={() => setCurrentView('tournaments')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                🎮 Tournaments
              </button>
              <button
                onClick={() => setCurrentView('crypto')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                💎 Crypto
              </button>
              {isAdmin && (
                <button
                  onClick={() => setCurrentView('admin')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  🔧 Admin
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Main App Content */}
      <div className="min-h-screen">
        {/* Your existing AppLayout content will render here */}
      </div>
    </AppLayout>
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
