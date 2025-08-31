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
  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const soundEffectsRef = useRef<HTMLAudioElement | null>(null);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('audioSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<AudioSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Background music functions
  const playBackgroundMusic = () => {
    if (!settings.musicEnabled) return;
    
    try {
      if (!backgroundMusicRef.current) {
        // Try to load background music, but provide fallback
        backgroundMusicRef.current = new Audio('/audio/background-music.mp3');
        backgroundMusicRef.current.loop = true;
        backgroundMusicRef.current.volume = settings.backgroundMusicVolume;
        
        // Handle missing audio file gracefully
        backgroundMusicRef.current.onerror = () => {
          console.warn('Background music file not found. Using fallback audio.');
          // Create a simple fallback audio using Web Audio API
          createFallbackBackgroundMusic();
        };
        
        // Handle successful load
        backgroundMusicRef.current.oncanplaythrough = () => {
          console.log('Background music loaded successfully');
        };
      }
      
      if (backgroundMusicRef.current && backgroundMusicRef.current.readyState >= 2) {
        backgroundMusicRef.current.volume = settings.backgroundMusicVolume;
        backgroundMusicRef.current.play().catch(error => {
          console.warn('Could not play background music:', error);
          // Try fallback if main audio fails
          createFallbackBackgroundMusic();
        });
      }
    } catch (error) {
      console.warn('Background music not available:', error);
      createFallbackBackgroundMusic();
    }
  };

  // Create fallback background music using Web Audio API
  const createFallbackBackgroundMusic = () => {
    try {
      if (typeof window !== 'undefined' && window.AudioContext) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 2);
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime + 4);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime + 2);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 6);
        
        // Loop the fallback music
        setInterval(() => {
          if (settings.musicEnabled) {
            createFallbackBackgroundMusic();
          }
        }, 6000);
        
        console.log('Fallback background music created');
      }
    } catch (error) {
      console.warn('Could not create fallback audio:', error);
    }
  };

  const stopBackgroundMusic = () => {
    if (backgroundMusicRef.current) {
      try {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
      } catch (error) {
        console.warn('Error stopping background music:', error);
      }
    }
  };

  // Dynamic music volume control
  const setGameMusicMode = (isGameActive: boolean) => {
    if (!backgroundMusicRef.current || !settings.musicEnabled) return;
    
    if (isGameActive) {
      // Increase volume for active gameplay
      backgroundMusicRef.current.volume = settings.gameMusicVolume;
    } else {
      // Decrease volume for background ambiance
      backgroundMusicRef.current.volume = settings.backgroundMusicVolume;
    }
  };

  // Voice announcement functions
  const playVoiceAnnouncement = (text: string) => {
    if (!settings.voiceEnabled) return;
    
    // Use Web Speech API for voice synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = settings.voiceVolume;
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      // Try to use a good voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || voice.name.includes('Samantha') || voice.name.includes('Alex')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      speechSynthesis.speak(utterance);
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

  const playNumberCall = (number: number) => {
    if (!settings.voiceEnabled) return;
    
    try {
      // Get Adam's voice audio file for this specific number
      const audioFile = getAudioFileForNumber(number);
      const displayText = getDisplayTextForNumber(number);
      
      if (audioFile) {
        // Play Adam's voice calling the number
        const audio = new Audio(audioFile);
        audio.volume = settings.voiceVolume;
        
        // Handle successful play
        audio.play().then(() => {
          console.log(`Playing Adam's voice: ${displayText}`);
        }).catch(error => {
          console.warn(`Could not play Adam's voice for ${displayText}:`, error);
          // Fallback to TTS if Adam's voice fails
          fallbackToTTS(displayText || `Number ${number}`);
        });
        
        // Handle audio errors gracefully
        audio.onerror = () => {
          console.warn(`Adam's voice file not found for ${displayText}:`, audioFile);
          // Fallback to TTS
          fallbackToTTS(displayText || `Number ${number}`);
        };
      } else {
        // Fallback to TTS for invalid numbers
        fallbackToTTS(`Number ${number}`);
      }
    } catch (error) {
      console.warn('Error playing Adam\'s voice:', error);
      // Fallback to TTS
      fallbackToTTS(`Number ${number}`);
    }
  };

  // Fallback to TTS if Adam's voice is not available
  const fallbackToTTS = (text: string) => {
    if (!settings.voiceEnabled) return;
    
    // Use Web Speech API for voice synthesis as fallback
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = settings.voiceVolume;
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      // Try to use a good voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || voice.name.includes('Samantha') || voice.name.includes('Alex')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      speechSynthesis.speak(utterance);
    }
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