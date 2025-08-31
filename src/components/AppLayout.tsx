import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Menu, X, Gamepad2, Trophy, Gift, Coins, BarChart3, ChevronUp, Zap, Star, Target } from 'lucide-react';
import GameModes from './GameModes';
import TournamentLobby from './TournamentLobby';
import BonusSystem from './BonusSystem';
import MiniGames from './MiniGames';
import AuthModal from './AuthModal';
import PaymentModal from './PaymentModal';
import UserProfileModal from './UserProfileModal';
import GemShopModal from './GemShopModal';
import MusicPlayer from './MusicPlayer';

const AppLayout: React.FC = () => {
  const { user, balance, gems, isAuthenticated, logout } = useAppContext();
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [gemShopModalOpen, setGemShopModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setShowHamburgerMenu(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowHamburgerMenu(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0">
        {/* Floating Bubbles - Spread across entire screen */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-20 animate-float" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute top-40 left-1/4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute top-60 right-1/3 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20 animate-float" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
        <div className="absolute top-80 left-1/6 w-18 h-18 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full opacity-20 animate-float" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }}></div>
        <div className="absolute top-96 right-1/6 w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-20 animate-float" style={{ animationDelay: '2.5s', animationDuration: '3.8s' }}></div>
        
        {/* Floating Stars - Distributed across screen */}
        <div className="absolute top-32 left-1/3 text-yellow-300 text-2xl animate-pulse" style={{ animationDelay: '0s' }}>⭐</div>
        <div className="absolute top-64 right-1/4 text-blue-300 text-xl animate-pulse" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute top-96 left-1/2 text-purple-300 text-3xl animate-pulse" style={{ animationDelay: '2s' }}>🌟</div>
        <div className="absolute top-48 right-1/2 text-green-300 text-xl animate-pulse" style={{ animationDelay: '0.5s' }}>💫</div>
        <div className="absolute top-72 left-1/8 text-pink-300 text-lg animate-pulse" style={{ animationDelay: '1.5s' }}>⭐</div>
        
        {/* Floating Coins - Spread out */}
        <div className="absolute top-48 left-1/5 text-yellow-400 text-2xl animate-float" style={{ animationDelay: '0.5s', animationDuration: '4s' }}>💰</div>
        <div className="absolute top-72 right-1/5 text-green-400 text-xl animate-float" style={{ animationDelay: '1.5s', animationDuration: '3s' }}>💎</div>
        <div className="absolute top-56 left-3/4 text-blue-400 text-lg animate-float" style={{ animationDelay: '2.5s', animationDuration: '5s' }}>💎</div>
        
        {/* Moving Clouds - Different positions */}
        <div className="absolute top-16 left-0 w-32 h-16 bg-gradient-to-r from-white/10 to-white/5 rounded-full animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute top-32 right-0 w-24 h-12 bg-gradient-to-r from-white/10 to-white/5 rounded-full animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
        <div className="absolute top-64 left-1/2 w-20 h-10 bg-gradient-to-r from-white/10 to-white/5 rounded-full animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }}></div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}></div>
        </div>
        
        {/* Gradient Orbs - Spread out */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }}></div>
        
        {/* Gaming Icons - Top Left Quadrant */}
        <div className="absolute top-1/6 left-1/6 text-purple-400 text-lg animate-float" style={{ animationDuration: '5s', animationDelay: '0.5s' }}>🎲</div>
        <div className="absolute top-1/8 left-1/8 text-blue-400 text-xl animate-float" style={{ animationDuration: '6s', animationDelay: '1s' }}>🎯</div>
        <div className="absolute top-1/4 left-1/8 text-yellow-400 text-2xl animate-pulse" style={{ animationDelay: '0.5s' }}>🏅</div>
        
        {/* Gaming Icons - Top Right Quadrant */}
        <div className="absolute top-1/6 right-1/6 text-green-400 text-lg animate-float" style={{ animationDuration: '4s', animationDelay: '1.5s' }}>🎮</div>
        <div className="absolute top-1/8 right-1/8 text-orange-400 text-xl animate-pulse" style={{ animationDelay: '1s' }}>🥇</div>
        <div className="absolute top-1/4 right-1/8 text-red-400 text-lg animate-pulse" style={{ animationDelay: '1.5s' }}>🔥</div>
        
        {/* Gaming Icons - Top Center */}
        <div className="absolute top-1/6 left-1/2 text-pink-400 text-xl animate-float" style={{ animationDuration: '7s', animationDelay: '0.3s' }}>🍀</div>
        <div className="absolute top-1/8 left-1/2 text-cyan-400 text-lg animate-float" style={{ animationDuration: '8s', animationDelay: '0.8s' }}>💫</div>
        <div className="absolute top-1/4 left-3/4 text-yellow-300 text-xl animate-float" style={{ animationDuration: '6s', animationDelay: '1.2s' }}>⭐</div>
        
        {/* Middle Left Area */}
        <div className="absolute top-2/5 left-1/6 text-indigo-400 text-lg animate-spin-slow" style={{ animationDuration: '15s' }}>🌀</div>
        <div className="absolute top-1/3 left-1/4 text-emerald-400 text-xl animate-float" style={{ animationDuration: '5s', animationDelay: '0.7s' }}>🌊</div>
        <div className="absolute top-2/5 left-1/8 text-purple-300 text-lg animate-float" style={{ animationDuration: '6s', animationDelay: '1.1s' }}>🌈</div>
        <div className="absolute top-3/5 left-1/5 text-blue-300 text-lg animate-float" style={{ animationDuration: '7s', animationDelay: '0.8s' }}>💎</div>
        
        {/* Middle Right Area */}
        <div className="absolute top-2/5 right-1/6 text-red-300 text-lg animate-float" style={{ animationDuration: '7s', animationDelay: '0.4s' }}>⚡</div>
        <div className="absolute top-1/3 right-1/4 text-blue-300 text-xl animate-float" style={{ animationDuration: '8s', animationDelay: '0.9s' }}>💎</div>
        <div className="absolute top-2/5 right-1/8 text-green-300 text-lg animate-float" style={{ animationDuration: '6s', animationDelay: '1.3s' }}>🎪</div>
        <div className="absolute top-3/5 right-1/5 text-purple-300 text-lg animate-float" style={{ animationDuration: '8s', animationDelay: '1.2s' }}>🎭</div>
        
        {/* Center Area */}
        <div className="absolute top-1/2 left-1/8 text-yellow-400 text-xl animate-pulse" style={{ animationDelay: '0.2s' }}>👑</div>
        <div className="absolute top-1/2 right-1/8 text-gray-400 text-lg animate-pulse" style={{ animationDelay: '0.7s' }}>🥈</div>
        <div className="absolute top-1/2 left-3/4 text-orange-400 text-xl animate-pulse" style={{ animationDelay: '1.2s' }}>🥉</div>
        <div className="absolute top-1/2 left-1/2 text-pink-400 text-lg animate-pulse" style={{ animationDelay: '0.9s' }}>💖</div>
        
        {/* Bottom Left Quadrant */}
        <div className="absolute bottom-1/6 left-1/6 text-orange-400 text-lg animate-float" style={{ animationDuration: '8s', animationDelay: '0.4s' }}>🎨</div>
        <div className="absolute bottom-1/4 left-1/6 text-indigo-400 text-xl animate-float" style={{ animationDuration: '7s', animationDelay: '0.9s' }}>🎭</div>
        <div className="absolute bottom-1/3 left-1/8 text-emerald-400 text-lg animate-float" style={{ animationDuration: '9s', animationDelay: '1.1s' }}>🎪</div>
        <div className="absolute bottom-2/5 left-1/4 text-blue-400 text-lg animate-float" style={{ animationDuration: '6s', animationDelay: '0.6s' }}>🌊</div>
        
        {/* Bottom Right Quadrant */}
        <div className="absolute bottom-1/6 right-1/6 text-red-300 text-lg animate-pulse" style={{ animationDelay: '0.6s' }}>💥</div>
        <div className="absolute bottom-1/4 right-1/6 text-blue-300 text-xl animate-pulse" style={{ animationDelay: '1.1s' }}>⚡</div>
        <div className="absolute bottom-1/3 right-1/8 text-green-300 text-lg animate-pulse" style={{ animationDelay: '0.8s' }}>🎯</div>
        <div className="absolute bottom-2/5 right-1/4 text-purple-400 text-lg animate-pulse" style={{ animationDelay: '1.3s' }}>🌈</div>
        
        {/* Bottom Center */}
        <div className="absolute bottom-1/6 left-1/2 text-green-300 text-xl animate-float" style={{ animationDuration: '5s', animationDelay: '0.5s' }}>🍀</div>
        <div className="absolute bottom-1/4 left-1/2 text-yellow-300 text-lg animate-float" style={{ animationDuration: '6s', animationDelay: '1s' }}>⭐</div>
        <div className="absolute bottom-1/3 left-1/2 text-pink-300 text-xl animate-float" style={{ animationDuration: '7s', animationDelay: '0.7s' }}>💖</div>
        <div className="absolute bottom-2/5 left-1/2 text-cyan-300 text-lg animate-float" style={{ animationDuration: '8s', animationDelay: '1.4s' }}>💫</div>
        
        {/* Additional Floating Bubbles - Spread out */}
        <div className="absolute top-2/3 left-1/6 w-8 h-8 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full opacity-30 animate-float" style={{ animationDuration: '4s', animationDelay: '0.6s' }}></div>
        <div className="absolute top-2/3 right-1/6 w-12 h-12 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full opacity-25 animate-float" style={{ animationDuration: '5s', animationDelay: '1.1s' }}></div>
        <div className="absolute top-2/3 left-2/3 w-6 h-6 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-35 animate-float" style={{ animationDuration: '6s', animationDelay: '0.8s' }}></div>
        <div className="absolute top-1/3 left-2/3 w-10 h-10 bg-gradient-to-br from-green-300 to-emerald-400 rounded-full opacity-30 animate-float" style={{ animationDuration: '7s', animationDelay: '1.3s' }}></div>
        
        {/* More Stars and Sparkles - Distributed */}
        <div className="absolute top-3/4 left-1/5 text-yellow-200 text-lg animate-pulse" style={{ animationDelay: '0.3s' }}>✨</div>
        <div className="absolute top-3/4 right-1/5 text-blue-200 text-xl animate-pulse" style={{ animationDelay: '0.8s' }}>🌟</div>
        <div className="absolute top-3/4 left-1/2 text-purple-200 text-lg animate-pulse" style={{ animationDelay: '1.3s' }}>💫</div>
        <div className="absolute top-1/4 left-1/5 text-green-200 text-lg animate-pulse" style={{ animationDelay: '0.4s' }}>⭐</div>
        
        {/* Glowing Lines - Different positions */}
        <div className="absolute top-1/2 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-30 animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-1/2 right-0 w-1 h-32 bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-30 animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
        <div className="absolute top-1/6 left-3/4 w-1 h-24 bg-gradient-to-b from-transparent via-pink-400 to-transparent opacity-25 animate-pulse" style={{ animationDuration: '5s' }}></div>
        <div className="absolute top-1/3 right-3/4 w-1 h-20 bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-25 animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }}></div>
        <div className="absolute top-2/3 left-1/8 w-1 h-16 bg-gradient-to-b from-transparent via-green-400 to-transparent opacity-25 animate-pulse" style={{ animationDuration: '6s', animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/4 left-1/2 w-1 h-20 bg-gradient-to-b from-transparent via-yellow-400 to-transparent opacity-25 animate-pulse" style={{ animationDuration: '8s', animationDelay: '0.7s' }}></div>
        
        {/* Floating Particles - Spread across screen */}
        <div className="absolute top-1/8 left-1/3 w-1.5 h-1.5 bg-cyan-300 rounded-full opacity-50 animate-pulse" style={{ animationDuration: '4s', animationDelay: '0.3s' }}></div>
        <div className="absolute top-1/8 right-1/3 w-1 h-1 bg-yellow-300 rounded-full opacity-60 animate-pulse" style={{ animationDuration: '5s', animationDelay: '0.8s' }}></div>
        <div className="absolute top-1/8 left-2/3 w-2 h-2 bg-purple-300 rounded-full opacity-40 animate-pulse" style={{ animationDuration: '6s', animationDelay: '1.2s' }}></div>
        <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-yellow-300 rounded-full opacity-60 animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-cyan-300 rounded-full opacity-50 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute top-1/4 right-1/2 w-1 h-1 bg-pink-300 rounded-full opacity-50 animate-pulse" style={{ animationDuration: '6s', animationDelay: '0.9s' }}></div>
        <div className="absolute top-2/3 right-1/2 w-1.5 h-1.5 bg-green-300 rounded-full opacity-40 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1.5s' }}></div>
      </div>

      {/* Full Navigation Bar */}
      <nav className="bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-blue-900/80 border-b border-purple-700/50 sticky top-0 z-50 backdrop-blur-sm">
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

            {/* Desktop Navigation Links */}
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

      {/* Hamburger Menu Button */}
      <button
        onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
        className="fixed top-20 right-4 z-40 p-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full shadow-lg hover:scale-105 transition-all duration-200"
        title="Quick Navigation"
      >
        {showHamburgerMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Hamburger Menu Dropdown */}
      {showHamburgerMenu && (
        <div className="fixed top-28 right-4 z-40 bg-gradient-to-r from-purple-800/95 to-indigo-900/95 backdrop-blur-sm rounded-2xl p-4 border border-purple-400/30 shadow-2xl min-w-48">
          <div className="text-white font-bold text-sm mb-3 text-center">
            🚀 Quick Navigation
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => scrollToSection('game-modes')}
              className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-purple-700/50 rounded-md transition-colors flex items-center gap-2"
            >
              <Gamepad2 className="w-4 h-4" />
              🎯 BINGO Rooms
            </button>
            
            <button
              onClick={() => scrollToSection('tournaments')}
              className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-purple-700/50 rounded-md transition-colors flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              🏆 Tournaments
            </button>
            
            <button
              onClick={() => scrollToSection('bonus')}
              className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-purple-700/50 rounded-md transition-colors flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              ⚡ Bonus System
            </button>
            
            <button
              onClick={() => scrollToSection('mini-games')}
              className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-purple-700/50 rounded-md transition-colors flex items-center gap-2"
            >
              <Star className="w-4 h-4" />
              🎮 Mini Games
            </button>
            
            <button
              onClick={() => scrollToSection('leaderboard')}
              className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-purple-700/50 rounded-md transition-colors flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              📊 Leaderboard
            </button>
            
            <button
              onClick={() => scrollToSection('rewards')}
              className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-purple-700/50 rounded-md transition-colors flex items-center gap-2"
            >
              <Gift className="w-4 h-4" />
              🎁 Daily Rewards
            </button>
            
            <button
              onClick={() => scrollToSection('cashout')}
              className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-purple-700/50 rounded-md transition-colors flex items-center gap-2"
            >
              <Coins className="w-4 h-4" />
              💰 Cashout
            </button>
            
            <button
              onClick={scrollToTop}
              className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-purple-700/50 rounded-md transition-colors flex items-center gap-2"
            >
              <ChevronUp className="w-4 h-4" />
              🔝 Back to Top
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
        {/* Header Logo */}
        <div className="mb-3 flex justify-center">
          <img 
            src="/hero logo.png" 
            alt="BetBingoCash Logo" 
            className="h-16 w-auto object-contain"
          />
        </div>
        
        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4 drop-shadow-2xl">
          BINGO Game Rooms
        </h1>

        <GameModes />
      </main>

      {/* User Profile Modals */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <PaymentModal 
        isOpen={paymentModalOpen} 
        onClose={() => setPaymentModalOpen(false)}
        amount={25}
        onSuccess={(amount) => {
          console.log(`Payment successful: $${amount}`);
        }}
      />
      <UserProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
      <GemShopModal isOpen={gemShopModalOpen} onClose={() => setGemShopModalOpen(false)} />

      {/* Background Music Player */}
      <MusicPlayer />
    </div>
  );
};

export default AppLayout;