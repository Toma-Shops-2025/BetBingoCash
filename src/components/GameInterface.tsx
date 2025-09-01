import React, { useState, useEffect, useRef } from 'react';
import { useAudio } from '../contexts/AudioContext';
import { useToast } from '../hooks/use-toast';
import BingoCard from './BingoCard';
import { Timer, Star, Zap, Clock, Star as DoubleStar, Trophy, Users, DollarSign, Medal, Award } from 'lucide-react';

interface Powerup {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  effect: string;
}

interface Player {
  id: number;
  name: string;
  score: number;
  bingos: number;
  isCurrentPlayer: boolean;
  accountBalance?: number;
}

interface GameResult {
  playerId: number;
  playerName: string;
  finalScore: number;
  bingos: number;
  position: number;
  prizeAmount: number;
  powerupsUsed: number;
  totalDaubs: number;
}

interface PrizeStructure {
  firstPlace: number;
  secondPlace: number;
  thirdPlace: number;
  totalPrize: number;
}

const POWERUPS: Powerup[] = [
  {
    id: 'triple',
    name: 'Triple Points',
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    description: '3X Points',
    effect: 'Triple points for next BINGO'
  },
  {
    id: 'star',
    name: 'Star Power',
    icon: <Star className="w-6 h-6 text-blue-400" />,
    description: 'Daub Any Space',
    effect: 'Mark any single space on your card'
  },
  {
    id: 'stopwatch',
    name: 'Time Freeze',
    icon: <Clock className="w-6 h-6 text-green-400" />,
    description: 'Stop Timer 10s',
    effect: 'Timer stops for 10 seconds'
  },
  {
    id: 'doublestar',
    name: 'Double Star',
    icon: <DoubleStar className="w-6 h-6 text-purple-400" />,
    description: 'Daub 2 Spaces',
    effect: 'Mark any two spaces on your card'
  }
];

