import React from 'react';

interface LeaderboardCardProps {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  winnings: string;
  isCurrentUser?: boolean;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  rank, name, avatar, score, winnings, isCurrentUser = false
}) => {
  const getRankColor = (rank: number) => {
    switch(rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500 text-black';
      case 3: return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
      default: return 'bg-gradient-to-r from-purple-600 to-purple-800 text-white';
    }
  };

  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1: return '👑';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '';
    }
  };

  return (
    <div className={`rounded-2xl p-4 border-2 transition-all duration-300 hover:scale-102 ${
      isCurrentUser 
        ? 'bg-gradient-to-r from-green-800 to-emerald-900 border-green-400 shadow-lg shadow-green-400/20' 
        : 'bg-gradient-to-r from-indigo-800 to-purple-900 border-purple-400/30 hover:border-yellow-400/50'
    }`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getRankColor(rank)}`}>
          {getRankIcon(rank) || rank}
        </div>
        
        <img 
          src={avatar} 
          alt={name}
          className="w-14 h-14 rounded-full border-3 border-yellow-400/50 object-cover"
        />
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-bold text-lg">{name}</h3>
            {isCurrentUser && <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">YOU</span>}
          </div>
          <div className="text-gray-300 text-sm">Score: {score.toLocaleString()}</div>
        </div>
        
        <div className="text-right">
          <div className="text-green-400 font-bold text-lg">{winnings}</div>
          <div className="text-gray-400 text-sm">Winnings</div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCard;