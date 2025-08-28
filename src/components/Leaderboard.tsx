import React from 'react';
import LeaderboardCard from './LeaderboardCard';

const Leaderboard: React.FC = () => {
  const players = [
    {
      rank: 1,
      name: "BingoKing92",
      avatar: "https://d64gsuwffb70l.cloudfront.net/68afa13c8b8d5f8d0ee8e35a_1756340622462_ee13e57b.webp",
      score: 8750,
      winnings: "$2,450.00"
    },
    {
      rank: 2,
      name: "CashQueen",
      avatar: "https://d64gsuwffb70l.cloudfront.net/68afa13c8b8d5f8d0ee8e35a_1756340624185_6d445cfe.webp",
      score: 8234,
      winnings: "$1,890.00"
    },
    {
      rank: 3,
      name: "LuckyStrike",
      avatar: "https://d64gsuwffb70l.cloudfront.net/68afa13c8b8d5f8d0ee8e35a_1756340626519_b1d92c12.webp",
      score: 7965,
      winnings: "$1,340.00"
    },
    {
      rank: 4,
      name: "WinnerTakesAll",
      avatar: "https://d64gsuwffb70l.cloudfront.net/68afa13c8b8d5f8d0ee8e35a_1756340628253_cb45b718.webp",
      score: 7456,
      winnings: "$980.00"
    },
    {
      rank: 5,
      name: "BingoMaster",
      avatar: "https://d64gsuwffb70l.cloudfront.net/68afa13c8b8d5f8d0ee8e35a_1756340630255_d137fddd.webp",
      score: 7123,
      winnings: "$750.00"
    },
    {
      rank: 6,
      name: "You",
      avatar: "https://d64gsuwffb70l.cloudfront.net/68afa13c8b8d5f8d0ee8e35a_1756340632022_57bd38c5.webp",
      score: 6890,
      winnings: "$650.00",
      isCurrentUser: true
    },
    {
      rank: 7,
      name: "CashCrusher",
      avatar: "https://d64gsuwffb70l.cloudfront.net/68afa13c8b8d5f8d0ee8e35a_1756340633897_6aa57cb9.webp",
      score: 6234,
      winnings: "$520.00"
    },
    {
      rank: 8,
      name: "BingoHero",
      avatar: "https://d64gsuwffb70l.cloudfront.net/68afa13c8b8d5f8d0ee8e35a_1756340635715_3ff9bc2b.webp",
      score: 5987,
      winnings: "$430.00"
    }
  ];

  return (
    <div className="py-12 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-white mb-4">
            🏅 TOP WINNERS
          </h2>
          <p className="text-xl text-gray-300">
            See where you rank among today's biggest winners!
          </p>
        </div>
        
        <div className="space-y-4">
          {players.map((player, index) => (
            <LeaderboardCard key={index} {...player} />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-200">
            VIEW FULL LEADERBOARD
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;