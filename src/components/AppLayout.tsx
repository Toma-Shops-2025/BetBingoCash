import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useAudio } from '@/contexts/AudioContext';
import { useIsMobile } from '@/hooks/use-mobile';
import HeroSection from './HeroSection';
import PromoBanner from './PromoBanner';
import GameModes from './GameModes';
import FeaturesSection from './FeaturesSection';
import GameStats from './GameStats';
import TournamentLobby from './TournamentLobby';
import Leaderboard from './Leaderboard';
import TestimonialsSection from './TestimonialsSection';
import DailyRewards from './DailyRewards';
import CashoutSection from './CashoutSection';
import Footer from './Footer';
import AuthModal from './AuthModal';
import PaymentModal from './PaymentModal';
import UserProfileModal from './UserProfileModal';
import GemShopModal from './GemShopModal';

const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar, user, balance, gems, isAuthenticated, logout } = useAppContext();
  const { playBackgroundMusic, setGameMusicMode } = useAudio();
  const isMobile = useIsMobile();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [gemShopModalOpen, setGemShopModalOpen] = useState(false);

  // Debug authentication state
  console.log('AppLayout - isAuthenticated:', isAuthenticated, 'user:', user);

  // Start background music when app loads
  useEffect(() => {
    // Start background music with soft volume
    playBackgroundMusic();
    // Ensure we're in background music mode (softer volume)
    setGameMusicMode(false);
  }, [playBackgroundMusic, setGameMusicMode]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 border-b border-purple-700/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="BetBingoCash Logo" 
                className="h-10 w-auto"
              />
              <div className="text-xl font-black text-white">
                BET BINGO<span className="text-yellow-400">CASH</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#games" className="text-white/80 hover:text-white transition-colors">Live Games</a>
              <a href="#tournaments" className="text-white/80 hover:text-white transition-colors">Tournaments</a>
              <a href="#leaderboard" className="text-white/80 hover:text-white transition-colors">Leaderboard</a>
              <a href="#rewards" className="text-white/80 hover:text-white transition-colors">Rewards</a>
              <a href="#cashout" className="text-white/80 hover:text-white transition-colors">Cash Out</a>
            </div>
            
            <div className="flex items-center gap-4">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <button
                      onClick={() => setGemShopModalOpen(true)}
                      className="flex items-center gap-2 hover:bg-white/20 rounded-full px-2 py-1 transition-colors"
                    >
                      <div className="text-yellow-400">💎</div>
                      <span className="text-white font-bold">{gems}</span>
                    </button>
                    <div className="w-px h-4 bg-white/30"></div>
                    <div className="text-green-400">💰</div>
                    <span className="text-white font-bold">${balance.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => setGemShopModalOpen(true)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-full text-sm transition-all duration-200"
                  >
                    💎 Gem Shop
                  </button>

                  <button
                    onClick={() => setPaymentModalOpen(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2 px-4 rounded-full text-sm transition-all duration-200"
                  >
                    💸 Add Funds
                  </button>
                  
                  <div className="relative group">
                    <button className="bg-white/10 backdrop-blur-sm rounded-full p-2 border border-white/20">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user?.username?.charAt(0) || 'U'}
                      </div>
                    </button>
                    
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="p-3 border-b border-gray-700">
                        <div className="text-white font-semibold">{user?.username || 'User'}</div>
                        <div className="text-white/60 text-sm">{user?.email}</div>
                      </div>
                      <div className="p-2 space-y-1">
                        <button 
                          onClick={() => setProfileModalOpen(true)}
                          className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                        >
                          👤 My Profile
                        </button>
                        <button 
                          onClick={() => {/* TODO: Open account settings */}}
                          className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                        >
                          ⚙️ Account Settings
                        </button>
                        <button 
                          onClick={() => {/* TODO: Open withdrawal modal */}}
                          className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                        >
                          💰 Withdraw Funds
                        </button>
                        <div className="border-t border-gray-700 my-1"></div>
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-md transition-colors"
                        >
                          🚪 Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setAuthModalOpen(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-full text-sm transition-all duration-200"
                  >
                    🔐 Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <HeroSection />
        <PromoBanner />
        <GameModes />
        <FeaturesSection />
        <GameStats />
        <div id="tournaments">
          <TournamentLobby />
        </div>
        <div id="leaderboard">
          <Leaderboard />
        </div>
        <TestimonialsSection />
        <div id="rewards">
          <DailyRewards />
        </div>
        <div id="cashout">
          <CashoutSection />
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
      
      <PaymentModal 
        isOpen={paymentModalOpen} 
        onClose={() => setPaymentModalOpen(false)} 
        amount={25}
        onSuccess={(amount) => {
          // Handle successful payment
          console.log(`Payment successful: $${amount}`);
        }}
      />

      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      <GemShopModal
        isOpen={gemShopModalOpen}
        onClose={() => setGemShopModalOpen(false)}
      />
    </div>
  );
};

export default AppLayout;