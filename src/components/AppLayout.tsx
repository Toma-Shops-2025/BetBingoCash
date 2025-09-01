import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
  Casino,
  Football,
  Basketball,
  Zap
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { name: '🏠 Home', path: '/', icon: Home, color: 'from-blue-500 to-blue-700' },
    { name: '🎯 BINGO Rooms', path: '/bingo', icon: Target, color: 'from-green-500 to-green-700' },
    { name: '🎰 Casino Hub', path: '/casino', icon: Casino, color: 'from-purple-500 to-purple-700' },
    { name: '🏈 Sports Betting', path: '/sports', icon: Football, color: 'from-orange-500 to-orange-700' },
    { name: '🏆 Tournaments', path: '/tournaments', icon: Trophy, color: 'from-yellow-500 to-yellow-700' },
    { name: '👑 VIP Membership', path: '/vip', icon: Crown, color: 'from-yellow-400 to-orange-500' },
    { name: '⭐ Achievements', path: '/achievements', icon: Star, color: 'from-indigo-500 to-indigo-700' },
    { name: '💎 Crypto Payments', path: '/crypto', icon: DollarSign, color: 'from-emerald-500 to-emerald-700' },
    { name: '👤 User Dashboard', path: '/dashboard', icon: Users, color: 'from-blue-600 to-blue-800' },
    { name: '⚙️ Settings', path: '/settings', icon: Settings, color: 'from-gray-500 to-gray-700' }
  ];

  const quickAccessGames = [
    { name: 'Classic BINGO', icon: '🎯', color: 'bg-green-500' },
    { name: 'Speed BINGO', icon: '⚡', color: 'bg-blue-500' },
    { name: 'Progressive BINGO', icon: '💰', color: 'bg-yellow-500' },
    { name: 'Fortune Slots', icon: '🎰', color: 'bg-purple-500' },
    { name: 'Live Blackjack', icon: '🃏', color: 'bg-red-500' },
    { name: 'Sports Betting', icon: '🏈', color: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Professional Casino Background */}
      <div className="fixed inset-0 z-0">
        {/* Main Casino Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        
        {/* Casino Floor Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(138, 43, 226, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(255, 69, 0, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 90% 20%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)
            `,
            backgroundSize: '400px 400px, 300px 300px, 500px 500px, 350px 350px'
          }}></div>
        </div>

        {/* Floating Casino Elements */}
        <div className="absolute inset-0">
          {/* Slot Machine Reels */}
          <div className="absolute top-20 left-10 w-32 h-32 opacity-10 animate-spin-slow">
            <div className="w-full h-full bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full"></div>
          </div>
          
          {/* Poker Chips */}
          <div className="absolute top-40 right-20 w-24 h-24 opacity-10 animate-bounce-slow">
            <div className="w-full h-full bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
          </div>
          
          {/* Dice */}
          <div className="absolute bottom-32 left-32 w-20 h-20 opacity-10 animate-pulse">
            <div className="w-full h-full bg-gradient-to-b from-blue-400 to-purple-500 rounded-lg"></div>
          </div>
          
          {/* Roulette Wheel */}
          <div className="absolute bottom-20 right-32 w-28 h-28 opacity-10 animate-spin-slow">
            <div className="w-full h-full bg-gradient-to-b from-green-400 to-teal-500 rounded-full"></div>
          </div>
        </div>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎰</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">BetBingoCash</h1>
                <p className="text-xs text-white/60">Ultimate Gaming Empire</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-1">
              {navigationItems.slice(0, 6).map((item) => (
                <button
                  key={item.name}
                  className={`px-4 py-2 rounded-lg text-white/80 hover:text-white transition-all duration-200 hover:bg-white/10 flex items-center gap-2`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.name.split(' ')[1]}</span>
                </button>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm text-white font-medium">{user.username}</p>
                    <p className="text-xs text-white/60">Balance: ${(user.balance.usdc + user.balance.usdt).toFixed(2)}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105">
                  Connect Wallet
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden relative z-20 bg-black/95 backdrop-blur-md border-b border-white/10">
          <div className="px-4 py-6 space-y-3">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                className={`w-full text-left px-4 py-3 rounded-lg text-white/80 hover:text-white transition-all duration-200 hover:bg-white/10 flex items-center gap-3`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Access Gaming Hub */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">🎰 Welcome to the Ultimate Gaming Empire</h2>
          <p className="text-white/80 text-lg">Choose your game and start winning big!</p>
        </div>

        {/* Quick Access Game Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {quickAccessGames.map((game) => (
            <button
              key={game.name}
              className={`${game.color} hover:scale-105 transition-all duration-200 rounded-2xl p-6 text-white text-center shadow-lg hover:shadow-2xl`}
            >
              <div className="text-3xl mb-2">{game.icon}</div>
              <div className="text-sm font-medium">{game.name}</div>
            </button>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-white font-bold text-xl mb-2">Massive Tournaments</h3>
            <p className="text-white/60">Compete for prizes up to $100,000 in epic tournaments</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-4xl mb-4">👑</div>
            <h3 className="text-white font-bold text-xl mb-2">VIP Benefits</h3>
            <p className="text-white/60">Get up to 100% bonus on all winnings with VIP membership</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-white font-bold text-xl mb-2">Crypto Ready</h3>
            <p className="text-white/60">Deposit and withdraw with USDC, USDT, BTC, and ETH</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-black/20 backdrop-blur-md border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">BetBingoCash</h3>
              <p className="text-white/60 text-sm">The ultimate gaming destination with massive jackpots and endless entertainment.</p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Games</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>BINGO Rooms</li>
                <li>Casino Games</li>
                <li>Sports Betting</li>
                <li>Live Casino</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>VIP Membership</li>
                <li>Tournaments</li>
                <li>Achievements</li>
                <li>Crypto Payments</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>Help Center</li>
                <li>Live Chat</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-white/60 text-sm">© 2024 BetBingoCash. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;