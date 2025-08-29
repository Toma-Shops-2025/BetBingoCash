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
            {/* Logo and Brand */}
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src="/logo.png"
                alt="BetBingoCash Logo"
                className="h-8 w-auto sm:h-10"
              />
              <div className="text-lg sm:text-xl font-black text-white">
                <span className="hidden sm:inline">BET BINGO CASH</span>
                <span className="sm:hidden">BINGO CASH</span>
              </div>
            </div>

            {/* Desktop Navigation Links - Hidden on Mobile */}
            <div className="hidden lg:flex items-center gap-6">
              <a href="#tournaments" className="text-white/80 hover:text-white transition-colors">
                🏆 Tournaments
              </a>
              <a href="#leaderboard" className="text-white/80 hover:text-white transition-colors">
                📊 Leaderboard
              </a>
              <a href="#rewards" className="text-white/80 hover:text-white transition-colors">
                🎁 Rewards
              </a>
              <a href="#cashout" className="text-white/80 hover:text-white transition-colors">
                💰 Cashout
              </a>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {isAuthenticated && user ? (
                <>
                  {/* Mobile: Compact User Info */}
                  <div className="lg:hidden flex items-center gap-2">
                    <button
                      onClick={() => setGemShopModalOpen(true)}
                      className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-1 px-2 rounded-full text-xs transition-colors"
                    >
                      <span>💎</span>
                      <span className="hidden xs:inline">{gems}</span>
                    </button>
                    <div className="text-green-400 text-xs font-bold">
                      ${balance.toFixed(0)}
                    </div>
                  </div>

                  {/* Desktop: Full User Info */}
                  <div className="hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
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

                  {/* Mobile: Compact Action Buttons */}
                  <div className="lg:hidden flex items-center gap-1">
                    <button
                      onClick={() => setGemShopModalOpen(true)}
                      className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-bold py-1 px-2 rounded-full text-xs transition-all duration-200"
                    >
                      💎
                    </button>
                    <button
                      onClick={() => setPaymentModalOpen(true)}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-1 px-2 rounded-full text-xs transition-all duration-200"
                    >
                      💸
                    </button>
                    <button
                      onClick={() => setProfileModalOpen(true)}
                      className="bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20"
                    >
                      <div className="w-5 h-5 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user?.username?.charAt(0) || 'U'}
                      </div>
                    </button>
                  </div>

                  {/* Desktop: Full Action Buttons */}
                  <div className="hidden lg:flex items-center gap-3">
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
                            onClick={() => setProfileModalOpen(true)}
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
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 sm:px-6 rounded-full text-sm transition-all duration-200"
                  >
                    <span className="hidden sm:inline">🔐 Sign In</span>
                    <span className="sm:hidden">🔐</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Quick Navigation Menu */}
      <div className="fixed top-20 right-4 z-40">
        <div className="bg-gradient-to-br from-purple-800/90 to-indigo-900/90 backdrop-blur-sm rounded-2xl p-2 border border-purple-400/30 shadow-2xl">
          <div className="text-center mb-2">
            <div className="text-white/80 text-xs font-bold hidden sm:block">🚀 QUICK NAV</div>
            <div className="text-white/80 text-xs font-bold sm:hidden">🚀</div>
          </div>
          <div className="space-y-1.5">
            <button
              onClick={() => document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xs font-bold py-1.5 px-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
              title="Jump to Games"
            >
              <span className="hidden sm:inline">🎮 Games</span>
              <span className="sm:hidden">🎮</span>
            </button>
            <button
              onClick={() => document.getElementById('tournaments')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white text-xs font-bold py-1.5 px-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
              title="Jump to Tournaments"
            >
              <span className="hidden sm:inline">🏆 Tournaments</span>
              <span className="sm:hidden">🏆</span>
            </button>
            <button
              onClick={() => document.getElementById('leaderboard')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white text-xs font-bold py-1.5 px-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
              title="Jump to Leaderboard"
            >
              <span className="hidden sm:inline">📊 Leaderboard</span>
              <span className="sm:hidden">📊</span>
            </button>
            <button
              onClick={() => document.getElementById('rewards')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-xs font-bold py-1.5 px-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
              title="Jump to Rewards"
            >
              <span className="hidden sm:inline">🎁 Rewards</span>
              <span className="sm:hidden">🎁</span>
            </button>
            <button
              onClick={() => document.getElementById('cashout')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white text-xs font-bold py-1.5 px-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
              title="Jump to Cashout"
            >
              <span className="hidden sm:inline">💰 Cashout</span>
              <span className="sm:hidden">💰</span>
            </button>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <div className="fixed top-80 right-4 z-40">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-gradient-to-br from-gray-700/90 to-gray-800/90 backdrop-blur-sm rounded-full p-3 border border-gray-500/30 shadow-2xl hover:scale-110 transition-all duration-200"
          title="Back to Top"
        >
          <div className="text-white text-lg">⬆️</div>
        </button>
      </div>

      {/* Main Content */}
      <main>
        <HeroSection />
        <PromoBanner />
        <div id="games">
          <GameModes />
        </div>
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