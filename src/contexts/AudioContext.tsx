import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface AudioSettings {
  musicEnabled: boolean;
  voiceEnabled: boolean;
  soundEffectsEnabled: boolean;
  musicVolume: number;
  voiceVolume: number;
  soundEffectsVolume: number;
}

interface AudioContextType {
  settings: AudioSettings;
  updateSettings: (newSettings: Partial<AudioSettings>) => void;
  playBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
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
    
    if (!backgroundMusicRef.current) {
      backgroundMusicRef.current = new Audio('/audio/background-music.mp3');
      backgroundMusicRef.current.loop = true;
      backgroundMusicRef.current.volume = settings.musicVolume;
    }
    
    backgroundMusicRef.current.volume = settings.musicVolume;
    backgroundMusicRef.current.play().catch(console.error);
  };

  const stopBackgroundMusic = () => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
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
    
    const audio = new Audio(`/audio/${effect}.mp3`);
    audio.volume = settings.soundEffectsVolume;
    audio.play().catch(console.error);
  };

  const playCountdown = () => {
    if (!settings.soundEffectsEnabled) return;
    
    // Play countdown beep
    playSoundEffect('countdown-beep');
  };

  const playGameStart = () => {
    if (!settings.soundEffectsEnabled) return;
    
    // Play game start sound
    playSoundEffect('game-start');
  };

  const playBingo = () => {
    if (!settings.soundEffectsEnabled) return;
    
    // Play bingo celebration sound
    playSoundEffect('bingo-celebration');
  };

  const playNumberCall = (number: number) => {
    if (!settings.voiceEnabled) return;
    
    // Announce the number
    const numberText = number.toString();
    playVoiceAnnouncement(`Number ${numberText}`);
    
    // Also play a sound effect
    if (settings.soundEffectsEnabled) {
      playSoundEffect('number-call');
    }
  };

  // Update audio volumes when settings change
  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = settings.musicVolume;
    }
  }, [settings.musicVolume]);

  return (
    <AudioContext.Provider
      value={{
        settings,
        updateSettings,
        playBackgroundMusic,
        stopBackgroundMusic,
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