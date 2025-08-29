import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import TournamentCard from './TournamentCard';
import GameInterface from './GameInterface';

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
      setTournaments(prev => prev.map(tournament => {
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
        
        return {
          ...tournament,
          timeLeft: newTimeLeft,
          players: newPlayers
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleJoinTournament = (tournament: any) => {
    // Start the corresponding game mode
    startGame(tournament.gameMode);
    setSelectedTournament(tournament);
  };

  // If a tournament is selected, show the game interface
  if (selectedTournament) {
    const gameMode = {
      id: selectedTournament.gameMode,
      title: selectedTournament.title,
      description: `Tournament: ${selectedTournament.title} - Prize Pool: ${selectedTournament.prize}`,
      duration: selectedTournament.difficulty === 'Easy' ? 60 : selectedTournament.difficulty === 'Medium' ? 120 : 180,
      prize: selectedTournament.prize,
      entryFee: parseFloat(selectedTournament.entry.replace('$', ''))
    };

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
              Prize Pool: {selectedTournament.prize} • Entry: {selectedTournament.entry}
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