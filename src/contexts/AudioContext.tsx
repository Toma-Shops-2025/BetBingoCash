import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getAudioFileForNumber, getDisplayTextForNumber } from '../lib/bingoAudioMap';

interface AudioSettings {
  musicEnabled: boolean;
  voiceEnabled: boolean;
  soundEffectsEnabled: boolean;
  musicVolume: number;
  voiceVolume: number;
  soundEffectsVolume: number;
  backgroundMusicVolume: number; // New: separate background music volume
  gameMusicVolume: number; // New: game music volume
}

interface AudioContextType {
  settings: AudioSettings;
  updateSettings: (newSettings: Partial<AudioSettings>) => void;
  playBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
  setGameMusicMode: (isGameActive: boolean) => void; // New: switch between background and game music
  playVoiceAnnouncement: (text: string) => void;
  playSoundEffect: (effect: string) => void;
  playCountdown: () => void;
  playGameStart: () => void;
  playBingo: () => void;
  playNumberCall: (number: number) => void;
}

const defaultAudioSettings: AudioSettings = {
  musicEnabled: true,
  voiceEnabled: true,
  soundEffectsEnabled: true,
  musicVolume: 0.7,
  voiceVolume: 0.8,
  soundEffectsVolume: 0.6,
  backgroundMusicVolume: 0.3, // Soft background music
  gameMusicVolume: 0.6, // Louder during games
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AudioSettings>(() => {
    const saved = localStorage.getItem('audioSettings');
    return saved ? JSON.parse(saved) : defaultAudioSettings;
  });

  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const gameMusicRef = useRef<HTMLAudioElement | null>(null);
  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const soundEffectsRef = useRef<HTMLAudioElement | null>(null);
  const fallbackAudioRef = useRef<any>(null);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('audioSettings', JSON.stringify(settings));
  }, [settings]);

  // Start background music automatically when component mounts
  useEffect(() => {
    if (settings.musicEnabled) {
      // Small delay to ensure everything is loaded
      const timer = setTimeout(() => {
        playBackgroundMusic();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []); // Only run once on mount

  const updateSettings = (newSettings: Partial<AudioSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Background music functions
  const playBackgroundMusic = () => {
    try {
      if (settings.musicEnabled && typeof window !== 'undefined') {
        // Try to use the actual background music file first
        const audio = new Audio('/audio/background-music.mp3');
        audio.loop = true;
        audio.volume = settings.backgroundMusicVolume;
        
        audio.addEventListener('canplaythrough', () => {
          audio.play().catch(error => {
            console.warn('Could not play background music:', error);
            // Fallback to generated music if file fails
            createFallbackBackgroundMusic();
          });
        });
        
        audio.addEventListener('error', () => {
          console.warn('Background music file failed to load, using fallback');
          createFallbackBackgroundMusic();
        });
        
        // Store reference for controls
        backgroundMusicRef.current = audio;
        console.log('Background music started with MP3 file');
      }
    } catch (error) {
      console.warn('Could not play background music:', error);
      createFallbackBackgroundMusic();
    }
  };

  // Create fallback background music using Web Audio API
  const createFallbackBackgroundMusic = () => {
    try {
      if (typeof window !== 'undefined' && window.AudioContext) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Create a proper musical sequence
        const createNote = (frequency: number, duration: number, startTime: number, volume: number) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          const filter = audioContext.createBiquadFilter();
          
          oscillator.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          // Use different wave types for variety
          const waveTypes: OscillatorType[] = ['sine', 'triangle', 'square'];
          oscillator.type = waveTypes[Math.floor(Math.random() * waveTypes.length)];
          
          oscillator.frequency.setValueAtTime(frequency, startTime);
          
          // Add slight pitch variation
          oscillator.frequency.setValueAtTime(frequency * (0.98 + Math.random() * 0.04), startTime + duration * 0.5);
          
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800 + Math.random() * 400, startTime);
          filter.Q.setValueAtTime(0.5 + Math.random() * 0.5, startTime);
          
          gainNode.gain.setValueAtTime(0, startTime);
          gainNode.gain.linearRampToValueAtTime(volume * 3, startTime + 0.1); // MUCH LOUDER
          gainNode.gain.linearRampToValueAtTime(volume * 2.5, startTime + duration * 0.7);
          gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
          
          oscillator.start(startTime);
          oscillator.stop(startTime + duration);
          
          return { oscillator, gainNode };
        };
        
        // Create a pleasant melody using pentatonic scale (no harsh intervals)
        const pentatonicScale = [220, 247, 277, 330, 370, 440, 494, 554, 659, 740]; // A pentatonic
        const notes: any[] = [];
        let currentTime = audioContext.currentTime;
        
        const playMelody = () => {
          if (!settings.musicEnabled) return;
          
          // Clear old notes
          notes.forEach(note => {
            try {
              note.oscillator.stop();
            } catch (e) {}
          });
          notes.length = 0;
          
          // Play a sequence of 8-12 notes
          const numNotes = 8 + Math.floor(Math.random() * 5);
          
          for (let i = 0; i < numNotes; i++) {
            const freq = pentatonicScale[Math.floor(Math.random() * pentatonicScale.length)];
            const duration = 0.5 + Math.random() * 1.5; // 0.5 to 2 seconds
            const volume = (0.1 + Math.random() * 0.15) * settings.backgroundMusicVolume; // MUCH LOUDER
            
            const note = createNote(freq, duration, currentTime, volume);
            notes.push(note);
            
            currentTime += duration + 0.1; // Small gap between notes
          }
          
          // Schedule next melody
          setTimeout(() => {
            if (settings.musicEnabled) {
              currentTime = audioContext.currentTime;
              playMelody();
            }
          }, (currentTime - audioContext.currentTime) * 1000 + 1000);
        };
        
        // Start playing
        playMelody();
        
        console.log('Proper musical background music created');
        
        // Store cleanup function in ref so it can be stopped later
        const cleanup = () => {
          notes.forEach(note => {
            try {
              note.oscillator.stop();
            } catch (e) {}
          });
        };
        
        fallbackAudioRef.current = { stop: cleanup };
        
        // Return cleanup function
        return cleanup;
      }
    } catch (error) {
      console.warn('Could not create fallback audio:', error);
    }
  };

  const stopBackgroundMusic = () => {
    console.log('Stopping background music...');
    
    if (backgroundMusicRef.current) {
      try {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
        backgroundMusicRef.current = null;
        console.log('Background music stopped');
      } catch (error) {
        console.warn('Error stopping background music:', error);
      }
    }
    
    // Also stop any fallback audio that might be playing
    if (fallbackAudioRef.current) {
      try {
        console.log('Stopping fallback audio...');
        fallbackAudioRef.current.stop();
        fallbackAudioRef.current = null;
        console.log('Fallback audio stopped');
      } catch (error) {
        console.warn('Error stopping fallback audio:', error);
      }
    }
    
    // Force stop any ongoing speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      console.log('Speech synthesis cancelled');
    }
    
    // Force stop any Web Audio API contexts
    if ((window as any).audioContext) {
      try {
        (window as any).audioContext.close();
        console.log('Audio context closed');
      } catch (e) {}
    }
  };

  // Comprehensive function to stop ALL audio
  const stopAllAudio = () => {
    console.log('Stopping ALL audio sources...');
    
    // Stop background music
    if (backgroundMusicRef.current) {
      try {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
        backgroundMusicRef.current = null;
        console.log('Background music stopped');
      } catch (error) {
        console.warn('Error stopping background music:', error);
      }
    }
    
    // Stop game music
    if (gameMusicRef.current) {
      try {
        gameMusicRef.current.pause();
        gameMusicRef.current.currentTime = 0;
        gameMusicRef.current = null;
        console.log('Game music stopped');
      } catch (error) {
        console.warn('Error stopping game music:', error);
      }
    }
    
    // Stop fallback audio
    if (fallbackAudioRef.current) {
      try {
        fallbackAudioRef.current.stop();
        fallbackAudioRef.current = null;
        console.log('Fallback audio stopped');
      } catch (error) {
        console.warn('Error stopping fallback audio:', error);
      }
    }
    
    // Stop speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      console.log('Speech synthesis cancelled');
    }
    
    // Stop all HTML audio elements
    const allAudioElements = document.querySelectorAll('audio');
    allAudioElements.forEach(audio => {
      try {
        audio.pause();
        audio.currentTime = 0;
        console.log('HTML audio element stopped');
      } catch (e) {}
    });
    
    // Close any Web Audio contexts
    if ((window as any).audioContext) {
      try {
        (window as any).audioContext.close();
        console.log('Audio context closed');
      } catch (e) {}
    }
  };

  // Nuclear option - completely reset audio system
  const resetAudioSystem = () => {
    console.log('Nuclear option: Resetting entire audio system...');
    
    try {
      // Stop all audio elements
      const allAudioElements = document.querySelectorAll('audio');
      allAudioElements.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
        audio.load(); // Force reload
      });
      
      // Cancel all speech
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      
      // Clear all refs
      backgroundMusicRef.current = null;
      gameMusicRef.current = null;
      fallbackAudioRef.current = null;
      
      // Force page audio context to reset
      if (window.AudioContext || (window as any).webkitAudioContext) {
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          audioContext.close();
        } catch (e) {}
      }
      
      console.log('Audio system reset complete');
    } catch (error) {
      console.error('Error resetting audio system:', error);
    }
  };

  // Dynamic music volume control
  const setGameMusicMode = (isGameActive: boolean) => {
    console.log('Setting game music mode:', isGameActive);
    
    if (isGameActive) {
      // Nuclear option - reset everything
      console.log('Using nuclear option to stop all audio');
      resetAudioSystem();
      
      // Wait a moment then start game music
      setTimeout(() => {
        console.log('Starting game music after reset...');
        playGameMusic();
      }, 100);
      
    } else {
      // Stop game music and resume background music
      console.log('Stopping game music, resuming background music');
      stopGameMusic();
      playBackgroundMusic();
    }
  };

  // Game music functions
  const playGameMusic = () => {
    try {
      if (settings.musicEnabled && typeof window !== 'undefined') {
        // Play game music
        const gameAudio = new Audio('/audio/bingo-game-music.mp3');
        gameAudio.loop = true;
        gameAudio.volume = settings.gameMusicVolume;
        
        gameAudio.addEventListener('canplaythrough', () => {
          gameAudio.play().catch(error => {
            console.warn('Could not play game music:', error);
          });
        });
        
        // Store reference for controls
        gameMusicRef.current = gameAudio;
        console.log('Game music started');
      }
    } catch (error) {
      console.warn('Could not play game music:', error);
    }
  };

  const stopGameMusic = () => {
    if (gameMusicRef.current) {
      try {
        gameMusicRef.current.pause();
        gameMusicRef.current.currentTime = 0;
        gameMusicRef.current = null;
        console.log('Game music stopped');
      } catch (error) {
        console.warn('Error stopping game music:', error);
      }
    }
  };

  // Simple number-to-text mapping for clear pronunciation
  const numberToText = (num: number): string => {
    if (num === 0) return 'Free Space';
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy'];
    
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) {
      const ten = Math.floor(num / 10);
      const one = num % 10;
      return one === 0 ? tens[ten] : `${tens[ten]}-${ones[one]}`;
    }
    return num.toString();
  };

  // Voice announcement functions
  const playVoiceAnnouncement = (text: string) => {
    if (!settings.voiceEnabled) return;
    
    console.log('Playing voice announcement:', text);
    
    // Use Web Speech API for voice synthesis
    if ('speechSynthesis' in window) {
      // Cancel any previous speech first
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = settings.voiceVolume;
      utterance.rate = 0.8; // Slightly slower for clarity
      utterance.pitch = 1.0; // Normal pitch
      utterance.lang = 'en-US'; // Force English language
      
      // Wait for voices to load if they haven't already
      const getVoices = () => {
        const voices = speechSynthesis.getVoices();
        console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
        
        // Try to find the best English voice
        let preferredVoice = voices.find(voice => 
          voice.lang.startsWith('en') && 
          (voice.name.includes('Google') || voice.name.includes('Samantha') || voice.name.includes('Alex'))
        );
        
        if (!preferredVoice) {
          preferredVoice = voices.find(voice => voice.lang.startsWith('en'));
        }
        
        if (!preferredVoice) {
          preferredVoice = voices.find(voice => voice.lang.includes('en'));
        }
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
          console.log('Using voice:', preferredVoice.name, preferredVoice.lang);
        } else {
          console.log('No English voice found, using default');
        }
        
        // Start speaking
        speechSynthesis.speak(utterance);
      };
      
      // If voices are already loaded, use them immediately
      if (speechSynthesis.getVoices().length > 0) {
        getVoices();
      } else {
        // Wait for voices to load
        speechSynthesis.onvoiceschanged = getVoices;
      }
    }
  };

  // Get Adam's voice file path for a BINGO number
  const getAdamVoiceFile = (number: number): string => {
    if (number === 0) return ''; // Free space has no voice
    
    // Determine which column (B, I, N, G, O) this number belongs to
    let column: string;
    if (number >= 1 && number <= 15) column = 'B';
    else if (number >= 16 && number <= 30) column = 'I';
    else if (number >= 31 && number <= 45) column = 'N';
    else if (number >= 46 && number <= 60) column = 'G';
    else if (number >= 61 && number <= 75) column = 'O';
    else return ''; // Invalid number
    
    return `/audio/adam-voice/${column}-${number}.mp3`;
  };

  // Enhanced number call with Adam's voice
  const playNumberCall = (number: number) => {
    if (!settings.voiceEnabled) return;
    
    const voiceFile = getAdamVoiceFile(number);
    if (!voiceFile) return; // Skip free space
    
    console.log(`Playing Adam's voice for number: ${number} from file: ${voiceFile}`);
    
    try {
      // Create and play Adam's voice audio
      const audio = new Audio(voiceFile);
      audio.volume = settings.voiceVolume;
      
      // Handle successful play
      audio.play().then(() => {
        console.log(`Adam's voice playing: ${number}`);
      }).catch(error => {
        console.warn(`Could not play Adam's voice for ${number}:`, error);
        // Fallback to TTS if Adam's voice fails
        fallbackToTTS(numberToText(number));
      });
      
      // Handle audio errors gracefully
      audio.onerror = () => {
        console.warn(`Adam's voice file not found for ${number}:`, voiceFile);
        // Fallback to TTS
        fallbackToTTS(numberToText(number));
      };
      
    } catch (error) {
      console.warn('Error playing Adam\'s voice:', error);
      // Fallback to TTS
      fallbackToTTS(numberToText(number));
    }
  };

  // Sound effect functions
  const playSoundEffect = (effect: string) => {
    if (!settings.soundEffectsEnabled) return;
    
    try {
      const audio = new Audio(`/audio/${effect}.mp3`);
      audio.volume = settings.soundEffectsVolume;
      audio.play().catch(error => {
        console.warn(`Could not play sound effect ${effect}:`, error);
      });
    } catch (error) {
      console.warn(`Sound effect ${effect} not available:`, error);
    }
  };

  const playCountdown = () => {
    playSoundEffect('countdown-beep');
  };

  const playGameStart = () => {
    playSoundEffect('game-start');
  };

  const playBingo = () => {
    playSoundEffect('bingo-celebration');
  };

  // Fallback to TTS if Adam's voice is not available
  const fallbackToTTS = (text: string) => {
    console.log(`Falling back to TTS for: ${text}`);
    playVoiceAnnouncement(text);
  };

  // Update audio volumes when settings change
  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = settings.backgroundMusicVolume;
    }
  }, [settings.backgroundMusicVolume]);

  return (
    <AudioContext.Provider
      value={{
        settings,
        updateSettings,
        playBackgroundMusic,
        stopBackgroundMusic,
        setGameMusicMode,
        playVoiceAnnouncement,
        playSoundEffect,
        playCountdown,
        playGameStart,
        playBingo,
        playNumberCall,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}; 