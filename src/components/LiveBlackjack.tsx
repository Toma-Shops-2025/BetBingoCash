import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

interface PlayingCard {
  suit: string;
  value: string;
  numericValue: number;
  image: string;
}

interface GameState {
  playerHand: PlayingCard[];
  dealerHand: PlayingCard[];
  deck: PlayingCard[];
  gamePhase: 'betting' | 'dealing' | 'playerTurn' | 'dealerTurn' | 'gameOver';
  betAmount: number;
  balance: number;
  message: string;
  playerScore: number;
  dealerScore: number;
}

const LiveBlackjack: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    playerHand: [],
    dealerHand: [],
    deck: [],
    gamePhase: 'betting',
    betAmount: 10,
    balance: 1000,
    message: 'Place your bet and start the game!',
    playerScore: 0,
    dealerScore: 0
  });

  // Card suits and values
  const suits = ['♠️', '♥️', '♦️', '♣️'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  // Initialize deck
  useEffect(() => {
    initializeDeck();
  }, []);

  const initializeDeck = () => {
    const newDeck: PlayingCard[] = [];
    suits.forEach(suit => {
      values.forEach((value, index) => {
        let numericValue = index + 1;
        if (value === 'J' || value === 'Q' || value === 'K') {
          numericValue = 10;
        } else if (value === 'A') {
          numericValue = 11; // Ace starts as 11
        }
        
        newDeck.push({
          suit,
          value,
          numericValue,
          image: `${value}${suit}`
        });
      });
    });
    
    // Shuffle deck
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    
    setGameState(prev => ({ ...prev, deck: newDeck }));
  };

  // Calculate hand value (handling Aces)
  const calculateHandValue = (hand: PlayingCard[]): number => {
    let value = 0;
    let aces = 0;

    hand.forEach(card => {
      if (card.value === 'A') {
        aces += 1;
        value += 11;
      } else {
        value += card.numericValue;
      }
    });

    // Convert Aces from 11 to 1 if needed
    while (value > 21 && aces > 0) {
      value -= 10;
      aces -= 1;
    }

    return value;
  };

  // Deal initial cards
  const dealCards = () => {
    if (gameState.balance < gameState.betAmount) {
      toast({
        title: "Insufficient Balance",
        description: "Not enough balance to place this bet",
        variant: "destructive"
      });
      return;
    }

    const newDeck = [...gameState.deck];
    const playerHand = [newDeck.pop()!, newDeck.pop()!];
    const dealerHand = [newDeck.pop()!, newDeck.pop()!];

    const playerScore = calculateHandValue(playerHand);
    const dealerScore = calculateHandValue(dealerHand);

    setGameState(prev => ({
      ...prev,
      playerHand,
      dealerHand,
      deck: newDeck,
      gamePhase: 'playerTurn',
      balance: prev.balance - prev.betAmount,
      playerScore,
      dealerScore,
      message: playerScore === 21 ? 'Blackjack! You win!' : 'Your turn - Hit or Stand?'
    }));

    // Check for immediate blackjack
    if (playerScore === 21) {
      setTimeout(() => endGame('blackjack'), 1000);
    }
  };

  // Player hits
  const hit = () => {
    if (gameState.gamePhase !== 'playerTurn') return;

    const newDeck = [...gameState.deck];
    const newCard = newDeck.pop()!;
    const newPlayerHand = [...gameState.playerHand, newCard];
    const newPlayerScore = calculateHandValue(newPlayerHand);

    setGameState(prev => ({
      ...prev,
      playerHand: newPlayerHand,
      deck: newDeck,
      playerScore: newPlayerScore,
      message: newPlayerScore > 21 ? 'Bust! You lose!' : 'Hit or Stand?'
    }));

    if (newPlayerScore > 21) {
      setTimeout(() => endGame('bust'), 1000);
    }
  };

  // Player stands
  const stand = () => {
    if (gameState.gamePhase !== 'playerTurn') return;

    setGameState(prev => ({
      ...prev,
      gamePhase: 'dealerTurn',
      message: 'Dealer is playing...'
    }));

    // Dealer plays
    setTimeout(() => dealerPlay(), 1000);
  };

  // Dealer plays
  const dealerPlay = () => {
    let currentDealerHand = [...gameState.dealerHand];
    let currentDeck = [...gameState.deck];
    let currentDealerScore = calculateHandValue(currentDealerHand);

    // Dealer hits on 16 or less, stands on 17 or more
    while (currentDealerScore < 17) {
      const newCard = currentDeck.pop()!;
      currentDealerHand.push(newCard);
      currentDealerScore = calculateHandValue(currentDealerHand);
    }

    setGameState(prev => ({
      ...prev,
      dealerHand: currentDealerHand,
      deck: currentDeck,
      dealerScore: currentDealerScore,
      gamePhase: 'gameOver'
    }));

    // Determine winner
    setTimeout(() => determineWinner(currentDealerScore), 1000);
  };

  // Determine game winner
  const determineWinner = (dealerScore: number) => {
    const playerScore = gameState.playerScore;
    let result: string;
    let newBalance = gameState.balance;

    if (dealerScore > 21) {
      result = 'Dealer busts! You win!';
      newBalance += gameState.betAmount * 2;
    } else if (playerScore > dealerScore) {
      result = 'You win!';
      newBalance += gameState.betAmount * 2;
    } else if (dealerScore > playerScore) {
      result = 'Dealer wins!';
    } else {
      result = 'Push! It\'s a tie!';
      newBalance += gameState.betAmount;
    }

    setGameState(prev => ({
      ...prev,
      balance: newBalance,
      message: result
    }));

    toast({
      title: result.includes('win') ? "🎉 Winner!" : result.includes('lose') ? "😔 Game Over" : "🤝 Push",
      description: result,
      variant: result.includes('win') ? "default" : "destructive"
    });
  };

  // End game
  const endGame = (reason: string) => {
    let result: string;
    let newBalance = gameState.balance;

    if (reason === 'blackjack') {
      result = 'Blackjack! You win!';
      newBalance += Math.floor(gameState.betAmount * 2.5);
    } else if (reason === 'bust') {
      result = 'Bust! You lose!';
    } else {
      result = 'Game over!';
    }

    setGameState(prev => ({
      ...prev,
      gamePhase: 'gameOver',
      balance: newBalance,
      message: result
    }));
  };

  // New game
  const newGame = () => {
    initializeDeck();
    setGameState(prev => ({
      ...prev,
      playerHand: [],
      dealerHand: [],
      gamePhase: 'betting',
      message: 'Place your bet and start the game!',
      playerScore: 0,
      dealerScore: 0
    }));
  };

  // Double down
  const doubleDown = () => {
    if (gameState.gamePhase !== 'playerTurn' || gameState.balance < gameState.betAmount) return;

    setGameState(prev => ({
      ...prev,
      balance: prev.balance - prev.betAmount,
      betAmount: prev.betAmount * 2
    }));

    // Deal one more card and stand
    setTimeout(() => {
      hit();
      setTimeout(() => stand(), 500);
    }, 500);
  };

  // Insurance (when dealer shows Ace)
  const insurance = () => {
    if (gameState.dealerHand[0]?.value !== 'A') return;

    const insuranceBet = Math.floor(gameState.betAmount / 2);
    if (gameState.balance >= insuranceBet) {
      setGameState(prev => ({
        ...prev,
        balance: prev.balance - insuranceBet
      }));

      // Check if dealer has blackjack
      if (gameState.dealerHand[1]?.numericValue === 10) {
        setGameState(prev => ({
          ...prev,
          balance: prev.balance + insuranceBet * 2,
          message: 'Insurance pays! Dealer has blackjack!'
        }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Game Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 casino-neon">🃏 Live Blackjack</h1>
          <p className="text-white/80 text-lg">Beat the dealer to 21 without going over!</p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-white text-lg">Balance</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-green-400 casino-neon">
                ${gameState.balance.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-white text-lg">Bet Amount</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-yellow-400 casino-neon">
                ${gameState.betAmount.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-white text-lg">Player Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-blue-400 casino-neon">
                {gameState.playerScore}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-white text-lg">Dealer Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-red-400 casino-neon">
                {gameState.gamePhase === 'gameOver' ? gameState.dealerScore : '?'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Message */}
        <div className="text-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 inline-block">
            <p className="text-xl font-bold text-white casino-neon">
              {gameState.message}
            </p>
          </div>
        </div>

        {/* Game Table */}
        <div className="bg-gradient-to-br from-green-800/30 to-emerald-800/30 rounded-3xl p-8 mb-8 border border-green-500/30">
          {/* Dealer Hand */}
          <div className="mb-8">
            <h3 className="text-white font-bold text-xl mb-4 text-center">Dealer's Hand</h3>
            <div className="flex justify-center gap-4">
              {gameState.dealerHand.map((card, index) => (
                <div
                  key={index}
                  className={`w-20 h-28 bg-white rounded-lg flex items-center justify-center text-2xl font-bold border-2 ${
                    index === 1 && gameState.gamePhase !== 'gameOver' ? 'bg-blue-500 text-white' : 'bg-white text-black'
                  }`}
                >
                  {index === 1 && gameState.gamePhase !== 'gameOver' ? '?' : card.image}
                </div>
              ))}
            </div>
          </div>

          {/* Player Hand */}
          <div className="mb-8">
            <h3 className="text-white font-bold text-xl mb-4 text-center">Your Hand</h3>
            <div className="flex justify-center gap-4">
              {gameState.playerHand.map((card, index) => (
                <div
                  key={index}
                  className="w-20 h-28 bg-white rounded-lg flex items-center justify-center text-2xl font-bold border-2 text-black"
                >
                  {card.image}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Game Controls */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Betting Controls */}
            {gameState.gamePhase === 'betting' && (
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Place Your Bet</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setGameState(prev => ({ ...prev, betAmount: 10 }))}
                      className={`flex-1 ${gameState.betAmount === 10 ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      $10
                    </Button>
                    <Button
                      onClick={() => setGameState(prev => ({ ...prev, betAmount: 25 }))}
                      className={`flex-1 ${gameState.betAmount === 25 ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      $25
                    </Button>
                    <Button
                      onClick={() => setGameState(prev => ({ ...prev, betAmount: 50 }))}
                      className={`flex-1 ${gameState.betAmount === 50 ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      $50
                    </Button>
                  </div>
                  <Button
                    onClick={dealCards}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-lg"
                  >
                    🃏 Deal Cards
                  </Button>
                </div>
              </div>
            )}

            {/* Game Controls */}
            {gameState.gamePhase === 'playerTurn' && (
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Your Turn</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      onClick={hit}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3"
                    >
                      🃏 Hit
                    </Button>
                    <Button
                      onClick={stand}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3"
                    >
                      ✋ Stand
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={doubleDown}
                      disabled={gameState.balance < gameState.betAmount}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 disabled:opacity-50"
                    >
                      💰 Double Down
                    </Button>
                    {gameState.dealerHand[0]?.value === 'A' && (
                      <Button
                        onClick={insurance}
                        disabled={gameState.balance < Math.floor(gameState.betAmount / 2)}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 disabled:opacity-50"
                      >
                        🛡️ Insurance
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Game Over Controls */}
            {gameState.gamePhase === 'gameOver' && (
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Game Over</h3>
                <Button
                  onClick={newGame}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-lg"
                >
                  🎮 New Game
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Game Rules */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-white font-bold text-lg mb-4">🎯 Blackjack Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80 text-sm">
            <div>
              <p><strong>Objective:</strong> Beat the dealer to 21 without going over</p>
              <p><strong>Blackjack:</strong> A + 10-value card = 2.5x bet</p>
              <p><strong>Hit:</strong> Take another card</p>
              <p><strong>Stand:</strong> Keep your current hand</p>
            </div>
            <div>
              <p><strong>Double Down:</strong> Double your bet, get one card</p>
              <p><strong>Insurance:</strong> Bet dealer has blackjack (when showing Ace)</p>
              <p><strong>Dealer:</strong> Hits on 16 or less, stands on 17+</p>
              <p><strong>Bust:</strong> Over 21 = automatic loss</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveBlackjack; 