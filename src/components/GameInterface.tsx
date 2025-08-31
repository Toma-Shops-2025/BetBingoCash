import React, { forwardRef, useImperativeHandle, useState, useEffect, useRef } from 'react';
import { X, Pause, Play } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import BingoCard from './BingoCard';

export interface GameInterfaceProps {
  gameMode: string;
  onExit: () => void;
}

export interface GameInterfaceRef {
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
}

const GameInterface = forwardRef<GameInterfaceRef, GameInterfaceProps>(({ gameMode, onExit }, ref) => {
  const { setGameMusicMode, playGameStart, playBingo, playNumberCall } = useAudio();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds
  const [score, setScore] = useState(0);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [bingoAchieved, setBingoAchieved] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const numberCallIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useImperativeHandle(ref, () => ({
    startGame: () => {
      setGameStarted(true);
      setIsPlaying(true);
      setIsPaused(false);
      setTimeLeft(60);
      setScore(0);
      setCalledNumbers([]);
      setCurrentNumber(null);
      setBingoAchieved(false);
      setGameMusicMode(true);
      playGameStart();
      
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
    },
    pauseGame: () => {
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
      if (numberCallIntervalRef.current) clearInterval(numberCallIntervalRef.current);
    },
    resumeGame: () => {
      setIsPaused(false);
      if (gameStarted) {
        timerRef.current = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              endGame();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        startCallingNumbers();
      }
    },
    endGame: () => {
      endGame();
    }
  }));

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
      
      // Add score for each called number
      setScore(prev => prev + 10);
    }, 3000); // Call a new number every 3 seconds
  };

  const endGame = () => {
    setIsPlaying(false);
    setGameStarted(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (numberCallIntervalRef.current) clearInterval(numberCallIntervalRef.current);
    setGameMusicMode(false);
  };

  const handleBingo = () => {
    if (!bingoAchieved) {
      setBingoAchieved(true);
      setScore(prev => prev + 500); // Bonus for BINGO
      playBingo();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getBingoLetter = (number: number) => {
    if (number <= 15) return 'B';
    if (number <= 30) return 'I';
    if (number <= 45) return 'N';
    if (number <= 60) return 'G';
    return 'O';
  };

  const getBingoColor = (letter: string) => {
    switch (letter) {
      case 'B': return 'bg-red-500';
      case 'I': return 'bg-orange-500';
      case 'N': return 'bg-green-500';
      case 'G': return 'bg-blue-500';
      case 'O': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (numberCallIntervalRef.current) clearInterval(numberCallIntervalRef.current);
      setGameMusicMode(false);
    };
  }, [setGameMusicMode]);

  // Auto-start the game when component mounts
  useEffect(() => {
    console.log('GameInterface mounted, gameStarted:', gameStarted);
    if (!gameStarted) {
      // Small delay to ensure everything is loaded
      const timer = setTimeout(() => {
        console.log('Auto-starting game...');
        // Start the game directly since we have access to the methods
        startGame();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setIsPlaying(true);
    setIsPaused(false);
    setTimeLeft(60);
    setScore(0);
    setCalledNumbers([]);
    setCurrentNumber(null);
    setBingoAchieved(false);
    setGameMusicMode(true);
    playGameStart();
    
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
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 z-50 overflow-y-auto">
      {/* Top Section */}
      <div className="flex justify-between items-center p-4 bg-black/20 backdrop-blur-sm">
        {/* Timer */}
        <div className="bg-blue-400 rounded-lg px-4 py-2 text-white font-bold text-lg">
          {formatTime(timeLeft)}
        </div>
        
        {/* Score */}
        <div className="text-yellow-400 font-bold text-4xl">
          {score}
        </div>
        
        {/* Pause Button */}
        <button
          onClick={() => isPaused ? ref.current?.resumeGame() : ref.current?.pauseGame()}
          className="bg-blue-400 rounded-lg p-2 text-white hover:bg-blue-500 transition-colors"
        >
          {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
        </button>
      </div>

      {/* Called Numbers Display */}
      <div className="flex justify-center gap-4 p-4">
        {calledNumbers.slice(-3).map((number, index) => (
          <div
            key={index}
            className={`w-16 h-16 rounded-full ${getBingoColor(getBingoLetter(number))} flex flex-col items-center justify-center text-white font-bold shadow-lg`}
          >
            <div className="text-xs">{getBingoLetter(number)}</div>
            <div className="text-lg">{number}</div>
          </div>
        ))}
      </div>

      {/* BINGO Card */}
      <div className="flex justify-center p-4">
        <BingoCard 
          calledNumbers={calledNumbers}
          onBingo={handleBingo}
          bingoAchieved={bingoAchieved}
        />
      </div>

      {/* Bottom Section */}
      <div className="flex justify-center items-center gap-4 p-4">
        {/* Power-up Slots */}
        <div className="flex gap-2">
          {[1, 2, 3].map((slot) => (
            <div key={slot} className="w-12 h-12 bg-blue-800 rounded-full border-2 border-blue-600"></div>
          ))}
        </div>
        
        {/* Progress Bar */}
        <div className="w-32 h-3 bg-blue-800 rounded-full border border-blue-600">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-300"
            style={{ width: `${(calledNumbers.length / 75) * 100}%` }}
          ></div>
        </div>
        
        {/* BINGO Button */}
        <button
          onClick={handleBingo}
          disabled={bingoAchieved}
          className={`px-8 py-4 rounded-lg font-bold text-white text-xl shadow-lg transition-all duration-200 ${
            bingoAchieved 
              ? 'bg-green-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-105'
          }`}
        >
          {bingoAchieved ? 'BINGO!' : 'BINGO'}
        </button>
      </div>

      {/* Exit Button */}
      <button
        onClick={onExit}
        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
});

GameInterface.displayName = 'GameInterface';

export default GameInterface;