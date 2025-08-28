import React from 'react';

const GameStats: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-2xl font-bold text-yellow-400">$750K</div>
              <div className="text-white/80 text-sm">Total Winnings</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-green-400">15,234</div>
              <div className="text-white/80 text-sm">Winners Today</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl mb-2">🎮</div>
              <div className="text-2xl font-bold text-blue-400">89</div>
              <div className="text-white/80 text-sm">Live Games</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-2xl font-bold text-orange-400">2.5s</div>
              <div className="text-white/80 text-sm">Avg Payout</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStats;