import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useAudio } from '@/contexts/AudioContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Play, Pause, Volume2, VolumeX, Settings, Zap, Star, Coins, DollarSign, CreditCard, Music, Mic } from 'lucide-react';
import BingoCard from './BingoCard';

interface GameInterfaceProps {
  gameMode: string;
  onExit: () => void;
}

export interface GameInterfaceRef {
  checkBingoLines: () => boolean;
}

const GameInterface = forwardRef<GameInterfaceRef, GameInterfaceProps>(({ gameMode, onExit }, ref) => {
  const { balance, gems, updateBalance, updateGems } = useAppContext();
  const { 
    isPlaying, 
    togglePlay, 
    backgroundMusicVolume, 
    gameMusicVolume,
    setGameMusicMode,
    playNumberCall,
    playBingoCelebration 
  } = useAudio();

  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'paused' | 'finished'>('waiting');
  const [calledNumbers, setCalledNumbers] = useState<string[]>([]);
  const [currentNumber, setCurrentNumber] = useState<string>('');
  const [ballsRemaining, setBallsRemaining] = useState(75);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [autoDaub, setAutoDaub] = useState(true);
  const [tripleDaubProgress, setTripleDaubProgress] = useState(0);
  const [powerUpSlots, setPowerUpSlots] = useState<Array<{ id: string; type: string; icon: string }>>([]);
  const [canCallBingo, setCanCallBingo] = useState(false);
  const [bingoLines, setBingoLines] = useState<string[]>([]);
  
  // Audio states
  const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] = useState(false);
  const [backgroundMusicVolume, setBackgroundMusicVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  
  const bingoCardRef = useRef<any>(null);
  const gameInterval = useRef<NodeJS.Timeout | null>(null);
  const numberCallInterval = useRef<NodeJS.Timeout | null>(null);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech synthesis and find Adam-like voice
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
      
      // Wait for voices to load
      const loadVoices = () => {
        const voices = speechSynthesisRef.current?.getVoices() || [];
        // Find a male voice that sounds closest to Adam
        const adamLikeVoice = voices.find(voice => 
          voice.lang.includes('en') && 
          (voice.name.includes('Male') || voice.name.includes('David') || voice.name.includes('Mark') || voice.name.includes('James'))
        ) || voices.find(voice => voice.lang.includes('en')) || voices[0];
        
        if (adamLikeVoice) {
          setSelectedVoice(adamLikeVoice.name);
        }
      };
      
      if (speechSynthesisRef.current.getVoices().length > 0) {
        loadVoices();
      } else {
        speechSynthesisRef.current.addEventListener('voiceschanged', loadVoices);
      }
    }
  }, []);

  // Initialize background music
  useEffect(() => {
    backgroundMusicRef.current = new Audio('/audio/background-music.mp3');
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.volume = backgroundMusicVolume;
    
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
    };
  }, []);

  // Play background music
  const playBackgroundMusic = () => {
    if (backgroundMusicRef.current && !isMuted) {
      backgroundMusicRef.current.play().catch(console.error);
      setIsBackgroundMusicPlaying(true);
    }
  };

  // Stop background music
  const stopBackgroundMusic = () => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      setIsBackgroundMusicPlaying(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = !isMuted ? 0 : backgroundMusicVolume;
    }
  };

  // Call BINGO number with Adam-like voice
  const callBingoNumber = (number: string) => {
    if (speechSynthesisRef.current && selectedVoice) {
      // Cancel any ongoing speech
      speechSynthesisRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance();
      utterance.text = `Number ${number}`;
      utterance.voice = speechSynthesisRef.current.getVoices().find(v => v.name === selectedVoice) || null;
      utterance.rate = 0.9; // Slightly slower for Adam-like effect
      utterance.pitch = 0.95; // Slightly lower pitch for male voice
      utterance.volume = 0.8;
      
      // Add some natural pauses and emphasis
      utterance.text = `Number ${number.slice(0, 1)} ${number.slice(1)}`;
      
      speechSynthesisRef.current.speak(utterance);
    }
  };

  // Set game music mode when component mounts
  useEffect(() => {
    setGameMusicMode(true);
    playBackgroundMusic();
    return () => {
      setGameMusicMode(false);
      stopBackgroundMusic();
    };
  }, [setGameMusicMode]);

  // Generate BINGO numbers (B1-B15, I16-I30, N31-N45, G46-G60, O61-O75)
  const generateBingoNumbers = () => {
    const numbers: string[] = [];
    const letters = ['B', 'I', 'N', 'G', 'O'];
    const ranges = [
      [1, 15], [16, 30], [31, 45], [46, 60], [61, 75]
    ];
    
    letters.forEach((letter, index) => {
      const [start, end] = ranges[index];
      for (let i = start; i <= end; i++) {
        numbers.push(`${letter}${i}`);
      }
    });
    
    return numbers.sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    setGameState('playing');
    setCalledNumbers([]);
    setBallsRemaining(75);
    setTripleDaubProgress(0);
    
    const allNumbers = generateBingoNumbers();
    let currentIndex = 0;
    
    // Call numbers every 3 seconds
    numberCallInterval.current = setInterval(() => {
      if (currentIndex < allNumbers.length) {
        const number = allNumbers[currentIndex];
        setCurrentNumber(number);
        setCalledNumbers(prev => [number, ...prev.slice(0, 2)]); // Keep only last 3
        setBallsRemaining(75 - currentIndex - 1);
        
        // Call BINGO number with Adam-like voice
        callBingoNumber(number);
        
        currentIndex++;
      } else {
        // Game finished
        setGameState('finished');
        if (numberCallInterval.current) {
          clearInterval(numberCallInterval.current);
        }
      }
    }, 3000);
  };

  // Auto-start game after a short delay when entering a room
  useEffect(() => {
    if (gameState === 'waiting') {
      const autoStartTimer = setTimeout(() => {
        startGame();
      }, 3000); // Start game automatically after 3 seconds
      
      return () => clearTimeout(autoStartTimer);
    }
  }, [gameState]);

  const pauseGame = () => {
    setGameState('paused');
    if (numberCallInterval.current) {
      clearInterval(numberCallInterval.current);
    }
  };

  const resumeGame = () => {
    setGameState('playing');
    startGame();
  };

  const handleCallBingo = () => {
    if (!canCallBingo) return;
    
    // Check if player actually has BINGO
    if (bingoCardRef.current && bingoCardRef.current.checkBingoLines()) {
      playBingoCelebration();
      setGameState('finished');
      
      // Calculate winnings based on game mode
      const winnings = calculateWinnings();
      updateBalance(winnings);
      
      // Show celebration
      alert(`🎉 BINGO! You won $${winnings.toFixed(2)}! 🎉`);
    } else {
      alert('❌ No BINGO yet! Keep playing!');
    }
  };

  const calculateWinnings = () => {
    // Base winnings based on game mode
    const baseWinnings = {
      'bingo-room-1': 1.50,
      'bingo-room-2': 5.00,
      'bingo-room-3': 13.50,
      'bingo-room-4': 9.00,
      'bingo-room-5': 13.00,
      'bingo-room-6': 18.90,
      'bingo-room-7': 35.00
    };
    
    return baseWinnings[gameMode as keyof typeof baseWinnings] || 10.00;
  };

  const getBingoCall = (number: string) => {
    return number; // Format: B1, I16, N31, G46, O61
  };

  // Expose checkBingoLines method to parent
  useImperativeHandle(ref, () => ({
    checkBingoLines: () => {
      return bingoCardRef.current?.checkBingoLines() || false;
    }
  }));

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (gameState === 'playing') {
          pauseGame();
        } else if (gameState === 'paused') {
          resumeGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState]);

  // Check for BINGO lines periodically
  useEffect(() => {
    if (gameState === 'playing') {
      const checkInterval = setInterval(() => {
        if (bingoCardRef.current) {
          const hasBingo = bingoCardRef.current.checkBingoLines();
          setCanCallBingo(hasBingo);
        }
      }, 1000);
      
      return () => clearInterval(checkInterval);
    }
  }, [gameState]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-purple-800 relative overflow-hidden">
      {/* Futuristic City Skyline Background */}
      <div className="absolute inset-0 z-0">
        {/* Glowing buildings */}
        <div className="absolute left-0 bottom-0 w-32 h-64 bg-gradient-to-t from-purple-600 to-blue-500 opacity-60">
          <div className="w-full h-full bg-gradient-to-b from-transparent via-purple-400/20 to-transparent animate-pulse"></div>
        </div>
        <div className="absolute right-0 bottom-0 w-40 h-80 bg-gradient-to-t from-blue-600 to-purple-500 opacity-60">
          <div className="w-full h-full bg-gradient-to-b from-transparent via-blue-400/20 to-transparent animate-pulse"></div>
        </div>
        
        {/* Central pyramid structure */}
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 w-48 h-96 bg-gradient-to-t from-yellow-400 via-orange-500 to-red-500 opacity-80">
          <div className="w-full h-full bg-gradient-to-b from-transparent via-yellow-300/30 to-transparent animate-pulse"></div>
        </div>
        
        {/* Glowing orbs */}
        <div className="absolute left-1/4 top-1/2 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute right-1/4 top-1/3 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-60" style={{animationDelay: '1s'}}></div>
        <div className="absolute left-1/3 bottom-1/4 w-5 h-5 bg-pink-400 rounded-full animate-ping opacity-60" style={{animationDelay: '2s'}}></div>
        
        {/* Reflective water surface */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-400/20 to-transparent opacity-40"></div>
      </div>

      {/* Game Interface */}
      <div className="relative z-10 p-4">
        {/* Top Section - Currency and Controls */}
        <div className="flex justify-between items-start mb-6">
          {/* Left - Currency Display */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-green-400/30">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-bold text-lg">{(balance || 0).toFixed(0)}</span>
            </div>
            <div className="flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-yellow-400/30">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-bold text-lg">{(gems || 0).toFixed(0)}</span>
            </div>
          </div>
          
          {/* Right - Home Button */}
          <Button
            onClick={onExit}
            variant="ghost"
            className="bg-purple-600/20 hover:bg-purple-600/40 backdrop-blur-sm border border-purple-400/30 text-white p-3 rounded-full"
          >
            <Home className="w-5 h-5" />
          </Button>
        </div>

        {/* Audio Controls */}
        <div className="flex justify-center mb-6">
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-purple-400" />
              <span className="text-white text-sm">Music</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={backgroundMusicVolume}
                onChange={(e) => {
                  const volume = parseFloat(e.target.value);
                  setBackgroundMusicVolume(volume);
                  if (backgroundMusicRef.current) {
                    backgroundMusicRef.current.volume = volume;
                  }
                }}
                className="w-20"
              />
            </div>
            
            <Button
              onClick={toggleMute}
              variant="ghost"
              className={`p-2 rounded-lg ${
                isMuted 
                  ? 'bg-red-500/20 border border-red-400/30 text-red-400' 
                  : 'bg-green-500/20 border border-green-400/30 text-green-400'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-blue-400" />
              <span className="text-white text-sm">Voice: {selectedVoice || 'Loading...'}</span>
            </div>
          </div>
        </div>

        {/* Called Numbers Bar */}
        <div className="flex items-center gap-4 mb-6 bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
          <div className="flex gap-3">
            {calledNumbers.map((number, index) => (
              <div
                key={index}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 ${
                  index === 0 ? 'bg-orange-500 border-orange-400 animate-pulse' :
                  index === 1 ? 'bg-green-500 border-green-400' :
                  'bg-red-500 border-red-400'
                }`}
              >
                {number}
              </div>
            ))}
          </div>
          
          {/* Game Speed Control */}
          <Button
            onClick={() => setGameSpeed(prev => prev === 3 ? 1 : prev + 1)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span className="text-sm">x{gameSpeed}</span>
          </Button>
          
          {/* Balls Remaining */}
          <div className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-4 py-2 rounded-lg font-bold">
            {ballsRemaining} BALLS
          </div>
        </div>

        {/* Main Game Area */}
        <div className="flex gap-6">
          {/* Left - BINGO Card */}
          <div className="flex-1">
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/50">
              {/* Rainbow BINGO Header */}
              <div className="text-center mb-6">
                <h1 className="text-4xl font-black">
                  <span className="text-red-500">B</span>
                  <span className="text-orange-500">I</span>
                  <span className="text-green-500">N</span>
                  <span className="text-blue-500">G</span>
                  <span className="text-purple-500">O</span>
                </h1>
              </div>
              
              <BingoCard
                ref={bingoCardRef}
                calledNumbers={calledNumbers}
                onBingoLinesChange={setBingoLines}
              />
            </div>
          </div>

          {/* Right - Controls and Power-ups */}
          <div className="w-80 space-y-4">
            {/* Power-up Slots */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
              <h3 className="text-white font-bold mb-3 text-center">Power-ups</h3>
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((slot) => (
                  <div
                    key={slot}
                    className="w-16 h-20 bg-purple-800/50 border border-purple-400/30 rounded-lg flex items-center justify-center"
                  >
                    {powerUpSlots[slot] ? (
                      <div className="text-center">
                        <div className="text-2xl">{powerUpSlots[slot].icon}</div>
                        <div className="text-xs text-white">{powerUpSlots[slot].type}</div>
                      </div>
                    ) : (
                      <div className="text-purple-400/50 text-xs">Empty</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Triple Daub Power-up */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-4 border border-pink-400/30">
              <h3 className="text-center text-white font-bold mb-3">TRIPLE DAUB</h3>
              <div className="flex justify-center gap-2 mb-3">
                {[0, 1, 2].map((chip) => (
                  <div
                    key={chip}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      chip < tripleDaubProgress
                        ? 'bg-red-500 border-red-400'
                        : 'bg-gray-600 border-gray-500'
                    }`}
                  >
                    {chip < tripleDaubProgress && <Star className="w-4 h-4 text-white" />}
                  </div>
                ))}
              </div>
              <div className="text-center text-white text-sm">
                {tripleDaubProgress}/3
              </div>
            </div>

            {/* Auto-daub Toggle */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">AUTO DAUB</span>
                <Button
                  onClick={() => setAutoDaub(!autoDaub)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold ${
                    autoDaub
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
                >
                  {autoDaub ? 'ON' : 'OFF'}
                </Button>
              </div>
            </div>

            {/* Game Controls */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
              <div className="space-y-3">
                {gameState === 'waiting' && (
                  <Button
                    onClick={startGame}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    START GAME
                  </Button>
                )}
                
                {gameState === 'playing' && (
                  <Button
                    onClick={pauseGame}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    PAUSE
                  </Button>
                )}
                
                {gameState === 'paused' && (
                  <Button
                    onClick={resumeGame}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 rounded-xl"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    RESUME
                  </Button>
                )}
                
                {/* CALL BINGO Button */}
                <Button
                  onClick={handleCallBingo}
                  disabled={!canCallBingo}
                  className={`w-full font-bold py-3 rounded-xl text-lg ${
                    canCallBingo
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white animate-pulse'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  🎯 CALL BINGO!
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Game Status */}
        <div className="mt-6 text-center">
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30 inline-block">
            <div className="text-white font-bold text-lg">
              {gameState === 'waiting' && '🎮 Game Starting in 3 seconds...'}
              {gameState === 'playing' && '🎯 Game in Progress'}
              {gameState === 'paused' && '⏸️ Game Paused'}
              {gameState === 'finished' && '🏆 Game Complete'}
            </div>
            {currentNumber && (
              <div className="text-purple-300 text-sm mt-2">
                Current Number: <span className="font-bold text-white">{getBingoCall(currentNumber)}</span>
              </div>
            )}
            {gameState === 'waiting' && (
              <div className="text-yellow-300 text-sm mt-2">
                ⏰ Auto-starting soon...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

GameInterface.displayName = 'GameInterface';

export default GameInterface;