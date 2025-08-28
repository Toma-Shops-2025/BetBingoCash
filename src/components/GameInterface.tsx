import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import BingoCard from './BingoCard';
import { toast } from '@/components/ui/use-toast';

const GameInterface: React.FC = () => {
  const { isAuthenticated, startGame, endGame, currentGame } = useAppContext();
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(120); // 2 minutes
  const [score, setScore] = useState<number>(0);
  const [gameActive, setGameActive] = useState(false);
  const [powerUps, setPowerUps] = useState({
    magicBall: 3,
    magicDauber: 2,
    tripleTime: 1,
  });

  // Generate a random bingo number (1-75)
  const generateNumber = useCallback(() => {
    const availableNumbers = Array.from({ length: 75 }, (_, i) => i + 1)
      .filter(num => !calledNumbers.includes(num));
    
    if (availableNumbers.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    return availableNumbers[randomIndex];
  }, [calledNumbers]);

  // Start the game
  const handleStartGame = () => {
    if (!isAuthenticated) {
      toast({
        title: "Please Sign In",
        description: "You need to be signed in to play.",
        variant: "destructive",
      });
      return;
    }

    startGame('bingo');
    setGameActive(true);
    setScore(0);
    setCalledNumbers([]);
    setTimeLeft(120);
    setPowerUps({
      magicBall: 3,
      magicDauber: 2,
      tripleTime: 1,
    });
    
    // Generate first number
    const firstNumber = generateNumber();
    if (firstNumber) {
      setCurrentNumber(firstNumber);
      setCalledNumbers([firstNumber]);
    }
  };

  // Call next number
  const callNextNumber = useCallback(() => {
    if (!gameActive) return;
    
    const nextNumber = generateNumber();
    if (nextNumber) {
      setCurrentNumber(nextNumber);
      setCalledNumbers(prev => [...prev, nextNumber]);
      setScore(prev => prev + 10); // Base score for each number
    } else {
      // Game over - all numbers called
      handleGameOver();
    }
  }, [gameActive, generateNumber]);

  // Handle game over
  const handleGameOver = () => {
    setGameActive(false);
    endGame(score);
    toast({
      title: "Game Over!",
      description: `Final Score: ${score.toLocaleString()}`,
    });
  };

  // Use power-up
  const usePowerUp = (type: keyof typeof powerUps) => {
    if (powerUps[type] <= 0) return;
    
    setPowerUps(prev => ({ ...prev, [type]: prev[type] - 1 }));
    
    switch (type) {
      case 'magicBall':
        // Call 3 numbers at once
        for (let i = 0; i < 3; i++) {
          setTimeout(() => callNextNumber(), i * 500);
        }
        break;
      case 'magicDauber':
        // Auto-mark numbers on card (handled in BingoCard)
        toast({
          title: "Magic Dauber Activated!",
          description: "Numbers will be auto-marked for 10 seconds!",
        });
        break;
      case 'tripleTime':
        // Triple the time remaining
        setTimeLeft(prev => Math.min(prev * 3, 300));
        toast({
          title: "Triple Time!",
          description: "Time extended!",
        });
        break;
    }
  };

  // Timer effect
  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  // Auto-call numbers effect
  useEffect(() => {
    if (!gameActive) return;
    
    const interval = setInterval(() => {
      callNextNumber();
    }, 3000); // Call number every 3 seconds
    
    return () => clearInterval(interval);
  }, [gameActive, callNextNumber]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="py-12 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-white mb-4">
            🎯 LIVE BINGO GAME
          </h2>
          
          {!gameActive ? (
            <button
              onClick={handleStartGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black py-4 px-12 rounded-full text-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🚀 START GAME
            </button>
          ) : (
            <div className="flex justify-center items-center gap-8 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">⏰ {formatTime(timeLeft)}</div>
                <div className="text-sm text-white/80">Time Left</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{score.toLocaleString()}</div>
                <div className="text-sm text-white/80">Your Score</div>
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Called Numbers */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-gray-600/30">
              <h3 className="text-xl font-bold text-white mb-4 text-center">CALLED NUMBERS</h3>
              
              {/* Current Number */}
              {currentNumber && (
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-lg animate-pulse">
                    {currentNumber}
                  </div>
                  <div className="text-white/80 text-sm mt-2">Current Call</div>
                </div>
              )}
              
              {/* Recent Numbers */}
              <div className="grid grid-cols-5 gap-2">
                {calledNumbers.slice(-10).map((num, index) => (
                  <div key={index} className="aspect-square bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {num}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Power-ups */}
            <div className="mt-6 bg-gradient-to-br from-purple-800 to-indigo-900 rounded-2xl p-6 border-2 border-purple-400/30">
              <h3 className="text-xl font-bold text-white mb-4 text-center">POWER-UPS</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => usePowerUp('magicBall')}
                  disabled={powerUps.magicBall <= 0 || !gameActive}
                  className={`w-full font-bold py-3 px-4 rounded-lg flex items-center gap-3 transition-all ${
                    powerUps.magicBall > 0 && gameActive
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  ⭐ Magic Ball <span className="ml-auto">{powerUps.magicBall}</span>
                </button>
                <button 
                  onClick={() => usePowerUp('magicDauber')}
                  disabled={powerUps.magicDauber <= 0 || !gameActive}
                  className={`w-full font-bold py-3 px-4 rounded-lg flex items-center gap-3 transition-all ${
                    powerUps.magicDauber > 0 && gameActive
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  👑 Magic Dauber <span className="ml-auto">{powerUps.magicDauber}</span>
                </button>
                <button 
                  onClick={() => usePowerUp('tripleTime')}
                  disabled={powerUps.tripleTime <= 0 || !gameActive}
                  className={`w-full font-bold py-3 px-4 rounded-lg flex items-center gap-3 transition-all ${
                    powerUps.tripleTime > 0 && gameActive
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  ⚡ Triple Time <span className="ml-auto">{powerUps.tripleTime}</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Bingo Card */}
          <div className="lg:col-span-2">
            <BingoCard 
              calledNumbers={calledNumbers}
              gameActive={gameActive}
              onBingo={(lines) => {
                const bingoBonus = lines * 100;
                setScore(prev => prev + bingoBonus);
                toast({
                  title: `BINGO! ${lines} Line${lines > 1 ? 's' : ''}!`,
                  description: `+${bingoBonus} points!`,
                });
              }}
            />
            
            {gameActive && (
              <div className="mt-6 text-center">
                <button 
                  onClick={handleGameOver}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-black py-4 px-12 rounded-full text-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  🛑 END GAME
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameInterface;