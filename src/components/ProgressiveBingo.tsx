import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import NavigationHeader from './NavigationHeader';

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

interface Jackpot {
  name: string;
  current: number;
  target: number;
  color: string;
  icon: string;
}

const ProgressiveBingo: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [bingoCards, setBingoCards] = useState<BingoCard[]>([]);
  const [gameTimer, setGameTimer] = useState(0);
  const [betAmount, setBetAmount] = useState(10);
  const [balance, setBalance] = useState(1000);
  const [winAmount, setWinAmount] = useState(0);
  const [totalWon, setTotalWon] = useState(0);
  const [autoCall, setAutoCall] = useState(false);
  const [betLevel, setBetLevel] = useState<'bronze' | 'silver' | 'gold' | 'platinum'>('silver');

  // Progressive jackpots
  const [jackpots, setJackpots] = useState<Jackpot[]>([
    { name: 'Mini Jackpot', current: 1250, target: 5000, color: 'bg-green-500', icon: '💰' },
    { name: 'Minor Jackpot', current: 8750, target: 25000, color: 'bg-blue-500', icon: '💎' },
    { name: 'Major Jackpot', current: 42500, target: 100000, color: 'bg-purple-500', icon: '🏆' },
    { name: 'Grand Jackpot', current: 187500, target: 500000, color: 'bg-yellow-500', icon: '👑' }
  ]);

  // Bet level multipliers
  const betLevelMultipliers = {
    bronze: { multiplier: 1, cards: 1, minBet: 5 },
    silver: { multiplier: 2, cards: 2, minBet: 10 },
    gold: { multiplier: 3, cards: 3, minBet: 25 },
    platinum: { multiplier: 5, cards: 4, minBet: 50 }
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

  // Start the game
  const startGame = useCallback(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to play Progressive BINGO",
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

    const level = betLevelMultipliers[betLevel];
    const cards = Array.from({ length: level.cards }, () => generateBingoCard());
    
    setBingoCards(cards);
    setCalledNumbers([]);
    setCurrentNumber(null);
    setGameState('playing');
    setGameTimer(0);
    setBalance(prev => prev - betAmount);
    
    // Calculate potential winnings including jackpot contributions
    const baseWin = betAmount * 75 * level.multiplier;
    const jackpotBonus = jackpots.reduce((total, jackpot) => {
      const contribution = (betAmount * 0.01); // 1% of bet goes to jackpots
      return total + contribution;
    }, 0);
    
    setWinAmount(Math.floor(baseWin + jackpotBonus));
  }, [user, betAmount, balance, betLevel, generateBingoCard, jackpots, toast]);

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

    // Check for wins
    checkForBingo();
  }, [gameState, calledNumbers, toast]);

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
      
      // Calculate winnings with jackpot contributions
      const level = betLevelMultipliers[betLevel];
      const baseWin = betAmount * 75 * level.multiplier;
      
      // Add jackpot contributions
      let totalWin = baseWin;
      const newJackpots = jackpots.map(jackpot => {
        if (jackpot.current >= jackpot.target) {
          // Jackpot hit! Add to winnings
          totalWin += jackpot.current;
          return { ...jackpot, current: 0 }; // Reset jackpot
        } else {
          // Add bet contribution to jackpot
          const contribution = Math.floor(betAmount * 0.01);
          return { ...jackpot, current: jackpot.current + contribution };
        }
      });
      
      setJackpots(newJackpots);
      setWinAmount(totalWin);
      setTotalWon(prev => prev + totalWin);
      setBalance(prev => prev + totalWin);
      
      // Check if any jackpots were hit
      const hitJackpots = jackpots.filter(j => j.current >= j.target);
      if (hitJackpots.length > 0) {
        toast({
          title: "🎉 JACKPOT HIT!",
          description: `You hit ${hitJackpots.length} jackpot(s) for a total of $${totalWin}!`,
          variant: "default"
        });
      } else {
        toast({
          title: "🎉 BINGO!",
          description: `Congratulations! You won $${totalWin}!`,
          variant: "default"
        });
      }
    }
  }, [bingoCards, gameTimer, betLevel, betAmount, jackpots, toast]);

  // Auto-call numbers
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoCall && gameState === 'playing') {
      interval = setInterval(() => {
        callNumber();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [autoCall, gameState, callNumber]);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-yellow-900 to-slate-900 p-6">
      <NavigationHeader />
      <div className="max-w-7xl mx-auto">
        {/* Game Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 casino-neon">💰 Progressive BINGO</h1>
          <p className="text-white/80 text-lg">Play for massive progressive jackpots and community prizes!</p>
        </div>

        {/* Progressive Jackpots */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {jackpots.map((jackpot, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border border-white/20">
              <CardHeader className="text-center pb-2">
                <div className="text-3xl mb-2">{jackpot.icon}</div>
                <CardTitle className="text-white text-lg">{jackpot.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-yellow-400 casino-neon mb-2">
                  {formatCurrency(jackpot.current)}
                </div>
                <Progress 
                  value={(jackpot.current / jackpot.target) * 100} 
                  className="mb-2"
                />
                <div className="text-white/70 text-sm">
                  Target: {formatCurrency(jackpot.target)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Game Controls */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Bet Level</label>
              <select 
                value={betLevel} 
                onChange={(e) => setBetLevel(e.target.value as 'bronze' | 'silver' | 'gold' | 'platinum')}
                className="w-full bg-white/20 text-white rounded-lg px-3 py-2 border border-white/30"
              >
                <option value="bronze">🥉 Bronze (1x, 1 card)</option>
                <option value="silver">🥈 Silver (2x, 2 cards)</option>
                <option value="gold">🥇 Gold (3x, 3 cards)</option>
                <option value="platinum">💎 Platinum (5x, 4 cards)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">Bet Amount</label>
              <select 
                value={betAmount} 
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="w-full bg-white/20 text-white rounded-lg px-3 py-2 border border-white/30"
              >
                <option value={10}>$10.00</option>
                <option value={25}>$25.00</option>
                <option value={50}>$50.00</option>
                <option value={100}>$100.00</option>
                <option value={250}>$250.00</option>
                <option value={500}>$500.00</option>
              </select>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Potential Win</label>
              <div className="text-2xl font-bold text-yellow-400 casino-neon">
                {formatCurrency(winAmount)}
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
                  onClick={startGame}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3"
                >
                  🚀 Start Game
                </Button>
              )}
              
              {gameState === 'playing' && (
                <>
                  <Button 
                    onClick={callNumber}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2"
                  >
                    🎲 Call Number
                  </Button>
                  <Button 
                    onClick={() => setAutoCall(!autoCall)}
                    className={`w-full ${autoCall ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'} text-white font-bold py-2`}
                  >
                    {autoCall ? '⏸️ Stop Auto' : '▶️ Auto Call'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Current Number Display */}
        {currentNumber && (
          <div className="text-center mb-8">
            <div className="bg-yellow-500/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30 inline-block">
              <h2 className="text-2xl font-bold text-yellow-400 mb-2">Current Number</h2>
              <div className="text-6xl font-bold text-yellow-400 casino-neon">
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
                className="bg-yellow-600 text-white text-lg px-3 py-2"
              >
                {num}
              </Badge>
            ))}
          </div>
        </div>

        {/* BINGO Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Bet Level Info */}
        <div className="bg-yellow-900/20 backdrop-blur-sm rounded-2xl p-6 mt-8 border border-yellow-500/30">
          <h3 className="text-white font-bold text-xl mb-4 text-center">💰 Bet Level Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="bg-yellow-800/40 rounded-lg p-4">
              <div className="text-2xl mb-2">🥉</div>
              <div className="text-white font-bold">Bronze</div>
              <div className="text-yellow-200">1x Multiplier</div>
              <div className="text-yellow-200/70 text-sm">1 BINGO Card</div>
              <div className="text-yellow-200/70 text-sm">Min Bet: $5</div>
            </div>
            <div className="bg-yellow-800/40 rounded-lg p-4">
              <div className="text-2xl mb-2">🥈</div>
              <div className="text-white font-bold">Silver</div>
              <div className="text-yellow-200">2x Multiplier</div>
              <div className="text-yellow-200/70 text-sm">2 BINGO Cards</div>
              <div className="text-yellow-200/70 text-sm">Min Bet: $10</div>
            </div>
            <div className="bg-yellow-800/40 rounded-lg p-4">
              <div className="text-2xl mb-2">🥇</div>
              <div className="text-white font-bold">Gold</div>
              <div className="text-yellow-200">3x Multiplier</div>
              <div className="text-yellow-200/70 text-sm">3 BINGO Cards</div>
              <div className="text-yellow-200/70 text-sm">Min Bet: $25</div>
            </div>
            <div className="bg-yellow-800/40 rounded-lg p-4">
              <div className="text-2xl mb-2">💎</div>
              <div className="text-white font-bold">Platinum</div>
              <div className="text-yellow-200">5x Multiplier</div>
              <div className="text-yellow-200/70 text-sm">4 BINGO Cards</div>
              <div className="text-yellow-200/70 text-sm">Min Bet: $50</div>
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
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 text-lg"
            >
              🎮 Play Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressiveBingo; 