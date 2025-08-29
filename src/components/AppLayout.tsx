import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X, Gamepad2, Trophy, Gift, Coins, BarChart3, ChevronUp } from 'lucide-react';
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
  const { sidebarOpen, toggleSidebar, user, balance, gems, isAuthenticated, logout, currentGame } = useAppContext();
  const isMobile = useIsMobile();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [gemShopModalOpen, setGemShopModalOpen] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);

  // Check if user is currently in a game
  const isInGame = !!currentGame;

  // Debug authentication state
  console.log('AppLayout - isAuthenticated:', isAuthenticated, 'user:', user);

  const handleLogout = async () => {
    await logout();
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setShowHamburgerMenu(false); // Close menu after navigation
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowHamburgerMenu(false); // Close menu after navigation
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
                      <span className="hidden xs:inline">{gems || 0}</span>
                    </button>
                    <div className="text-green-400 text-xs font-bold">
                      ${(balance || 0).toFixed(0)}
                    </div>
                  </div>

                  {/* Desktop: Full User Info */}
                  <div className="hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <button
                      onClick={() => setGemShopModalOpen(true)}
                      className="flex items-center gap-2 hover:bg-white/20 rounded-full px-2 py-1 transition-colors"
                    >
                      <div className="text-yellow-400">💎</div>
                      <span className="text-white font-bold">{gems || 0}</span>
                    </button>
                    <div className="w-px h-4 bg-white/30"></div>
                    <div className="text-green-400">💰</div>
                    <span className="text-white font-bold">${(balance || 0).toFixed(2)}</span>
                  </div>

                  {/* Mobile: Compact Action Buttons */}
                  <div className="lg:hidden flex items-center gap-1">
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
                            👤 Profile
                          </button>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
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

      {/* Hamburger Menu Button - Fixed Position */}
      {!isInGame && (
        <button
          onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
          className="fixed top-4 right-4 z-50 p-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full shadow-lg hover:scale-105 transition-all duration-200"
          title="Quick Navigation"
        >
          {showHamburgerMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      )}

      {/* Hamburger Menu Dropdown */}
      {showHamburgerMenu && !isInGame && (
        <div className="fixed top-20 right-4 z-50 bg-gradient-to-r from-purple-800/95 to-indigo-900/95 backdrop-blur-sm rounded-2xl p-4 border border-purple-400/30 shadow-2xl min-w-48">
          <div className="text-white font-bold text-sm mb-3 text-center">
            🚀 Quick Navigation
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => scrollToSection('games')}
              className="w-full p-3 bg-gradient-to-r from-blue-600/80 to-blue-700/80 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl flex items-center gap-3 transition-all duration-200 hover:scale-105"
            >
              <Gamepad2 className="w-5 h-5" />
              <span>Games</span>
            </button>

            <button
              onClick={() => scrollToSection('tournaments')}
              className="w-full p-3 bg-gradient-to-r from-purple-600/80 to-purple-700/80 hover:from-purple-500 hover:to-purple-600 text-white rounded-xl flex items-center gap-3 transition-all duration-200 hover:scale-105"
            >
              <Trophy className="w-5 h-5" />
              <span>Tournaments</span>
            </button>

            <button
              onClick={() => scrollToSection('leaderboard')}
              className="w-full p-3 bg-gradient-to-r from-green-600/80 to-green-700/80 hover:from-green-500 hover:to-green-600 text-white rounded-xl flex items-center gap-3 transition-all duration-200 hover:scale-105"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => scrollToSection('rewards')}
              className="w-full p-3 bg-gradient-to-r from-yellow-600/80 to-yellow-700/80 hover:from-yellow-500 hover:to-yellow-600 text-white rounded-xl flex items-center gap-3 transition-all duration-200 hover:scale-105"
            >
              <Gift className="w-5 h-5" />
              <span>Rewards</span>
            </button>

            <button
              onClick={() => scrollToSection('cashout')}
              className="w-full p-3 bg-gradient-to-r from-red-600/80 to-red-700/80 hover:from-red-500 hover:to-red-600 text-white rounded-xl flex items-center gap-3 transition-all duration-200 hover:scale-105"
            >
              <Coins className="w-5 h-5" />
              <span>Cashout</span>
            </button>

            <div className="pt-2 border-t border-white/20">
              <div className="text-white/60 text-xs mb-2 text-center">🎵 Music</div>
              
              <button
                onClick={() => window.open('https://open.spotify.com', '_blank')}
                className="w-full p-3 bg-gradient-to-r from-green-600/80 to-green-700/80 hover:from-green-500 hover:to-green-600 text-white rounded-xl flex items-center gap-3 transition-all duration-200 hover:scale-105 mb-2"
              >
                <span className="text-lg">🎵</span>
                <span>Spotify</span>
              </button>

              <button
                onClick={() => window.open('https://www.pandora.com', '_blank')}
                className="w-full p-3 bg-gradient-to-r from-blue-600/80 to-blue-700/80 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl flex items-center gap-3 transition-all duration-200 hover:scale-105 mb-2"
              >
                <span className="text-lg">🎵</span>
                <span>Pandora</span>
              </button>

              <button
                onClick={() => window.open('https://music.apple.com', '_blank')}
                className="w-full p-3 bg-gradient-to-r from-pink-600/80 to-pink-700/80 hover:from-pink-500 hover:to-pink-600 text-white rounded-xl flex items-center gap-3 transition-all duration-200 hover:scale-105"
              >
                <span className="text-lg">🎵</span>
                <span>Apple Music</span>
              </button>
            </div>

            <div className="pt-2 border-t border-white/20">
              <button
                onClick={scrollToTop}
                className="w-full p-3 bg-gradient-to-r from-gray-600/80 to-gray-700/80 hover:from-gray-500 hover:to-gray-600 text-white rounded-xl flex items-center gap-3 transition-all duration-200 hover:scale-105"
              >
                <ChevronUp className="w-5 h-5" />
                <span>Back to Top</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
        <Footer />
      </main>

      {/* Modals */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <PaymentModal isOpen={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} />
      <UserProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
      <GemShopModal isOpen={gemShopModalOpen} onClose={() => setGemShopModalOpen(false)} />
    </div>
  );
};

export default AppLayout;