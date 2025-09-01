import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Users, DollarSign, Play } from 'lucide-react';
import GameInterface from './GameInterface';

const GameModes: React.FC = () => {
  const { isAuthenticated, balance, updateBalance, startGame } = useAppContext();
  const { toast } = useToast();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  // 7 different BINGO game rooms with varying stakes
  const gameRooms = [
    {
      id: 'room-1',
      title: 'BINGO Battle - 5 Players',
      description: 'Fast-paced 5-player BINGO battle with quick rounds and instant action!',
      features: ['5 Players', '2-Minute Timer', 'Powerups', '1st/2nd/3rd Prizes'],
      specialInfo: '5 Players',
      entryFee: 15.00,
      prizePool: 75.00,
      minPlayers: 5,
      currentPlayers: 5,
      bingoPattern: 'Any 5 in a row',
      playerCount: 5,
      houseEdge: '30%',
      payout: '70%'
    },
    {
      id: 'room-2',
      title: 'BINGO Championship - 10 Players',
      description: 'Medium-sized tournament with 10 competitive players and bigger prize pools!',
      features: ['10 Players', '2-Minute Timer', 'Powerups', '1st/2nd/3rd Prizes'],
      specialInfo: '10 Players',
      entryFee: 20.00,
      prizePool: 200.00,
      minPlayers: 10,
      currentPlayers: 10,
      bingoPattern: 'Any 5 in a row',
      playerCount: 10,
      houseEdge: '30%',
      payout: '70%'
    },
    {
      id: 'room-3',
      title: 'BINGO Tournament - 15 Players',
      description: 'Large tournament with 15 players competing for substantial prizes!',
      features: ['15 Players', '2-Minute Timer', 'Powerups', '1st/2nd/3rd Prizes'],
      specialInfo: '15 Players',
      entryFee: 25.00,
      prizePool: 375.00,
      minPlayers: 15,
      currentPlayers: 15,
      bingoPattern: 'Any 5 in a row',
      playerCount: 15,
      houseEdge: '30%',
      payout: '70%'
    },
    {
      id: 'room-4',
      title: 'BINGO Grand Championship - 20 Players',
      description: 'Epic 20-player championship with massive prize pools and ultimate glory!',
      features: ['20 Players', '2-Minute Timer', 'Powerups', '1st/2nd/3rd Prizes'],
      specialInfo: '20 Players',
      entryFee: 30.00,
      prizePool: 600.00,
      minPlayers: 20,
      currentPlayers: 20,
      bingoPattern: 'Any 5 in row',
      playerCount: 20,
      houseEdge: '30%',
      payout: '70%'
    }
  ];

  // Calculate dynamic prize based on entry fee and player count
  const calculatePrize = (entryFee: number, currentPlayers: number, roomId: string) => {
    // Return exact prize amounts as requested by user
    const exactPrizes: { [key: string]: number } = {
      'bingo-room-1': 1.50,
      'bingo-room-2': 5.00,
      'bingo-room-3': 13.50,
      'bingo-room-4': 9.00,
      'bingo-room-5': 13.00,
      'bingo-room-6': 18.90,
      'bingo-room-7': 35.00
    };
    
    return exactPrizes[roomId] || (entryFee * 15).toFixed(2);
  };

  // Calculate crown points (VIP system)
  const calculateCrownPoints = (entryFee: number, currentPlayers: number) => {
    const basePoints = entryFee * 100;
    const playerMultiplier = Math.max(1, currentPlayers / 5);
    return Math.floor(basePoints * playerMultiplier);
  };

  const handlePlayGame = (gameRoom: any) => {
    if (!isAuthenticated) {
      toast({
        title: "Please Sign In",
        description: "You need to be signed in to play games.",
        variant: "destructive",
      });
      return;
    }

    // Check if user has enough balance for entry fee
    if (balance < gameRoom.entryFee) {
      toast({
        title: "Insufficient Balance",
        description: `You need $${gameRoom.entryFee.toFixed(2)} to join ${gameRoom.title}. Add funds to continue.`,
        variant: "destructive",
      });
      return;
    }

    // Check if room has minimum players
    if (gameRoom.currentPlayers < gameRoom.minPlayers) {
      toast({
        title: "Room Not Ready",
        description: `This room needs at least ${gameRoom.minPlayers} players to start. Currently: ${gameRoom.currentPlayers} players.`,
        variant: "destructive",
      });
      return;
    }

    // Confirm entry fee payment
    const confirmEntry = window.confirm(
      `Join ${gameRoom.title}?\n\nEntry Fee: $${gameRoom.entryFee.toFixed(2)}\nPrize Pool: $${calculatePrize(gameRoom.entryFee, gameRoom.currentPlayers, gameRoom.id)}\nPlayers: ${gameRoom.currentPlayers}\n\nYour balance: $${(balance || 0).toFixed(2)}\n\nClick OK to confirm and pay entry fee.`
    );

    if (!confirmEntry) return;

    // Deduct entry fee and start game
    updateBalance(-gameRoom.entryFee);
    
    // Show success message
    toast({
      title: `Entry Fee Paid! 🎯`,
      description: `$${gameRoom.entryFee.toFixed(2)} deducted. Starting ${gameRoom.title}!`,
    });

    // Small delay to show the toast, then start the game
    setTimeout(() => {
      setSelectedGame(gameRoom.id);
    }, 1000);
  };

  const handleBackToRooms = () => {
    setSelectedGame(null);
  };

  // If a game is selected, show the game interface
  if (selectedGame) {
    const gameRoom = gameRooms.find(room => room.id === selectedGame);
    return (
      <GameInterface 
        gameMode={selectedGame}
        onExit={() => setSelectedGame(null)}
      />
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Multiple ways to win big! Pick your favorite BINGO room and start earning cash prizes. 
            Same BINGO rules, different stakes and odds.
          </p>
        </div>

        {/* Game Rooms Grid */}
        <div className="space-y-4">
          {gameRooms.map((room, index) => {
            const prizeAmount = calculatePrize(room.entryFee, room.currentPlayers, room.id);
            const crownPoints = calculateCrownPoints(room.entryFee, room.currentPlayers);
            
            return (
              <Card key={room.id} className="bg-gray-900 border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 cursor-pointer group">
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    {/* Left Section - Prize Info (Yellow/Orange) */}
                    <div className={`w-1/3 bg-gradient-to-br ${room.color} p-4 rounded-l-lg flex flex-col justify-center items-center text-center`}>
                      <div className="text-3xl font-black text-white mb-2">${prizeAmount}</div>
                      <div className="text-sm text-white/80 mb-4">PRIZE</div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Crown className="w-5 h-5 text-yellow-200" />
                        <span className="text-white font-bold text-sm">
                          {crownPoints >= 1000 ? `${(crownPoints / 1000).toFixed(1)}K` : crownPoints}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-white/80" />
                        <span className="text-white text-sm">Players: {room.currentPlayers}</span>
                      </div>
                    </div>

                    {/* Middle Section - Game Info (Blue/Purple) */}
                    <div className="w-1/3 bg-gradient-to-br from-blue-500 to-purple-600 p-4 flex flex-col justify-center items-center text-center relative overflow-hidden">
                      {/* Special Info Badge */}
                      <div className="absolute top-2 left-2 bg-yellow-500/90 backdrop-blur-sm rounded-full px-2 py-1 animate-pulse">
                        <span className="text-black text-xs font-bold">
                          {room.specialInfo}
                        </span>
                      </div>
                      
                      {/* Room Status Badge */}
                      <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
                        <span className="text-white text-xs font-bold">
                          {room.currentPlayers >= room.minPlayers ? 'Ready' : 'Waiting'}
                        </span>
                      </div>
                      
                      {/* Prominent START GAME Button */}
                      <Button
                        onClick={() => handlePlayGame(room)}
                        disabled={room.currentPlayers < room.minPlayers}
                        className={`mb-3 w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-2 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 ${
                          room.currentPlayers < room.minPlayers ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        🚀 START GAME
                      </Button>
                      
                      {/* BINGO Card Background */}
                      <div className="grid grid-cols-3 grid-rows-2 gap-1 mb-3">
                        {Array.from({ length: 6 }, (_, i) => (
                          <div key={i} className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            {Math.floor(Math.random() * 75) + 1}
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-white font-bold text-lg mb-1">{room.title}</div>
                      <div className="text-white/80 text-sm mb-2">{room.description}</div>
                      
                      {/* Features List */}
                      <div className="space-y-1">
                        {room.features.slice(0, 2).map((feature, index) => (
                          <div key={index} className="text-white/90 text-xs font-medium">
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Section - Entry & Play (White/Gray) */}
                    <div className="w-1/3 bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-r-lg flex flex-col justify-center items-center text-center">
                      <div className="text-2xl font-bold text-gray-800 mb-2">Entry</div>
                      <div className="text-3xl font-black text-green-600 mb-2">${room.entryFee}</div>
                      
                      {/* House Edge & Payout Info */}
                      <div className="text-xs text-gray-600 mb-3 space-y-1">
                        <div>Prize Pool: ${room.prizePool}</div>
                        <div className="text-red-600 font-semibold">House Edge: {room.houseEdge}</div>
                        <div className="text-blue-600 font-semibold">Payout: {room.payout}</div>
                      </div>
                      
                      <Button
                        onClick={() => handlePlayGame(room)}
                        disabled={room.currentPlayers < room.minPlayers}
                        className={`w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 ${
                          room.currentPlayers < room.minPlayers ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Game
                      </Button>
                      
                      {room.currentPlayers < room.minPlayers && (
                        <div className="text-xs text-gray-500 mt-2">
                          Needs {room.minPlayers} players
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Rules & Gameplay Section */}
                  <div className="bg-gray-800 p-4 rounded-b-lg border-t border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Game Rules */}
                      <div>
                        <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                          📋 Game Rules
                        </h4>
                        <div className="text-gray-300 text-xs space-y-1">
                          <div>• {room.bingoPattern}</div>
                          <div>• Numbers called every 3 seconds</div>
                          <div>• 60-second game timer</div>
                          <div>• Auto-daubing enabled</div>
                        </div>
                      </div>
                      
                      {/* How to Play */}
                      <div>
                        <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                          🎮 How to Play
                        </h4>
                        <div className="text-gray-300 text-xs space-y-1">
                          <div>• Click "Start Game" to begin</div>
                          <div>• Watch for called numbers</div>
                          <div>• Get 5 in a row to win</div>
                          <div>• Click BINGO when you win!</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-8 text-center">
          <div className="bg-gray-800/50 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4">🎯 How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <div className="font-bold text-blue-400 mb-2">Same BINGO Rules</div>
                <p>All rooms use identical BINGO gameplay - complete 1 line to win!</p>
              </div>
              <div>
                <div className="font-bold text-green-400 mb-2">Different Stakes</div>
                <p>Choose your risk level - from $0.10 casual play to $10.00 high stakes!</p>
              </div>
              <div>
                <div className="font-bold text-yellow-400 mb-2">Dynamic Prizes</div>
                <p>Prize pools adjust based on entry fees and player counts.</p>
              </div>
              <div>
                <div className="font-bold text-purple-400 mb-2">Crown Points</div>
                <p>Earn VIP points based on your stakes and room popularity.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModes;