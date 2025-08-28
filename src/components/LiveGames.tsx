import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const LiveGames: React.FC = () => {
  const liveGames = [
    {
      room: "Mega Jackpot Room",
      players: 1247,
      prize: "$15,420",
      nextDraw: "2:34",
      status: "live",
      difficulty: "High Stakes"
    },
    {
      room: "Speed Lightning",
      players: 892,
      prize: "$3,200",
      nextDraw: "0:45",
      status: "live",
      difficulty: "Fast Pace"
    },
    {
      room: "Classic Gold",
      players: 654,
      prize: "$5,800",
      nextDraw: "4:12",
      status: "live",
      difficulty: "Traditional"
    },
    {
      room: "Pattern Master",
      players: 423,
      prize: "$2,100",
      nextDraw: "1:58",
      status: "live",
      difficulty: "Strategy"
    },
    {
      room: "Newbie Friendly",
      players: 789,
      prize: "$1,500",
      nextDraw: "3:27",
      status: "live",
      difficulty: "Beginner"
    },
    {
      room: "VIP Diamond",
      players: 156,
      prize: "$25,000",
      nextDraw: "6:45",
      status: "live",
      difficulty: "Exclusive"
    }
  ];

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-black text-white mb-4">
              🔴 Live Games Now
            </h2>
            <p className="text-xl text-gray-300">
              Join thousands of players competing for real cash prizes right now!
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 font-bold">LIVE</span>
            </div>
            <div className="text-white font-bold">
              <span className="text-green-400">3,461</span> Players Online
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveGames.map((game, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:border-green-500 transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{game.room}</h3>
                    <span className="text-sm text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">
                      {game.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-bold">LIVE</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Prize Pool:</span>
                    <span className="text-green-400 font-bold text-lg">{game.prize}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Players:</span>
                    <span className="text-blue-400 font-bold">{game.players.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Next Draw:</span>
                    <span className="text-yellow-400 font-bold">{game.nextDraw}</span>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-full transition-all duration-200 transform group-hover:scale-105">
                  🎯 Join Game
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-200">
            🔥 View All Live Games
          </button>
        </div>
      </div>
    </section>
  );
};

export default LiveGames;