import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Zap, Star, Coins, DollarSign, Gamepad2, Trophy, Gift, Sparkles, Rocket, Flame, Shield } from 'lucide-react';

interface MiniGamesProps {
  onGameComplete?: (gameId: string, score: number, reward: number) => void;
}

const MiniGames: React.FC<MiniGamesProps> = ({ onGameComplete }) => {
  const { gems, updateGems, balance, updateBalance } = useAppContext();
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [gameScores, setGameScores] = useState<{ [key: string]: number }>({});

  // Available Mini-Games
  const miniGames = [
    {
      id: 'number-rush',
      name: '🚀 Number Rush',
      description: 'Click numbers as fast as you can!',
      icon: <Target className="w-8 h-8" />,
      color: 'from-red-400 to-pink-500',
      reward: '10-50 gems',
      difficulty: 'Easy',
      highScore: 0
    },
    {
      id: 'bingo-memory',
      name: '🧠 BINGO Memory',
      description: 'Remember the sequence of BINGO numbers!',
      icon: <Star className="w-8 h-8" />,
      color: 'from-blue-400 to-purple-500',
      reward: '15-75 gems',
      difficulty: 'Medium',
      highScore: 0
    },
    {
      id: 'speed-daub',
      name: '⚡ Speed Daub',
      description: 'Daub numbers in the correct order!',
      icon: <Zap className="w-8 h-8" />,
      color: 'from-yellow-400 to-orange-500',
      reward: '20-100 gems',
      difficulty: 'Hard',
      highScore: 0
    },
    {
      id: 'pattern-match',
      name: '🎯 Pattern Match',
      description: 'Match BINGO patterns quickly!',
      icon: <Gamepad2 className="w-8 h-8" />,
      color: 'from-green-400 to-emerald-500',
      reward: '25-125 gems',
      difficulty: 'Expert',
      highScore: 0
    }
  ];

  // Number Rush Game
  const NumberRushGame = () => {
    const [numbers, setNumbers] = useState<number[]>([]);
    const [currentNumber, setCurrentNumber] = useState<number>(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameActive, setGameActive] = useState(false);

    useEffect(() => {
      if (gameActive && timeLeft > 0) {
        const timer = setInterval(() => {
          setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
      } else if (timeLeft === 0) {
        endGame();
      }
    }, [gameActive, timeLeft]);

    const startGame = () => {
      setGameActive(true);
      setScore(0);
      setTimeLeft(30);
      generateNewNumber();
    };

    const generateNewNumber = () => {
      const newNumber = Math.floor(Math.random() * 75) + 1;
      setCurrentNumber(newNumber);
      setNumbers(prev => [...prev, newNumber]);
    };

    const handleNumberClick = (clickedNumber: number) => {
      if (clickedNumber === currentNumber) {
        setScore(prev => prev + 10);
        generateNewNumber();
      } else {
        setScore(prev => Math.max(0, prev - 5));
      }
    };

    const endGame = () => {
      setGameActive(false);
      const finalScore = score;
      const reward = Math.floor(finalScore / 10);
      
      updateGems(reward);
      setGameScores(prev => ({ ...prev, 'number-rush': finalScore }));
      
      if (onGameComplete) {
        onGameComplete('number-rush', finalScore, reward);
      }
      
      alert(`🎮 Game Over! Score: ${finalScore} | Reward: ${reward} gems`);
    };

    return (
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-6">🚀 Number Rush</h3>
        
        {!gameActive ? (
          <Button onClick={startGame} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 text-lg">
            START GAME
          </Button>
        ) : (
          <div className="space-y-6">
            <div className="text-2xl font-bold text-white">
              Time: {timeLeft}s | Score: {score}
            </div>
            
            <div className="text-6xl font-black text-yellow-400 mb-6">
              {currentNumber}
            </div>
            
            <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
              {Array.from({ length: 25 }, (_, i) => {
                const number = i + 1;
                return (
                  <Button
                    key={number}
                    onClick={() => handleNumberClick(number)}
                    className="w-12 h-12 text-sm font-bold bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    {number}
                  </Button>
                );
              })}
            </div>
            
            <div className="text-sm text-gray-300">
              Click the number {currentNumber} as fast as you can!
            </div>
          </div>
        )}
      </div>
    );
  };

  // BINGO Memory Game
  const BingoMemoryGame = () => {
    const [sequence, setSequence] = useState<string[]>([]);
    const [playerSequence, setPlayerSequence] = useState<string[]>([]);
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [gameActive, setGameActive] = useState(false);
    const [showingSequence, setShowingSequence] = useState(false);

    const startGame = () => {
      setGameActive(true);
      setLevel(1);
      setScore(0);
      generateSequence();
    };

    const generateSequence = () => {
      const letters = ['B', 'I', 'N', 'G', 'O'];
      const newSequence = Array.from({ length: level + 2 }, () => {
        const letter = letters[Math.floor(Math.random() * letters.length)];
        const number = Math.floor(Math.random() * 15) + 1;
        return `${letter}${number}`;
      });
      setSequence(newSequence);
      setPlayerSequence([]);
      showSequence(newSequence);
    };

    const showSequence = async (seq: string[]) => {
      setShowingSequence(true);
      for (let i = 0; i < seq.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      setShowingSequence(false);
    };

    const handleNumberClick = (number: string) => {
      if (showingSequence) return;
      
      const newPlayerSequence = [...playerSequence, number];
      setPlayerSequence(newPlayerSequence);
      
      if (newPlayerSequence.length === sequence.length) {
        checkSequence();
      }
    };

    const checkSequence = () => {
      const isCorrect = sequence.every((num, index) => num === playerSequence[index]);
      
      if (isCorrect) {
        setScore(prev => prev + level * 10);
        setLevel(prev => prev + 1);
        setTimeout(generateSequence, 1000);
      } else {
        endGame();
      }
    };

    const endGame = () => {
      setGameActive(false);
      const finalScore = score;
      const reward = Math.floor(finalScore / 20);
      
      updateGems(reward);
      setGameScores(prev => ({ ...prev, 'bingo-memory': finalScore }));
      
      if (onGameComplete) {
        onGameComplete('bingo-memory', finalScore, reward);
      }
      
      alert(`🧠 Game Over! Level: ${level} | Score: ${finalScore} | Reward: ${reward} gems`);
    };

    const letters = ['B', 'I', 'N', 'G', 'O'];
    const numbers = Array.from({ length: 15 }, (_, i) => i + 1);

    return (
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-6">🧠 BINGO Memory</h3>
        
        {!gameActive ? (
          <Button onClick={startGame} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 text-lg">
            START GAME
          </Button>
        ) : (
          <div className="space-y-6">
            <div className="text-xl font-bold text-white">
              Level: {level} | Score: {score}
            </div>
            
            {showingSequence ? (
              <div className="text-2xl font-bold text-yellow-400">
                Remember the sequence!
              </div>
            ) : (
              <div className="text-2xl font-bold text-green-400">
                Your turn! Repeat the sequence.
              </div>
            )}
            
            <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
              {letters.map(letter => (
                <div key={letter} className="text-center">
                  <div className="text-lg font-bold text-white mb-2">{letter}</div>
                  <div className="grid grid-cols-3 gap-1">
                    {numbers.slice(0, 15).map(num => (
                      <Button
                        key={num}
                        onClick={() => handleNumberClick(`${letter}${num}`)}
                        disabled={showingSequence}
                        className="w-8 h-8 text-xs font-bold bg-gray-700 hover:bg-gray-600 text-white"
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-sm text-gray-300">
              {showingSequence ? 'Watch carefully...' : 'Click the numbers in the correct order!'}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render the appropriate game
  const renderGame = () => {
    switch (activeGame) {
      case 'number-rush':
        return <NumberRushGame />;
      case 'bingo-memory':
        return <BingoMemoryGame />;
      default:
        return null;
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-white mb-4">
            🎮 MINI-GAMES ARCADE 🎮
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Take a break from BINGO and enjoy these exciting mini-games! 
            Earn gems, beat high scores, and have fun!
          </p>
        </div>

        {/* Game Selection */}
        {!activeGame ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {miniGames.map((game) => (
              <Card key={game.id} className="bg-gray-900 border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`bg-gradient-to-r ${game.color} w-20 h-20 rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                    {game.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{game.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-yellow-400 font-bold">{game.reward}</div>
                    <div className="text-blue-400 text-sm">Difficulty: {game.difficulty}</div>
                    <div className="text-green-400 text-sm">High Score: {gameScores[game.id] || 0}</div>
                  </div>
                  
                  <Button
                    onClick={() => setActiveGame(game.id)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    PLAY NOW
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <Button
              onClick={() => setActiveGame(null)}
              className="mb-6 bg-gray-600 hover:bg-gray-700 text-white"
            >
              ← Back to Mini-Games
            </Button>
            
            <Card className="bg-gray-900 border-gray-700 max-w-2xl mx-auto">
              <CardContent className="p-8">
                {renderGame()}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Mini-Games Info */}
        {!activeGame && (
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-purple-800/20 to-blue-800/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">🎯 How Mini-Games Work</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <div className="text-purple-400 font-bold mb-2">🎮 Gameplay</div>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Complete challenges to earn gems</li>
                    <li>• Beat your high scores</li>
                    <li>• Different difficulty levels</li>
                    <li>• Fun between BINGO sessions</li>
                  </ul>
                </div>
                <div>
                  <div className="text-blue-400 font-bold mb-2">💎 Rewards</div>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Earn gems based on performance</li>
                    <li>• Use gems for power-ups</li>
                    <li>• Unlock special bonuses</li>
                    <li>• Track your progress</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniGames; 