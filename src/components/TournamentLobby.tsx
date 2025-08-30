import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Users, DollarSign, Play, Star, Zap, Crown, Gift, Target, Flame, Lightning, Shield } from 'lucide-react';

const TournamentLobby: React.FC = () => {
  const { isAuthenticated, balance, updateBalance, startGame } = useAppContext();
  const { toast } = useToast();
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'featured' | 'daily' | 'weekly' | 'special'>('featured');

  // Amazing tournament collection
  const tournaments = [
    // Featured Tournaments
    {
      id: 'mega-bingo-championship',
      title: "🏆 MEGA BINGO CHAMPIONSHIP",
      description: "The ultimate BINGO showdown! Compete against the best players worldwide.",
      entryFee: 25.00,
      prizePool: 2500.00,
      maxPlayers: 100,
      currentPlayers: 47,
      timeLeft: "2 days 14 hours",
      type: 'featured',
      specialFeatures: ['VIP Rewards', 'Leaderboard Points', 'Exclusive Badges'],
      color: "from-yellow-400 via-orange-500 to-red-500",
      icon: "👑",
      minPlayers: 20,
      gameMode: 'bingo-room-7'
    },
    {
      id: 'lightning-speed-bingo',
      title: "⚡ LIGHTNING SPEED BINGO",
      description: "Ultra-fast BINGO action! Numbers called every 1 second.",
      entryFee: 15.00,
      prizePool: 1200.00,
      maxPlayers: 50,
      currentPlayers: 23,
      timeLeft: "1 day 8 hours",
      type: 'featured',
      specialFeatures: ['Speed Bonus', 'Double Points', 'Rapid Rewards'],
      color: "from-blue-400 via-purple-500 to-pink-500",
      icon: "⚡",
      minPlayers: 15,
      gameMode: 'bingo-room-6'
    },
    
    // Daily Tournaments
    {
      id: 'daily-bingo-rush',
      title: "🌅 DAILY BINGO RUSH",
      description: "Fresh challenges every day! Perfect for daily players.",
      entryFee: 5.00,
      prizePool: 500.00,
      maxPlayers: 75,
      currentPlayers: 38,
      timeLeft: "18 hours 32 minutes",
      type: 'daily',
      specialFeatures: ['Daily Rewards', 'Streak Bonuses', 'Quick Play'],
      color: "from-green-400 via-emerald-500 to-teal-500",
      icon: "🌅",
      minPlayers: 10,
      gameMode: 'bingo-room-5'
    },
    {
      id: 'morning-bingo-blast',
      title: "🌞 MORNING BINGO BLAST",
      description: "Start your day with explosive BINGO action!",
      entryFee: 3.00,
      prizePool: 300.00,
      maxPlayers: 60,
      currentPlayers: 25,
      timeLeft: "6 hours 15 minutes",
      type: 'daily',
      specialFeatures: ['Morning Bonus', 'Energy Boost', 'Sunrise Rewards'],
      color: "from-yellow-300 via-orange-400 to-red-400",
      icon: "🌞",
      minPlayers: 8,
      gameMode: 'bingo-room-4'
    },
    
    // Weekly Tournaments
    {
      id: 'weekly-bingo-master',
      title: "📅 WEEKLY BINGO MASTER",
      description: "Weekly championship with massive prize pools!",
      entryFee: 20.00,
      prizePool: 2000.00,
      maxPlayers: 150,
      currentPlayers: 89,
      timeLeft: "4 days 22 hours",
      type: 'weekly',
      specialFeatures: ['Weekly Rankings', 'Master Badges', 'Elite Rewards'],
      color: "from-purple-400 via-pink-500 to-red-500",
      icon: "📅",
      minPlayers: 25,
      gameMode: 'bingo-room-7'
    },
    {
      id: 'weekend-warrior',
      title: "🎉 WEEKEND WARRIOR",
      description: "Weekend special with double prizes and bonuses!",
      entryFee: 12.00,
      prizePool: 1500.00,
      maxPlayers: 80,
      currentPlayers: 52,
      timeLeft: "2 days 6 hours",
      type: 'weekly',
      specialFeatures: ['Weekend Bonus', 'Double Prizes', 'Party Mode'],
      color: "from-pink-400 via-rose-500 to-red-500",
      icon: "🎉",
      minPlayers: 20,
      gameMode: 'bingo-room-6'
    },
    
    // Special Tournaments
    {
      id: 'bingo-battle-royale',
      title: "⚔️ BINGO BATTLE ROYALE",
      description: "Last player standing wins it all! Elimination-style BINGO.",
      entryFee: 35.00,
      prizePool: 3500.00,
      maxPlayers: 200,
      currentPlayers: 156,
      timeLeft: "3 days 12 hours",
      type: 'special',
      specialFeatures: ['Battle Royale', 'Elimination Rounds', 'Survival Rewards'],
      color: "from-red-400 via-pink-500 to-purple-500",
      icon: "⚔️",
      minPlayers: 50,
      gameMode: 'bingo-room-7'
    },
    {
      id: 'cosmic-bingo-quest',
      title: "🚀 COSMIC BINGO QUEST",
      description: "Space-themed BINGO adventure with cosmic rewards!",
      entryFee: 18.00,
      prizePool: 1800.00,
      maxPlayers: 120,
      currentPlayers: 67,
      timeLeft: "5 days 8 hours",
      type: 'special',
      specialFeatures: ['Cosmic Rewards', 'Space Badges', 'Galaxy Bonuses'],
      color: "from-indigo-400 via-purple-500 to-blue-500",
      icon: "🚀",
      minPlayers: 30,
      gameMode: 'bingo-room-6'
    }
  ];

  const handleJoinTournament = (tournament: any) => {
    if (!isAuthenticated) {
      toast({
        title: "Please Sign In",
        description: "You need to be signed in to join tournaments.",
        variant: "destructive",
      });
      return;
    }

    if (balance < tournament.entryFee) {
      toast({
        title: "Insufficient Balance",
        description: `You need $${tournament.entryFee.toFixed(2)} to join ${tournament.title}. Add funds to continue.`,
        variant: "destructive",
      });
      return;
    }

    if (tournament.currentPlayers < tournament.minPlayers) {
      toast({
        title: "Tournament Not Ready",
        description: `This tournament needs at least ${tournament.minPlayers} players. Currently: ${tournament.currentPlayers} players.`,
        variant: "destructive",
      });
      return;
    }

    const confirmEntry = window.confirm(
      `Join ${tournament.title}?\n\nEntry Fee: $${tournament.entryFee.toFixed(2)}\nPrize Pool: $${tournament.prizePool.toFixed(2)}\nPlayers: ${tournament.currentPlayers}/${tournament.maxPlayers}\nTime Left: ${tournament.timeLeft}\n\nYour balance: $${(balance || 0).toFixed(2)}\n\nClick OK to confirm and pay entry fee.`
    );

    if (!confirmEntry) return;

    updateBalance(-tournament.entryFee);
    startGame(tournament.gameMode);
    setSelectedTournament(tournament);
    
    toast({
      title: `Tournament Entry Confirmed! 🏆`,
      description: `$${tournament.entryFee.toFixed(2)} deducted. Welcome to ${tournament.title}!`,
    });
  };

  const getFilteredTournaments = () => {
    return tournaments.filter(t => t.type === activeTab);
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'featured': return '⭐';
      case 'daily': return '🌅';
      case 'weekly': return '📅';
      case 'special': return '🎯';
      default: return '🏆';
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-5xl font-black text-white mb-4">
            🏆 TOURNAMENT ARENA 🏆
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Compete in epic BINGO tournaments, earn exclusive rewards, and become a legend! 
            Choose your challenge and battle for glory!
          </p>
        </div>

        {/* Tournament Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-2 border border-purple-400/30">
            {(['featured', 'daily', 'weekly', 'special'] as const).map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                variant="ghost"
                className={`mx-1 px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {getTabIcon(tab)} {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Tournament Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {getFilteredTournaments().map((tournament) => (
            <Card key={tournament.id} className="bg-gray-900 border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 cursor-pointer group overflow-hidden">
              <CardContent className="p-0">
                {/* Tournament Header */}
                <div className={`bg-gradient-to-r ${tournament.color} p-6 text-center relative overflow-hidden`}>
                  <div className="text-6xl mb-2">{tournament.icon}</div>
                  <h3 className="text-xl font-black text-white mb-2">{tournament.title}</h3>
                  <p className="text-white/90 text-sm">{tournament.description}</p>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-xs font-bold">
                      {tournament.currentPlayers >= tournament.minPlayers ? 'Ready' : 'Waiting'}
                    </span>
                  </div>
                  
                  <div className="absolute top-2 left-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-xs font-bold">
                      {tournament.type.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Tournament Stats */}
                <div className="p-6 space-y-4">
                  {/* Prize Pool */}
                  <div className="text-center">
                    <div className="text-3xl font-black text-yellow-400 mb-1">
                      ${tournament.prizePool.toFixed(0)}
                    </div>
                    <div className="text-sm text-gray-400">PRIZE POOL</div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400 mb-1">
                        ${tournament.entryFee}
                      </div>
                      <div className="text-xs text-gray-500">Entry</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400 mb-1">
                        {tournament.currentPlayers}/{tournament.maxPlayers}
                      </div>
                      <div className="text-xs text-gray-500">Players</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400 mb-1">
                        {tournament.timeLeft.split(' ')[0]}
                      </div>
                      <div className="text-xs text-gray-500">Left</div>
                    </div>
                  </div>

                  {/* Special Features */}
                  <div className="bg-purple-500/10 border border-purple-400/20 rounded-lg p-3">
                    <div className="text-purple-400 font-bold text-sm mb-2">✨ Special Features</div>
                    <div className="flex flex-wrap gap-2">
                      {tournament.specialFeatures.map((feature, index) => (
                        <span
                          key={index}
                          className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full border border-purple-400/30"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Join Button */}
                  <Button
                    onClick={() => handleJoinTournament(tournament)}
                    disabled={tournament.currentPlayers < tournament.minPlayers}
                    className={`w-full font-bold py-3 rounded-xl text-lg transition-all duration-200 ${
                      tournament.currentPlayers >= tournament.minPlayers
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Trophy className="w-5 h-5 mr-2" />
                    {tournament.currentPlayers >= tournament.minPlayers ? 'JOIN TOURNAMENT' : 'WAITING FOR PLAYERS'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tournament Info */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-800/20 to-blue-800/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">🎯 Tournament Rules & Rewards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <div className="text-purple-400 font-bold mb-2">🏆 How to Win</div>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Complete BINGO lines faster than opponents</li>
                  <li>• Use power-ups strategically</li>
                  <li>• Build winning streaks for bonus points</li>
                  <li>• Climb the leaderboard rankings</li>
                </ul>
              </div>
              <div>
                <div className="text-blue-400 font-bold mb-2">🎁 Rewards System</div>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Cash prizes for top finishers</li>
                  <li>• Exclusive badges and achievements</li>
                  <li>• VIP status and special access</li>
                  <li>• Bonus gems and power-ups</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentLobby;