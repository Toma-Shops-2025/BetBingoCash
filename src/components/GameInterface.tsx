import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, Home, Star, Coins, DollarSign, CreditCard } from 'lucide-react';
import BingoCard from './BingoCard';

interface GameInterfaceProps {
  gameMode: string;
  onExit: () => void;
}

export interface GameInterfaceRef {
  checkBingoLines: () => boolean;
}

const GameInterface = forwardRef<GameInterfaceRef, GameInterfaceProps>(({ gameMode, onExit }, ref) => {
  const { balance, gems, updateBalance } = useAppContext();
  
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'paused' | 'finished'>('waiting');
  const [calledNumbers, setCalledNumbers] = useState<string[]>([]);
  const [currentNumber, setCurrentNumber] = useState<string>('');
  const [ballsRemaining, setBallsRemaining] = useState(75);
  const [canCallBingo, setCanCallBingo] = useState(false);
  
  const bingoCardRef = useRef<any>(null);
  const numberCallInterval = useRef<NodeJS.Timeout | null>(null);

  // Generate BINGO numbers
  const generateBingoNumbers = () => {
    const numbers: string[] = [];
    const letters = ['B', 'I', 'N', 'G', 'O'];
    const ranges = [
      [1, 15], [16, 30], [31, 45], [46, 60], [61, 75]
    ];
    
    letters.forEach((letter, index) => {
      const [start, end] = ranges[index];
      for (let i = start; i <= end; i++) {
        numbers.push(`${letter}${i}`);
      }
    });
    
    return numbers.sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    console.log('Starting BINGO game...');
    setGameState('playing');
    setCalledNumbers([]);
    setBallsRemaining(75);
    
    const allNumbers = generateBingoNumbers();
    let currentIndex = 0;
    
    // Call numbers every 2 seconds
    numberCallInterval.current = setInterval(() => {
      if (currentIndex < allNumbers.length) {
        const number = allNumbers[currentIndex];
        setCurrentNumber(number);
        setCalledNumbers(prev => [number, ...prev.slice(0, 2)]);
        setBallsRemaining(75 - currentIndex - 1);
        
        // Use speech synthesis to call numbers
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(`Number ${number}`);
          utterance.rate = 0.9;
          utterance.pitch = 0.95;
          window.speechSynthesis.speak(utterance);
        }
        
        currentIndex++;
      } else {
        setGameState('finished');
        if (numberCallInterval.current) {
          clearInterval(numberCallInterval.current);
        }
      }
    }, 2000);
  };

  const pauseGame = () => {
    setGameState('paused');
    if (numberCallInterval.current) {
      clearInterval(numberCallInterval.current);
    }
  };

  const resumeGame = () => {
    setGameState('playing');
    startGame();
  };

  const handleCallBingo = () => {
    if (!canCallBingo) return;
    
    if (bingoCardRef.current && bingoCardRef.current.checkBingoLines()) {
      setGameState('finished');
      
      // Calculate winnings
      const winnings = calculateWinnings();
      updateBalance(winnings);
      
      alert(`🎉 BINGO! You won $${winnings.toFixed(2)}! 🎉`);
    } else {
      alert('❌ No BINGO yet! Keep playing!');
    }
  };

  const calculateWinnings = () => {
    const baseWinnings = {
      'bingo-room-1': 1.50,
      'bingo-room-2': 5.00,
      'bingo-room-3': 13.50,
      'bingo-room-4': 9.00,
      'bingo-room-5': 13.00,
      'bingo-room-6': 18.90,
      'bingo-room-7': 35.00
    };
    
    return baseWinnings[gameMode as keyof typeof baseWinnings] || 10.00;
  };

  // Expose checkBingoLines method
  useImperativeHandle(ref, () => ({
    checkBingoLines: () => {
      return bingoCardRef.current?.checkBingoLines() || false;
    }
  }));

  // Check for BINGO lines periodically
  useEffect(() => {
    if (gameState === 'playing') {
      const checkInterval = setInterval(() => {
        if (bingoCardRef.current) {
          const hasBingo = bingoCardRef.current.checkBingoLines();
          setCanCallBingo(hasBingo);
        }
      }, 1000);
      
      return () => clearInterval(checkInterval);
    }
  }, [gameState]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-purple-800 relative overflow-hidden">
      {/* Futuristic City Skyline Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-0 bottom-0 w-32 h-64 bg-gradient-to-t from-purple-600 to-blue-500 opacity-60">
          <div className="w-full h-full bg-gradient-to-b from-transparent via-purple-400/20 to-transparent animate-pulse"></div>
        </div>
        <div className="absolute right-0 bottom-0 w-40 h-80 bg-gradient-to-t from-blue-600 to-purple-500 opacity-60">
          <div className="w-full h-full bg-gradient-to-b from-transparent via-blue-400/20 to-transparent animate-pulse"></div>
        </div>
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 w-48 h-96 bg-gradient-to-t from-yellow-400 via-orange-500 to-red-500 opacity-80">
          <div className="w-full h-full bg-gradient-to-b from-transparent via-yellow-300/30 to-transparent animate-pulse"></div>
        </div>
      </div>

      {/* Game Interface */}
      <div className="relative z-10 p-4">
        {/* Top Section */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-green-400/30">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-bold text-lg">{(balance || 0).toFixed(0)}</span>
            </div>
            <div className="flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-yellow-400/30">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-bold text-lg">{(gems || 0).toFixed(0)}</span>
            </div>
          </div>
          
          <Button
            onClick={onExit}
            variant="ghost"
            className="bg-purple-600/20 hover:bg-purple-600/40 backdrop-blur-sm border border-purple-400/30 text-white p-3 rounded-full"
          >
            <Home className="w-5 h-5" />
          </Button>
        </div>

        {/* Called Numbers Bar */}
        <div className="flex items-center gap-4 mb-6 bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
          <div className="flex gap-3">
            {calledNumbers.map((number, index) => (
              <div
                key={index}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 ${
                  index === 0 ? 'bg-orange-500 border-orange-400 animate-pulse' :
                  index === 1 ? 'bg-green-500 border-green-400' :
                  'bg-red-500 border-red-400'
                }`}
              >
                {number}
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-4 py-2 rounded-lg font-bold">
            {ballsRemaining} BALLS
          </div>
        </div>

        {/* Main Game Area */}
        <div className="flex gap-6">
          {/* Left - BINGO Card */}
          <div className="flex-1">
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/50">
              <div className="text-center mb-6">
                <h1 className="text-4xl font-black">
                  <span className="text-red-500">B</span>
                  <span className="text-orange-500">I</span>
                  <span className="text-green-500">N</span>
                  <span className="text-blue-500">G</span>
                  <span className="text-purple-500">O</span>
                </h1>
              </div>
              
              <BingoCard
                ref={bingoCardRef}
                calledNumbers={calledNumbers}
                onBingoLinesChange={() => {}}
              />
            </div>
          </div>

          {/* Right - Controls */}
          <div className="w-80 space-y-4">
            {/* GIGANTIC START BUTTON - ALWAYS VISIBLE */}
            <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-6 border-4 border-green-400/50">
              <Button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-6 rounded-xl text-xl shadow-2xl"
              >
                <Play className="w-8 h-8 mr-3" />
                🚀 START BINGO GAME! 🚀
              </Button>
              <div className="text-center text-green-300 text-lg mt-3 font-bold">
                Click to start immediately!
              </div>
            </div>

            {/* Game Status */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
              <div className="text-white font-bold text-center text-lg mb-3">
                {gameState === 'waiting' && '🎮 Ready to Start'}
                {gameState === 'playing' && '🎯 Game in Progress'}
                {gameState === 'paused' && '⏸️ Game Paused'}
                {gameState === 'finished' && '🏆 Game Complete'}
              </div>
              {currentNumber && (
                <div className="text-purple-300 text-center">
                  Current: <span className="font-bold text-white">{currentNumber}</span>
                </div>
              )}
            </div>

            {/* Game Controls */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
              <div className="space-y-3">
                {gameState === 'playing' && (
                  <Button
                    onClick={pauseGame}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    PAUSE
                  </Button>
                )}
                
                {gameState === 'paused' && (
                  <Button
                    onClick={resumeGame}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 rounded-xl"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    RESUME
                  </Button>
                )}
                
                {/* CALL BINGO Button */}
                <Button
                  onClick={handleCallBingo}
                  disabled={!canCallBingo}
                  className={`w-full font-bold py-3 rounded-xl text-lg ${
                    canCallBingo
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white animate-pulse'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  🎯 CALL BINGO!
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

GameInterface.displayName = 'GameInterface';

export default GameInterface;