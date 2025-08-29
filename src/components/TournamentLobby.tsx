import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import TournamentCard from './TournamentCard';
import GameInterface from './GameInterface';
import { toast } from '@/components/ui/use-toast';

const TournamentLobby: React.FC = () => {
  const { startGame } = useAppContext();
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [tournaments, setTournaments] = useState([
    {
      title: "Lightning Round",
      prize: "$1,000",
      entry: "$5.00",
      players: 847,
      maxPlayers: 1000,
      timeLeft: "2:45",
      difficulty: "Easy" as const,
      image: "https://d64gsuwffb70l.cloudfront.net/68afa13c8b8d5f8d0ee8e35a_1756340608220_160a804a.webp",
      gameMode: "speed-bingo"
    },
    {
      title: "Cash Crusher",
      prize: "$2,500",
      entry: "$10.00",
      players: 523,
      maxPlayers: 800,
      timeLeft: "5:12",
      difficulty: "Medium" as const,
      image: "https://d64gsuwffb70l.cloudfront.net/68afa13c8b8d5f8d0ee8e35a_1756340609932_e4f5872d.webp",
      gameMode: "classic-75"
    },
    {
      title: "Mega Jackpot",
      prize: "$10,000",
      entry: "$25.00",
      players: 234,
      maxPlayers: 500,
      timeLeft: "8:33",
      difficulty: "Hard" as const,
      image: "https://d64gsuwffb70l.cloudfront.net/68afa13c8b8d5f8d0ee8e35a_1756340609932_e4f5872d.webp",
      gameMode: "jackpot-room"
    },
    {
      title: "Speed Bingo",
      prize: "$500",
      entry: "$2.00",
      players: 1203,
      maxPlayers: 1500,
      timeLeft: "1:28",
      difficulty: "Easy" as const,
      image: "https://d64gsuwffb70l.cloudfront.net/68afa13c8b8d5f8d0ee8e35a_1756340613673_01feab3c.webp",
      gameMode: "speed-bingo"
    },
    {
      title: "Winner's Circle",
      prize: "$5,000",
      entry: "$15.00",
      players: 445,
      maxPlayers: 600,
      timeLeft: "12:05",
      difficulty: "Medium" as const,
      image: "https://d64gsuwffb70l.cloudfront.net/68afa13c8b8d5f8d0ee8e35a_1756340615413_29d0d021.webp",
      gameMode: "pattern-bingo"
    },
    {
      title: "Elite Championship",
      prize: "$25,000",
      entry: "$50.00",
      players: 89,
      maxPlayers: 200,
      timeLeft: "15:42",
      difficulty: "Hard" as const,
      image: "https://d64gsuwffb70l.cloudfront.net/68afa13c8b8d5f8d0ee8e35a_1756340617359_b4d72bc2.webp",
      gameMode: "jackpot-room"
    }
  ]);

  // Update countdown timers and player counts
  useEffect(() => {
    const interval = setInterval(() => {
      setTournaments(prev => {
        console.log('Updating tournaments, current state:', prev);
        
        const updated = prev.map(tournament => {
          // Update time left (simplified countdown)
          const [mins, secs] = tournament.timeLeft.split(':').map(Number);
          let newMins = mins;
          let newSecs = secs - 1;
          
          if (newSecs < 0) {
            newSecs = 59;
            newMins -= 1;
          }
          
          if (newMins < 0) {
            newMins = 15; // Reset to 15 minutes
            newSecs = 0;
          }
          
          const newTimeLeft = `${newMins}:${newSecs.toString().padStart(2, '0')}`;
          
          // Randomly update player count (simulate live activity)
          const playerChange = Math.random() > 0.7 ? Math.floor(Math.random() * 3) - 1 : 0;
          const newPlayers = Math.max(0, Math.min(tournament.maxPlayers, tournament.players + playerChange));
          
          const updatedTournament = {
            ...tournament,
            timeLeft: newTimeLeft,
            players: newPlayers,
            // Preserve the gameMode property
            gameMode: tournament.gameMode
          };
          
          console.log('Updated tournament:', updatedTournament.title, 'gameMode:', updatedTournament.gameMode);
          
          return updatedTournament;
        });
        
        console.log('Updated tournaments state:', updated);
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Monitor selectedTournament state changes
  useEffect(() => {
    console.log('selectedTournament state changed to:', selectedTournament);
  }, [selectedTournament]);

  const handleJoinTournament = (tournament: any) => {
    console.log('Joining tournament:', tournament);
    console.log('Tournament gameMode:', tournament.gameMode);
    console.log('Tournament keys:', Object.keys(tournament));
    
    // Validate tournament data
    if (!tournament.gameMode) {
      console.error('Tournament missing gameMode:', tournament);
      toast({
        title: "Tournament Error",
        description: "This tournament is not properly configured. Please try another one.",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Setting selectedTournament to:', tournament);
    
    // Set the selected tournament FIRST
    setSelectedTournament(tournament);
    
    // Then start the game (this is just for logging)
    startGame(tournament.gameMode);
    
    console.log('Tournament state should now be set. selectedTournament:', selectedTournament);
  };

  // If a tournament is selected, show the game interface
  if (selectedTournament) {
    // Ensure entry fee is a number
    const entryFee = typeof selectedTournament.entry === 'string' 
      ? parseFloat(selectedTournament.entry.replace('$', ''))
      : selectedTournament.entry;
    
    // Validate game mode data
    if (!selectedTournament.gameMode) {
      console.error('Tournament missing gameMode:', selectedTournament);
      return (
        <div className="py-12 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <button
              onClick={() => setSelectedTournament(null)}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full text-sm transition-all duration-200 mb-4"
            >
              ← Back to Tournaments
            </button>
            <h2 className="text-4xl font-black text-white mb-4">
              ⚠️ Tournament Error
            </h2>
            <p className="text-xl text-gray-300">
              This tournament is not properly configured. Please try another one.
            </p>
          </div>
        </div>
      );
    }
    
    const gameMode = {
      id: selectedTournament.gameMode,
      title: selectedTournament.title,
      description: `Tournament: ${selectedTournament.title} - Prize Pool: ${selectedTournament.prize}`,
      duration: selectedTournament.difficulty === 'Easy' ? 60 : selectedTournament.difficulty === 'Medium' ? 120 : 180,
      prize: selectedTournament.prize,
      entryFee: entryFee
    };

    console.log('Starting tournament with gameMode:', gameMode);

    return (
      <div className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <button
              onClick={() => setSelectedTournament(null)}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full text-sm transition-all duration-200 mb-4"
            >
              ← Back to Tournaments
            </button>
            <h2 className="text-4xl font-black text-white mb-4">
              🏆 {selectedTournament.title} Tournament
            </h2>
            <p className="text-xl text-gray-300">
              Prize Pool: {selectedTournament.prize} • Entry: {typeof selectedTournament.entry === 'string' ? selectedTournament.entry : `$${selectedTournament.entry.toFixed(2)}`}
            </p>
          </div>
          
          <GameInterface gameMode={gameMode} />
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-white mb-4">
            🏆 LIVE TOURNAMENTS
          </h2>
          <p className="text-xl text-gray-300">
            Join thousands of players competing for real cash prizes right now!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament, index) => (
            <TournamentCard 
              key={index} 
              {...tournament} 
              onJoinTournament={handleJoinTournament}
            />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-200">
            VIEW ALL TOURNAMENTS
          </button>
        </div>
      </div>
    </div>
  );
};

export default TournamentLobby;