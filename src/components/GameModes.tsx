import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const GameModes: React.FC = () => {
  const gameModes = [
    {
      title: "Speed Bingo",
      description: "Fast-paced games with quick wins",
      prize: "$500",
      players: "125",
      image: "https://d64gsuwffb70l.cloudfront.net/68afa3c8dc48a02afdc596ca_1756342029898_22dadc29.webp",
      color: "from-red-500 to-pink-600"
    },
    {
      title: "Classic 75",
      description: "Traditional bingo with big payouts",
      prize: "$1,200",
      players: "89",
      image: "https://d64gsuwffb70l.cloudfront.net/68afa3c8dc48a02afdc596ca_1756342031659_b64c02ed.webp",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Pattern Bingo",
      description: "Special patterns for bonus wins",
      prize: "$800",
      players: "156",
      image: "https://d64gsuwffb70l.cloudfront.net/68afa3c8dc48a02afdc596ca_1756342033434_cde2517b.webp",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Jackpot Room",
      description: "Progressive jackpots up to $10K",
      prize: "$10,000",
      players: "234",
      image: "https://d64gsuwffb70l.cloudfront.net/68afa3c8dc48a02afdc596ca_1756342035247_9b1fbe11.webp",
      color: "from-yellow-500 to-orange-600"
    }
  ];

  return (
    <section className="py-16 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white mb-4">
            Choose Your Game Mode
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Multiple ways to win big! Pick your favorite bingo style and start earning cash prizes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gameModes.map((mode, index) => (
            <Card key={index} className="bg-gray-900 border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 cursor-pointer group">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={mode.image} 
                    alt={mode.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${mode.color} opacity-80 group-hover:opacity-60 transition-opacity`}></div>
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-sm font-bold">👥 {mode.players}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{mode.title}</h3>
                  <p className="text-gray-400 mb-4">{mode.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <div className="text-2xl font-black text-green-400">{mode.prize}</div>
                      <div className="text-xs text-gray-500">Prize Pool</div>
                    </div>
                    <button className={`bg-gradient-to-r ${mode.color} text-white font-bold py-2 px-4 rounded-full text-sm hover:shadow-lg transition-all`}>
                      Play Now
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GameModes;