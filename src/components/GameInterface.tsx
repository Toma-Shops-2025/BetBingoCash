import React, { useState, useEffect, useRef } from 'react';
import { useAudio } from '../contexts/AudioContext';
import { useToast } from '../hooks/use-toast';
import BingoCard from './BingoCard';
import { Timer, Star, Zap, Clock, Star as DoubleStar, Trophy, Users } from 'lucide-react';

interface Powerup {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  effect: string;
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
  
  // Powerup system
  const [powerupSlots, setPowerupSlots] = useState<(Powerup | null)[]>([null, null, null]);
  const [meterProgress, setMeterProgress] = useState(0);
  const [daubCount, setDaubCount] = useState(0);
  const [activePowerups, setActivePowerups] = useState<Set<string>>(new Set());
  
  // Multiplayer simulation
  const [otherPlayers, setOtherPlayers] = useState([
    { id: 1, name: 'Player2', score: 0, bingos: 0 },
    { id: 2, name: 'Player3', score: 0, bingos: 0 },
    { id: 3, name: 'Player4', score: 0, bingos: 0 },
    { id: 4, name: 'Player5', score: 0, bingos: 0 }
  ]);
  
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
          return {
            ...player,
            score: player.score + Math.floor(Math.random() * 50) + 10,
            bingos: Math.random() < 0.1 ? player.bingos + 1 : player.bingos
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
    let bingoScore = 100;
    if (activePowerups.has('triple')) {
      bingoScore *= 3;
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

  const endGame = () => {
    setIsPlaying(false);
    clearInterval(timerRef.current!);
    clearInterval(numberCallIntervalRef.current!);
    clearInterval(powerupIntervalRef.current!);
    
    // Determine winner
    const allPlayers = [
      { name: 'You', score, bingos },
      ...otherPlayers
    ];
    
    const winner = allPlayers.reduce((prev, current) => 
      current.score > prev.score ? current : prev
    );
    
    toast({
      title: winner.name === 'You' ? '🏆 You Won!' : '🏆 Game Over',
      description: `${winner.name} won with ${winner.score} points and ${winner.bingos} BINGOs!`,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-2xl">
          🎯 BINGO BATTLE
        </h1>
        <p className="text-white/80 text-lg">
          Compete against {otherPlayers.length} other players for the prize!
        </p>
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