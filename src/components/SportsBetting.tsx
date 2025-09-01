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
  AlertCircle,
  Football,
  Basketball,
  Baseball,
  Soccer
} from 'lucide-react';

interface Sport {
  id: string;
  name: string;
  icon: string;
  color: string;
  isActive: boolean;
  eventsCount: number;
  totalBets: number;
}

interface SportEvent {
  id: string;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  startTime: Date;
  status: 'upcoming' | 'live' | 'finished';
  odds: {
    home: number;
    draw?: number;
    away: number;
  };
  totalBets: number;
  isPopular: boolean;
  specialOffers: string[];
}

interface BettingSlip {
  eventId: string;
  selection: 'home' | 'draw' | 'away';
  odds: number;
  stake: number;
  potentialWin: number;
}

const SportsBetting: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [activeSport, setActiveSport] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<SportEvent | null>(null);
  const [bettingSlip, setBettingSlip] = useState<BettingSlip[]>([]);
  const [stake, setStake] = useState('');
  const [showBetModal, setShowBetModal] = useState(false);

  const sports: Sport[] = [
    {
      id: 'football',
      name: 'Football',
      icon: '🏈',
      color: 'from-orange-500 to-red-600',
      isActive: true,
      eventsCount: 156,
      totalBets: 45000
    },
    {
      id: 'basketball',
      name: 'Basketball',
      icon: '🏀',
      color: 'from-orange-400 to-orange-600',
      isActive: true,
      eventsCount: 89,
      totalBets: 32000
    },
    {
      id: 'baseball',
      name: 'Baseball',
      icon: '⚾',
      color: 'from-blue-500 to-blue-700',
      isActive: true,
      eventsCount: 67,
      totalBets: 28000
    },
    {
      id: 'soccer',
      name: 'Soccer',
      icon: '⚽',
      color: 'from-green-500 to-green-700',
      isActive: true,
      eventsCount: 234,
      totalBets: 67000
    },
    {
      id: 'hockey',
      name: 'Hockey',
      icon: '🏒',
      color: 'from-gray-500 to-gray-700',
      isActive: true,
      eventsCount: 45,
      totalBets: 18000
    },
    {
      id: 'tennis',
      name: 'Tennis',
      icon: '🎾',
      color: 'from-yellow-500 to-yellow-700',
      isActive: true,
      eventsCount: 78,
      totalBets: 25000
    }
  ];

  const sportEvents: SportEvent[] = [
    // Football Events
    {
      id: 'football_1',
      sport: 'football',
      league: 'NFL',
      homeTeam: 'Kansas City Chiefs',
      awayTeam: 'Buffalo Bills',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      status: 'upcoming',
      odds: { home: 1.85, away: 2.10 },
      totalBets: 12500,
      isPopular: true,
      specialOffers: ['Double Winnings', 'Free Bet if Chiefs Win']
    },
    {
      id: 'football_2',
      sport: 'football',
      league: 'NFL',
      homeTeam: 'Dallas Cowboys',
      awayTeam: 'Philadelphia Eagles',
      startTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
      status: 'upcoming',
      odds: { home: 2.25, away: 1.75 },
      totalBets: 8900,
      isPopular: true,
      specialOffers: ['Risk-Free Bet', 'Live Cash Out']
    },

    // Basketball Events
    {
      id: 'basketball_1',
      sport: 'basketball',
      league: 'NBA',
      homeTeam: 'Los Angeles Lakers',
      awayTeam: 'Golden State Warriors',
      startTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
      status: 'upcoming',
      odds: { home: 1.95, away: 1.90 },
      totalBets: 15600,
      isPopular: true,
      specialOffers: ['Triple Points', 'First Basket Bonus']
    },
    {
      id: 'basketball_2',
      sport: 'basketball',
      league: 'NBA',
      homeTeam: 'Boston Celtics',
      awayTeam: 'Miami Heat',
      startTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
      status: 'upcoming',
      odds: { home: 1.65, away: 2.35 },
      totalBets: 7200,
      isPopular: false,
      specialOffers: ['Live Betting', 'Quarter Betting']
    },

    // Soccer Events
    {
      id: 'soccer_1',
      sport: 'soccer',
      league: 'Premier League',
      homeTeam: 'Manchester United',
      awayTeam: 'Liverpool',
      startTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
      status: 'upcoming',
      odds: { home: 2.80, draw: 3.20, away: 2.50 },
      totalBets: 23400,
      isPopular: true,
      specialOffers: ['Both Teams Score', 'Over/Under Goals']
    },
    {
      id: 'soccer_2',
      sport: 'soccer',
      league: 'La Liga',
      homeTeam: 'Real Madrid',
      awayTeam: 'Barcelona',
      startTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
      status: 'upcoming',
      odds: { home: 2.15, draw: 3.40, away: 3.25 },
      totalBets: 18900,
      isPopular: true,
      specialOffers: ['El Clásico Special', 'First Goal Scorer']
    },

    // Live Events
    {
      id: 'live_1',
      sport: 'basketball',
      league: 'NBA',
      homeTeam: 'Chicago Bulls',
      awayTeam: 'Detroit Pistons',
      startTime: new Date(Date.now() - 30 * 60 * 1000),
      status: 'live',
      odds: { home: 1.75, away: 2.15 },
      totalBets: 4500,
      isPopular: false,
      specialOffers: ['Live Betting', 'Quarter Betting']
    }
  ];

  const filteredEvents = sportEvents.filter(event => 
    activeSport === 'all' || event.sport === activeSport
  );

  const handleAddToBettingSlip = (event: SportEvent, selection: 'home' | 'draw' | 'away') => {
    const odds = event.odds[selection];
    if (!odds) return;

    const newBet: BettingSlip = {
      eventId: event.id,
      selection,
      odds,
      stake: 0,
      potentialWin: 0
    };

    setBettingSlip(prev => [...prev, newBet]);
    toast({
      title: '✅ Bet Added!',
      description: `${event.homeTeam} vs ${event.awayTeam} added to betting slip`,
    });
  };

  const handleRemoveBet = (eventId: string) => {
    setBettingSlip(prev => prev.filter(bet => bet.eventId !== eventId));
  };

  const calculateTotalOdds = () => {
    if (bettingSlip.length === 0) return 1;
    return bettingSlip.reduce((total, bet) => total * bet.odds, 1);
  };

  const calculatePotentialWin = () => {
    const totalOdds = calculateTotalOdds();
    const stakeAmount = parseFloat(stake) || 0;
    return (totalOdds * stakeAmount - stakeAmount).toFixed(2);
  };

  const handlePlaceBet = () => {
    if (!user) {
      toast({
        title: '❌ Not Authenticated',
        description: 'Please log in to place bets',
        variant: 'destructive'
      });
      return;
    }

    if (bettingSlip.length === 0) {
      toast({
        title: '❌ No Bets Selected',
        description: 'Please add some events to your betting slip',
        variant: 'destructive'
      });
      return;
    }

    if (!stake || parseFloat(stake) <= 0) {
      toast({
        title: '❌ Invalid Stake',
        description: 'Please enter a valid stake amount',
        variant: 'destructive'
      });
      return;
    }

    // In production, this would process the bet
    toast({
      title: '🎉 Bet Placed!',
      description: `Your bet of $${stake} has been placed successfully!`,
    });

    // Clear betting slip
    setBettingSlip([]);
    setStake('');
    setShowBetModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-400';
      case 'live': return 'text-green-400';
      case 'finished': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <Clock className="w-4 h-4" />;
      case 'live': return <Play className="w-4 h-4" />;
      case 'finished': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatTimeRemaining = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    
    if (diff <= 0) return 'Started';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
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
          <div className="text-6xl mb-4">🏈</div>
          <h1 className="text-5xl font-bold text-white mb-4">Sports Betting</h1>
          <p className="text-white/80 text-xl">
            Bet on your favorite sports with the best odds and biggest payouts!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-white">1,200+</div>
            <div className="text-white/60 text-sm">Live Events</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-white">$15M+</div>
            <div className="text-white/60 text-sm">Paid Out Today</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-white">250K+</div>
            <div className="text-white/60 text-sm">Active Bettors</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-white">98.5%</div>
            <div className="text-white/60 text-sm">Payout Rate</div>
          </div>
        </div>

        {/* Sports Navigation */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {sports.map(sport => (
            <button
              key={sport.id}
              onClick={() => setActiveSport(sport.id)}
              className={`relative px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-105 ${
                activeSport === sport.id
                  ? `bg-gradient-to-r ${sport.color} text-white shadow-2xl`
                  : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
              }`}
            >
              <div className="text-2xl mb-2">{sport.icon}</div>
              <div className="font-bold">{sport.name}</div>
              <div className="text-xs opacity-80">{sport.eventsCount} events</div>
              {sport.isActive && (
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Betting Slip Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowBetModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
          >
            📋 Betting Slip ({bettingSlip.length})
            {bettingSlip.length > 0 && (
              <span className="bg-white text-green-600 px-2 py-1 rounded-full text-xs">
                {bettingSlip.length}
              </span>
            )}
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map(event => (
            <div
              key={event.id}
              className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 hover:scale-105 border-white/20 hover:border-white/40"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  event.status === 'live' ? 'bg-green-500/20 text-green-400' :
                  event.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {getStatusIcon(event.status)}
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </div>
              </div>

              {/* Popular Badge */}
              {event.isPopular && (
                <div className="absolute top-4 left-4 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold">
                  🔥 POPULAR
                </div>
              )}

              {/* Event Header */}
              <div className="mb-4">
                <div className="text-white/60 text-sm mb-2">{event.league}</div>
                <h3 className="text-white font-bold text-xl mb-2">
                  {event.homeTeam} vs {event.awayTeam}
                </h3>
                <div className="text-white/60 text-sm">
                  {formatTimeRemaining(event.startTime)}
                </div>
              </div>

              {/* Odds */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <button
                  onClick={() => handleAddToBettingSlip(event, 'home')}
                  className="bg-white/10 hover:bg-white/20 rounded-xl p-3 text-center transition-all duration-200 hover:scale-105"
                >
                  <div className="text-white font-bold text-lg">{event.odds.home}</div>
                  <div className="text-white/60 text-sm">{event.homeTeam}</div>
                </button>
                
                {event.odds.draw && (
                  <button
                    onClick={() => handleAddToBettingSlip(event, 'draw')}
                    className="bg-white/10 hover:bg-white/20 rounded-xl p-3 text-center transition-all duration-200 hover:scale-105"
                  >
                    <div className="text-white font-bold text-lg">{event.odds.draw}</div>
                    <div className="text-white/60 text-sm">Draw</div>
                  </button>
                )}
                
                <button
                  onClick={() => handleAddToBettingSlip(event, 'away')}
                  className="bg-white/10 hover:bg-white/20 rounded-xl p-3 text-center transition-all duration-200 hover:scale-105"
                >
                  <div className="text-white font-bold text-lg">{event.odds.away}</div>
                  <div className="text-white/60 text-sm">{event.awayTeam}</div>
                </button>
              </div>

              {/* Special Offers */}
              {event.specialOffers.length > 0 && (
                <div className="mb-4">
                  <div className="text-white/60 text-sm mb-2">Special Offers:</div>
                  <div className="flex flex-wrap gap-2">
                    {event.specialOffers.map((offer, index) => (
                      <span
                        key={index}
                        className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs"
                      >
                        {offer}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Stats */}
              <div className="flex justify-between text-white/60 text-sm">
                <span>Total Bets: {event.totalBets.toLocaleString()}</span>
                <span>Live Betting: {event.status === 'live' ? 'Yes' : 'No'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Betting Slip Modal */}
        {showBetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-blue-800 to-purple-900 rounded-3xl p-8 shadow-2xl border-4 border-blue-500 max-w-2xl w-full text-white relative">
              <button
                onClick={() => setShowBetModal(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl"
              >
                ×
              </button>
              
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-yellow-300 mb-2">Betting Slip</h2>
                <p className="text-white/80">Review and place your bets</p>
              </div>

              {/* Selected Bets */}
              {bettingSlip.length === 0 ? (
                <div className="text-center text-white/60 py-8">
                  No bets selected yet
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {bettingSlip.map((bet, index) => {
                    const event = sportEvents.find(e => e.id === bet.eventId);
                    if (!event) return null;

                    return (
                      <div key={index} className="bg-white/10 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-white font-bold">
                            {event.homeTeam} vs {event.awayTeam}
                          </div>
                          <button
                            onClick={() => handleRemoveBet(bet.eventId)}
                            className="text-red-400 hover:text-red-300"
                          >
                            ×
                          </button>
                        </div>
                        <div className="text-white/60 text-sm">
                          Selection: {bet.selection === 'home' ? event.homeTeam : 
                                     bet.selection === 'away' ? event.awayTeam : 'Draw'}
                        </div>
                        <div className="text-white/60 text-sm">
                          Odds: {bet.odds}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Betting Slip Summary */}
              {bettingSlip.length > 0 && (
                <div className="bg-white/10 rounded-xl p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-white/60 text-sm mb-1">Total Odds</div>
                      <div className="text-white font-bold text-xl">{calculateTotalOdds().toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-white/60 text-sm mb-1">Potential Win</div>
                      <div className="text-green-400 font-bold text-xl">${calculatePotentialWin()}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Stake Input */}
              <div className="mb-6">
                <label className="block text-white/80 text-sm mb-2">Stake Amount ($)</label>
                <input
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  placeholder="Enter stake amount"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handlePlaceBet}
                  disabled={bettingSlip.length === 0 || !stake}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                  🎯 Place Bet
                </button>
                <button
                  onClick={() => setShowBetModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Bet Big?</h2>
          <p className="text-white/80 text-lg mb-6">
            Join thousands of sports bettors who are already winning big!
          </p>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-2xl transform hover:scale-105 transition-all duration-200">
            🚀 Start Betting Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SportsBetting; 