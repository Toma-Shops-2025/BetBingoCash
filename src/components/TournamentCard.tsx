import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/components/ui/use-toast';

interface TournamentCardProps {
  title: string;
  prize: string;
  entry: string;
  players: number;
  maxPlayers: number;
  timeLeft: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  image: string;
  gameMode: string;
  onJoinTournament?: (tournament: any) => void;
}

const TournamentCard: React.FC<TournamentCardProps> = ({
  title, prize, entry, players, maxPlayers, timeLeft, difficulty, image, gameMode, onJoinTournament
}) => {
  const { isAuthenticated, balance, updateBalance } = useAppContext();

  // Tournament details and rules
  const getTournamentDetails = () => {
    const details = {
      'speed-bingo': {
        description: "Lightning-fast tournament with rapid number calling and quick wins",
        rules: [
          "Complete 1 line to advance to next round",
          "3-second number intervals for maximum speed",
          "Elimination rounds until final winner",
          "Sudden death format in final round"
        ],
        strategy: "Speed and focus are crucial. Watch for patterns and be ready to call BINGO instantly.",
        specialRules: "⚡ Speed rounds: Numbers called faster in final stages"
      },
      'classic-75': {
        description: "Traditional tournament with strategic gameplay and multiple winners",
        rules: [
          "Complete 1 line to advance to next round",
          "5-second number intervals for strategy",
          "Multiple winners can advance together",
          "Final round: Best of 3 games"
        ],
        strategy: "Take your time and watch for multiple line opportunities. Quality over speed.",
        specialRules: "🏆 Championship format: Best of 3 games in final round"
      },
      'pattern-bingo': {
        description: "Pattern-based tournament with unique challenges and bonus prizes",
        rules: [
          "Complete specific patterns to advance",
          "Patterns get more complex each round",
          "Bonus points for creative pattern completion",
          "Final round: Ultimate pattern challenge"
        ],
        strategy: "Study patterns carefully. Some are easier than others - choose wisely!",
        specialRules: "✨ Pattern Master bonus: Complete 3+ patterns for extra points"
      },
      'jackpot-room': {
        description: "High-stakes tournament with massive progressive jackpots",
        rules: [
          "Complete 1 line to advance to next round",
          "6-second number intervals for suspense",
          "Jackpot grows with each eliminated player",
          "Final round: Winner takes all jackpot"
        ],
        strategy: "High risk, high reward. This is for serious players only!",
        specialRules: "🎰 Progressive jackpot: Grows with every eliminated player"
      }
    };
    
    return details[gameMode as keyof typeof details] || details['classic-75'];
  };

  const tournamentDetails = getTournamentDetails();

  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleJoinTournament = () => {
    if (!isAuthenticated) {
      toast({
        title: "Please Sign In",
        description: "You need to be signed in to join tournaments.",
        variant: "destructive",
      });
      return;
    }

    // Parse entry fee
    const entryFee = parseFloat(entry.replace('$', ''));
    
    if (balance < entryFee) {
      toast({
        title: "Insufficient Balance",
        description: `You need $${entryFee.toFixed(2)} to join this tournament. Add funds to continue.`,
        variant: "destructive",
      });
      return;
    }

    // Check if tournament is full
    if (players >= maxPlayers) {
      toast({
        title: "Tournament Full",
        description: "This tournament is already full. Please try another one.",
        variant: "destructive",
      });
      return;
    }

    // Confirm entry fee payment
    const confirmEntry = window.confirm(
      `Join ${title} Tournament?\n\nEntry Fee: ${entry}\nPrize Pool: ${prize}\nPlayers: ${players}/${maxPlayers}\n\nYour balance: $${balance.toFixed(2)}\n\nClick OK to confirm and pay entry fee.`
    );

    if (!confirmEntry) return;

    // Deduct entry fee
    updateBalance(-entryFee);

    // Call the tournament join handler
    if (onJoinTournament) {
      onJoinTournament({
        title,
        prize,
        entry: entryFee,
        players,
        maxPlayers,
        difficulty,
        image,
        gameMode,
        timeLeft
      });
    }

    toast({
      title: "Tournament Joined! 🏆",
      description: `Welcome to ${title}! Entry fee of ${entry} has been deducted.`,
    });
  };

  return (
    <div className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-2xl p-6 border-2 border-purple-400/30 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="flex justify-between items-start mb-4">
        <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getDifficultyColor(difficulty)}`}>
          {difficulty}
        </div>
        <div className="text-right">
          <div className="text-yellow-400 font-bold text-lg">{prize}</div>
          <div className="text-white/60 text-sm">Prize Pool</div>
        </div>
      </div>
      
      <h3 className="text-white font-bold text-xl mb-3">{title}</h3>
      
      {/* Tournament Description */}
      <p className="text-white/70 text-sm mb-4">{tournamentDetails.description}</p>
      
      <div className="flex items-center gap-3 mb-4">
        <img src={image} alt="Game" className="w-12 h-12 rounded-full border-2 border-yellow-400/50" />
        <div>
          <div className="text-white/80 text-sm">Entry Fee</div>
          <div className="text-green-400 font-bold">{entry}</div>
        </div>
      </div>
      
      {/* Tournament Rules & Strategy */}
      <div className="mb-4 space-y-3">
        {/* Rules */}
        <div className="bg-purple-800/30 rounded-lg p-3">
          <div className="text-xs font-bold text-blue-400 mb-2 flex items-center gap-1">
            📋 Tournament Rules
          </div>
          <ul className="text-xs text-white/80 space-y-1">
            {tournamentDetails.rules.slice(0, 2).map((rule, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-400 text-xs">•</span>
                <span>{rule}</span>
              </li>
            ))}
            {tournamentDetails.rules.length > 2 && (
              <li className="text-blue-400 text-xs cursor-pointer hover:underline">
                +{tournamentDetails.rules.length - 2} more rules...
              </li>
            )}
          </ul>
        </div>

        {/* Strategy */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          <div className="text-xs font-bold text-yellow-400 mb-2 flex items-center gap-1">
            🎯 Strategy
          </div>
          <p className="text-xs text-yellow-300">{tournamentDetails.strategy}</p>
        </div>

        {/* Special Rules */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
          <div className="text-xs font-bold text-purple-400 mb-2 flex items-center gap-1">
            ⭐ Special Rules
          </div>
          <p className="text-xs text-purple-300">{tournamentDetails.specialRules}</p>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Players</span>
          <span className="text-white">{players}/{maxPlayers}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
            style={{ width: `${(players / maxPlayers) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-orange-400 text-sm font-medium">⏰ {timeLeft}</div>
        <button 
          onClick={handleJoinTournament}
          disabled={players >= maxPlayers}
          className={`font-bold py-2 px-6 rounded-full text-sm transition-all duration-200 ${
            players >= maxPlayers
              ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:scale-105'
          }`}
        >
          {players >= maxPlayers ? 'FULL' : 'JOIN NOW'}
        </button>
      </div>
    </div>
  );
};

export default TournamentCard;