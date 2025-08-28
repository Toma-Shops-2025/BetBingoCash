import React from 'react';
import TournamentCard from './TournamentCard';

const TournamentLobby: React.FC = () => {
  const tournaments = [
    {
      title: "Lightning Round",
      prize: "$1,000",
      entry: "$5.00",
      players: 847,
      maxPlayers: 1000,
      timeLeft: "2:45",
      difficulty: "Easy" as const,
      image: "https://d64gsuwffb70l.cloudfront.net/68afa13c8b8d5f8d0ee8e35a_1756340608220_160a804a.webp"
    },
    {
      title: "Cash Crusher",
      prize: "$2,500",
      entry: "$10.00",
      players: 523,
      maxPlayers: 800,
      timeLeft: "5:12",
      difficulty: "Medium" as const,
      image: "https://d64gsuwffb70l.cloudfront.net/68afa13c8b8d5f8d0ee8e35a_1756340609932_e4f5872d.webp"
    },
    {
      title: "Mega Jackpot",
      prize: "$10,000",
      entry: "$25.00",
      players: 234,
      maxPlayers: 500,
      timeLeft: "8:33",
      difficulty: "Hard" as const,
      image: "https://d64gsuwffb70l.cloudfront.net/68afa13c8b8d5f8d0ee8e35a_1756340611793_069ebd56.webp"
    },
    {
      title: "Speed Bingo",
      prize: "$500",
      entry: "$2.00",
      players: 1203,
      maxPlayers: 1500,
      timeLeft: "1:28",
      difficulty: "Easy" as const,
      image: "https://d64gsuwffb70l.cloudfront.net/68afa13c8b8d5f8d0ee8e35a_1756340613673_01feab3c.webp"
    },
    {
      title: "Winner's Circle",
      prize: "$5,000",
      entry: "$15.00",
      players: 445,
      maxPlayers: 600,
      timeLeft: "12:05",
      difficulty: "Medium" as const,
      image: "https://d64gsuwffb70l.cloudfront.net/68afa13c8b8d5f8d0ee8e35a_1756340615413_29d0d021.webp"
    },
    {
      title: "Elite Championship",
      prize: "$25,000",
      entry: "$50.00",
      players: 89,
      maxPlayers: 200,
      timeLeft: "15:42",
      difficulty: "Hard" as const,
      image: "https://d64gsuwffb70l.cloudfront.net/68afa13c8b8d5f8d0ee8e35a_1756340617359_b4d72bc2.webp"
    }
  ];

  return (
    <div className="py-12 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-white mb-4">
            🏆 LIVE TOURNAMENTS
          </h2>
          <p className="text-xl text-gray-300">
            Join thousands of players competing for real cash prizes right now!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament, index) => (
            <TournamentCard key={index} {...tournament} />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-200">
            VIEW ALL TOURNAMENTS
          </button>
        </div>
      </div>
    </div>
  );
};

export default TournamentLobby;