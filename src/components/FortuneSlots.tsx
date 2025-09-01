import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

interface SlotSymbol {
  id: string;
  name: string;
  value: number;
  image: string;
}

interface Payline {
  positions: number[];
  multiplier: number;
}

const FortuneSlots: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [gameState, setGameState] = useState<'idle' | 'spinning' | 'won'>('idle');
  const [reels, setReels] = useState<SlotSymbol[][]>([]);
  const [betAmount, setBetAmount] = useState(1);
  const [balance, setBalance] = useState(1000);
  const [winAmount, setWinAmount] = useState(0);
  const [totalWon, setTotalWon] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoPlayCount, setAutoPlayCount] = useState(0);

  // Slot symbols with values
  const symbols: SlotSymbol[] = [
    { id: '1', name: 'Seven', value: 100, image: '7️⃣' },
    { id: '2', name: 'Bar', value: 50, image: '🍫' },
    { id: '3', name: 'Cherry', value: 25, image: '🍒' },
    { id: '4', name: 'Lemon', value: 15, image: '🍋' },
    { id: '5', name: 'Orange', value: 10, image: '🍊' },
    { id: '6', name: 'Plum', value: 8, image: '🫐' },
    { id: '7', name: 'Bell', value: 6, image: '🔔' },
    { id: '8', name: 'Watermelon', value: 4, image: '🍉' },
    { id: '9', name: 'Grape', value: 2, image: '🍇' }
  ];

  // Paylines configuration
  const paylines: Payline[] = [
    { positions: [0, 1, 2], multiplier: 1 }, // Top row
    { positions: [3, 4, 5], multiplier: 1 }, // Middle row
    { positions: [6, 7, 8], multiplier: 1 }, // Bottom row
    { positions: [0, 4, 8], multiplier: 2 }, // Diagonal left to right
    { positions: [2, 4, 6], multiplier: 2 }, // Diagonal right to left
    { positions: [1, 4, 7], multiplier: 1.5 }, // Vertical middle
    { positions: [0, 3, 6], multiplier: 1.5 }, // Vertical left
    { positions: [2, 5, 8], multiplier: 1.5 }  // Vertical right
  ];

  // Initialize reels
  useEffect(() => {
    initializeReels();
  }, []);

  const initializeReels = () => {
    const newReels: SlotSymbol[][] = [];
    for (let i = 0; i < 9; i++) {
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      newReels.push([randomSymbol]);
    }
    setReels(newReels);
  };

  // Spin the reels
  const spin = useCallback(async () => {
    if (gameState === 'spinning' || balance < betAmount) return;

    setGameState('spinning');
    setBalance(prev => prev - betAmount);
    setWinAmount(0);

    // Animate spinning
    const spinDuration = 2000;
    const spinInterval = 100;
    const totalSpins = spinDuration / spinInterval;

    for (let i = 0; i < totalSpins; i++) {
      await new Promise(resolve => setTimeout(resolve, spinInterval));
      
      // Update reels with random symbols during spin
      const newReels: SlotSymbol[][] = [];
      for (let j = 0; j < 9; j++) {
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        newReels.push([randomSymbol]);
      }
      setReels(newReels);
    }

    // Final result
    const finalReels: SlotSymbol[][] = [];
    for (let i = 0; i < 9; i++) {
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      finalReels.push([randomSymbol]);
    }
    setReels(finalReels);

    // Check for wins
    const win = calculateWin(finalReels);
    if (win > 0) {
      setWinAmount(win);
      setTotalWon(prev => prev + win);
      setBalance(prev => prev + win);
      setGameState('won');
      
      toast({
        title: "🎉 WINNER!",
        description: `You won $${win}!`,
        variant: "default"
      });
    } else {
      setGameState('idle');
    }

    // Continue auto-play if enabled
    if (autoPlay && autoPlayCount > 0) {
      setAutoPlayCount(prev => prev - 1);
      if (autoPlayCount > 1) {
        setTimeout(() => spin(), 1000);
      } else {
        setAutoPlay(false);
        setAutoPlayCount(0);
      }
    }
  }, [gameState, balance, betAmount, autoPlay, autoPlayCount, toast]);

  // Calculate winnings based on paylines
  const calculateWin = (currentReels: SlotSymbol[][]): number => {
    let totalWin = 0;

    paylines.forEach(payline => {
      const lineSymbols = payline.positions.map(pos => currentReels[pos][0]);
      const firstSymbol = lineSymbols[0];
      
      // Check if all symbols in the line are the same
      if (lineSymbols.every(symbol => symbol.id === firstSymbol.id)) {
        const symbolValue = firstSymbol.value;
        const lineWin = symbolValue * payline.multiplier * betAmount;
        totalWin += lineWin;
      }
    });

    return totalWin;
  };

  // Start auto-play
  const startAutoPlay = (count: number) => {
    if (balance < betAmount * count) {
      toast({
        title: "Insufficient Balance",
        description: "Not enough balance for auto-play",
        variant: "destructive"
      });
      return;
    }
    setAutoPlay(true);
    setAutoPlayCount(count);
    spin();
  };

  // Stop auto-play
  const stopAutoPlay = () => {
    setAutoPlay(false);
    setAutoPlayCount(0);
  };

  // Quick bet buttons
  const quickBet = (amount: number) => {
    setBetAmount(amount);
  };

  // Double bet
  const doubleBet = () => {
    const newBet = betAmount * 2;
    if (newBet <= balance) {
      setBetAmount(newBet);
    }
  };

  // Half bet
  const halfBet = () => {
    setBetAmount(Math.max(1, Math.floor(betAmount / 2)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Game Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 casino-neon">🎰 Fortune Slots</h1>
          <p className="text-white/80 text-lg">Match 3 symbols on any payline to win big!</p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-white text-lg">Balance</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-green-400 casino-neon">
                ${balance.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-white text-lg">Bet Amount</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-yellow-400 casino-neon">
                ${betAmount.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-white text-lg">Last Win</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-cyan-400 casino-neon">
                ${winAmount.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-white text-lg">Total Won</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-purple-400 casino-neon">
                ${totalWon.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Slot Machine */}
        <div className="bg-gradient-to-br from-purple-800/30 to-blue-800/30 rounded-3xl p-8 mb-8 border border-purple-500/30">
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* Reel 1 */}
            <div className="space-y-2">
              {reels.slice(0, 3).map((reel, index) => (
                <div
                  key={index}
                  className={`aspect-square bg-white/20 rounded-lg flex items-center justify-center text-4xl border-2 transition-all duration-300 ${
                    gameState === 'spinning' ? 'animate-pulse' : ''
                  } ${
                    index === 1 ? 'border-yellow-400' : 'border-white/30'
                  }`}
                >
                  {reel[0]?.image}
                </div>
              ))}
            </div>

            {/* Reel 2 */}
            <div className="space-y-2">
              {reels.slice(3, 6).map((reel, index) => (
                <div
                  key={index + 3}
                  className={`aspect-square bg-white/20 rounded-lg flex items-center justify-center text-4xl border-2 transition-all duration-300 ${
                    gameState === 'spinning' ? 'animate-pulse' : ''
                  } ${
                    index === 1 ? 'border-yellow-400' : 'border-white/30'
                  }`}
                >
                  {reel[0]?.image}
                </div>
              ))}
            </div>

            {/* Reel 3 */}
            <div className="space-y-2">
              {reels.slice(6, 9).map((reel, index) => (
                <div
                  key={index + 6}
                  className={`aspect-square bg-white/20 rounded-lg flex items-center justify-center text-4xl border-2 transition-all duration-300 ${
                    gameState === 'spinning' ? 'animate-pulse' : ''
                  } ${
                    index === 1 ? 'border-yellow-400' : 'border-white/30'
                  }`}
                >
                  {reel[0]?.image}
                </div>
              ))}
            </div>
          </div>

          {/* Paylines Info */}
          <div className="text-center mb-6">
            <h3 className="text-white font-bold text-lg mb-2">Paylines</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {paylines.map((payline, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-600 text-white">
                  Line {index + 1} ({payline.multiplier}x)
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Game Controls */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Betting Controls */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Betting</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    onClick={() => quickBet(1)}
                    className={`flex-1 ${betAmount === 1 ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    $1
                  </Button>
                  <Button
                    onClick={() => quickBet(5)}
                    className={`flex-1 ${betAmount === 5 ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    $5
                  </Button>
                  <Button
                    onClick={() => quickBet(10)}
                    className={`flex-1 ${betAmount === 10 ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    $10
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={halfBet}
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    Half
                  </Button>
                  <Button
                    onClick={doubleBet}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    Double
                  </Button>
                </div>
              </div>
            </div>

            {/* Spin Controls */}
            <div className="text-center">
              <h3 className="text-white font-bold text-lg mb-4">Spin</h3>
              <div className="space-y-3">
                <Button
                  onClick={spin}
                  disabled={gameState === 'spinning' || balance < betAmount}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-xl disabled:opacity-50"
                >
                  {gameState === 'spinning' ? '🎰 Spinning...' : '🎰 SPIN!'}
                </Button>
                
                {autoPlay ? (
                  <Button
                    onClick={stopAutoPlay}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2"
                  >
                    ⏹️ Stop Auto ({autoPlayCount})
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button
                      onClick={() => startAutoPlay(10)}
                      disabled={balance < betAmount * 10}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2"
                    >
                      ▶️ Auto 10
                    </Button>
                    <Button
                      onClick={() => startAutoPlay(25)}
                      disabled={balance < betAmount * 25}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2"
                    >
                      ▶️ Auto 25
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Symbol Values */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Symbol Values</h3>
              <div className="space-y-2 text-sm">
                {symbols.slice(0, 5).map((symbol) => (
                  <div key={symbol.id} className="flex items-center justify-between text-white">
                    <span>{symbol.image}</span>
                    <span className="text-yellow-400">${symbol.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Win Celebration */}
        {gameState === 'won' && (
          <div className="text-center">
            <div className="bg-yellow-500/20 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/30 inline-block">
              <h2 className="text-3xl font-bold text-yellow-400 mb-4 casino-neon">
                🎉 CONGRATULATIONS! 🎉
              </h2>
              <div className="text-4xl font-bold text-yellow-400 mb-4 casino-neon">
                You Won ${winAmount.toFixed(2)}!
              </div>
              <Button
                onClick={() => setGameState('idle')}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 text-lg"
              >
                🎰 Spin Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FortuneSlots; 