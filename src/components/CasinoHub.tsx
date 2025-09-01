import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { 
  Dice, 
  Cards, 
  SlotMachine, 
  Roulette, 
  Target, 
  Zap, 
  Crown,
  Star,
  TrendingUp,
  DollarSign,
  Users,
  Trophy
} from 'lucide-react';

interface CasinoGame {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'table' | 'slots' | 'card' | 'arcade' | 'live';
  minBet: number;
  maxBet: number;
  houseEdge: number;
  popularity: number;
  isNew: boolean;
  isHot: boolean;
  jackpot?: number;
  maxWin: number;
  features: string[];
}

const CasinoHub: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGame, setSelectedGame] = useState<CasinoGame | null>(null);
  const [showGameModal, setShowGameModal] = useState(false);

  const casinoGames: CasinoGame[] = [
    // BINGO Games (Your Core Product)
    {
      id: 'bingo_classic',
      name: 'Classic BINGO',
      description: 'Traditional 5x5 BINGO with powerups and multipliers',
      icon: '🎯',
      category: 'table',
      minBet: 5,
      maxBet: 100,
      houseEdge: 30,
      popularity: 95,
      isNew: false,
      isHot: true,
      maxWin: 10000,
      features: ['Powerups', 'Multipliers', 'Tournaments', 'Live Chat']
    },
    {
      id: 'bingo_speed',
      name: 'Speed BINGO',
      description: 'Ultra-fast 1-minute BINGO games',
      icon: '⚡',
      category: 'table',
      minBet: 2,
      maxBet: 50,
      houseEdge: 25,
      popularity: 88,
      isNew: true,
      isHot: true,
      maxWin: 5000,
      features: ['1-Minute Games', 'Speed Bonuses', 'Quick Payouts']
    },
    {
      id: 'bingo_progressive',
      name: 'Progressive BINGO',
      description: 'BINGO with growing jackpots that never reset',
      icon: '💰',
      category: 'table',
      minBet: 10,
      maxBet: 200,
      houseEdge: 35,
      popularity: 92,
      isNew: false,
      isHot: true,
      jackpot: 25000,
      maxWin: 100000,
      features: ['Growing Jackpots', 'Mega Prizes', 'VIP Access']
    },

    // Slot Games (Massive Revenue Generators)
    {
      id: 'slots_fortune',
      name: 'Fortune Slots',
      description: '5-reel video slots with 243 ways to win',
      icon: '🎰',
      category: 'slots',
      minBet: 0.10,
      maxBet: 100,
      houseEdge: 4,
      popularity: 96,
      isNew: false,
      isHot: true,
      jackpot: 50000,
      maxWin: 100000,
      features: ['243 Ways to Win', 'Free Spins', 'Bonus Rounds', 'Progressive Jackpots']
    },
    {
      id: 'slots_megaways',
      name: 'Megaways Slots',
      description: 'Up to 117,649 ways to win with cascading reels',
      icon: '🎲',
      category: 'slots',
      minBet: 0.20,
      maxBet: 200,
      houseEdge: 3.5,
      popularity: 94,
      isNew: true,
      isHot: true,
      jackpot: 100000,
      maxWin: 500000,
      features: ['Megaways Engine', 'Cascading Reels', 'Multipliers', 'Bonus Features']
    },
    {
      id: 'slots_crypto',
      name: 'Crypto Slots',
      description: 'Blockchain-powered slots with crypto rewards',
      icon: '🔗',
      category: 'slots',
      minBet: 0.05,
      maxBet: 500,
      houseEdge: 4.5,
      popularity: 89,
      isNew: true,
      isHot: false,
      maxWin: 1000000,
      features: ['Crypto Rewards', 'NFT Prizes', 'DeFi Integration', 'High Volatility']
    },

    // Table Games (Classic Casino Experience)
    {
      id: 'blackjack_classic',
      name: 'Classic Blackjack',
      description: 'Traditional 21 with perfect strategy options',
      icon: '🃏',
      category: 'card',
      minBet: 5,
      maxBet: 1000,
      houseEdge: 0.5,
      popularity: 93,
      isNew: false,
      isHot: true,
      maxWin: 50000,
      features: ['Perfect Strategy', 'Insurance', 'Double Down', 'Split Hands']
    },
    {
      id: 'roulette_european',
      name: 'European Roulette',
      description: 'Single zero roulette with better player odds',
      icon: '🎡',
      category: 'table',
      minBet: 1,
      maxBet: 500,
      houseEdge: 2.7,
      popularity: 91,
      isNew: false,
      isHot: true,
      maxWin: 35000,
      features: ['Single Zero', 'La Partage', 'En Prison', 'Multiple Betting Options']
    },
    {
      id: 'poker_texas',
      name: 'Texas Hold\'em',
      description: 'Classic poker with tournaments and cash games',
      icon: '♠️',
      category: 'card',
      minBet: 10,
      maxBet: 1000,
      houseEdge: 2.5,
      popularity: 90,
      isNew: false,
      isHot: true,
      maxWin: 100000,
      features: ['Tournaments', 'Cash Games', 'Multi-Table', 'Player Rankings']
    },

    // Live Casino (Real Dealers, Real Money)
    {
      id: 'live_baccarat',
      name: 'Live Baccarat',
      description: 'Real dealers, real cards, real excitement',
      icon: '🎭',
      category: 'live',
      minBet: 25,
      maxBet: 5000,
      houseEdge: 1.06,
      popularity: 87,
      isNew: false,
      isHot: true,
      maxWin: 100000,
      features: ['Live Dealers', 'HD Streaming', 'Chat with Dealers', 'Multiple Tables']
    },
    {
      id: 'live_blackjack',
      name: 'Live Blackjack',
      description: 'Interactive blackjack with professional dealers',
      icon: '🎯',
      category: 'live',
      minBet: 20,
      maxBet: 2000,
      houseEdge: 0.5,
      popularity: 89,
      isNew: false,
      isHot: true,
      maxWin: 75000,
      features: ['Live Dealers', 'Side Bets', 'Perfect Strategy', 'VIP Tables']
    },

    // Arcade & Skill Games (Lower House Edge, Higher Engagement)
    {
      id: 'crash_game',
      name: 'Crash Game',
      description: 'Watch the multiplier grow and cash out before it crashes',
      icon: '📈',
      category: 'arcade',
      minBet: 1,
      maxBet: 100,
      houseEdge: 1,
      popularity: 94,
      isNew: true,
      isHot: true,
      maxWin: 100000,
      features: ['Real-time Multiplier', 'Auto Cash-out', 'Provably Fair', 'High Volatility']
    },
    {
      id: 'dice_game',
      name: 'Provably Fair Dice',
      description: 'Roll the dice and win with verifiable fairness',
      icon: '🎲',
      category: 'arcade',
      minBet: 0.01,
      maxBet: 1000,
      houseEdge: 1,
      popularity: 86,
      isNew: false,
      isHot: false,
      maxWin: 50000,
      features: ['Provably Fair', 'Customizable Odds', 'Instant Results', 'Low House Edge']
    },
    {
      id: 'plinko',
      name: 'Plinko',
      description: 'Drop the ball and watch it bounce to big wins',
      icon: '🔴',
      category: 'arcade',
      minBet: 0.10,
      maxBet: 100,
      houseEdge: 2,
      popularity: 88,
      isNew: true,
      isHot: true,
      maxWin: 25000,
      features: ['Multiple Drop Zones', 'Multiplier Pins', 'Animated Graphics', 'Quick Play']
    }
  ];

  const filteredGames = casinoGames.filter(game => 
    selectedCategory === 'all' || game.category === selectedCategory
  );

  const handlePlayGame = (game: CasinoGame) => {
    if (!user) {
      toast({
        title: '❌ Not Authenticated',
        description: 'Please log in to play casino games',
        variant: 'destructive'
      });
      return;
    }

    setSelectedGame(game);
    setShowGameModal(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'table': return '🎯';
      case 'slots': return '🎰';
      case 'card': return '🃏';
      case 'arcade': return '🎮';
      case 'live': return '📺';
      default: return '🎯';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'table': return 'Table Games';
      case 'slots': return 'Slot Machines';
      case 'card': return 'Card Games';
      case 'arcade': return 'Arcade Games';
      case 'live': return 'Live Casino';
      default: return 'All Games';
    }
  };

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return 'text-green-400';
    if (popularity >= 80) return 'text-yellow-400';
    if (popularity >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎰</div>
          <h1 className="text-5xl font-bold text-white mb-4">Casino Hub</h1>
          <p className="text-white/80 text-xl">
            The ultimate gaming destination with hundreds of games and massive jackpots!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-3xl mb-2">🎮</div>
            <div className="text-2xl font-bold text-white">{casinoGames.length}</div>
            <div className="text-white/60 text-sm">Total Games</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-white">$2.5M+</div>
            <div className="text-white/60 text-sm">Total Jackpots</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-white">50K+</div>
            <div className="text-white/60 text-sm">Active Players</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-white">$500K+</div>
            <div className="text-white/60 text-sm">Paid Out Today</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {['all', 'table', 'slots', 'card', 'arcade', 'live'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
              }`}
            >
              <span>{getCategoryIcon(category)}</span>
              {getCategoryName(category)}
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map(game => (
            <div
              key={game.id}
              className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 hover:scale-105 border-white/20 hover:border-white/40"
            >
              {/* New & Hot Badges */}
              {game.isNew && (
                <div className="absolute -top-2 -left-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  NEW
                </div>
              )}
              {game.isHot && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  HOT
                </div>
              )}

              {/* Game Icon & Name */}
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{game.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{game.name}</h3>
                <p className="text-white/60 text-sm">{game.description}</p>
              </div>

              {/* Game Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-white/80 text-sm">
                  <span>Min Bet:</span>
                  <span className="text-white font-bold">${game.minBet}</span>
                </div>
                <div className="flex justify-between text-white/80 text-sm">
                  <span>Max Bet:</span>
                  <span className="text-white font-bold">${game.maxBet}</span>
                </div>
                <div className="flex justify-between text-white/80 text-sm">
                  <span>House Edge:</span>
                  <span className="text-red-400 font-bold">{game.houseEdge}%</span>
                </div>
                <div className="flex justify-between text-white/80 text-sm">
                  <span>Popularity:</span>
                  <span className={`font-bold ${getPopularityColor(game.popularity)}`}>
                    {game.popularity}%
                  </span>
                </div>
                {game.jackpot && (
                  <div className="flex justify-between text-white/80 text-sm">
                    <span>Jackpot:</span>
                    <span className="text-yellow-400 font-bold">${game.jackpot.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/80 text-sm">
                  <span>Max Win:</span>
                  <span className="text-green-400 font-bold">${game.maxWin.toLocaleString()}</span>
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <div className="text-white/60 text-sm mb-2">Features:</div>
                <div className="flex flex-wrap gap-1">
                  {game.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                  {game.features.length > 3 && (
                    <span className="bg-white/10 text-white/60 text-xs px-2 py-1 rounded-full">
                      +{game.features.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Play Button */}
              <button
                onClick={() => handlePlayGame(game)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                🎮 Play Now
              </button>
            </div>
          ))}
        </div>

        {/* Game Modal */}
        {showGameModal && selectedGame && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-blue-800 to-purple-900 rounded-3xl p-8 shadow-2xl border-4 border-blue-500 max-w-2xl w-full text-white relative">
              <button
                onClick={() => setShowGameModal(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl"
              >
                ×
              </button>
              
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{selectedGame.icon}</div>
                <h2 className="text-3xl font-bold text-yellow-300 mb-2">{selectedGame.name}</h2>
                <p className="text-white/80">{selectedGame.description}</p>
              </div>

              {/* Game Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-white/60 text-sm mb-1">House Edge</div>
                  <div className="text-red-400 font-bold text-xl">{selectedGame.houseEdge}%</div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-white/60 text-sm mb-1">Max Win</div>
                  <div className="text-green-400 font-bold text-xl">${selectedGame.maxWin.toLocaleString()}</div>
                </div>
              </div>

              {/* Features List */}
              <div className="mb-6">
                <h3 className="text-white font-bold text-xl mb-3">Game Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedGame.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-white/80">
                      <Star className="w-4 h-4 text-yellow-400" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition-colors">
                  🎮 Play for Real Money
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-colors">
                  🎯 Play Demo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Win Big?</h2>
          <p className="text-white/80 text-lg mb-6">
            Join thousands of players who are already winning massive jackpots!
          </p>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-2xl transform hover:scale-105 transition-all duration-200">
            🚀 Start Playing Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CasinoHub; 