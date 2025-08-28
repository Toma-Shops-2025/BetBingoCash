import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useAudio } from '@/contexts/AudioContext';
import BingoCard from './BingoCard';
import GamePauseModal from './GamePauseModal';
import AudioSettingsModal from './AudioSettingsModal';
import { toast } from '@/components/ui/use-toast';
import { Pause, Settings } from 'lucide-react';

interface GameMode {
  id: string;
  title: string;
  description: string;
  duration: number;
  prize: string;
  entryFee: number;
}

interface GameInterfaceProps {
  gameMode: GameMode;
}

const GameInterface: React.FC<GameInterfaceProps> = ({ gameMode }) => {
  const { isAuthenticated, startGame, endGame, currentGame, updateBalance, updateGems } = useAppContext();
  const { 
    playBackgroundMusic, 
    stopBackgroundMusic, 
    playCountdown, 
    playGameStart, 
    playBingo, 
    playNumberCall 
  } = useAudio();
  
  // Safety check for gameMode
  if (!gameMode) {
    return (
      <div className="py-12 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-white mb-4">
            🎯 Game Loading...
          </h2>
          <p className="text-xl text-gray-300">
            Please select a game mode to start playing.
          </p>
        </div>
      </div>
    );
  }
  
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(gameMode.duration);
  const [score, setScore] = useState<number>(0);
  const [gameActive, setGameActive] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
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

  // Handle countdown animation
  const startCountdown = () => {
    setShowCountdown(true);
    setCountdownNumber(3);
    
    const countdownInterval = setInterval(() => {
      setCountdownNumber(prev => {
        if (prev > 1) {
          playCountdown();
          return prev - 1;
        } else {
          clearInterval(countdownInterval);
          setTimeout(() => {
            setShowCountdown(false);
            startGameAfterCountdown();
          }, 1000);
          return 0;
        }
      });
    }, 1000);
  };

  const startGameAfterCountdown = () => {
    playGameStart();
    playBackgroundMusic();
    
    startGame(gameMode.id);
    setGameActive(true);
    setScore(0);
    setCalledNumbers([]);
    setTimeLeft(gameMode.duration);
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
      playNumberCall(firstNumber);
    }
  };

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

    startCountdown();
  };

  // Handle pause/resume
  const togglePause = () => {
    if (gameActive && !gamePaused) {
      setGamePaused(true);
      setShowPauseModal(true);
    } else if (gameActive && gamePaused) {
      setGamePaused(false);
      setShowPauseModal(false);
    }
  };

  // Handle resume from pause modal
  const handleResume = () => {
    setGamePaused(false);
    setShowPauseModal(false);
  };

  // Handle quit game
  const handleQuit = () => {
    stopBackgroundMusic();
    setGameActive(false);
    setGamePaused(false);
    setShowPauseModal(false);
    setCurrentNumber(null);
    setCalledNumbers([]);
    setTimeLeft(gameMode.duration);
    setScore(0);
  };

  // Call next number
  const callNextNumber = useCallback(() => {
    if (!gameActive || gamePaused) return;
    
    const nextNumber = generateNumber();
    if (nextNumber) {
      setCurrentNumber(nextNumber);
      setCalledNumbers(prev => [...prev, nextNumber]);
      setScore(prev => prev + 10); // Base score for each number
      playNumberCall(nextNumber);
    } else {
      // Game over - all numbers called
      handleGameOver();
    }
  }, [gameActive, gamePaused, generateNumber]);

  // Handle game over
  const handleGameOver = () => {
    setGameActive(false);
    stopBackgroundMusic();
    
    // Calculate final score with time bonus
    const timeBonus = Math.floor(timeLeft * 2); // 2 points per second remaining
    const finalScore = score + timeBonus;
    
    // Calculate prize based on game mode and performance
    let prizeAmount = 0;
    let prizeMessage = '';
    let gemsEarned = 0;
    
    if (gameMode.id === 'speed-bingo') {
      // Winner takes 80%, Runner-up 20%
      if (finalScore >= 500) {
        prizeAmount = parseFloat(gameMode.prize.replace('$', '').replace(',', '')) * 0.8;
        prizeMessage = `🏆 WINNER! You won $${prizeAmount.toFixed(2)}!`;
        gemsEarned = 100; // Bonus gems for winning
      } else if (finalScore >= 300) {
        prizeAmount = parseFloat(gameMode.prize.replace('$', '').replace(',', '')) * 0.2;
        prizeMessage = `🥈 Runner-up! You won $${prizeAmount.toFixed(2)}!`;
        gemsEarned = 50; // Gems for runner-up
      } else if (finalScore >= 200) {
        gemsEarned = 25; // Participation gems
      }
    } else if (gameMode.id === 'classic-75') {
      // 1st: 60%, 2nd: 25%, 3rd: 15%
      if (finalScore >= 800) {
        prizeAmount = parseFloat(gameMode.prize.replace('$', '').replace(',', '')) * 0.6;
        prizeMessage = `🥇 1st Place! You won $${prizeAmount.toFixed(2)}!`;
        gemsEarned = 150; // Bonus gems for 1st place
      } else if (finalScore >= 600) {
        prizeAmount = parseFloat(gameMode.prize.replace('$', '').replace(',', '')) * 0.25;
        prizeMessage = `🥈 2nd Place! You won $${prizeAmount.toFixed(2)}!`;
        gemsEarned = 75; // Gems for 2nd place
      } else if (finalScore >= 400) {
        prizeAmount = parseFloat(gameMode.prize.replace('$', '').replace(',', '')) * 0.15;
        prizeMessage = `🥉 3rd Place! You won $${prizeAmount.toFixed(2)}!`;
        gemsEarned = 50; // Gems for 3rd place
      } else if (finalScore >= 200) {
        gemsEarned = 30; // Participation gems
      }
    } else if (gameMode.id === 'pattern-bingo') {
      // Winner takes 70%, Pattern bonus 30%
      if (finalScore >= 600) {
        prizeAmount = parseFloat(gameMode.prize.replace('$', '').replace(',', '')) * 0.7;
        prizeMessage = `🎯 Pattern Master! You won $${prizeAmount.toFixed(2)}!`;
        gemsEarned = 120; // Bonus gems for pattern mastery
      } else if (finalScore >= 400) {
        gemsEarned = 60; // Gems for good pattern performance
      } else if (finalScore >= 200) {
        gemsEarned = 25; // Participation gems
      }
    } else if (gameMode.id === 'jackpot-room') {
      // Progressive jackpot - simplified calculation
      if (finalScore >= 1000) {
        prizeAmount = parseFloat(gameMode.prize.replace('$', '').replace(',', ''));
        prizeMessage = `💎 JACKPOT! You won $${prizeAmount.toFixed(2)}!`;
        gemsEarned = 500; // Massive gem bonus for jackpot
      } else if (finalScore >= 700) {
        gemsEarned = 200; // High performance gems
      } else if (finalScore >= 400) {
        gemsEarned = 100; // Good performance gems
      } else if (finalScore >= 200) {
        gemsEarned = 50; // Participation gems
      }
    }
    
    // Award gems based on performance
    if (gemsEarned > 0) {
      updateGems(gemsEarned);
      toast({
        title: "💎 Gems Earned!",
        description: `+${gemsEarned} gems for your performance!`,
      });
    }
    
    // Award prize if won
    if (prizeAmount > 0) {
      updateBalance(prizeAmount);
      toast({
        title: "🎉 PRIZE WON!",
        description: prizeMessage,
      });
    }
    
    endGame(finalScore);
    
    // Show game results
    toast({
      title: "Game Complete! 🎯",
      description: `Final Score: ${finalScore.toLocaleString()} (Base: ${score.toLocaleString()} + Time Bonus: ${timeBonus.toLocaleString()})${prizeAmount > 0 ? ` | Prize: $${prizeAmount.toFixed(2)}` : ''}${gemsEarned > 0 ? ` | Gems: +${gemsEarned}` : ''}`,
    });
    
    // Reset game state
    setCurrentNumber(null);
    setCalledNumbers([]);
    setTimeLeft(gameMode.duration);
    setScore(0);
  };

  // Use power-up
  const usePowerUp = (type: keyof typeof powerUps) => {
    if (powerUps[type] <= 0 || gamePaused) return;
    
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
    if (!gameActive || timeLeft <= 0 || gamePaused) return;
    
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
  }, [gameActive, timeLeft, gamePaused]);

  // Auto-call numbers effect
  useEffect(() => {
    if (!gameActive || gamePaused) return;
    
    const interval = setInterval(() => {
      callNextNumber();
    }, 3000); // Call number every 3 seconds
    
    return () => clearInterval(interval);
  }, [gameActive, gamePaused, callNextNumber]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && gameActive) {
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameActive, gamePaused]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Countdown overlay
  if (showCountdown) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="text-9xl font-black text-white mb-4 animate-pulse">
            {countdownNumber > 0 ? countdownNumber : 'GO!'}
          </div>
          <div className="text-2xl text-white/80">
            {countdownNumber > 0 ? 'Get Ready!' : 'Game Starting!'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-white mb-4">
            🎯 {gameMode.title}
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
            {gameMode.description}
          </p>
          
          {/* Game Stats */}
          <div className="flex justify-center items-center gap-8 text-white mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">💰 {gameMode.prize}</div>
              <div className="text-sm text-white/80">Prize Pool</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">⏱️ {Math.floor(gameMode.duration / 60)}m {gameMode.duration % 60}s</div>
              <div className="text-sm text-white/80">Game Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">🎫 ${gameMode.entryFee}</div>
              <div className="text-sm text-white/80">Entry Fee</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">🎯 {gameMode.id.includes('jackpot') ? 'Progressive' : 'Fixed'}</div>
              <div className="text-sm text-white/80">Prize Type</div>
            </div>
          </div>
          
          {/* Game Controls */}
          <div className="flex justify-center items-center gap-4 mb-6">
            {!gameActive ? (
              <button
                onClick={handleStartGame}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black py-4 px-12 rounded-full text-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                🚀 START GAME
              </button>
            ) : (
              <>
                <button
                  onClick={togglePause}
                  className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Pause className="w-5 h-5 mr-2 inline" />
                  {gamePaused ? 'Resume' : 'Pause'}
                </button>
                
                <button
                  onClick={() => setShowAudioSettings(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Settings className="w-5 h-5 mr-2 inline" />
                  Audio
                </button>
              </>
            )}
          </div>
          
          {gameActive && (
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
                  disabled={powerUps.magicBall <= 0 || !gameActive || gamePaused}
                  className={`w-full font-bold py-3 px-4 rounded-lg flex items-center gap-3 transition-all ${
                    powerUps.magicBall > 0 && gameActive && !gamePaused
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  ⭐ Magic Ball <span className="ml-auto">{powerUps.magicBall}</span>
                </button>
                <button 
                  onClick={() => usePowerUp('magicDauber')}
                  disabled={powerUps.magicDauber <= 0 || !gameActive || gamePaused}
                  className={`w-full font-bold py-3 px-4 rounded-lg flex items-center gap-3 transition-all ${
                    powerUps.magicDauber > 0 && gameActive && !gamePaused
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  👑 Magic Dauber <span className="ml-auto">{powerUps.magicDauber}</span>
                </button>
                <button 
                  onClick={() => usePowerUp('tripleTime')}
                  disabled={powerUps.tripleTime <= 0 || !gameActive || gamePaused}
                  className={`w-full font-bold py-3 px-4 rounded-lg flex items-center gap-3 transition-all ${
                    powerUps.tripleTime > 0 && gameActive && !gamePaused
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
              gameActive={gameActive && !gamePaused}
              onBingo={(lines) => {
                const bingoBonus = lines * 100;
                setScore(prev => prev + bingoBonus);
                playBingo();
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

      {/* Modals */}
      <GamePauseModal
        isOpen={showPauseModal}
        onClose={() => setShowPauseModal(false)}
        onResume={handleResume}
        onQuit={handleQuit}
        onAudioSettings={() => setShowAudioSettings(true)}
        isPaused={gamePaused}
      />

      <AudioSettingsModal
        isOpen={showAudioSettings}
        onClose={() => setShowAudioSettings(false)}
      />
    </div>
  );
};

export default GameInterface;