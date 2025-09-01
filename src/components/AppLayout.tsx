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
  Dice6,
  Zap,
  Target
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
    { name: '🎰 Casino Hub', path: '/casino', icon: Dice6, color: 'from-purple-500 to-purple-700' },
    { name: '🏈 Sports Betting', path: '/sports', icon: Zap, color: 'from-orange-500 to-orange-700' },
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
        {/* Main Casino Background - Dark Casino Interior */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 via-slate-800 to-slate-900"></div>
        
        {/* Casino Floor Pattern - Marble-like Texture */}
        <div className="absolute inset-0 opacity-15">
          <div className="w-full h-full" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(138, 43, 226, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(255, 69, 0, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 90% 20%, rgba(0, 255, 255, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 60% 50%, rgba(255, 20, 147, 0.06) 0%, transparent 50%)
            `,
            backgroundSize: '400px 400px, 300px 300px, 500px 500px, 350px 350px, 600px 600px'
          }}></div>
        </div>

        {/* Casino Wall Pattern - Subtle Stripes */}
        <div className="absolute inset-0 opacity-8">
          <div className="w-full h-full" style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 2px,
                rgba(255, 215, 0, 0.03) 2px,
                rgba(255, 215, 0, 0.03) 4px
              )
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Floating Casino Elements - Enhanced */}
        <div className="absolute inset-0">
          {/* Slot Machine Reels - More Realistic */}
          <div className="absolute top-20 left-10 w-32 h-32 opacity-8 animate-spin-slow">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 casino-slot rounded-full"></div>
              <div className="absolute inset-2 bg-gradient-to-b from-yellow-300 to-orange-400 rounded-full"></div>
              <div className="absolute inset-4 bg-gradient-to-b from-yellow-200 to-orange-300 rounded-full flex items-center justify-center text-2xl">🎰</div>
            </div>
          </div>
          
          {/* Poker Chips Stack - More Realistic */}
          <div className="absolute top-40 right-20 w-24 h-24 opacity-8 animate-bounce-slow">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 casino-chip rounded-full"></div>
              <div className="absolute inset-1 bg-gradient-to-b from-red-400 to-pink-500 rounded-full"></div>
              <div className="absolute inset-2 bg-gradient-to-b from-red-300 to-pink-400 rounded-full"></div>
              <div className="absolute inset-3 bg-gradient-to-b from-red-200 to-pink-300 rounded-full flex items-center justify-center text-lg">🃏</div>
            </div>
          </div>
          
          {/* Dice - More Realistic */}
          <div className="absolute bottom-32 left-32 w-20 h-20 opacity-8 animate-float">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 casino-dice rounded-lg shadow-lg"></div>
              <div className="absolute inset-1 bg-gradient-to-br from-blue-300 to-purple-500 rounded-lg"></div>
              <div className="absolute inset-2 bg-gradient-to-br from-blue-200 to-purple-400 rounded-lg flex items-center justify-center text-sm">🎲</div>
            </div>
          </div>
          
          {/* Roulette Wheel - More Realistic */}
          <div className="absolute bottom-20 right-32 w-28 h-28 opacity-8 animate-spin-slow">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 casino-roulette rounded-full"></div>
              <div className="absolute inset-2 bg-gradient-to-b from-green-300 via-teal-400 to-blue-500 rounded-full"></div>
              <div className="absolute inset-4 bg-gradient-to-b from-green-200 via-teal-300 to-blue-400 rounded-full flex items-center justify-center text-xl">🎡</div>
            </div>
          </div>

          {/* Additional Casino Elements */}
          {/* Golden Coins */}
          <div className="absolute top-60 left-1/4 w-16 h-16 opacity-6 animate-float">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full animate-glow"></div>
              <div className="absolute inset-2 bg-gradient-to-b from-yellow-300 to-orange-400 rounded-full flex items-center justify-center text-lg">🪙</div>
            </div>
          </div>

          {/* Playing Cards */}
          <div className="absolute top-80 right-1/3 w-20 h-16 opacity-6 animate-bounce-slow">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 casino-poker rounded-lg shadow-lg"></div>
              <div className="absolute inset-1 bg-gradient-to-br from-white to-gray-100 rounded-lg flex items-center justify-center text-sm">🃏</div>
            </div>
          </div>

          {/* Casino Chandelier Effect */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-40 h-40 opacity-4">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-200/20 to-transparent rounded-full animate-pulse"></div>
              <div className="absolute inset-10 bg-gradient-to-b from-transparent via-yellow-300/15 to-transparent rounded-full animate-pulse delay-1000"></div>
              <div className="absolute inset-20 bg-gradient-to-b from-transparent via-yellow-400/10 to-transparent rounded-full animate-pulse delay-2000"></div>
            </div>
          </div>

          {/* Casino Sparkles */}
          <div className="casino-sparkle" style={{ top: '15%', left: '20%', animationDelay: '0s' }}></div>
          <div className="casino-sparkle" style={{ top: '25%', right: '15%', animationDelay: '0.5s' }}></div>
          <div className="casino-sparkle" style={{ bottom: '30%', left: '15%', animationDelay: '1s' }}></div>
          <div className="casino-sparkle" style={{ bottom: '25%', right: '25%', animationDelay: '1.5s' }}></div>
          <div className="casino-sparkle" style={{ top: '50%', left: '50%', animationDelay: '2s' }}></div>
          <div className="casino-sparkle" style={{ top: '70%', right: '40%', animationDelay: '2.5s' }}></div>

          {/* Additional Casino Elements */}
          {/* Casino Tables */}
          <div className="absolute top-1/2 left-1/4 w-32 h-24 opacity-6 animate-float">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 casino-felt rounded-xl"></div>
              <div className="absolute inset-2 bg-green-600/80 rounded-lg flex items-center justify-center text-lg">🃏</div>
            </div>
          </div>

          {/* Casino Bar */}
          <div className="absolute bottom-40 left-1/3 w-28 h-20 opacity-6 animate-bounce-slow">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg"></div>
              <div className="absolute inset-2 bg-gradient-to-b from-amber-700 to-amber-800 rounded-lg flex items-center justify-center text-lg">🍸</div>
            </div>
          </div>

          {/* Casino Security Camera */}
          <div className="absolute top-32 right-1/4 w-16 h-16 opacity-8 animate-pulse">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-800 rounded-full"></div>
              <div className="absolute inset-2 bg-gradient-to-b from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-sm">📹</div>
            </div>
          </div>

          {/* Casino ATM */}
          <div className="absolute bottom-60 right-1/4 w-20 h-16 opacity-6 animate-bounce-slow">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-700 to-blue-800 rounded-lg"></div>
              <div className="absolute inset-2 bg-gradient-to-b from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-sm">🏧</div>
            </div>
          </div>

          {/* Casino VIP Lounge Entrance - Enhanced */}
          <div className="absolute top-1/3 right-1/3 w-24 h-20 opacity-7 animate-glow casino-pulse-glow">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-lg casino-lights"></div>
              <div className="absolute inset-2 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-lg flex items-center justify-center text-lg casino-bling">👑</div>
            </div>
          </div>

          {/* Casino Slot Machine Row - Enhanced */}
          <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-48 h-16 opacity-5">
            <div className="w-full h-full relative flex space-x-2">
              <div className="w-12 h-16 casino-slot rounded-lg flex items-center justify-center text-lg casino-lights">🎰</div>
              <div className="w-12 h-16 casino-slot rounded-lg flex items-center justify-center text-lg casino-lights" style={{ animationDelay: '0.5s' }}>🎰</div>
              <div className="w-12 h-16 casino-slot rounded-lg flex items-center justify-center text-lg casino-lights" style={{ animationDelay: '1s' }}>🎰</div>
              <div className="w-12 h-16 casino-slot rounded-lg flex items-center justify-center text-lg casino-lights" style={{ animationDelay: '1.5s' }}>🎰</div>
            </div>
          </div>
        </div>

        {/* Subtle Grid Pattern - Casino Floor */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(255, 215, 0, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 215, 0, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Ambient Lighting Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-200/10 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-purple-200/10 via-transparent to-transparent"></div>
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-blue-200/10 via-transparent to-transparent"></div>
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-red-200/10 via-transparent to-transparent"></div>
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
          <h2 className="text-4xl font-bold text-white mb-4 casino-neon">🎰 Welcome to the Ultimate Gaming Empire</h2>
          <p className="text-white/80 text-lg">Choose your game and start winning big!</p>
        </div>

        {/* Quick Access Game Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {quickAccessGames.map((game) => (
            <button
              key={game.name}
              className={`${game.color} hover:scale-105 transition-all duration-200 rounded-2xl p-6 text-white text-center shadow-lg hover:shadow-2xl casino-card`}
            >
              <div className="text-3xl mb-2">{game.icon}</div>
              <div className="text-sm font-medium">{game.name}</div>
            </button>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="casino-card rounded-2xl p-6 text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-white font-bold text-xl mb-2 casino-neon">Massive Tournaments</h3>
            <p className="text-white/60">Compete for prizes up to $100,000 in epic tournaments</p>
          </div>
          
          <div className="casino-card rounded-2xl p-6 text-center">
            <div className="text-4xl mb-4">👑</div>
            <h3 className="text-white font-bold text-xl mb-2 casino-neon">VIP Benefits</h3>
            <p className="text-white/60">Get up to 100% bonus on all winnings with VIP membership</p>
          </div>
          
          <div className="casino-card rounded-2xl p-6 text-center">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-white font-bold text-xl mb-2 casino-neon">Crypto Ready</h3>
            <p className="text-white/60">Deposit and withdraw with USDC, USDT, BTC, and ETH</p>
          </div>
        </div>

        {/* Casino Table Felt Area */}
        <div className="casino-felt rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <h3 className="text-3xl font-bold text-white mb-4 casino-neon">🎲 Live Casino Tables</h3>
            <p className="text-white/90 text-lg mb-6">Experience the thrill of live casino games with real dealers</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
                <div className="text-2xl mb-2">🃏</div>
                <div className="text-white font-semibold">Blackjack</div>
                <div className="text-white/70 text-sm">Live Dealers</div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
                <div className="text-2xl mb-2">🎡</div>
                <div className="text-white font-semibold">Roulette</div>
                <div className="text-white/70 text-sm">Multiple Tables</div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
                <div className="text-2xl mb-2">🎰</div>
                <div className="text-white font-semibold">Slots</div>
                <div className="text-white/70 text-sm">Progressive Jackpots</div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
                <div className="text-2xl mb-2">🎲</div>
                <div className="text-white font-semibold">Craps</div>
                <div className="text-white/70 text-sm">High Stakes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Casino VIP Lounge */}
        <div className="bg-gradient-to-r from-yellow-900/30 via-amber-800/30 to-yellow-900/30 rounded-3xl p-8 mb-8 relative overflow-hidden border border-yellow-500/30">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-amber-400/10 to-yellow-400/10 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <h3 className="text-3xl font-bold text-yellow-300 mb-4 casino-neon">👑 VIP Casino Lounge</h3>
            <p className="text-yellow-200/90 text-lg mb-6">Exclusive high-roller experience with premium amenities</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-yellow-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-yellow-500/30">
                <div className="text-4xl mb-4">💎</div>
                <h4 className="text-yellow-200 font-bold text-xl mb-2">Diamond VIP</h4>
                <p className="text-yellow-200/70 mb-3">$100K+ monthly play</p>
                <ul className="text-yellow-200/80 text-sm space-y-1">
                  <li>• Personal Account Manager</li>
                  <li>• 100% Welcome Bonus</li>
                  <li>• Exclusive Tournaments</li>
                  <li>• Private Gaming Rooms</li>
                </ul>
              </div>
              
              <div className="bg-yellow-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-yellow-500/30">
                <div className="text-4xl mb-4">🏆</div>
                <h4 className="text-yellow-200 font-bold text-xl mb-2">Platinum VIP</h4>
                <p className="text-yellow-200/70 mb-3">$50K+ monthly play</p>
                <ul className="text-yellow-200/80 text-sm space-y-1">
                  <li>• Priority Support</li>
                  <li>• 75% Welcome Bonus</li>
                  <li>• VIP Tournaments</li>
                  <li>• Cashback Rewards</li>
                </ul>
              </div>
              
              <div className="bg-yellow-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-yellow-500/30">
                <div className="text-4xl mb-4">⭐</div>
                <h4 className="text-yellow-200 font-bold text-xl mb-2">Gold VIP</h4>
                <p className="text-yellow-200/70 mb-3">$25K+ monthly play</p>
                <ul className="text-yellow-200/80 text-sm space-y-1">
                  <li>• Dedicated Support</li>
                  <li>• 50% Welcome Bonus</li>
                  <li>• Special Events</li>
                  <li>• Loyalty Points</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Casino Promotions & Jackpots */}
        <div className="bg-gradient-to-r from-purple-900/30 via-pink-800/30 to-purple-900/30 rounded-3xl p-8 mb-8 relative overflow-hidden border border-purple-500/30">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-purple-400/10 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <h3 className="text-3xl font-bold text-purple-300 mb-4 casino-neon">🎁 Promotions & Jackpots</h3>
            <p className="text-purple-200/90 text-lg mb-6">Massive jackpots and exclusive promotions waiting for you</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-purple-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-purple-500/30">
                <div className="text-4xl mb-4">💰</div>
                <h4 className="text-purple-200 font-bold text-xl mb-2">Progressive Jackpots</h4>
                <div className="text-3xl font-bold text-yellow-400 mb-3 casino-neon">$2,847,392</div>
                <p className="text-purple-200/70 mb-3">Current Mega Jackpot</p>
                <div className="space-y-2 text-purple-200/80 text-sm">
                  <div className="flex justify-between">
                    <span>Mega Fortune:</span>
                    <span className="text-yellow-400">$847,392</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hall of Gods:</span>
                    <span className="text-yellow-400">$1,234,567</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mega Moolah:</span>
                    <span className="text-yellow-400">$765,433</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-purple-500/30">
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="text-purple-200 font-bold text-xl mb-2">Current Promotions</h4>
                <div className="space-y-4 text-purple-200/80">
                  <div className="bg-purple-800/40 rounded-lg p-3">
                    <div className="text-lg font-semibold text-yellow-300">🎉 Welcome Package</div>
                    <div className="text-sm">200% up to $2000 + 200 Free Spins</div>
                  </div>
                  <div className="bg-purple-800/40 rounded-lg p-3">
                    <div className="text-lg font-semibold text-yellow-300">🔥 Hot Streak</div>
                    <div className="text-sm">Win 3 games in a row, get 50% bonus</div>
                  </div>
                  <div className="bg-purple-800/40 rounded-lg p-3">
                    <div className="text-lg font-semibold text-yellow-300">💎 Crypto Bonus</div>
                    <div className="text-sm">25% extra on all crypto deposits</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Casino Statistics & Leaderboard */}
        <div className="bg-gradient-to-r from-blue-900/30 via-cyan-800/30 to-blue-900/30 rounded-3xl p-8 mb-8 relative overflow-hidden border border-blue-500/30">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-cyan-400/10 to-blue-400/10 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <h3 className="text-3xl font-bold text-blue-300 mb-4 casino-neon">📊 Casino Statistics & Winners</h3>
            <p className="text-blue-200/90 text-lg mb-6">Real-time casino statistics and recent big winners</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-blue-500/30">
                <div className="text-4xl mb-4">🎰</div>
                <h4 className="text-blue-200 font-bold text-xl mb-2">Active Players</h4>
                <div className="text-3xl font-bold text-cyan-400 mb-2 casino-neon">1,847</div>
                <p className="text-blue-200/70 text-sm">Currently Online</p>
              </div>
              
              <div className="bg-blue-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-blue-500/30">
                <div className="text-4xl mb-4">🏆</div>
                <h4 className="text-blue-200 font-bold text-xl mb-2">Total Payouts</h4>
                <div className="text-3xl font-bold text-cyan-400 mb-2 casino-neon">$12.4M</div>
                <p className="text-blue-200/70 text-sm">This Month</p>
              </div>
              
              <div className="bg-blue-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-blue-500/30">
                <div className="text-4xl mb-4">🎲</div>
                <h4 className="text-blue-200 font-bold text-xl mb-2">Games Played</h4>
                <div className="text-3xl font-bold text-cyan-400 mb-2 casino-neon">847K</div>
                <p className="text-blue-200/70 text-sm">Today</p>
              </div>
            </div>

            <div className="bg-blue-900/40 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
              <h4 className="text-blue-200 font-bold text-xl mb-4">🏅 Recent Big Winners</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-blue-800/40 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <div className="text-blue-200 font-semibold">LuckyPlayer_847</div>
                      <div className="text-blue-200/70 text-sm">Won $847,392 on Mega Fortune</div>
                    </div>
                  </div>
                  <div className="text-yellow-400 font-bold">$847,392</div>
                </div>
                
                <div className="flex items-center justify-between bg-blue-800/40 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <div className="text-blue-200 font-semibold">HighRoller_2024</div>
                      <div className="text-blue-200/70 text-sm">Won $234,567 on Hall of Gods</div>
                    </div>
                  </div>
                  <div className="text-yellow-400 font-bold">$234,567</div>
                </div>
                
                <div className="flex items-center justify-between bg-blue-800/40 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <div className="text-blue-200 font-semibold">SlotMaster_99</div>
                      <div className="text-blue-200/70 text-sm">Won $165,433 on Mega Moolah</div>
                    </div>
                  </div>
                  <div className="text-yellow-400 font-bold">$165,433</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Casino Grand Entrance */}
        <div className="bg-gradient-to-r from-red-900/30 via-pink-800/30 to-red-900/30 rounded-3xl p-8 mb-8 relative overflow-hidden border border-red-500/30 casino-smoke">
          <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 via-pink-400/10 to-red-400/10 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <h3 className="text-4xl font-bold text-red-300 mb-4 casino-neon casino-bling">🎰 WELCOME TO BETBINGO CASH 🎰</h3>
            <p className="text-red-200/90 text-lg mb-6">The Ultimate Casino Gaming Experience</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-red-500/30 casino-3d-card">
                <div className="text-5xl mb-4">🎊</div>
                <h4 className="text-red-200 font-bold text-xl mb-2 casino-neon">Grand Opening</h4>
                <p className="text-red-200/70 mb-3">Celebrating our launch with massive bonuses</p>
                <div className="text-2xl font-bold text-yellow-400 casino-neon">24/7 Gaming</div>
                <p className="text-red-200/60 text-sm">Never stop winning</p>
              </div>
              
              <div className="bg-red-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-red-500/30 casino-3d-card">
                <div className="text-5xl mb-4">🚀</div>
                <h4 className="text-red-200 font-bold text-xl mb-2 casino-neon">Instant Play</h4>
                <p className="text-red-200/70 mb-3">No downloads, play instantly</p>
                <div className="text-2xl font-bold text-yellow-400 casino-neon">Mobile Ready</div>
                <p className="text-red-200/60 text-sm">Play anywhere, anytime</p>
              </div>
            </div>
            
            <div className="mt-8">
              <button className="casino-button px-8 py-4 rounded-xl text-xl font-bold casino-neon-border">
                🎯 START PLAYING NOW
              </button>
            </div>
          </div>
        </div>

        {/* Casino Audio & Atmosphere Controls */}
        <div className="bg-gradient-to-r from-indigo-900/30 via-purple-800/30 to-indigo-900/30 rounded-3xl p-8 mb-8 relative overflow-hidden border border-indigo-500/30">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 via-purple-400/10 to-indigo-400/10 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <h3 className="text-3xl font-bold text-indigo-300 mb-4 casino-neon">🎵 Casino Atmosphere Controls</h3>
            <p className="text-indigo-200/90 text-lg mb-6">Customize your casino experience with audio and visual effects</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-indigo-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-indigo-500/30">
                <div className="text-4xl mb-4">🎵</div>
                <h4 className="text-indigo-200 font-bold text-xl mb-2">Background Music</h4>
                <div className="space-y-3">
                  <button className="w-full bg-indigo-700/60 hover:bg-indigo-600/60 text-white px-4 py-2 rounded-lg transition-colors">
                    🎰 Slot Machine Sounds
                  </button>
                  <button className="w-full bg-indigo-700/60 hover:bg-indigo-600/60 text-white px-4 py-2 rounded-lg transition-colors">
                    🃏 Poker Room Ambience
                  </button>
                  <button className="w-full bg-indigo-700/60 hover:bg-indigo-600/60 text-white px-4 py-2 rounded-lg transition-colors">
                    🎡 Roulette Excitement
                  </button>
                </div>
              </div>
              
              <div className="bg-indigo-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-indigo-500/30">
                <div className="text-4xl mb-4">🔊</div>
                <h4 className="text-indigo-200 font-bold text-xl mb-2">Sound Effects</h4>
                <div className="space-y-3">
                  <button className="w-full bg-indigo-700/60 hover:bg-indigo-600/60 text-white px-4 py-2 rounded-lg transition-colors">
                    🎲 Dice Rolling
                  </button>
                  <button className="w-full bg-indigo-700/60 hover:bg-indigo-600/60 text-white px-4 py-2 rounded-lg transition-colors">
                    🪙 Coin Dropping
                  </button>
                  <button className="w-full bg-indigo-700/60 hover:bg-indigo-600/60 text-white px-4 py-2 rounded-lg transition-colors">
                    🏆 Win Celebrations
                  </button>
                </div>
              </div>
              
              <div className="bg-indigo-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-indigo-500/30">
                <div className="text-4xl mb-4">✨</div>
                <h4 className="text-indigo-200 font-bold text-xl mb-2">Visual Effects</h4>
                <div className="space-y-3">
                  <button className="w-full bg-indigo-700/60 hover:bg-indigo-600/60 text-white px-4 py-2 rounded-lg transition-colors">
                    🌟 Enhanced Sparkles
                  </button>
                  <button className="w-full bg-indigo-700/60 hover:bg-indigo-600/60 text-white px-4 py-2 rounded-lg transition-colors">
                    💫 Neon Glows
                  </button>
                  <button className="w-full bg-indigo-700/60 hover:bg-indigo-600/60 text-white px-4 py-2 rounded-lg transition-colors">
                    🎭 3D Animations
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Casino Live Dealers */}
        <div className="bg-gradient-to-r from-emerald-900/30 via-teal-800/30 to-emerald-900/30 rounded-3xl p-8 mb-8 relative overflow-hidden border border-emerald-500/30">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-teal-400/10 to-emerald-400/10 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <h3 className="text-3xl font-bold text-emerald-300 mb-4 casino-neon">👥 Live Casino Dealers</h3>
            <p className="text-emerald-200/90 text-lg mb-6">Meet our professional live dealers for an authentic casino experience</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-emerald-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-emerald-500/30 casino-3d-card">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-3xl">👨‍💼</div>
                <h4 className="text-emerald-200 font-bold text-lg mb-2">Alex Thompson</h4>
                <p className="text-emerald-200/70 text-sm mb-2">Blackjack Specialist</p>
                <div className="text-xs text-emerald-200/60">5+ years experience</div>
                <div className="mt-3">
                  <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full">LIVE</span>
                </div>
              </div>
              
              <div className="bg-emerald-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-emerald-500/30 casino-3d-card">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-red-600 rounded-full flex items-center justify-center text-3xl">👩‍💼</div>
                <h4 className="text-emerald-200 font-bold text-lg mb-2">Sarah Chen</h4>
                <p className="text-emerald-200/70 text-sm mb-2">Roulette Expert</p>
                <div className="text-xs text-emerald-200/60">7+ years experience</div>
                <div className="mt-3">
                  <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full">LIVE</span>
                </div>
              </div>
              
              <div className="bg-emerald-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-emerald-500/30 casino-3d-card">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center text-3xl">👨‍💼</div>
                <h4 className="text-emerald-200 font-bold text-lg mb-2">Mike Rodriguez</h4>
                <p className="text-emerald-200/70 text-sm mb-2">Poker Master</p>
                <div className="text-xs text-emerald-200/60">10+ years experience</div>
                <div className="mt-3">
                  <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full">LIVE</span>
                </div>
              </div>
              
              <div className="bg-emerald-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-emerald-500/30 casino-3d-card">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center text-3xl">👩‍💼</div>
                <h4 className="text-emerald-200 font-bold text-lg mb-2">Emma Wilson</h4>
                <p className="text-emerald-200/70 text-sm mb-2">Craps Professional</p>
                <div className="text-xs text-emerald-200/60">6+ years experience</div>
                <div className="mt-3">
                  <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full">LIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Casino Tournament System */}
        <div className="bg-gradient-to-r from-orange-900/30 via-red-800/30 to-orange-900/30 rounded-3xl p-8 mb-8 relative overflow-hidden border border-orange-500/30">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-red-400/10 to-orange-400/10 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <h3 className="text-3xl font-bold text-orange-300 mb-4 casino-neon">🏆 Casino Tournament System</h3>
            <p className="text-orange-200/90 text-lg mb-6">Compete in epic tournaments with massive prize pools</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-orange-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-orange-500/30">
                <div className="text-4xl mb-4">🔥</div>
                <h4 className="text-orange-200 font-bold text-xl mb-2">Daily Tournaments</h4>
                <div className="space-y-3 text-orange-200/80">
                  <div className="bg-orange-800/40 rounded-lg p-3">
                    <div className="text-lg font-semibold text-yellow-300">🎰 Slot Masters</div>
                    <div className="text-sm">Prize Pool: $50,000</div>
                    <div className="text-xs text-orange-200/60">Starts in 2 hours</div>
                  </div>
                  <div className="bg-orange-800/40 rounded-lg p-3">
                    <div className="text-lg font-semibold text-yellow-300">🃏 Poker Champions</div>
                    <div className="text-sm">Prize Pool: $75,000</div>
                    <div className="text-xs text-orange-200/60">Starts in 4 hours</div>
                  </div>
                  <div className="bg-orange-800/40 rounded-lg p-3">
                    <div className="text-lg font-semibold text-yellow-300">🎡 Roulette Royale</div>
                    <div className="text-sm">Prize Pool: $30,000</div>
                    <div className="text-xs text-orange-200/60">Starts in 6 hours</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-orange-500/30">
                <div className="text-4xl mb-4">💎</div>
                <h4 className="text-orange-200 font-bold text-xl mb-2">Weekly Championships</h4>
                <div className="space-y-3 text-orange-200/80">
                  <div className="bg-orange-800/40 rounded-lg p-3">
                    <div className="text-lg font-semibold text-yellow-300">👑 VIP Masters</div>
                    <div className="text-sm">Prize Pool: $250,000</div>
                    <div className="text-xs text-orange-200/60">VIP Players Only</div>
                  </div>
                  <div className="bg-orange-800/40 rounded-lg p-3">
                    <div className="text-lg font-semibold text-yellow-300">🌍 Global Cup</div>
                    <div className="text-sm">Prize Pool: $500,000</div>
                    <div className="text-xs text-orange-200/60">International Event</div>
                  </div>
                  <div className="bg-orange-800/40 rounded-lg p-3">
                    <div className="text-lg font-semibold text-yellow-300">🚀 Crypto Kings</div>
                    <div className="text-sm">Prize Pool: $100,000</div>
                    <div className="text-xs text-orange-200/60">Crypto Players</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-900/40 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
              <h4 className="text-orange-200 font-bold text-xl mb-4">🏅 Tournament Leaderboard</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-orange-800/40 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <div className="text-orange-200 font-semibold">TournamentKing_2024</div>
                      <div className="text-orange-200/70 text-sm">Won 15 tournaments</div>
                    </div>
                  </div>
                  <div className="text-yellow-400 font-bold">$847,392</div>
                </div>
                
                <div className="flex items-center justify-between bg-orange-800/40 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <div className="text-orange-200 font-semibold">PokerQueen_99</div>
                      <div className="text-orange-200/70 text-sm">Won 12 tournaments</div>
                    </div>
                  </div>
                  <div className="text-yellow-400 font-bold">$634,567</div>
                </div>
                
                <div className="flex items-center justify-between bg-orange-800/40 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <div className="text-orange-200 font-semibold">SlotMaster_Pro</div>
                      <div className="text-orange-200/70 text-sm">Won 10 tournaments</div>
                    </div>
                  </div>
                  <div className="text-yellow-400 font-bold">$465,433</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Casino Game Themes */}
        <div className="bg-gradient-to-r from-pink-900/30 via-rose-800/30 to-pink-900/30 rounded-3xl p-8 mb-8 relative overflow-hidden border border-pink-500/30">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400/10 via-rose-400/10 to-pink-400/10 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <h3 className="text-3xl font-bold text-pink-300 mb-4 casino-neon">🎭 Casino Game Themes</h3>
            <p className="text-pink-200/90 text-lg mb-6">Explore different casino atmospheres and game themes</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-pink-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-pink-500/30 casino-3d-card">
                <div className="text-4xl mb-4">🏰</div>
                <h4 className="text-pink-200 font-bold text-xl mb-2">Royal Palace</h4>
                <p className="text-pink-200/70 mb-3">Luxury casino with gold accents</p>
                <div className="space-y-2 text-pink-200/80 text-sm">
                  <div>• High-end table games</div>
                  <div>• VIP treatment</div>
                  <div>• Premium cocktails</div>
                </div>
              </div>
              
              <div className="bg-pink-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-pink-500/30 casino-3d-card">
                <div className="text-4xl mb-4">🌴</div>
                <h4 className="text-pink-200 font-bold text-xl mb-2">Tropical Paradise</h4>
                <p className="text-pink-200/70 mb-3">Beach-themed casino experience</p>
                <div className="space-y-2 text-pink-200/80 text-sm">
                  <div>• Island music</div>
                  <div>• Beach cocktails</div>
                  <div>• Relaxed atmosphere</div>
                </div>
              </div>
              
              <div className="bg-pink-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-pink-500/30 casino-3d-card">
                <div className="text-4xl mb-4">🚀</div>
                <h4 className="text-pink-200 font-bold text-xl mb-2">Cyber Future</h4>
                <p className="text-pink-200/70 mb-3">High-tech neon casino</p>
                <div className="space-y-2 text-pink-200/80 text-sm">
                  <div>• Neon lights</div>
                  <div>• Electronic music</div>
                  <div>• Futuristic games</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Casino Loyalty Program */}
        <div className="bg-gradient-to-r from-cyan-900/30 via-blue-800/30 to-cyan-900/30 rounded-3xl p-8 mb-8 relative overflow-hidden border border-cyan-500/30">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-blue-400/10 to-cyan-400/10 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <h3 className="text-3xl font-bold text-cyan-300 mb-4 casino-neon">🎁 Casino Loyalty Program</h3>
            <p className="text-cyan-200/90 text-lg mb-6">Earn points and unlock exclusive rewards as you play</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-cyan-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-cyan-500/30">
                <div className="text-4xl mb-4">⭐</div>
                <h4 className="text-cyan-200 font-bold text-lg mb-2">Bronze</h4>
                <p className="text-cyan-200/70 text-sm mb-2">0-999 points</p>
                <div className="text-xs text-cyan-200/60">Basic rewards</div>
              </div>
              
              <div className="bg-cyan-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-cyan-500/30">
                <div className="text-4xl mb-4">🥈</div>
                <h4 className="text-cyan-200 font-bold text-lg mb-2">Silver</h4>
                <p className="text-cyan-200/70 text-sm mb-2">1000-4999 points</p>
                <div className="text-xs text-cyan-200/60">Enhanced rewards</div>
              </div>
              
              <div className="bg-cyan-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-cyan-500/30">
                <div className="text-4xl mb-4">🥇</div>
                <h4 className="text-cyan-200 font-bold text-lg mb-2">Gold</h4>
                <p className="text-cyan-200/70 text-sm mb-2">5000-19999 points</p>
                <div className="text-xs text-cyan-200/60">Premium rewards</div>
              </div>
              
              <div className="bg-cyan-900/40 backdrop-blur-sm rounded-xl p-6 text-center border border-cyan-500/30">
                <div className="text-4xl mb-4">💎</div>
                <h4 className="text-cyan-200 font-bold text-lg mb-2">Platinum</h4>
                <p className="text-cyan-200/70 text-sm mb-2">20000+ points</p>
                <div className="text-xs text-cyan-200/60">Elite rewards</div>
              </div>
            </div>

            <div className="bg-cyan-900/40 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
              <h4 className="text-cyan-200 font-bold text-xl mb-4">🎯 Current Status</h4>
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 casino-neon">2,847</div>
                  <div className="text-cyan-200/70 text-sm">Points Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 casino-neon">Silver</div>
                  <div className="text-cyan-200/70 text-sm">Current Tier</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 casino-neon">2,153</div>
                  <div className="text-cyan-200/70 text-sm">To Next Tier</div>
                </div>
              </div>
              <div className="w-full bg-cyan-800/40 rounded-full h-3">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full" style={{ width: '57%' }}></div>
              </div>
            </div>
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