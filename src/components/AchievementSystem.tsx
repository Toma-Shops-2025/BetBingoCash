import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Crown, 
  Gift, 
  TrendingUp,
  Award,
  Medal,
  Fire,
  Lightning,
  Diamond,
  CheckCircle,
  Lock
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'gaming' | 'social' | 'financial' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  reward: {
    type: 'coins' | 'vip_days' | 'powerups' | 'exclusive';
    amount: number;
    description: string;
  };
  requirements: {
    type: string;
    target: number;
    current: number;
    description: string;
  };
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress: number; // 0-100
}

interface LeaderboardEntry {
  username: string;
  points: number;
  achievements: number;
  rank: number;
  avatar: string;
  isCurrentUser: boolean;
}

const AchievementSystem: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'achievements' | 'leaderboard' | 'rewards'>('achievements');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [achievements, setAchievements] = useState<Achievement[]>([
    // Gaming Achievements
    {
      id: 'first_win',
      name: 'First Victory',
      description: 'Win your first BINGO game',
      icon: '🎯',
      category: 'gaming',
      rarity: 'common',
      points: 100,
      reward: {
        type: 'coins',
        amount: 50,
        description: '50 USDC bonus'
      },
      requirements: {
        type: 'games_won',
        target: 1,
        current: 1,
        description: 'Win 1 game'
      },
      isUnlocked: true,
      unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      progress: 100
    },
    {
      id: 'winning_streak',
      name: 'Winning Streak',
      description: 'Win 5 games in a row',
      icon: '🔥',
      category: 'gaming',
      rarity: 'rare',
      points: 500,
      reward: {
        type: 'vip_days',
        amount: 7,
        description: '7 days of Bronze VIP'
      },
      requirements: {
        type: 'consecutive_wins',
        target: 5,
        current: 3,
        description: 'Win 5 games in a row'
      },
      isUnlocked: false,
      progress: 60
    },
    {
      id: 'bingo_master',
      name: 'BINGO Master',
      description: 'Win 100 BINGO games',
      icon: '👑',
      category: 'gaming',
      rarity: 'epic',
      points: 2000,
      reward: {
        type: 'exclusive',
        amount: 1,
        description: 'Exclusive "BINGO Master" title'
      },
      requirements: {
        type: 'games_won',
        target: 100,
        current: 25,
        description: 'Win 100 games'
      },
      isUnlocked: false,
      progress: 25
    },
    {
      id: 'speed_demon',
      name: 'Speed Demon',
      description: 'Get BINGO in under 30 seconds',
      icon: '⚡',
      category: 'gaming',
      rarity: 'legendary',
      points: 5000,
      reward: {
        type: 'powerups',
        amount: 10,
        description: '10 X3 Powerups'
      },
      requirements: {
        type: 'fast_bingo',
        target: 1,
        current: 0,
        description: 'Get BINGO in under 30 seconds'
      },
      isUnlocked: false,
      progress: 0
    },

    // Social Achievements
    {
      id: 'social_butterfly',
      name: 'Social Butterfly',
      description: 'Play with 50 different players',
      icon: '🦋',
      category: 'social',
      rarity: 'rare',
      points: 300,
      reward: {
        type: 'coins',
        amount: 100,
        description: '100 USDC bonus'
      },
      requirements: {
        type: 'unique_players',
        target: 50,
        current: 12,
        description: 'Play with 50 different players'
      },
      isUnlocked: false,
      progress: 24
    },
    {
      id: 'team_player',
      name: 'Team Player',
      description: 'Participate in 10 tournaments',
      icon: '🤝',
      category: 'social',
      rarity: 'epic',
      points: 1500,
      reward: {
        type: 'vip_days',
        amount: 30,
        description: '30 days of Silver VIP'
      },
      requirements: {
        type: 'tournaments_joined',
        target: 10,
        current: 4,
        description: 'Join 10 tournaments'
      },
      isUnlocked: false,
      progress: 40
    },

    // Financial Achievements
    {
      id: 'high_roller',
      name: 'High Roller',
      description: 'Win $1000 in a single game',
      icon: '💰',
      category: 'financial',
      rarity: 'epic',
      points: 2500,
      reward: {
        type: 'exclusive',
        amount: 1,
        description: 'Exclusive "High Roller" badge'
      },
      requirements: {
        type: 'single_game_win',
        target: 1000,
        current: 450,
        description: 'Win $1000 in one game'
      },
      isUnlocked: false,
      progress: 45
    },
    {
      id: 'millionaire',
      name: 'Millionaire',
      description: 'Accumulate $10,000 in total winnings',
      icon: '🏆',
      category: 'financial',
      rarity: 'legendary',
      points: 10000,
      reward: {
        type: 'vip_days',
        amount: 365,
        description: '1 year of Diamond VIP'
      },
      requirements: {
        type: 'total_winnings',
        target: 10000,
        current: 3450,
        description: 'Win $10,000 total'
      },
      isUnlocked: false,
      progress: 34.5
    },

    // Special Achievements
    {
      id: 'early_bird',
      name: 'Early Bird',
      description: 'Join BetBingoCash in the first month',
      icon: '🐦',
      category: 'special',
      rarity: 'rare',
      points: 1000,
      reward: {
        type: 'exclusive',
        amount: 1,
        description: 'Founder status and badge'
      },
      requirements: {
        type: 'join_date',
        target: 1,
        current: 1,
        description: 'Join in first month'
      },
      isUnlocked: true,
      unlockedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      progress: 100
    },
    {
      id: 'lucky_charm',
      name: 'Lucky Charm',
      description: 'Win 3 games in a row with the same BINGO pattern',
      icon: '🍀',
      category: 'special',
      rarity: 'legendary',
      points: 7500,
      reward: {
        type: 'powerups',
        amount: 25,
        description: '25 of each powerup type'
      },
      requirements: {
        type: 'same_pattern_wins',
        target: 3,
        current: 1,
        description: 'Win 3 games with same pattern'
      },
      isUnlocked: false,
      progress: 33.3
    }
  ]);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    {
      username: 'BingoMaster2024',
      points: 15420,
      achievements: 8,
      rank: 1,
      avatar: '👑',
      isCurrentUser: false
    },
    {
      username: 'LuckyPlayer',
      points: 12850,
      achievements: 6,
      rank: 2,
      avatar: '🥈',
      isCurrentUser: false
    },
    {
      username: 'SpeedDemon',
      points: 11200,
      achievements: 7,
      rank: 3,
      avatar: '🥉',
      isCurrentUser: false
    },
    {
      username: user?.username || 'You',
      points: 8750,
      achievements: 4,
      rank: 4,
      avatar: '🎯',
      isCurrentUser: true
    },
    {
      username: 'TournamentKing',
      points: 7200,
      achievements: 5,
      rank: 5,
      avatar: '🏆',
      isCurrentUser: false
    }
  ]);

  const [totalPoints, setTotalPoints] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState(0);

  useEffect(() => {
    // Calculate total points and unlocked achievements
    const points = achievements.reduce((sum, achievement) => 
      achievement.isUnlocked ? sum + achievement.points : sum, 0
    );
    const unlocked = achievements.filter(a => a.isUnlocked).length;
    
    setTotalPoints(points);
    setUnlockedAchievements(unlocked);
  }, [achievements]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getRarityBackground = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/20 border-gray-400/30';
      case 'rare': return 'bg-blue-500/20 border-blue-400/30';
      case 'epic': return 'bg-purple-500/20 border-purple-400/30';
      case 'legendary': return 'bg-yellow-500/20 border-yellow-400/30';
      default: return 'bg-gray-500/20 border-gray-400/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'gaming': return '🎮';
      case 'social': return '🤝';
      case 'financial': return '💰';
      case 'special': return '⭐';
      default: return '🎯';
    }
  };

  const filteredAchievements = achievements.filter(achievement => 
    selectedCategory === 'all' || achievement.category === selectedCategory
  );

  const handleClaimReward = (achievement: Achievement) => {
    if (!achievement.isUnlocked) return;

    toast({
      title: '🎁 Reward Claimed!',
      description: `You received: ${achievement.reward.description}`,
    });

    // In production, this would actually give the reward to the user
    console.log(`User claimed reward: ${achievement.reward.description}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-5xl font-bold text-white mb-4">Achievement System</h1>
          <p className="text-white/80 text-xl">
            Complete challenges, earn rewards, and climb the leaderboard!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-white">{unlockedAchievements}</div>
            <div className="text-white/60 text-sm">Achievements Unlocked</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-white">{totalPoints.toLocaleString()}</div>
            <div className="text-white/60 text-sm">Total Points</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-white">
              {((unlockedAchievements / achievements.length) * 100).toFixed(1)}%
            </div>
            <div className="text-white/60 text-sm">Completion Rate</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-3xl mb-2">🏅</div>
            <div className="text-2xl font-bold text-white">#{leaderboard.find(l => l.isCurrentUser)?.rank || 'N/A'}</div>
            <div className="text-white/60 text-sm">Your Rank</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1 mb-6">
          {[
            { id: 'achievements', label: 'Achievements', icon: '🏆' },
            { id: 'leaderboard', label: 'Leaderboard', icon: '📊' },
            { id: 'rewards', label: 'Rewards', icon: '🎁' }
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

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {['all', 'gaming', 'social', 'financial', 'special'].map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 hover:scale-105 ${
                    achievement.isUnlocked
                      ? getRarityBackground(achievement.rarity)
                      : 'bg-white/5 border-white/20'
                  }`}
                >
                  {/* Achievement Icon */}
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <div className={`text-sm font-bold ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity.toUpperCase()}
                    </div>
                  </div>

                  {/* Achievement Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-white font-bold text-lg mb-2">{achievement.name}</h3>
                    <p className="text-white/60 text-sm mb-3">{achievement.description}</p>
                    <div className="text-yellow-400 font-bold text-lg">{achievement.points} pts</div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-white/60 text-sm mb-2">
                      <span>Progress</span>
                      <span>{achievement.progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          achievement.isUnlocked
                            ? 'bg-green-500'
                            : 'bg-blue-500'
                        }`}
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="mb-4">
                    <div className="text-white/80 text-sm mb-2">
                      {achievement.requirements.description}
                    </div>
                    <div className="text-white/60 text-xs">
                      {achievement.requirements.current} / {achievement.requirements.target}
                    </div>
                  </div>

                  {/* Reward */}
                  <div className="bg-white/5 rounded-xl p-3 mb-4">
                    <div className="text-white/60 text-xs mb-1">Reward:</div>
                    <div className="text-white font-medium text-sm">{achievement.reward.description}</div>
                  </div>

                  {/* Status */}
                  {achievement.isUnlocked ? (
                    <div className="text-center">
                      <div className="text-green-400 text-sm mb-2 flex items-center justify-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Unlocked {achievement.unlockedAt?.toLocaleDateString()}
                      </div>
                      <button
                        onClick={() => handleClaimReward(achievement)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Claim Reward
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-white/40 text-sm">
                      <Lock className="w-5 h-5 mx-auto mb-1" />
                      Locked
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
              <div className="p-6 border-b border-white/20">
                <h3 className="text-white font-bold text-xl">🏆 Global Leaderboard</h3>
                <p className="text-white/60 text-sm">Top players by achievement points</p>
              </div>
              
              <div className="divide-y divide-white/10">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.username}
                    className={`p-6 flex items-center gap-4 transition-all duration-200 ${
                      entry.isCurrentUser ? 'bg-blue-500/10' : 'hover:bg-white/5'
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                      {index === 0 && <span className="text-yellow-400">🥇</span>}
                      {index === 1 && <span className="text-gray-400">🥈</span>}
                      {index === 2 && <span className="text-orange-400">🥉</span>}
                      {index > 2 && (
                        <span className={`text-white ${index < 9 ? 'text-lg' : 'text-sm'}`}>
                          #{entry.rank}
                        </span>
                      )}
                    </div>

                    {/* Avatar & Username */}
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl">{entry.avatar}</div>
                      <div>
                        <div className="text-white font-bold">
                          {entry.username}
                          {entry.isCurrentUser && (
                            <span className="ml-2 text-blue-400 text-sm">(You)</span>
                          )}
                        </div>
                        <div className="text-white/60 text-sm">
                          {entry.achievements} achievements unlocked
                        </div>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <div className="text-white font-bold text-lg">
                        {entry.points.toLocaleString()}
                      </div>
                      <div className="text-white/60 text-sm">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-xl mb-4">🎁 Available Rewards</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Coins */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/20">
                  <div className="text-3xl mb-2">💰</div>
                  <h4 className="text-white font-bold mb-2">USDC Rewards</h4>
                  <p className="text-white/60 text-sm mb-3">
                    Earn USDC coins for completing achievements
                  </p>
                  <div className="text-green-400 font-bold">Available: $250</div>
                </div>

                {/* VIP Days */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/20">
                  <div className="text-3xl mb-2">👑</div>
                  <h4 className="text-white font-bold mb-2">VIP Access</h4>
                  <p className="text-white/60 text-sm mb-3">
                    Unlock VIP benefits and exclusive features
                  </p>
                  <div className="text-yellow-400 font-bold">Available: 45 days</div>
                </div>

                {/* Powerups */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/20">
                  <div className="text-3xl mb-2">⚡</div>
                  <h4 className="text-white font-bold mb-2">Game Powerups</h4>
                  <p className="text-white/60 text-sm mb-3">
                    Special abilities to use during BINGO games
                  </p>
                  <div className="text-purple-400 font-bold">Available: 35 powerups</div>
                </div>

                {/* Exclusive Items */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/20">
                  <div className="text-3xl mb-2">⭐</div>
                  <h4 className="text-white font-bold mb-2">Exclusive Items</h4>
                  <p className="text-white/60 text-sm mb-3">
                    Unique titles, badges, and profile customizations
                  </p>
                  <div className="text-blue-400 font-bold">Available: 8 items</div>
                </div>

                {/* Tournament Entries */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/20">
                  <div className="text-3xl mb-2">🏆</div>
                  <h4 className="text-white font-bold mb-2">Tournament Entries</h4>
                  <p className="text-white/60 text-sm mb-3">
                    Free entry to exclusive VIP tournaments
                  </p>
                  <div className="text-green-400 font-bold">Available: 3 entries</div>
                </div>

                {/* Special Events */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/20">
                  <div className="text-3xl mb-2">🎉</div>
                  <h4 className="text-white font-bold mb-2">Special Events</h4>
                  <p className="text-white/60 text-sm mb-3">
                    Access to exclusive gaming events and challenges
                  </p>
                  <div className="text-yellow-400 font-bold">Available: 2 events</div>
                </div>
              </div>
            </div>

            {/* Claim All Button */}
            <div className="text-center">
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-2xl transform hover:scale-105 transition-all duration-200">
                🎁 Claim All Available Rewards
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementSystem; 