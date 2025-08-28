import React from 'react';

const DailyRewards: React.FC = () => {
  const rewards = [
    { day: 1, reward: '💎 50 Gems', claimed: true },
    { day: 2, reward: '💎 70 Gems', claimed: true },
    { day: 3, reward: '💰 $0.30', claimed: false, current: true },
    { day: 4, reward: '💎 90 Gems', claimed: false },
    { day: 5, reward: '💎 100 Gems', claimed: false },
    { day: 6, reward: '💎 120 Gems', claimed: false },
    { day: 7, reward: '🎁 $0.30 + 💎 130', claimed: false, special: true }
  ];

  return (
    <div className="py-12 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-white mb-4">
            🗓️ 7-DAY BONUS STREAK
          </h2>
          <p className="text-xl text-blue-200">
            Login daily to claim your rewards and build your streak!
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-3xl p-8 border-2 border-purple-400/30">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">
              7-Day Bonus Streak
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            {rewards.slice(0, 6).map((reward, index) => (
              <div key={index} className={`rounded-2xl p-4 text-center border-2 transition-all duration-300 ${
                reward.claimed 
                  ? 'bg-green-600/20 border-green-400/50' 
                  : reward.current 
                  ? 'bg-yellow-500/20 border-yellow-400 animate-pulse' 
                  : 'bg-purple-600/20 border-purple-400/30'
              }`}>
                <div className="text-white font-bold mb-2">Day {reward.day}</div>
                <div className="text-2xl mb-2">💎</div>
                <div className="text-white text-sm">{reward.reward}</div>
                {reward.claimed && <div className="text-green-400 text-xs mt-2">✓ Claimed</div>}
              </div>
            ))}
          </div>
          
          {/* Day 7 Special */}
          <div className="bg-gradient-to-r from-pink-600 to-purple-700 rounded-2xl p-6 border-2 border-pink-400/50">
            <div className="text-center">
              <div className="text-white font-bold text-xl mb-2">Day 7</div>
              <div className="text-4xl mb-2">🎁</div>
              <div className="text-white text-lg font-bold mb-2">$0.30 + 💎 130</div>
              <div className="text-pink-200 text-sm">Special Bonus!</div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-200">
              🎁 CLAIM TODAY'S REWARD
            </button>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-orange-400">3</div>
            <div className="text-white/80 text-sm">Current Streak</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-yellow-400">15</div>
            <div className="text-white/80 text-sm">Best Streak</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-green-400">$45.60</div>
            <div className="text-white/80 text-sm">Total Earned</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyRewards;