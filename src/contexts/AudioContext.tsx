import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

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
        backgroundMusicRef.current = new Audio('/audio/background-music.mp3');
        backgroundMusicRef.current.loop = true;
        backgroundMusicRef.current.volume = settings.backgroundMusicVolume;
        
        // Handle missing audio file gracefully
        backgroundMusicRef.current.onerror = () => {
          console.warn('Background music file not found. Please add /audio/background-music.mp3');
          // Fallback: use system beep or silent audio
          backgroundMusicRef.current = null;
        };
      }
      
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.volume = settings.backgroundMusicVolume;
        backgroundMusicRef.current.play().catch(error => {
          console.warn('Could not play background music:', error);
        });
      }
    } catch (error) {
      console.warn('Background music not available:', error);
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
    playSoundEffect('number-call');
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