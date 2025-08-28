import React from 'react';

interface TournamentCardProps {
  title: string;
  prize: string;
  entry: string;
  players: number;
  maxPlayers: number;
  timeLeft: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  image: string;
}

const TournamentCard: React.FC<TournamentCardProps> = ({
  title, prize, entry, players, maxPlayers, timeLeft, difficulty, image
}) => {
  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-2xl p-6 border-2 border-purple-400/30 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="flex justify-between items-start mb-4">
        <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getDifficultyColor(difficulty)}`}>
          {difficulty}
        </div>
        <div className="text-right">
          <div className="text-yellow-400 font-bold text-lg">{prize}</div>
          <div className="text-white/60 text-sm">Prize Pool</div>
        </div>
      </div>
      
      <h3 className="text-white font-bold text-xl mb-3">{title}</h3>
      
      <div className="flex items-center gap-3 mb-4">
        <img src={image} alt="Game" className="w-12 h-12 rounded-full border-2 border-yellow-400/50" />
        <div>
          <div className="text-white/80 text-sm">Entry Fee</div>
          <div className="text-green-400 font-bold">{entry}</div>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Players</span>
          <span className="text-white">{players}/{maxPlayers}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
            style={{ width: `${(players / maxPlayers) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-orange-400 text-sm font-medium">⏰ {timeLeft}</div>
        <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 px-6 rounded-full text-sm transition-all duration-200">
          JOIN NOW
        </button>
      </div>
    </div>
  );
};

export default TournamentCard;