const GameInterface: React.FC = () => {
  const { playNumberCall, playBingo, setGameMusicMode } = useAudio();
  const { toast } = useToast();
  
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [score, setScore] = useState(0);
  const [bingos, setBingos] = useState(0);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [bingoAchieved, setBingoAchieved] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  
  // Powerup system
  const [powerupSlots, setPowerupSlots] = useState<(Powerup | null)[]>([null, null, null]);
  const [meterProgress, setMeterProgress] = useState(0);
  const [daubCount, setDaubCount] = useState(0);
  const [activePowerups, setActivePowerups] = useState<Set<string>>(new Set());
  const [powerupsUsed, setPowerupsUsed] = useState(0);
  
  // Game configuration - will be set based on selected room
  const [entryFee, setEntryFee] = useState(5.00);
  const [prizePool, setPrizePool] = useState(25.00);
  const [playerCount, setPlayerCount] = useState(5);
  
  // Multiplayer simulation - dynamically sized based on room
  const [otherPlayers, setOtherPlayers] = useState<Player[]>([]);

  // Game results and prizes
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [prizeStructure, setPrizeStructure] = useState<PrizeStructure>({
    firstPlace: 0,
    secondPlace: 0,
    thirdPlace: 0,
    totalPrize: 0
  });
  
  // Initialize other players based on room selection
  useEffect(() => {
    // Get room info from URL or localStorage (you can implement this based on your routing)
    const roomId = localStorage.getItem('selectedRoom') || 'room-1';
    let roomConfig;
    
    switch (roomId) {
      case 'room-1':
        roomConfig = { playerCount: 5, prizePool: 25.00 };
        break;
      case 'room-2':
        roomConfig = { playerCount: 10, prizePool: 50.00 };
        break;
      case 'room-3':
        roomConfig = { playerCount: 15, prizePool: 75.00 };
        break;
      case 'room-4':
        roomConfig = { playerCount: 20, prizePool: 100.00 };
        break;
      default:
        roomConfig = { playerCount: 5, prizePool: 25.00 };
    }
    
    setPlayerCount(roomConfig.playerCount);
    setPrizePool(roomConfig.prizePool);
    
    // Generate other players (excluding current player)
    const otherPlayerCount = roomConfig.playerCount - 1;
    const newOtherPlayers: Player[] = [];
    
    for (let i = 1; i <= otherPlayerCount; i++) {
      newOtherPlayers.push({
        id: i,
        name: `Player${i + 1}`,
        score: 0,
        bingos: 0,
        isCurrentPlayer: false,
        accountBalance: Math.floor(Math.random() * 200) + 50
      });
    }
    
    setOtherPlayers(newOtherPlayers);
  }, []);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const numberCallIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const powerupIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setGameMusicMode(true);
    return () => setGameMusicMode(false);
  }, [setGameMusicMode]);

  // Auto-start the game when component mounts
  useEffect(() => {
    console.log('GameInterface mounted, gameStarted:', gameStarted);
    if (!gameStarted) {
      // Small delay to ensure everything is loaded
      const timer = setTimeout(() => {
        console.log('Auto-starting game...');
        startGame();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setIsPlaying(true);
    setIsPaused(false);
    setTimeLeft(120); // 2 minutes
    setScore(0);
    setBingos(0);
    setCalledNumbers([]);
    setCurrentNumber(null);
    setBingoAchieved(false);
    setMeterProgress(0);
    setDaubCount(0);
    setPowerupSlots([null, null, null]);
    setActivePowerups(new Set());
    setPowerupsUsed(0);
    setGameEnded(false);
    setGameResults([]);
    
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Start calling numbers
    startCallingNumbers();
    
    // Simulate other players
    simulateOtherPlayers();
  };

  const simulateOtherPlayers = () => {
    powerupIntervalRef.current = setInterval(() => {
      setOtherPlayers(prev => prev.map(player => {
        // Randomly increase scores and bingos
        if (Math.random() < 0.3) {
          const scoreIncrease = Math.floor(Math.random() * 50) + 10;
          const newScore = player.score + scoreIncrease;
          const newBingos = Math.random() < 0.1 ? player.bingos + 1 : player.bingos;
          
          return {
            ...player,
            score: newScore,
            bingos: newBingos
          };
        }
        return player;
      }));
    }, 3000); // Update every 3 seconds
  };

  const startCallingNumbers = () => {
    numberCallIntervalRef.current = setInterval(() => {
      if (calledNumbers.length >= 75) return; // All numbers called
      
      let newNumber: number;
      do {
        newNumber = Math.floor(Math.random() * 75) + 1;
      } while (calledNumbers.includes(newNumber));
      
      setCurrentNumber(newNumber);
      setCalledNumbers(prev => [...prev, newNumber]);
      playNumberCall(newNumber);
      
      // Clear current number after 2 seconds
      setTimeout(() => setCurrentNumber(null), 2000);
    }, 3000); // Call every 3 seconds
  };

  const handleBingo = () => {
    if (bingoAchieved) return;
    
    setBingoAchieved(true);
    setBingos(prev => prev + 1);
    
    // Calculate score with powerup multipliers
    let bingoScore = 1500; // Base score increased to 1500
    if (activePowerups.has('triple')) {
      bingoScore *= 3; // 1500 * 3 = 4500
      setActivePowerups(prev => {
        const newSet = new Set(prev);
        newSet.delete('triple');
        return newSet;
      });
    }
    
    setScore(prev => prev + bingoScore);
    playBingo();
    
    toast({
      title: '🎉 BINGO!',
      description: `You got a BINGO! +${bingoScore} points`,
    });
    
    // Reset for next BINGO
    setTimeout(() => setBingoAchieved(false), 2000);
  };

  const handleDaub = (number: number) => {
    if (!calledNumbers.includes(number)) return;
    
    setDaubCount(prev => {
      const newCount = prev + 1;
      
      // Update meter progress (1/3 for each daub)
      const newProgress = Math.min((newCount % 3) / 3, 1);
      setMeterProgress(newProgress);
      
      // Fill powerup slot every 3 daubs
      if (newCount % 3 === 0 && newCount > 0) {
        fillPowerupSlot();
      }
      
      return newCount;
    });
  };

  const fillPowerupSlot = () => {
    const availableSlots = powerupSlots.findIndex(slot => slot === null);
    if (availableSlots === -1) return; // All slots full
    
    const randomPowerup = POWERUPS[Math.floor(Math.random() * POWERUPS.length)];
    setPowerupSlots(prev => {
      const newSlots = [...prev];
      newSlots[availableSlots] = randomPowerup;
      return newSlots;
    });
    
    toast({
      title: '⭐ Powerup Earned!',
      description: `You got ${randomPowerup.name}!`,
    });
  };

  const usePowerup = (slotIndex: number) => {
    const powerup = powerupSlots[slotIndex];
    if (!powerup) return;
    
    setActivePowerups(prev => new Set([...prev, powerup.id]));
    setPowerupSlots(prev => {
      const newSlots = [...prev];
      newSlots[slotIndex] = null;
      return newSlots;
    });
    
    setPowerupsUsed(prev => prev + 1);
    
    toast({
      title: '🚀 Powerup Activated!',
      description: powerup.effect,
    });
    
    // Handle specific powerup effects
    if (powerup.id === 'stopwatch') {
      // Stop timer for 10 seconds
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), 10000);
    }
  };

  const calculatePrizeDistribution = (totalPrize: number): PrizeStructure => {
    // All rooms now use 1st, 2nd, 3rd place distribution
    return {
      firstPlace: totalPrize * 0.60, // 60%
      secondPlace: totalPrize * 0.30, // 30%
      thirdPlace: totalPrize * 0.10,  // 10%
      totalPrize
    };
  };

  const endGame = () => {
    setIsPlaying(false);
    setGameEnded(true);
    clearInterval(timerRef.current!);
    clearInterval(numberCallIntervalRef.current!);
    clearInterval(powerupIntervalRef.current!);
    
    // Create final player list with current player
    const allPlayers: Player[] = [
      { id: 0, name: 'You', score, bingos, isCurrentPlayer: true, accountBalance: 100.00 },
      ...otherPlayers
    ];
    
    // Sort players by score (highest first)
    const sortedPlayers = [...allPlayers].sort((a, b) => b.score - a.score);
    
    // Calculate prize distribution
    const prizes = calculatePrizeDistribution(prizePool);
    setPrizeStructure(prizes);
    
    // Create game results
    const results: GameResult[] = sortedPlayers.map((player, index) => {
      let position = 0;
      let prizeAmount = 0;
      
      if (index === 0) {
        position = 1;
        prizeAmount = prizes.firstPlace;
      } else if (index === 1 && prizes.secondPlace > 0) {
        position = 2;
        prizeAmount = prizes.secondPlace;
      } else if (index === 2 && prizes.thirdPlace > 0) {
        position = 3;
        prizeAmount = prizes.thirdPlace;
      }
      
      return {
        playerId: player.id,
        playerName: player.name,
        finalScore: player.score,
        bingos: player.bingos,
        position,
        prizeAmount,
        powerupsUsed: player.isCurrentPlayer ? powerupsUsed : Math.floor(Math.random() * 3),
        totalDaubs: player.isCurrentPlayer ? daubCount : Math.floor(Math.random() * 20) + 10
      };
    });
    
    setGameResults(results);
    
    // Show winner announcement
    const winner = results[0];
    toast({
      title: winner.playerName === 'You' ? '🏆 You Won!' : '🏆 Game Over',
      description: `${winner.playerName} won with ${winner.finalScore} points and ${winner.bingos} BINGOs!`,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Game Results Display
  if (gameEnded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 p-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-2xl">
            🏆 Game Results
          </h1>
          <p className="text-white/80 text-lg">
            Final standings and prize distribution
          </p>
        </div>

        {/* Prize Pool Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
          <div className="text-center">
            <h3 className="text-white font-bold text-2xl mb-2">💰 Prize Pool</h3>
            <div className="text-4xl font-bold text-yellow-400 mb-2">
              {formatCurrency(prizeStructure.totalPrize)}
            </div>
            <p className="text-white/60">
              Entry Fee: {formatCurrency(entryFee)} | Players: {gameResults.length}
            </p>
          </div>
        </div>

        {/* Final Standings */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
          <h3 className="text-white font-bold text-xl mb-4 text-center">🏅 Final Standings</h3>
          
          {gameResults.map((result, index) => (
            <div 
              key={result.playerId}
              className={`flex items-center justify-between p-4 rounded-xl mb-3 border-2 transition-all duration-200 ${
                index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-400' :
                index === 1 ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-300' :
                index === 2 ? 'bg-gradient-to-r from-orange-600/20 to-orange-700/20 border-orange-500' :
                'bg-white/5 border-white/10'
              }`}
            >
              {/* Position */}
              <div className="flex items-center gap-3">
                {index === 0 && <Medal className="w-8 h-8 text-yellow-400" />}
                {index === 1 && <Medal className="w-8 h-8 text-gray-400" />}
                {index === 2 && <Medal className="w-8 h-8 text-orange-600" />}
                {index > 2 && <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </span>}
                
                <div>
                  <div className="text-white font-bold text-lg">{result.playerName}</div>
                  <div className="text-white/60 text-sm">
                    {result.bingos} BINGOs • {result.powerupsUsed} Powerups • {result.totalDaubs} Daubs
                  </div>
                </div>
              </div>
              
              {/* Score and Prize */}
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{result.finalScore}</div>
                <div className="text-sm text-white/60">points</div>
                {result.prizeAmount > 0 && (
                  <div className="text-lg font-bold text-green-400 mt-1">
                    +{formatCurrency(result.prizeAmount)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Prize Distribution */}
        {prizeStructure.secondPlace > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
            <h3 className="text-white font-bold text-xl mb-4 text-center">🏆 Prize Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl mb-2">🥇</div>
                <div className="text-white font-bold">1st Place</div>
                <div className="text-yellow-400 font-bold text-xl">{formatCurrency(prizeStructure.firstPlace)}</div>
                <div className="text-white/60 text-sm">60% of pool</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🥈</div>
                <div className="text-white font-bold">2nd Place</div>
                <div className="text-gray-400 font-bold text-xl">{formatCurrency(prizeStructure.secondPlace)}</div>
                <div className="text-white/60 text-sm">30% of pool</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🥉</div>
                <div className="text-white font-bold">3rd Place</div>
                <div className="text-orange-600 font-bold text-xl">{formatCurrency(prizeStructure.thirdPlace)}</div>
                <div className="text-white/60 text-sm">10% of pool</div>
              </div>
            </div>
          </div>
        )}

        {/* Account Integration */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
          <h3 className="text-white font-bold text-xl mb-4 text-center">💳 Account Update</h3>
          <div className="text-center text-white/80">
            <p className="mb-2">Prizes will be automatically credited to your account within 24 hours.</p>
            <p className="text-sm">Please contact support if you have any questions about your winnings.</p>
          </div>
        </div>

        {/* Play Again Button */}
        <div className="text-center">
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-200"
          >
            🎮 Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-2xl">
          🎯 BINGO Battle
        </h1>
        <p className="text-white/80 text-lg">
          Compete against {otherPlayers.length} other players for {formatCurrency(prizePool)}!
        </p>
        <div className="mt-2 text-white/60 text-sm">
          Room: {playerCount} Players • Entry: {formatCurrency(entryFee)} • Prize Pool: {formatCurrency(prizePool)}
        </div>
      </div>

      {/* Game Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Timer */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <div className="flex items-center justify-center gap-2 text-white">
            <Timer className="w-6 h-6 text-red-400" />
            <span className="text-2xl font-bold">{formatTime(timeLeft)}</span>
          </div>
          <p className="text-white/60 text-center text-sm mt-1">Time Remaining</p>
        </div>

        {/* Score */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <div className="text-center text-white">
            <div className="text-2xl font-bold text-yellow-400">{score}</div>
            <p className="text-white/60 text-sm">Your Score</p>
          </div>
        </div>

        {/* BINGOs */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <div className="text-center text-white">
            <div className="text-2xl font-bold text-green-400">{bingos}</div>
            <p className="text-white/60 text-sm">BINGOs</p>
          </div>
        </div>
      </div>

      {/* Current Number Display */}
      {currentNumber && (
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 inline-block">
            <div className="text-6xl font-bold text-white drop-shadow-2xl">
              {currentNumber}
            </div>
            <p className="text-white/90 text-lg mt-2">Number Called!</p>
          </div>
        </div>
      )}

      {/* BINGO Card */}
      <div className="flex justify-center mb-6">
        <BingoCard 
          calledNumbers={calledNumbers}
          onBingo={handleBingo}
          bingoAchieved={bingoAchieved}
          onDaub={handleDaub}
        />
      </div>

      {/* Powerup System */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
        <h3 className="text-white font-bold text-lg mb-4 text-center">⭐ Powerup System</h3>
        
        {/* Powerup Slots */}
        <div className="flex justify-center gap-4 mb-4">
          {powerupSlots.map((powerup, index) => (
            <div
              key={index}
              onClick={() => powerup && usePowerup(index)}
              className={`w-20 h-20 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all duration-200 ${
                powerup 
                  ? 'border-white/40 bg-white/20 cursor-pointer hover:scale-110' 
                  : 'border-white/20 bg-white/5'
              }`}
            >
              {powerup ? (
                <div className="text-center">
                  {powerup.icon}
                  <div className="text-white text-xs mt-1">{powerup.description}</div>
                </div>
              ) : (
                <div className="text-white/40 text-2xl">?</div>
              )}
            </div>
          ))}
        </div>

        {/* Meter Bar */}
        <div className="text-center">
          <div className="text-white/80 text-sm mb-2">Powerup Meter</div>
          <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-4 transition-all duration-300 ease-out"
              style={{ width: `${meterProgress * 100}%` }}
            ></div>
          </div>
          <div className="text-white/60 text-xs mt-1">
            {daubCount % 3}/3 daubs to next powerup
          </div>
        </div>
      </div>

      {/* BINGO Button */}
      <div className="text-center mb-6">
        <button
          onClick={handleBingo}
          disabled={!bingoAchieved}
          className={`px-12 py-4 rounded-2xl font-bold text-2xl transition-all duration-200 ${
            bingoAchieved
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:scale-105'
              : 'bg-gray-500 text-gray-300 cursor-not-allowed'
          }`}
        >
          🎯 BINGO!
        </button>
      </div>

      {/* Other Players */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-white font-bold text-lg mb-4 text-center flex items-center justify-center gap-2">
          <Users className="w-5 h-5" />
          Other Players
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherPlayers.map(player => (
            <div key={player.id} className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex justify-between items-center text-white">
                <span className="font-medium">{player.name}</span>
                <div className="text-right">
                  <div className="text-yellow-400 font-bold">{player.score}</div>
                  <div className="text-xs text-white/60">{player.bingos} BINGOs</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameInterface;