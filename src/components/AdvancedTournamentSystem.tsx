import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { 
  Trophy, 
  Users, 
  Clock, 
  DollarSign, 
  Star, 
  Crown, 
  Zap,
  Target,
  TrendingUp,
  Award,
  Calendar,
  Play,
  Lock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Tournament {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  format: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
  entryFee: number;
  prizePool: number;
  maxPlayers: number;
  currentPlayers: number;
  startTime: Date;
  endTime: Date;
  status: 'upcoming' | 'registration' | 'active' | 'completed';
  minLevel: number;
  isVIP: boolean;
  specialRules: string[];
  prizes: {
    first: number;
    second: number;
    third: number;
    fourth?: number;
    fifth?: number;
  };
  leaderboard: TournamentPlayer[];
}

interface TournamentPlayer {
  username: string;
  score: number;
  gamesPlayed: number;
  gamesWon: number;
  rank: number;
  isCurrentUser: boolean;
  avatar: string;
}

const AdvancedTournamentSystem: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'upcoming' | 'active' | 'completed' | 'my_tournaments'>('upcoming');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const [tournaments, setTournaments] = useState<Tournament[]>([
    // Daily Tournaments
    {
      id: 'daily_1',
      name: 'Daily BINGO Blitz',
      description: 'Quick 5-minute BINGO games with instant prizes',
      type: 'daily',
      format: 'single_elimination',
      entryFee: 5.00,
      prizePool: 100.00,
      maxPlayers: 32,
      currentPlayers: 28,
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
      status: 'registration',
      minLevel: 1,
      isVIP: false,
      specialRules: ['2-minute games', 'No powerups', 'Sudden death overtime'],
      prizes: {
        first: 60,
        second: 25,
        third: 15
      },
      leaderboard: [
        { username: 'SpeedDemon', score: 4500, gamesPlayed: 3, gamesWon: 3, rank: 1, isCurrentUser: false, avatar: '🥇' },
        { username: 'BingoMaster', score: 4200, gamesPlayed: 3, gamesWon: 2, rank: 2, isCurrentUser: false, avatar: '🥈' },
        { username: 'LuckyPlayer', score: 3800, gamesPlayed: 3, gamesWon: 2, rank: 3, isCurrentUser: false, avatar: '🥉' }
      ]
    },

    // Weekly Tournaments
    {
      id: 'weekly_1',
      name: 'Weekly Championship',
      description: 'Epic weekly tournament with massive prize pools',
      type: 'weekly',
      format: 'double_elimination',
      entryFee: 25.00,
      prizePool: 1000.00,
      maxPlayers: 64,
      currentPlayers: 45,
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'registration',
      minLevel: 5,
      isVIP: false,
      specialRules: ['Best of 3 games', 'Powerups enabled', 'Championship bracket'],
      prizes: {
        first: 600,
        second: 250,
        third: 100,
        fourth: 50
      },
      leaderboard: []
    },

    // Monthly Tournaments
    {
      id: 'monthly_1',
      name: 'Monthly Grand Slam',
      description: 'The ultimate monthly tournament with legendary prizes',
      type: 'monthly',
      format: 'swiss',
      entryFee: 100.00,
      prizePool: 5000.00,
      maxPlayers: 128,
      currentPlayers: 89,
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'registration',
      minLevel: 10,
      isVIP: true,
      specialRules: ['Swiss system', 'All powerups', 'Grand final showdown'],
      prizes: {
        first: 3000,
        second: 1200,
        third: 500,
        fourth: 200,
        fifth: 100
      },
      leaderboard: []
    },

    // Special Tournaments
    {
      id: 'special_1',
      name: 'VIP Invitational',
      description: 'Exclusive tournament for VIP members only',
      type: 'special',
      format: 'round_robin',
      entryFee: 0.00,
      prizePool: 2500.00,
      maxPlayers: 16,
      currentPlayers: 12,
      startTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'registration',
      minLevel: 15,
      isVIP: true,
      specialRules: ['VIP only', 'Round robin format', 'Luxury prizes'],
      prizes: {
        first: 1500,
        second: 600,
        third: 400
      },
      leaderboard: []
    },

    // Active Tournament
    {
      id: 'active_1',
      name: 'Quick Fire Challenge',
      description: 'Fast-paced BINGO action happening now!',
      type: 'daily',
      format: 'single_elimination',
      entryFee: 10.00,
      prizePool: 200.00,
      maxPlayers: 16,
      currentPlayers: 16,
      startTime: new Date(Date.now() - 30 * 60 * 1000), // Started 30 minutes ago
      endTime: new Date(Date.now() + 30 * 60 * 1000), // Ends in 30 minutes
      status: 'active',
      minLevel: 3,
      isVIP: false,
      specialRules: ['1-minute games', 'Speed bonus', 'Elimination rounds'],
      prizes: {
        first: 120,
        second: 50,
        third: 30
      },
      leaderboard: [
        { username: 'SpeedDemon', score: 8900, gamesPlayed: 4, gamesWon: 4, rank: 1, isCurrentUser: false, avatar: '🥇' },
        { username: 'BingoMaster', score: 8200, gamesPlayed: 4, gamesWon: 3, rank: 2, isCurrentUser: false, avatar: '🥈' },
        { username: 'LuckyPlayer', score: 7800, gamesPlayed: 4, gamesWon: 3, rank: 3, isCurrentUser: false, avatar: '🥉' },
        { username: user?.username || 'You', score: 7200, gamesPlayed: 4, gamesWon: 2, rank: 4, isCurrentUser: true, avatar: '🎯' }
      ]
    }
  ]);

  const handleJoinTournament = async (tournament: Tournament) => {
    if (!user) {
      toast({
        title: '❌ Not Authenticated',
        description: 'Please log in to join tournaments',
        variant: 'destructive'
      });
      return;
    }

    if (tournament.isVIP && !user.isVIP) {
      toast({
        title: '❌ VIP Required',
        description: 'This tournament is for VIP members only',
        variant: 'destructive'
      });
      return;
    }

    if (tournament.currentPlayers >= tournament.maxPlayers) {
      toast({
        title: '❌ Tournament Full',
        description: 'This tournament has reached maximum capacity',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsJoining(true);
      
      // Simulate joining process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update tournament
      setTournaments(prev => prev.map(t => 
        t.id === tournament.id 
          ? { ...t, currentPlayers: t.currentPlayers + 1 }
          : t
      ));
      
      toast({
        title: '🎉 Tournament Joined!',
        description: `You're now registered for ${tournament.name}`,
      });
      
    } catch (error) {
      toast({
        title: '❌ Join Failed',
        description: 'Failed to join tournament. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsJoining(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-400';
      case 'registration': return 'text-green-400';
      case 'active': return 'text-yellow-400';
      case 'completed': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <Clock className="w-4 h-4" />;
      case 'registration': return <Users className="w-4 h-4" />;
      case 'active': return <Play className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'daily': return '🌅';
      case 'weekly': return '📅';
      case 'monthly': return '🗓️';
      case 'special': return '⭐';
      default: return '🎯';
    }
  };

  const getFormatName = (format: string) => {
    switch (format) {
      case 'single_elimination': return 'Single Elimination';
      case 'double_elimination': return 'Double Elimination';
      case 'round_robin': return 'Round Robin';
      case 'swiss': return 'Swiss System';
      default: return 'Unknown';
    }
  };

  const filteredTournaments = tournaments.filter(tournament => {
    if (activeTab === 'upcoming') return tournament.status === 'upcoming';
    if (activeTab === 'active') return tournament.status === 'active';
    if (activeTab === 'completed') return tournament.status === 'completed';
    if (activeTab === 'my_tournaments') return tournament.leaderboard.some(p => p.isCurrentUser);
    return true;
  });

  const formatTimeRemaining = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    
    if (diff <= 0) return 'Started';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-5xl font-bold text-white mb-4">Tournament System</h1>
          <p className="text-white/80 text-xl">
            Compete in epic BINGO tournaments and win massive prizes!
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1 mb-6">
          {[
            { id: 'upcoming', label: 'Upcoming', icon: '⏰' },
            { id: 'active', label: 'Active', icon: '🎮' },
            { id: 'completed', label: 'Completed', icon: '✅' },
            { id: 'my_tournaments', label: 'My Tournaments', icon: '👤' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tournaments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTournaments.map(tournament => (
            <div
              key={tournament.id}
              className={`relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 hover:scale-105 ${
                tournament.status === 'active' 
                  ? 'border-yellow-500/50 bg-yellow-500/10' 
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  tournament.status === 'active' ? 'bg-yellow-500/20 text-yellow-400' :
                  tournament.status === 'registration' ? 'bg-green-500/20 text-green-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {getStatusIcon(tournament.status)}
                  {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                </div>
              </div>

              {/* Tournament Header */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{getTypeIcon(tournament.type)}</span>
                  <h3 className="text-white font-bold text-xl">{tournament.name}</h3>
                  {tournament.isVIP && (
                    <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-bold">
                      VIP ONLY
                    </span>
                  )}
                </div>
                <p className="text-white/60 text-sm">{tournament.description}</p>
              </div>

              {/* Tournament Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-white/60 text-sm mb-1">Entry Fee</div>
                  <div className="text-white font-bold">
                    {tournament.entryFee === 0 ? 'FREE' : `$${tournament.entryFee}`}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-white/60 text-sm mb-1">Prize Pool</div>
                  <div className="text-green-400 font-bold">${tournament.prizePool}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-white/60 text-sm mb-1">Players</div>
                  <div className="text-white font-bold">
                    {tournament.currentPlayers}/{tournament.maxPlayers}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-white/60 text-sm mb-1">Format</div>
                  <div className="text-white font-bold text-sm">{getFormatName(tournament.format)}</div>
                </div>
              </div>

              {/* Special Rules */}
              <div className="mb-4">
                <div className="text-white/60 text-sm mb-2">Special Rules:</div>
                <div className="flex flex-wrap gap-2">
                  {tournament.specialRules.map((rule, index) => (
                    <span
                      key={index}
                      className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded-full"
                    >
                      {rule}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prize Distribution */}
              <div className="mb-4">
                <div className="text-white/60 text-sm mb-2">Prizes:</div>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <div className="text-yellow-400 text-lg">🥇</div>
                    <div className="text-white font-bold">${tournament.prizes.first}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 text-lg">🥈</div>
                    <div className="text-white font-bold">${tournament.prizes.second}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-orange-400 text-lg">🥉</div>
                    <div className="text-white font-bold">${tournament.prizes.third}</div>
                  </div>
                </div>
              </div>

              {/* Time & Action */}
              <div className="flex items-center justify-between">
                <div className="text-white/60 text-sm">
                  {tournament.status === 'active' ? 'Ends in' : 'Starts in'}: {formatTimeRemaining(tournament.startTime)}
                </div>
                
                {tournament.status === 'registration' && (
                  <button
                    onClick={() => handleJoinTournament(tournament)}
                    disabled={isJoining || tournament.currentPlayers >= tournament.maxPlayers}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
                  >
                    {isJoining ? 'Joining...' : 'Join Tournament'}
                  </button>
                )}
                
                {tournament.status === 'active' && (
                  <button
                    onClick={() => {
                      setSelectedTournament(tournament);
                      setShowTournamentModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                  >
                    View Live
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tournament Modal */}
        {showTournamentModal && selectedTournament && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-blue-800 to-purple-900 rounded-3xl p-8 shadow-2xl border-4 border-blue-500 max-w-4xl w-full text-white relative">
              <button
                onClick={() => setShowTournamentModal(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl"
              >
                ×
              </button>
              
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-yellow-300 mb-2">{selectedTournament.name}</h2>
                <p className="text-white/80">Live Tournament - Join the action!</p>
              </div>

              {/* Live Leaderboard */}
              <div className="mb-6">
                <h3 className="text-white font-bold text-xl mb-4">🏆 Live Leaderboard</h3>
                <div className="space-y-3">
                  {selectedTournament.leaderboard.map((player, index) => (
                    <div
                      key={player.username}
                      className={`flex items-center justify-between p-4 rounded-xl ${
                        player.isCurrentUser ? 'bg-blue-500/20 border border-blue-500/50' : 'bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{player.avatar}</div>
                        <div>
                          <div className="text-white font-bold">
                            {player.username}
                            {player.isCurrentUser && (
                              <span className="ml-2 text-blue-400 text-sm">(You)</span>
                            )}
                          </div>
                          <div className="text-white/60 text-sm">
                            {player.gamesWon} wins in {player.gamesPlayed} games
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-white font-bold text-lg">{player.score.toLocaleString()}</div>
                        <div className="text-white/60 text-sm">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tournament Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-white/60 text-sm mb-1">Time Remaining</div>
                  <div className="text-white font-bold text-lg">{formatTimeRemaining(selectedTournament.endTime)}</div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-white/60 text-sm mb-1">Active Players</div>
                  <div className="text-white font-bold text-lg">{selectedTournament.currentPlayers}</div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-white/60 text-sm mb-1">Prize Pool</div>
                  <div className="text-green-400 font-bold text-lg">${selectedTournament.prizePool}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition-colors">
                  🎮 Join Next Game
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-colors">
                  📊 View Stats
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Compete?</h2>
          <p className="text-white/80 text-lg mb-6">
            Join tournaments, climb the leaderboard, and win massive prizes!
          </p>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-2xl transform hover:scale-105 transition-all duration-200">
            🚀 Browse All Tournaments
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedTournamentSystem; 