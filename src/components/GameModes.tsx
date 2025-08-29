import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/components/ui/use-toast';
import GameInterface from './GameInterface';

const GameModes: React.FC = () => {
  const { isAuthenticated, startGame, balance, updateBalance } = useAppContext();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  
  const gameModes = [
    {
      id: 'speed-bingo',
      title: "Speed Bingo",
      description: "Fast-paced games with quick wins",
      entryFee: 5.00,
      prize: "$500",
      minPlayers: 10,
      maxPlayers: 100,
      players: "125",
      image: "https://d64gsuwffb70l.cloudfront.net/68afa3c8dc48a02afdc596ca_1756342029898_22dadc29.webp",
      color: "from-red-500 to-pink-600",
      duration: 60, // 1 minute
      prizeStructure: "Winner takes 80%, Runner-up 20%",
      rules: [
        "Complete 1 line (horizontal, vertical, or diagonal) to win",
        "Numbers called every 3 seconds for fast-paced action",
        "First player to complete a line wins instantly",
        "Tie-breaker: Most numbers marked in shortest time",
        "Auto-daub enabled - no manual marking needed"
      ],
      tips: "Stay focused! Speed is key in this fast-paced mode. Watch for patterns and be ready to call BINGO quickly.",
      specialFeatures: "⚡ Speed Bonus: Complete in under 30 seconds for 10% extra prize"
    },
    {
      id: 'classic-75',
      title: "Classic 75",
      description: "Traditional bingo with big payouts",
      entryFee: 10.00,
      prize: "$1,200",
      minPlayers: 20,
      maxPlayers: 150,
      players: "89",
      image: "https://d64gsuwffb70l.cloudfront.net/68afa3c8dc48a02afdc596ca_1756342031659_b64c02ed.webp",
      color: "from-blue-500 to-indigo-600",
      duration: 120, // 2 minutes
      prizeStructure: "1st: 60%, 2nd: 25%, 3rd: 15%",
      rules: [
        "Complete 1 line (horizontal, vertical, or diagonal) to win",
        "Numbers called every 5 seconds for strategic play",
        "Multiple winners share prize pool proportionally",
        "Full card completion earns 2x prize multiplier",
        "Traditional 5x5 grid with B-I-N-G-O columns"
      ],
      tips: "This is the most popular mode! Take your time and watch for multiple line opportunities.",
      specialFeatures: "🏆 Full Card Bonus: Complete entire card for 2x prize multiplier"
    },
    {
      id: 'pattern-bingo',
      title: "Pattern Bingo",
      description: "Special patterns for bonus wins",
      entryFee: 7.50,
      prize: "$800",
      minPlayers: 15,
      maxPlayers: 120,
      players: "156",
      image: "https://d64gsuwffb70l.cloudfront.net/68afa3c8dc48a02afdc596ca_1756342033434_cde2517b.webp",
      color: "from-green-500 to-emerald-600",
      duration: 90, // 1.5 minutes
      prizeStructure: "Winner takes 70%, Pattern bonus 30%",
      rules: [
        "Complete specific patterns shown at game start",
        "Patterns include: X, L, T, U, Diamond, and more",
        "Numbers called every 4 seconds",
        "Pattern completion order determines prize share",
        "Bonus prizes for completing multiple patterns"
      ],
      tips: "Study the pattern before the game starts! Some patterns are easier than others.",
      specialFeatures: "✨ Pattern Master: Complete 3+ patterns for 50% bonus prize"
    },
    {
      id: 'jackpot-room',
      title: "Jackpot Room",
      description: "Progressive jackpots up to $10K",
      entryFee: 25.00,
      prize: "$10,000",
      minPlayers: 50,
      maxPlayers: 200,
      players: "234",
      image: "", // Remove custom image to use bingo card background
      color: "from-yellow-500 to-orange-600",
      duration: 180, // 3 minutes
      prizeStructure: "Progressive: 90% of entry fees + house contribution",
      rules: [
        "Complete 1 line to win progressive jackpot",
        "Jackpot grows with each game until won",
        "Numbers called every 6 seconds for maximum suspense",
        "Minimum jackpot guarantee: $5,000",
        "House contributes $1,000 to each jackpot"
      ],
      tips: "High stakes, high rewards! This is for serious players looking for life-changing wins.",
      specialFeatures: "🎰 Progressive Jackpot: Grows with every game until someone wins!"
    }
  ];

  const handlePlayGame = (gameMode: any) => {
    if (!isAuthenticated) {
      toast({
        title: "Please Sign In",
        description: "You need to be signed in to play games.",
        variant: "destructive",
      });
      return;
    }

    // Check if user has enough balance for entry fee
    if (balance < gameMode.entryFee) {
      toast({
        title: "Insufficient Balance",
        description: `You need $${gameMode.entryFee.toFixed(2)} to play ${gameMode.title}. Add funds to continue.`,
        variant: "destructive",
      });
      return;
    }

    // Confirm entry fee payment
    const confirmEntry = window.confirm(
      `Join ${gameMode.title}?\n\nEntry Fee: $${gameMode.entryFee.toFixed(2)}\nPrize Pool: ${gameMode.prize}\n\nYour balance: $${(balance || 0).toFixed(2)}\n\nClick OK to confirm and pay entry fee.`
    );

    if (!confirmEntry) return;

    // Deduct entry fee and start game
    updateBalance(-gameMode.entryFee);
    
    // Start the selected game
    startGame(gameMode.id);
    setSelectedGame(gameMode.id);
    
    toast({
      title: `Entry Fee Paid! 🎯`,
      description: `$${gameMode.entryFee.toFixed(2)} deducted. Starting ${gameMode.title}!`,
    });
  };

  const handleBackToModes = () => {
    setSelectedGame(null);
  };

  // If a game is selected, show the game interface
  if (selectedGame) {
    const gameMode = gameModes.find(mode => mode.id === selectedGame);
    return (
      <div className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <button
              onClick={handleBackToModes}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-2 px-6 rounded-full text-sm mb-4 transition-all duration-200"
            >
              ← Back to Game Modes
            </button>
            <h2 className="text-4xl font-black text-white mb-4">
              🎯 {gameMode?.title}
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {gameMode?.description}
            </p>
          </div>
          <GameInterface gameMode={gameMode} />
        </div>
      </div>
    );
  }

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
                  {mode.image ? (
                    <img 
                      src={mode.image} 
                      alt={mode.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                      {/* Bingo Card Background */}
                      <div className="grid grid-cols-5 grid-rows-3 gap-2 p-4">
                        {Array.from({ length: 15 }, (_, i) => (
                          <div key={i} className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-lg">
                            {Math.floor(Math.random() * 75) + 1}
                          </div>
                        ))}
                      </div>
                      {/* Jackpot Icon Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-orange-600/20 flex items-center justify-center">
                        <div className="text-6xl">🎰</div>
                      </div>
                    </div>
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-t ${mode.color} opacity-80 group-hover:opacity-60 transition-opacity`}></div>
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-sm font-bold">👥 {mode.players}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{mode.title}</h3>
                  <p className="text-gray-400 mb-4">{mode.description}</p>
                  
                  {/* Game Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-800 rounded-lg">
                      <div className="text-lg font-bold text-green-400">${mode.entryFee}</div>
                      <div className="text-xs text-gray-500">Entry Fee</div>
                    </div>
                    <div className="text-center p-3 bg-gray-800 rounded-lg">
                      <div className="text-lg font-bold text-yellow-400">{mode.players}</div>
                      <div className="text-xs text-gray-500">Players</div>
                    </div>
                  </div>
                  
                  {/* Prize Structure */}
                  <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-black text-green-400 mb-1">{mode.prize}</div>
                      <div className="text-xs text-gray-500 mb-2">Prize Pool</div>
                      <div className="text-xs text-blue-400">{mode.prizeStructure}</div>
                    </div>
                  </div>

                  {/* Rules & Tips Section */}
                  <div className="mb-4 space-y-3">
                    {/* Rules */}
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="text-xs font-bold text-blue-400 mb-2 flex items-center gap-1">
                        📋 Rules
                      </div>
                      <ul className="text-xs text-gray-300 space-y-1">
                        {mode.rules.slice(0, 3).map((rule, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-400 text-xs">•</span>
                            <span>{rule}</span>
                          </li>
                        ))}
                        {mode.rules.length > 3 && (
                          <li className="text-blue-400 text-xs cursor-pointer hover:underline">
                            +{mode.rules.length - 3} more rules...
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Tips */}
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                      <div className="text-xs font-bold text-yellow-400 mb-2 flex items-center gap-1">
                        💡 Pro Tip
                      </div>
                      <p className="text-xs text-yellow-300">{mode.tips}</p>
                    </div>

                    {/* Special Features */}
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                      <div className="text-xs font-bold text-purple-400 mb-2 flex items-center gap-1">
                        ⭐ Special Features
                      </div>
                      <p className="text-xs text-purple-300">{mode.specialFeatures}</p>
                    </div>
                  </div>
                  
                  {/* Player Limits */}
                  <div className="text-center text-xs text-gray-500 mb-4">
                    Min: {mode.minPlayers} | Max: {mode.maxPlayers} players
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <div className="text-sm text-white/80">Duration</div>
                      <div className="text-xs text-gray-500">{Math.floor(mode.duration / 60)}m {mode.duration % 60}s</div>
                    </div>
                    <button 
                      onClick={() => handlePlayGame(mode)}
                      className={`bg-gradient-to-r ${mode.color} text-white font-bold py-2 px-4 rounded-full text-sm hover:shadow-lg transition-all transform hover:scale-105`}
                    >
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