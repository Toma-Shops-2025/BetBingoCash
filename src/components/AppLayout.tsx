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