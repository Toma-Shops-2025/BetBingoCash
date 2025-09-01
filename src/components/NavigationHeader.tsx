import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { 
  Menu, 
  X, 
  Home, 
  Gamepad2, 
  Trophy, 
  Crown, 
  DollarSign, 
  Users, 
  Settings,
  LogOut,
  Wallet,
  Star,
  Target,
  TrendingUp,
  Award,
  Dice6,
  Zap,
  ArrowLeft,
  User
} from 'lucide-react';

const NavigationHeader: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { name: '🏠 Home', path: '/', icon: Home, color: 'from-blue-500 to-blue-700' },
    { name: '🎯 Classic BINGO', path: '/classic-bingo', icon: Target, color: 'from-green-500 to-green-700' },
    { name: '⚡ Speed BINGO', path: '/speed-bingo', icon: Zap, color: 'from-blue-500 to-blue-700' },
    { name: '💰 Progressive BINGO', path: '/progressive-bingo', icon: DollarSign, color: 'from-yellow-500 to-yellow-700' },
    { name: '🎰 Fortune Slots', path: '/fortune-slots', icon: Dice6, color: 'from-purple-500 to-purple-700' },
    { name: '🃏 Live Blackjack', path: '/live-blackjack', icon: Award, color: 'from-red-500 to-red-700' },
    { name: '🏈 Sports Betting', path: '/sports', icon: TrendingUp, color: 'from-orange-500 to-orange-700' },
    { name: '🏆 Tournaments', path: '/tournaments', icon: Trophy, color: 'from-yellow-400 to-orange-500' },
    { name: '👑 VIP Membership', path: '/vip', icon: Crown, color: 'from-yellow-400 to-orange-500' },
    { name: '⭐ Achievements', path: '/achievements', icon: Star, color: 'from-indigo-500 to-indigo-700' },
    { name: '💎 Crypto Payments', path: '/crypto', icon: Wallet, color: 'from-emerald-500 to-emerald-700' },
    { name: '💳 Payment System', path: '/payment', icon: DollarSign, color: 'from-green-500 to-green-700' },
    { name: '👤 User Dashboard', path: '/dashboard', icon: Users, color: 'from-blue-600 to-blue-800' },
    { name: '⚙️ Settings', path: '/settings', icon: Settings, color: 'from-gray-500 to-gray-700' }
  ];

  // Check if we're on a game page
  const isGamePage = location.pathname.includes('-bingo') || 
                    location.pathname.includes('-slots') || 
                    location.pathname.includes('-blackjack') ||
                    location.pathname.includes('sports') ||
                    location.pathname.includes('tournaments');

  // Get page title
  const getPageTitle = () => {
    const currentItem = navigationItems.find(item => item.path === location.pathname);
    if (currentItem) return currentItem.name;
    
    if (location.pathname === '/') return '🏠 BetBingo Casino';
    return '🎰 Casino Games';
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Navigation Header - Always Visible */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Logo and Back Button */}
            <div className="flex items-center space-x-4">
              {/* Back Button for Game Pages */}
              {isGamePage && (
                <Button
                  onClick={() => navigate('/')}
                  variant="ghost"
                  className="text-white hover:bg-white/10 p-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              
              {/* Logo/Home Button */}
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors"
              >
                <div className="text-2xl">🎰</div>
                <span className="font-bold text-lg hidden sm:block">BetBingo</span>
              </button>
            </div>

            {/* Center Section - Page Title */}
            <div className="hidden md:block">
              <h1 className="text-white font-semibold text-lg">
                {getPageTitle()}
              </h1>
            </div>

            {/* Right Section - User Menu and Hamburger */}
            <div className="flex items-center space-x-4">
              {/* User Info */}
              {isAuthenticated && user && (
                <div className="hidden md:flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-white text-sm font-medium">{user.username}</div>
                    <div className="text-white/60 text-xs">Balance: ${user.balance.usdc}</div>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              {/* Login/Register Button */}
              {!isAuthenticated && (
                <Button
                  onClick={() => navigate('/login')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
                >
                  Login / Register
                </Button>
              )}

              {/* Logout Button */}
              {isAuthenticated && (
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-white hover:bg-white/10 hidden md:block"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              )}

              {/* Hamburger Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-yellow-400 transition-colors p-2"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-md">
          <div className="pt-20 px-4 pb-6">
            {/* User Info Section */}
            {isAuthenticated && user && (
              <div className="bg-white/10 rounded-2xl p-6 mb-6 border border-white/20">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-white text-xl font-bold">{user.username}</div>
                    <div className="text-white/60">Balance: ${user.balance.usdc}</div>
                    <div className="text-white/60 text-sm">VIP: {user.isVIP ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Items */}
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center space-x-4 ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
            </div>

            {/* Logout Button */}
            {isAuthenticated && (
              <div className="mt-6">
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full py-4 text-lg"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </Button>
              </div>
            )}

            {/* Login Button */}
            {!isAuthenticated && (
              <div className="mt-6">
                <Button
                  onClick={() => handleNavigation('/login')}
                  className="w-full bg-green-600 hover:bg-green-700 py-4 text-lg"
                >
                  <User className="w-5 h-5 mr-2" />
                  Login / Register
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16"></div>
    </>
  );
};

export default NavigationHeader; 