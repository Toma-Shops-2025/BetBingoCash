import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

interface BingoNumber {
  value: number;
  called: boolean;
  marked: boolean;
}

interface BingoCard {
  id: string;
  numbers: BingoNumber[][];
  completed: boolean;
  completionTime?: number;
}

const SpeedBingo: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [gameState, setGameState] = useState<'waiting' | 'countdown' | 'playing' | 'finished'>('waiting');
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [bingoCards, setBingoCards] = useState<BingoCard[]>([]);
  const [gameTimer, setGameTimer] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [betAmount, setBetAmount] = useState(5);
  const [balance, setBalance] = useState(1000);
  const [winAmount, setWinAmount] = useState(0);
  const [totalWon, setTotalWon] = useState(0);
  const [gameSpeed, setGameSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [autoMark, setAutoMark] = useState(true);

  // Speed settings
  const speedSettings = {
    slow: { interval: 3000, bonus: 1.5 },
    medium: { interval: 2000, bonus: 2.0 },
    fast: { interval: 1000, bonus: 3.0 }
  };

  // Generate a random BINGO card
  const generateBingoCard = useCallback((): BingoCard => {
    const numbers: BingoNumber[][] = [];
    const usedNumbers = new Set<number>();

    // B column (1-15)
    const bNumbers: BingoNumber[] = [];
    for (let i = 0; i < 5; i++) {
      let num;
      do {
        num = Math.floor(Math.random() * 15) + 1;
      } while (usedNumbers.has(num));
      usedNumbers.add(num);
      bNumbers.push({ value: num, called: false, marked: false });
    }
    numbers.push(bNumbers);

    // I column (16-30)
    const iNumbers: BingoNumber[] = [];
    for (let i = 0; i < 5; i++) {
      let num;
      do {
        num = Math.floor(Math.random() * 15) + 16;
      } while (usedNumbers.has(num));
      usedNumbers.add(num);
      iNumbers.push({ value: num, called: false, marked: false });
    }
    numbers.push(iNumbers);

    // N column (31-45) - center is free space
    const nNumbers: BingoNumber[] = [];
    for (let i = 0; i < 5; i++) {
      if (i === 2) {
        nNumbers.push({ value: 0, called: true, marked: true }); // Free space
      } else {
        let num;
        do {
          num = Math.floor(Math.random() * 15) + 31;
        } while (usedNumbers.has(num));
        usedNumbers.add(num);
        nNumbers.push({ value: num, called: false, marked: false });
      }
    }
    numbers.push(nNumbers);

    // G column (46-60)
    const gNumbers: BingoNumber[] = [];
    for (let i = 0; i < 5; i++) {
      let num;
      do {
        num = Math.floor(Math.random() * 15) + 46;
      } while (usedNumbers.has(num));
      usedNumbers.add(num);
      gNumbers.push({ value: num, called: false, marked: false });
    }
    numbers.push(gNumbers);

    // O column (61-75)
    const oNumbers: BingoNumber[] = [];
    for (let i = 0; i < 5; i++) {
      let num;
      do {
        num = Math.floor(Math.random() * 15) + 61;
      } while (usedNumbers.has(num));
      usedNumbers.add(num);
      oNumbers.push({ value: num, called: false, marked: false });
    }
    numbers.push(oNumbers);

    return {
      id: Math.random().toString(36).substr(2, 9),
      numbers,
      completed: false
    };
  }, []);

  // Start countdown
  const startCountdown = useCallback(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to play Speed BINGO",
        variant: "destructive"
      });
      return;
    }

    if (balance < betAmount) {
      toast({
        title: "Insufficient Balance",
        description: "Not enough balance to place this bet",
        variant: "destructive"
      });
      return;
    }

    setGameState('countdown');
    setCountdown(3);
  }, [user, betAmount, balance, toast]);

  // Countdown effect
  useEffect(() => {
    if (gameState === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'countdown' && countdown === 0) {
      startGame();
    }
  }, [gameState, countdown]);

  // Start the game
  const startGame = useCallback(() => {
    // Generate 3 BINGO cards for the player
    const cards = [generateBingoCard(), generateBingoCard(), generateBingoCard()];
    setBingoCards(cards);
    setCalledNumbers([]);
    setCurrentNumber(null);
    setGameState('playing');
    setGameTimer(0);
    setBalance(prev => prev - betAmount);
    
    const speed = speedSettings[gameSpeed];
    setWinAmount(Math.floor(betAmount * 75 * speed.bonus)); // Speed bonus multiplier
  }, [betAmount, generateBingoCard, gameSpeed]);

  // Call a random number
  const callNumber = useCallback(() => {
    if (gameState !== 'playing') return;

    const availableNumbers = [];
    for (let i = 1; i <= 75; i++) {
      if (!calledNumbers.includes(i)) {
        availableNumbers.push(i);
      }
    }

    if (availableNumbers.length === 0) {
      // Game over - no winner
      setGameState('finished');
      toast({
        title: "Game Over",
        description: "No BINGO! All numbers called.",
        variant: "destructive"
      });
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const newNumber = availableNumbers[randomIndex];
    
    setCurrentNumber(newNumber);
    setCalledNumbers(prev => [...prev, newNumber]);

    // Update BINGO cards
    setBingoCards(prev => prev.map(card => ({
      ...card,
      numbers: card.numbers.map(row =>
        row.map(cell => ({
          ...cell,
          called: cell.value === newNumber ? true : cell.called
        }))
      )
    })));

    // Auto-mark if enabled
    if (autoMark) {
      setBingoCards(prev => prev.map(card => ({
        ...card,
        numbers: card.numbers.map(row =>
          row.map(cell => ({
            ...cell,
            marked: cell.value === newNumber ? true : cell.marked
          }))
        )
      })));
    }

    // Check for BINGO
    checkForBingo();
  }, [gameState, calledNumbers, autoMark, toast]);

  // Check if any card has BINGO
  const checkForBingo = useCallback(() => {
    setBingoCards(prev => prev.map(card => {
      if (card.completed) return card;

      // Check rows
      for (let row = 0; row < 5; row++) {
        if (card.numbers[row].every(cell => cell.called)) {
          return { ...card, completed: true, completionTime: gameTimer };
        }
      }

      // Check columns
      for (let col = 0; col < 5; col++) {
        if (card.numbers.every(row => row[col].called)) {
          return { ...card, completed: true, completionTime: gameTimer };
        }
      }

      // Check diagonals
      if (card.numbers[0][0].called && card.numbers[1][1].called && 
          card.numbers[2][2].called && card.numbers[3][3].called && 
          card.numbers[4][4].called) {
        return { ...card, completed: true, completionTime: gameTimer };
      }

      if (card.numbers[0][4].called && card.numbers[1][3].called && 
          card.numbers[2][2].called && card.numbers[3][1].called && 
          card.numbers[4][0].called) {
        return { ...card, completed: true, completionTime: gameTimer };
      }

      return card;
    }));

    // Check if any card completed
    const hasWinner = bingoCards.some(card => card.completed);
    if (hasWinner) {
      setGameState('finished');
      const speed = speedSettings[gameSpeed];
      const finalWin = Math.floor(winAmount * (1 + (gameTimer < 30 ? 0.5 : 0))); // Time bonus
      
      setWinAmount(finalWin);
      setTotalWon(prev => prev + finalWin);
      setBalance(prev => prev + finalWin);
      
      toast({
        title: "🎉 SPEED BINGO!",
        description: `Congratulations! You won $${finalWin} in ${gameTimer} seconds!`,
        variant: "default"
      });
    }
  }, [bingoCards, gameTimer, gameSpeed, winAmount, toast]);

  // Auto-call numbers based on speed
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      const speed = speedSettings[gameSpeed];
      interval = setInterval(() => {
        callNumber();
      }, speed.interval);
    }
    return () => clearInterval(interval);
  }, [gameState, gameSpeed, callNumber]);

  // Game timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setGameTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  // Mark a number on player's card
  const markNumber = (cardIndex: number, rowIndex: number, colIndex: number) => {
    if (gameState !== 'playing') return;

    setBingoCards(prev => prev.map((card, index) => {
      if (index === cardIndex) {
        const newNumbers = [...card.numbers];
        newNumbers[rowIndex] = [...newNumbers[rowIndex]];
        newNumbers[rowIndex][colIndex] = {
          ...newNumbers[rowIndex][colIndex],
          marked: !newNumbers[rowIndex][colIndex].marked
        };
        return { ...card, numbers: newNumbers };
      }
      return card;
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Game Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 casino-neon">⚡ Speed BINGO</h1>
          <p className="text-white/80 text-lg">Fast-paced BINGO with speed bonuses and time rewards!</p>
        </div>

        {/* Countdown Display */}
        {gameState === 'countdown' && (
          <div className="text-center mb-8">
            <div className="bg-blue-500/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30 inline-block">
              <h2 className="text-4xl font-bold text-blue-400 mb-4">Get Ready!</h2>
              <div className="text-8xl font-bold text-blue-400 casino-neon">
                {countdown}
              </div>
            </div>
          </div>
        )}

        {/* Game Controls */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Bet Amount</label>
              <select 
                value={betAmount} 
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="w-full bg-white/20 text-white rounded-lg px-3 py-2 border border-white/30"
              >
                <option value={5}>$5.00</option>
                <option value={10}>$10.00</option>
                <option value={25}>$25.00</option>
                <option value={50}>$50.00</option>
                <option value={100}>$100.00</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">Game Speed</label>
              <select 
                value={gameSpeed} 
                onChange={(e) => setGameSpeed(e.target.value as 'slow' | 'medium' | 'fast')}
                className="w-full bg-white/20 text-white rounded-lg px-3 py-2 border border-white/30"
              >
                <option value="slow">🐌 Slow (3s)</option>
                <option value="medium">⚡ Medium (2s)</option>
                <option value="fast">🚀 Fast (1s)</option>
              </select>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Potential Win</label>
              <div className="text-2xl font-bold text-yellow-400 casino-neon">
                ${winAmount}
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Game Timer</label>
              <div className="text-2xl font-bold text-cyan-400">
                {formatTime(gameTimer)}
              </div>
            </div>

            <div className="space-y-2">
              {gameState === 'waiting' && (
                <Button 
                  onClick={startCountdown}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3"
                >
                  🚀 Start Speed BINGO
                </Button>
              )}
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoMark"
                  checked={autoMark}
                  onChange={(e) => setAutoMark(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="autoMark" className="text-white text-sm">Auto-mark</label>
              </div>
            </div>
          </div>
        </div>

        {/* Current Number Display */}
        {currentNumber && (
          <div className="text-center mb-8">
            <div className="bg-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30 inline-block">
              <h2 className="text-2xl font-bold text-blue-400 mb-2">Current Number</h2>
              <div className="text-6xl font-bold text-blue-400 casino-neon">
                {currentNumber}
              </div>
            </div>
          </div>
        )}

        {/* Called Numbers */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
          <h3 className="text-white font-bold text-xl mb-4">Called Numbers</h3>
          <div className="flex flex-wrap gap-2">
            {calledNumbers.map((num, index) => (
              <Badge 
                key={index}
                variant="secondary"
                className="bg-blue-600 text-white text-lg px-3 py-2"
              >
                {num}
              </Badge>
            ))}
          </div>
        </div>

        {/* BINGO Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bingoCards.map((card, cardIndex) => (
            <Card key={card.id} className={`bg-white/10 backdrop-blur-sm border border-white/20 ${card.completed ? 'ring-4 ring-yellow-500' : ''}`}>
              <CardHeader className="text-center">
                <CardTitle className="text-white">
                  Card {cardIndex + 1} {card.completed && '🎉'}
                </CardTitle>
                {card.completionTime !== undefined && (
                  <p className="text-yellow-400 text-sm">Completed in {card.completionTime}s!</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-1">
                  {card.numbers.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => markNumber(cardIndex, rowIndex, colIndex)}
                        className={`
                          aspect-square flex items-center justify-center text-sm font-bold rounded cursor-pointer transition-all
                          ${cell.value === 0 
                            ? 'bg-yellow-500 text-black' // Free space
                            : cell.called && cell.marked
                            ? 'bg-green-500 text-white' // Called and marked
                            : cell.called
                            ? 'bg-blue-500 text-white' // Called but not marked
                            : 'bg-white/20 text-white hover:bg-white/30' // Not called
                          }
                        `}
                      >
                        {cell.value === 0 ? 'FREE' : cell.value}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Speed Bonus Info */}
        <div className="bg-blue-900/20 backdrop-blur-sm rounded-2xl p-6 mt-8 border border-blue-500/30">
          <h3 className="text-white font-bold text-xl mb-4 text-center">⚡ Speed Bonuses</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-blue-800/40 rounded-lg p-4">
              <div className="text-2xl mb-2">🐌</div>
              <div className="text-white font-bold">Slow Speed</div>
              <div className="text-blue-200">1.5x Bonus</div>
              <div className="text-blue-200/70 text-sm">3 second intervals</div>
            </div>
            <div className="bg-blue-800/40 rounded-lg p-4">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-white font-bold">Medium Speed</div>
              <div className="text-blue-200">2.0x Bonus</div>
              <div className="text-blue-200/70 text-sm">2 second intervals</div>
            </div>
            <div className="bg-blue-800/40 rounded-lg p-4">
              <div className="text-2xl mb-2">🚀</div>
              <div className="text-white font-bold">Fast Speed</div>
              <div className="text-blue-200">3.0x Bonus</div>
              <div className="text-blue-200/70 text-sm">1 second intervals</div>
            </div>
          </div>
        </div>

        {/* Game Status */}
        {gameState === 'finished' && (
          <div className="text-center mt-8">
            <Button 
              onClick={() => {
                setGameState('waiting');
                setBingoCards([]);
                setCalledNumbers([]);
                setCurrentNumber(null);
                setGameTimer(0);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 text-lg"
            >
              🎮 Play Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeedBingo; 